var postModel = require('../model/post.model');
var hashtagModel = require('../model/hashtag.model');
let hashtagController = {};

hashtagController.addtag = function(req,res){

	var hash = req.body.hashtag;
	var hashtag = new hashtagModel(hash);

	post.save(function(err,savedHashtags){
		console.log(err,savedHashtags);
		console.log(savedHashtags);
	})
}

hashtagController.getHash = function(req,res){

	hashtagModel.find({}).sort([['counter', 'descending']]).exec(function(err,hashtag){
		res.send(hashtag);
		console.log(hashtag);

	})
}

module.exports = hashtagController;