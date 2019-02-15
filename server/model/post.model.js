var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var post = new Schema({

	content: String,
	datetime: String,
	publish: Boolean,
	fileName:String,
	like:[{ type: Schema.Types.ObjectId, ref: 'Users'}],
	comment:[{ type: Schema.Types.ObjectId, ref: 'comment'}],
	userId:{ type: Schema.Types.ObjectId, ref: 'Users'},
	hashtags:[]
});

post.pre('find', function(next) {
  this.populate('userId');
  next();

});

module.exports = mongoose.model('post', post);