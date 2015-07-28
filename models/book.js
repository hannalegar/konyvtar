var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = mongoose.Schema({
	ISBN: {type: Number, required: 'Nincs megadva ISBN kód!',  max: 999999, min: 100000},
	title: {type: String, required: 'Nincs megadva cím!'},
	author: {type: String, required: 'Nincsen megadva szerző!'},
	amount: {type: Number, required: 'Nincsen megadva menniység!', max: 10}
});

module.exports = mongoose.model('Book', Book);