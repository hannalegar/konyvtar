/* global Handlebars, $ */
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
			$(this).parent().remove();
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

$('.edit-book').click(function (e) {
	e.preventDefault();
	$(this).parent().find('.edit-book').show();
	$(this).parent().find('.edit').show();
});

 $('.edit-form').on('submit', function (e) {
	e.preventDefault();
	console.log(this, this.action);
	
	console.log('ISBN: ', $('.edit-ISBN').val());
	console.log('author: ', $('.edit-author').val());
	console.log('title: ', $('.edit-title').val());
	console.log('description: ', $('.edit-description').val());
	console.log('amount: ', $('.edit-amount').val());
	
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
 });
 
 $('#users').on('click', '.edit-user', function (e) {
	e.preventDefault();
	console.log($(this).parent());
	$(this).hide();
	$(this).parent().find('.delete-user').hide();
	$(this).parent().find('.toAdmin').show();
 });
 
 $('.toAdmin').submit(function (e) {
	 e.preventDefault();
	 
	 var id = this.action.split('/')[5];
	 console.log(id); 
	 
	 console.log(this);
	 console.log(this.action);
	 console.log($('#toAdmin'));
	 console.log('isAdmin: ', $('#isAdmin-'+id)[0].checked);
	 
	 $.ajax(this.action, {
		 method: 'PUT',
		 dataType: 'json',
		 data: {
			 'isAdmin': $('#isAdmin-'+id)[0].checked
		 },
		 complete: function (data) {
			 console.log('succes edit');
		 }
	 });
 });
 
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
 
 $('#menu').click(function (e) {
	e.preventDefault();
	$('#book-logout').show();
	$('#mybooks').show();
	$('#book-borrow').show();
	$('#book-admin').show(); 
 });