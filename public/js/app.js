/* global Handlebars, $ */
$('#books').on('click', '#add-book', (function (e) {
	e.preventDefault();
	$('#book').show();
	$('#admin-menu').hide();
	$('#books').hide();
	$('#borrows').hide();
	$('#users').hide();
}));

var files = [];

$('input[type=file]').on('change', function (event) {
	files = event.target.files;
});

$('#book').submit(function (e) {
	e.preventDefault();
	
	var data = new FormData();
	 
	$.each(files, function(key, value){
		data.append('file', value);
	});
	
	data.append('ISBN', $('#new-ISBN').val());
	data.append('title', $('#new-title').val());
	data.append('author', $('#new-author').val());
	data.append('description', $('#new-description').val());
	data.append('amount', $('#new-amount').val());
	
	$.ajax(this.action, {
		type: 'POST',
		data: data,
		dataType: 'json',
		processData: false,
		contentType: false,
		success: function (data) {
			console.log('success');
			console.log('data', data);
			if (!data._id) {
				if (data.ISBN) {
					$('#invalid-ISBN').text(data.ISBN).show().fadeOut(3000);
				}
				if (data.author) {
					$('#invalid-author').text(data.author).show().fadeOut(3000);
				}
				if (data.title) {
					$('#invalid-title').text(data.title).show().fadeOut(3000);
				}
				if (data.description) {
					$('#invalid-description').text(data.description).show().fadeOut(3000);
				}
				if (data.amount) {
					$('#invalid-amount').text(data.amount).show().fadeOut(3000);
				}
				if (data.file) {
					$('#invalid-file').text(data.file).show().fadeOut(3000);
				}
			} else {
				console.log(data);
				var url = 'http://localhost:3000/books/' + data._id;
				window.location.replace(url);
			}
		}
	})
	
});

$('.delete-book').click(function (e) {
	e.preventDefault();
	console.log(this, this.href);
	
	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		context: document.activeElement,
		complete: function () {
			console.log('deleted');
			$(this).parent().parent().remove();
		}
	});
});

$('#book-borrow').click(function (e) {
	console.log(this.href);
	$.ajax(this.href, {
		method: 'POST',
		dataType: 'json',
		complete: function (data) {
			console.log('data: ', data);
			console.log('complete');
		}
	});
	e.preventDefault();
});

$('#register').submit(function (e) {
	e.preventDefault();

	$.post(this.action, {
		username: $('#username').val(),
		password: $('#ps').val(),
	}, function (data) {
		if (!data._id) {
			if (data.message) {
				$('#invalid-username').text(data.message).show().fadeOut(3000);
			}
			if (!data.password) {
				$('#invalid-ps').text('Field password is not set!').show().fadeOut(3000);
			}
		} else {
			console.log('success');
			window.location.replace("http://localhost:3000/login");
		}
	}, 'JSON');

});

var book_id;

$('.book').on('click', '.edit-book', function (e) {
	e.preventDefault();

	book_id =  this.href.split('/')[4];
	
	console.log(this);
	$('#'+book_id).show();
	$(this).parent().parent().find('.book-menu').hide();
});

 $('.edit-form').on('submit', function (e) {
	e.preventDefault();
	
	$.ajax(this.action, {
		method: 'PUT',
		dataType: 'json',
		data: {
			'ISBN': $('.edit-ISBN').val(),
			'author': $('.edit-author').val(),
			'title': $('.edit-title').val(),
			'description': $('.edit-description').val(),
			'amount': $('.edit-amount').val()
		},
		complete: function (data) {
			console.log(data);
		}
	});
	
	$(this).parent().hide();
	$(this).parent().parent().find('.book-menu').show();
 });
 
 var user_id;
 
 $('.user-menu').on('click', '.edit-user', function(e) {
	e.preventDefault();
	
	user_id = this.href.split('/')[5];
	console.log($(this).parent());

	$('#'+user_id).show();
	$(this).parent().hide();

 });
 
 $('.edit-user-form').on('submit', function (e) {
	e.preventDefault();
	
	$.ajax(this.action, {
		method: 'PUT',
	 	dataType: 'json',
		data: {
			'isAdmin': $('#isAdmin-'+user_id)[0].checked
		},
		complete: function (data) {
			console.log('succes edit');
		}
	 });
	 
	 $(this).hide();
	 $(this).parent().parent().find('.user-menu').show()
 });
 
 /*
 
 $('.toAdmin').submit(function (e) {
	 e.preventDefault();
	 
	 var user_id = this.action.split('/')[5]; 
	 
	 console.log($('#'+user_id));
	 console.log($('#'+user_id).parent());
	 console.log($('#'+user_id).parent().find('user-menu'));
	 
	 $('#'+user_id).hide();
	 $('#'+user_id).parent().find('.delete-user').show();
	 $('#'+user_id).parent().find('.edit-user').show();
	 
	 $.ajax(this.action, {
		 method: 'PUT',
		 dataType: 'json',
		 data: {
			 'isAdmin': $('#isAdmin-'+user_id)[0].checked
		 },
		 complete: function (data) {
			 console.log('succes edit');
		 }
	 });
 });
 */
 $('#users').on('click', '.delete-user', function (e) {
	e.preventDefault();
	
	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		context: document.activeElement,
		complete: function () {
			$(this).parent().remove();
		}
	}); 
 });
 
 
 $('#admin-users').click(function (e) {
	e.preventDefault();
	$('#users').show();
	$('#books').hide();
	$('#borrows').hide(); 
 });
 
 $('#admin-books').click(function (e) {
	e.preventDefault();
	$('#users').hide();
	$('#books').show();
	$('#borrows').hide(); 
 });
 
 $('#admin-borrows').click(function (e) {
	e.preventDefault();
	$('#users').hide();
	$('#books').hide();
	$('#borrows').show(); 
 });
 
 
 $('.delete-borrow').click(function (e) {
	e.preventDefault();
	console.log(this, this.href);
	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		context: document.activeElement,
		complete: function() {
			console.log('deleted borrow');
			$(this).parent().remove();
		}
	});
 });
 
 $('#menu').mouseover(function() {
	$('.menu-items').show();
	$('#book-logout').show();
	$('#mybooks').show();
	$('#book-borrow').show();
	$('#book-admin').show(); 
 });
 
 $('#book-menu').mouseleave(function() {
	 $('.menu-items').hide();
	 $('#book-logout').hide();
	$('#mybooks').hide();
	$('#book-borrow').hide();
	$('#book-admin').hide(); 
 });
 
 $('#menu').click(function (e) {
	 e.preventDefault();
 });