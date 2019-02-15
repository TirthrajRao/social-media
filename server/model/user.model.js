var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userDetails = new Schema({

	firstname: String,
	lastname: String,
	email:String,
	dob:String,
	pswd:String,
	friends:[{ type: Schema.Types.ObjectId, ref: 'Users'}],
	profile:String,
	cover:String

});
module.exports = mongoose.model('Users', userDetails);