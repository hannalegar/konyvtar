var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Borrow = mongoose.Schema({
	title: {type: String, required: true},
	user: {type: String, required: true},
	book_id :  mongoose.Schema.Types.ObjectId,
	file: {type: Object, required: true}, 
	date: {type: Date, default: Date.now},
	amount: {type: Number, required: true}
});

module.exports = mongoose.model('Borrow', Borrow);