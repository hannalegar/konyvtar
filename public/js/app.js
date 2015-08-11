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
		success: function (data) {
			console.log(data);
			$('#amount').text(data.amount);
			$('#success-borrow').text('Book has been borred!').show().fadeOut(3000);
		},
		error: function () {
			$('#success-borrow').text('This book can not be borrowed right now!').show().fadeOut(3000);
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
			/*if (!data.username) {
				$('#invalid-username').text('Field username is not set!').show().fadeOut(3000);
			}
			if (!data.password) {
				$('#invalid-ps').text('Field password is not set!').show().fadeOut(3000);
			}*/
			$('#invalid-ps').text(data.message).show();
			setTimeout(function	() {
				$('#invalid-ps').hide();
			}, 1800);
		} else {
			console.log('success');
			$('#success').text('Success registration!').show();
			setTimeout( function() {
				window.location.replace("http://localhost:3000/login")
			}, 3000);   

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
	var me = this;
	
	console.log(this.action);
	console.log(this);
	console.log('ISBN: ', $(this).find('.edit-ISBN').val());
	console.log('author: ', $(this).find('.edit-author').val());
	console.log('title: ', $(this).find('.edit-title').val());
	console.log('description: ', $(this).find('.edit-description').val());
	console.log('amount: ', $(this).find('.edit-amount').val());
	
	$.ajax(this.action, {
		method: 'PUT',
		dataType: 'json',
		data: {
			'ISBN': $(this).find('.edit-ISBN').val(),
			'author': $(this).find('.edit-author').val(),
			'title': $(this).find('.edit-title').val(),
			'description': $(this).find('.edit-description').val(),
			'amount': $(this).find('.edit-amount').val()
		},
		complete: function (data) {
			console.log(data);
			console.log('complete this: ', me);
			console.log($(me).parent().parent());
			$(me).parent().parent().find('.title').text(data.responseJSON.title);
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
 
 $('#users').on('click', '.delete-user', function (e) {
	e.preventDefault();
	var me = this;
	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		context: document.activeElement,
		complete: function () {
			$(me).parent().parent().remove();
		}
	}); 
 });
 
 $('.borrow').on('click', '.borrow-return', function (e) {
	 e.preventDefault();
	 
	 var id = this.href.split('/')[6],
	 	 me = this;
	 
	 console.log('id: ', id);
	 
	 $.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		context: document.activeElement,
		complete: function() {
			console.log('deleted borrow');	
			console.log($(me).parent());
			$(me).parent().remove();
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
	var me = this,
		id = this.href.split('/')[6]; 
	e.preventDefault();
	console.log(this, this.href);
	console.log('id: ', id);
		

	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		context: document.activeElement,
		complete: function() {
			console.log('deleted borrow');	
			console.log($(me).parent().find('#'+id));
			
			$(me).parent().find('.return-book').show();
			setTimeout( function () {
				$(me).parent().remove();	
			}, 3000);
		}
	});
 });
 
 $('#menu').mouseover(function() {
	$('.menu-items').show();
 });
 
 $('#book-menu').mouseleave(function() {
	 $('.menu-items').hide();	 
 });
 
 $('#menu').click(function (e) {
	 e.preventDefault();
 });
 
 $('#home-menu').mouseover(function	() {
	 $('#home-mybooks').show();
	 $('#home-logout').show();
 });
 
 $('#home').mouseleave(function() {
	 $('#home-mybooks').hide();
	 $('#home-logout').hide();	 
 });
 
 $('#home-menu').click(function (e) {
	 e.preventDefault();
 });
 
 $('#user-menu').mouseover(function () {
	$('#user-logout').show(); 
	$('#user-admin').show(); 
 });

 $('#myborrows-head').mouseleave(function () {
	 $('#user-logout').hide();
	 $('#user-admin').hide();
 });
 
 $('#user-menu').click(function (e) {
	 e.preventDefault();
 });