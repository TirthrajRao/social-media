var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hashtag = new Schema({

	hashtag:String,
	counter:Number
});

module.exports = mongoose.model('hashtag', hashtag);