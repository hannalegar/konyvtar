var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
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

passport.serializeUser(Account.serializeUser(function(user, done){
	done(null, Account._id);
}));
	
passport.deserializeUser(Account.deserializeUser(function(id, done){
	Account.findById(id, function(err, user){
		done(err, user);
	})
}));

mongoose.connect('mongodb://user:password@ds051740.mongolab.com:51740/konyvtar');

/*
registration
login
logout

get books
get book
post book
delete book
(edit book)

get borrows
get book/borrows
post borrow --> edit book
delete borrow --> edit book 
*/

/* registration, login, logout */

app.get('/register', function(req, res){
	console.log('get.register');
	res.render('register', {});
});

app.post('/register', function(req, res){
	Account.register( new Account ({ username : req.body.username}), req.body.password, function(err, account){
		if (err) {
			console.log(err);
			return res.render('register', { account : account});
		} else {
			passport.authenticate('local')(req, res, function(){
				console.log('succes registration', account);
				res.redirect('/')
			});
		}
	});
});

app.get('/login', function(req, res){
	console.log('get login');
	res.render('login', { user : req.user});
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	console.log({ user : req.user});
	console.log('success login');
	res.redirect('/');
});

app.get('/logout', function(req, res){
	console.log('succes logout');
	req.logout();
	res.redirect('/');
});

/* get, delete, edit, add book */ 

app.get('/', function(req, res){
	res.render('new');
});

app.get('/books', function (req, res) {
	Book.find(function (err, books) {
		if (err) {
			console.log('failed get books', err);
			res.send('failed get books', err);
		} else {
			console.log('get books', books);
			res.render('home', {
				book: books
			})
		}
	})
});

app.get('/books/:book_id', function (req, res) {
	Book.findOne({ _id : req.params.book_id }, function (err, book){
		if (err) {
			console.log('get book failed: ', err);
			res.send('get book failed: ', err);
		} else {
			console.log('success get book: ', book);
			res.render('book', {
				book: book
			});
		}
	});
});

app.post('/books', function(req, res){

	var data = {
		ISBN: req.body.ISBN,
		title: req.body.title,
		author: req.body.author,
		amount: req.body.amount
	}
	Book.create( data, function(err, book){
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
			if (err.errors.amount) {
				errmessage.amount = err.errors.amount.message;
			} 
			res.send(errmessage);
			console.log(errmessage);
		} else {
			console.log('post book', book);
			res.send(book);
		}
	});
});

app.delete('/books/:book_id', function (req, res){
	Book.findOneAndRemove({ _id: req.params.book_id}, function (err, book){
		if (err) {
			console.log('Nincs ilyen könyv');
			res.send('Nincs ilyen könyv!');
		} else {
			console.log('A könyv törölve lett');
			res.send('A könyv törölve lett!');
		}
	});
});

/* get, delete, post, borrow  */

app.get('/borrows', function (req, res){
	Borrow.find({}, function (err, borrows) {
		if (err) {
			console.log('there is no borrows');
			res.send('there is no borrows');
		} else {
			console.log('borrows: ', borrows);
			res.render('borrows', {
				borrow: borrows
			});
		}
	});
});

app.get('/books/:book_id/borrows', function (req, res) {
	console.log('get borrows');
	console.log(req.user.username, req.params.book_id);
	Borrow.find({ book_id : req.params.book_id }, function (err, borrows) {
		if (err) {
			console.log('borrows err: ', err);
			res.send(err);
		} else {
			console.log('borrows: ', borrows, req.params.book_id);
			res.render('borrow', {
				borrow: borrows,
				book_id : req.params.book_id
			});
		}
	});
});

app.post('/books/:book_id', function(req, res){
	console.log('post borrow');
	
	var am;
	
	Book.findOne({ _id : req.params.book_id}, function (err, book){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			if (book.amount > 0) {
				
				Borrow.create({ ISBN : book.ISBN, user : req.user.username, book_id : req.params.book_id }, function(err, borrow){
					if (err) {
						console.log('borrow post error: ', err);
						res.send(err);
					} else {
						am = book.amount - 1;
						console.log('success borrow:', borrow);
						res.send(borrow);
						
						Book.findOneAndUpdate( {_id : req.params.book_id }, { amount : am}, { new : true },  function(err, book){
							if (err) {
								console.log('book updated err: ', err);								
							} else {
								console.log('book updated');								
							}
						});
					}
				});
			} else {
				console.log('failed borrow');
				res.send('failed borrow');
			}
		}
	});

});

app.delete('books/:book_id/borrows/:borrow_id', function(req, res){
	console.log('delete borrow');
	var am;
	
	Book.findOne({ _id : req.params.book_id}, function (err, book) {
		if (err) {
			res.send(err);
		} else {
			am = book.amount + 1;	
			
			Borrow.findOneAndRemove({ _id : req.params.borrow_id}, function(err, borrow){
				if (err) {
					console.log('borrow delete err: ', err);
					res.send(err);
				} else {
					console.log('success delete borrow');
					res.send('success delete borrow');
					
					Book.findOneAndUpdate( {_id : req.params.book_id }, { amount : am}, { new : true },  function(err, book){
						if (err) {
							console.log('book updated err: ', err);
							res.send('book updated err: ', err);
						} else {
							console.log('book updated');
							res.send(book);
						}
					});
				}
			});
		}
	});
	
});

var server = app.listen(3000, function () {
	var host = server.address().address;
  	var port = server.address().port;
  	
	console.log('Example app listening at http://%s:%s', host, port);
});