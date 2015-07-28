var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Borrow = mongoose.Schema({
	ISBN: Number,
	user: String, 
	book_id :  mongoose.Schema.Types.ObjectId, 
	date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Borrow', Borrow);