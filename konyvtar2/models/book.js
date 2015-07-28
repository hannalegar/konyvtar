var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = mongoose.Schema({
	ISBN: {type: Number, required: 'Nincs megadva ISBN kód!'},
	title: {type: String, required: 'Nincs megadva cím!'},
	author: {type: String, required: 'Nincsen megadva szerző!'},
	amount: {type: Number, required: 'Nincsen megadva menniység!'}
});

module.exports = mongoose.model('Book', Book);