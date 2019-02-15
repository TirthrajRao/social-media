var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var message = new Schema({

	srcId: String,
	dstId: String,
	msg: String,
	
});

module.exports = mongoose.model('message', message);