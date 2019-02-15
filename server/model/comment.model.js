var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comment = new Schema({

	postId:{ type: Schema.Types.ObjectId, ref: 'post'},
	userId:{ type: Schema.Types.ObjectId, ref: 'Users'},
	comment:String
	
});

comment.pre('find', function(next) {
  this.populate('userId');
  next();

});
module.exports = mongoose.model('comment', comment);