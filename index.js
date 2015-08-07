var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var exphbs = require('express-handlebars');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var passport = require('passport');
var multer = require('multer');

var upload = multer({ storage : multer.diskStorage ({
		destination: function (req, file, cb) {
			cb(null, './public/images/book/');
		},
		filename: function (req, file, cb){
			cb(null, file.originalname);
		}
	})
});

var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

var Borrow = require('./models/borrow');
var Book = require('./models/book');
var Account = require('./models/account');

passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser( function (user, done) {
	done(null, Account._id);
}));
	
passport.deserializeUser(Account.deserializeUser( function (id, done) {
	Account.findById( id, function (err, user) {
		done(err, user);
	});
}));

mongoose.connect('mongodb://user:password@ds051740.mongolab.com:51740/konyvtar');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('DB connection is up');
});

var requiresAdmin = function(req, res, next) {	
	if (req.user && req.user.isAdmin === true) {
		next();
	} else {
		console.log('Unauthorized');
		res.send(401, 'Unauthorized');
	}		
};

/*
registration
login
logout

get books
get book
post book
delete book
edit book

get borrows
get book/borrows
post borrow --> edit book
delete borrow --> edit book 
*/

/* registration, login, logout */

app.get('/register', function (req, res) {
	res.render('register');
});

app.post('/register', function (req, res) {
	Account.register( new Account ({ username : req.body.username }), req.body.password, function (err, account) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log('succes registration', account);
			res.send(account);
		}
	});
});

app.get('/login', function (req, res) {
	res.render('login', { user : req.user});
});

app.post('/login', passport.authenticate('local'), function (req, res) {
	res.redirect('/');
});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

/* get, delete, edit, add book */ 

app.get('/', function (req, res) {
	Book.find(function (err, books) {
		if (err) {
			res.send('failed get books', err);
		} else {
			res.render('home', {
				book: books,
				user: req.user
			});
		}
	});
});

app.get('/admin/book', function (req, res) {
	Book.find(function (err, books) {
		if (err) {
			console.log('failed get books', err);
		} else {
			console.log('get books', books, req.user);
		}
	});
});

app.get('/books/:book_id', function (req, res) {
	Book.findOne({ _id : req.params.book_id }, function (err, book){
		if (err) {
			res.send('get book failed: ', err);
		} else {
			res.render('book', {
				book: book,
				user: req.user
			});
		}
	});
});

app.post('/books', requiresAdmin, upload.single('file'), function (req, res) {
	var data = {
		ISBN: req.body.ISBN,
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		amount: req.body.amount,
		file: req.file
	}
	Book.create(data, function (err, book) {
		console.log(err);
		var errmessage = {};
		
		if (err) {
			if (err.errors.ISBN) {
				errmessage.ISBN = err.errors.ISBN.message;
			}
			if (err.errors.title) {
				errmessage.title = err.errors.title.message;
			}
			if (err.errors.author) {
				errmessage.author = err.errors.author.message;
			}
			if (err.errors.description) {
				errmessage.description = err.errors.description.message;
			}
			if (err.errors.amount) {
				errmessage.amount = err.errors.amount.message;
			}
			if (err.errors.file) {
				errmessage.file = err.errors.file.message;
			} 
			res.send(errmessage);
			console.log(errmessage);
		} else {
			res.send(book);
		}
	});
});

app.put('/books/:book_id', requiresAdmin, function (req, res) {
	var data = {};
	if (req.body.ISBN) {
		data.ISBN = req.body.ISBN;
	}
	if (req.body.title) {
		data.title = req.body.title;
	}
	if (req.body.author) {
		data.author = req.body.author;
	}
	if (req.body.description) {
		data.description = req.body.description;
	}
	if (req.body.amount) {
		data.amount = req.body.amount;
	}
	Book.findOneAndUpdate({ _id : req.params.book_id }, data, { new : true }, function (err, book) {
		if (err) {
			res.send(err);
		} else {
			console.log('success updated book: ', book);
			res.send(book);
		}
	});
});

app.delete('/books/:book_id', requiresAdmin, function (req, res){
	Book.findOneAndRemove({ _id: req.params.book_id }, function (err, book){
		if (err) {
			res.send('Nincs ilyen könyv!');
		} else {
			res.send('A könyv törölve lett!');
		}
	});
});

/* get, delete, post, borrow  */

app.post('/books/:book_id', function (req, res) {
	var am;
	
	Book.findOne({ _id : req.params.book_id}, function (err, book) {
		if (err) {
			res.send(err);
		} else {
			if (book.amount > 0) {
				
				Borrow.create({ title : book.title, user : req.user.username, book_id : req.params.book_id, file: book.file }, function(err, borrow){
					if (err) {
						res.send(err);
					} else {
						am = book.amount - 1;
						res.send(borrow);
						Book.findOneAndUpdate( {_id : req.params.book_id }, { amount : am}, { new : true },  function(err, book){
							if (err) {
								console.log(err);
							} else {
								console.log('am: ', am);
							}
						});
					}
				});
			} else {
				res.send('failed borrow');
			}
		}
	});
});

app.delete('/books/:book_id/borrows/:borrow_id', function (req, res) {
	var am;

	Book.findOne({ _id : req.params.book_id }, function (err, book) {
		am = book.amount + 1;
		Borrow.findOneAndRemove({ _id : req.params.borrow_id, book_id : req.params.book_id }, function(err, borrow) {
			if (err) {
				res.send(err);
			} else {
				Book.findOneAndUpdate({ _id : req.params.book_id }, { amount : am}, { new : true }, function (err, book) {});
			}
		});
	});
});

/* get admin, get users/books, get users, put user -->admin, delete user */

app.get('/admin', requiresAdmin, function (req, res) {
	var promise, admin, users, borrows, books;

	promise = Account.find({ isAdmin : true}).exec();
	
	promise.then(function (foundAdmin) {
		admin = foundAdmin;
		return Account.find().exec();
	}).then(function (foundUsers) {
		users = foundUsers;
		return Book.find().exec();	
	}).then(function (foundBooks) {
		books = foundBooks;
		return Borrow.find();
	}).then(function (foundBorrows) {
		borrows = foundBorrows;
	}).then(function (err, foundAdmin, foundUsers, foundBorrows, foundBooks) {
		if (err) {
			console.log(err);
		} else {
			console.log(books);
			res.render('admin', {
				user: users,
				borrow: borrows,
				book: books,
				admin: admin,
				helpers: {
					datum: function (d) {
						if (!d) { return ""; }
						return d.getFullYear()+' '+d.getMonth()+' '+d.getDate();
					}
				}
			});
		}
	});
});

app.get('/user/borrows', function (req, res) {
	console.log(req.user);
	Borrow.find({ user : req.user.username }, function (err, borrows) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log(borrows);
			res.render('userborrows', {
				book: borrows
			});
		}
	});
});

app.put('/admin/user/:user_id', requiresAdmin, function (req, res) {
	var data = {
		isAdmin: req.body.isAdmin
	};
	Account.findOneAndUpdate({ _id : req.params.user_id }, data, { new : true }, function (err, account) {
		if (err) {
			res.send('Nincs ilyen user!');
		} else {
			res.send(account);
		}
	});
});

app.delete('/admin/user/:user_id', requiresAdmin, function (req, res) {
	Account.findOneAndRemove({ _id : req.params.user_id }, function (err, account) {
		if (err) {
			res.send(err);
		} else {
			res.send('A user törölve lett!');
		}
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
  	var port = server.address().port;
  	
	console.log('Example app listening at http://%s:%s', host, port);
});