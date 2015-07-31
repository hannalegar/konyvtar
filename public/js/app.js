/* global Handlebars, $ */
var files = [];

$('input[type=file]').on('change', function (event) {
	files = event.target.files;
});

$('#book').submit(function (e) {
	/*e.preventDefault();
	console.log(this, this.action);
	console.log($('#ISBN').val(), $('#author').val(), $('#title').val(), $('#amount').val());
	
	$.post(this. action,{
			ISBN: $('#new-ISBN').val(),
			title: $('#new-title').val(),
			author: $('#new-author').val(),
			description: $('#new-description').val(),
			amount: $('#new-amount').val()
		}, function(data){
			console.log(data);
			if (!data._id) {
				console.log('failed');
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
			} else {
				console.log(data);
				var url = 'http://localhost:3000/books/' + data._id;
				window.location.replace(url);
			}
		}
	);*/
	
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
/*admin*/
/*
$('#delete-book').click(function (e) {
	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		complete: function(){
			console.log('deleted');
			 $(this).parent().remove();
			window.location.replace("http://localhost:3000");
		}
	});
});
*/

/* home */
/*
$('#borrow-book').click(function (e) {
	console.log();
	$.ajax(this.href, {
		method: 'POST',
		dataType: 'json',
		complete: function(){
			console.log('complete');
		}
	});
	e.prevenetDefault;
});
*/

/*mybooks*/
/*
$('.borrow').on('click', '.delete-borrow', function (e) {
	e.preventDefault();
	console.log(this, this.href);
	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		context: document.activeElement,
		complete: function(){
			console.log('deleted');
			console.log($(this).parent().remove());
			$(this).parent().remove();
		}
	});
});
*/

$('#register').submit(function (e) {
	e.preventDefault();
	console.log(this, this.action);
	console.log('username: ', $('#username').val());
	console.log('password: ', $('#ps').val());
	console.log('isAdmin: ', $('#isAdmin')[0].checked);
	
	$.post(this.action, {
		username: $('#username').val(),
		password: $('#ps').val(),
		isAdmin: $('#isAdmin')[0].checked
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

/*admin*/
/*
$('#edit-book').click(function (e) {
	e.preventDefault();
	$('#book').hide();
	$('#edit').show();
	$('#edit-form').show();
});

 $('#edit-form').on('submit', function (e) {
	e.preventDefault();
	
	$.ajax(this.action, {
		method: 'PUT',
		dataType: 'json',
		data: {
			'ISBN': $('#edit-ISBN').val(),
			'title': $('#edit-title').val(),
			'author': $('#edit-author').val(),
			'description': $('#edit-description').val(),
			'amount': $('#edit-amount').val()
		}, 
		complete: function (data) {
			console.log('success update');
			console.log('data: ', data);
			$('#title').text(data.responseJSON.title);
			$('#ISBN').text(data.responseJSON.ISBN);
			$('#author').text(data.responseJSON.author);
			$('#description').text(data.responseJSON.description);
			$('#am').text(data.responseJSON.amount);
		}
	});
	$('#edit').hide();
	$('#book').show();
 });
 */
 
 /*admin --> add user*/
 /*
 $('#reg').on('click', 'a', function (e) {
	 e.preventDefault();
	 $('#login').hide();
	 $('#register').show();
 });
 */
 
 /*book, home*/
 /*
 $('#log').on('click', 'a', function (e) {
	e.preventDefault();
	$('#login').show();
	$('#register').hide();
 });
 */