/* global Handlebars, $ */

$('#book').submit(function (e) {
	e.preventDefault();
	console.log(this, this.action);
	console.log($('#ISBN').val(), $('#author').val(), $('#title').val(), $('#amount').val());
	
	$.post(this. action,{
			ISBN: $('#ISBN').val(),
			title: $('#title').val(),
			author: $('#author').val(),
			amount: $('#amount').val()
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
				if (data.amount) {
					$('#invalid-amount').text(data.amount).show().fadeOut(3000);
				}
			} else {
				console.log(data);
				var url = 'http://localhost:3000/books/' + data._id;
				window.location.replace(url);
			}
		}
	);
});

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