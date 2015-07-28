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
			} else {
				console.log(data);
			}
		}
	)
});

$('#delete-book').click(function (e) {
	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		complete: function(){
			console.log('deleted');
			window.location.replace("http://localhost:3000");
		}
	})
});

$('#borrow-book').click(function (e) {
	$.ajax(this.href, {
		method: 'POST',
		dataType: 'json',
		complete: function(){
			console.log('complete');
		}
	});
	e.prevenetDefault;
});

$('#delete-borrow').click(function (e) {
	$.ajax(this.href, {
		method: 'DELETE',
		dataType: 'json',
		complete: function(){
			console.log('deleted borrow');
			window.location.replace("http://localhost:3000");
		}
	});
});