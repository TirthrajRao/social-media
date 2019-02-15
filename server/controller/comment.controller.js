var commentModel = require('../model/comment.model');
var postModel = require('../model/post.model');
let commentController = {};

commentController.addComment = function(req,res){

	var userID = req.body.userId;
	var postID = req.body.postId;
	var comment = req.body.comment;

	var comment = new commentModel(req.body);


	comment.save(function(err,comment){
		if(err){res.status(500).send("Server Error")}
			else{
				postModel.findOne({_id:postID}).exec((err,result)=>{
					console.log("Response from message Controller",result)
					if(err){res.status(500).send("Server Error")}
						else{
							result.comment.push(comment._id);
							result.save();
							res.status(200).send(result);
						}
					})
			}
		})

}


commentController.getComment = function(req,res){



	var postid = req.params.postID;
	console.log("id of post:=======>>>>>",postid);
	postModel.findOne({_id:postid})
	.exec((err,result)=>{
		if(err) {res.status(500).send(err);}
		commentModel.find({_id:{$in: result.comment}})
		.exec((err,comment)=>{
			if(err) {res.status(500).send(err);}
			console.log("comment...",comment);
			res.status(200).send(comment);
		})
	})

}


module.exports = commentController;