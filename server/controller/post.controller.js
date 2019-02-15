
var postModel = require('../model/post.model');
var userModel = require('../model/user.model');
var hashtagModel = require('../model/hashtag.model');
let postController = {};
var _ = require('lodash');

postController.addPost = function(req,res){

	var userId = req.body.userId;
	var post = new postModel(req.body);
	console.log("addPost",post);
	var post = new postModel(req.body);


	var hash = req.body.hashtags;

	post.save(function(err,savedPost){
		console.log(err,savedPost);
		_.forEach(hash, function(i){
			hashtagModel.findOne({hashtag: i}, function(err, gotTag){
				if (err) {

				}else if(gotTag){

					gotTag.counter++;
					gotTag.save();
				}else{

					var data={
						hashtag:i,
						counter:1
					}

					var hashnew= new hashtagModel(data);
					hashnew.save(function(err,savedtag){
						console.log(err,savedtag);
					})


				}
			})
		})

	})
}




postController.deletePost = function(req,res){

}

postController.getPost = function(req,res){
	postModel.find({},function(err,post){
		res.send({post:post});
		console.log(posts);

	})
}

postController.getPostById = function(req,res){

	postModel.find({_id: req.params.id},function(err,foundUser)
	{
		res.send(err || foundUser);
	})

}

postController.getPosts = function(req,res){

	var userId = req.params.userId;
	postModel.find({userId:userId})
	.populate('posts')
	.exec((err,result)=>{
		if(err) {res.status(500).send(err);}
		res.status(200).send(result);
	})
}

postController.getFriendPosts = function(req,res){

	var CurrentUser = req.params.currentUserID;
	userModel.findOne({_id:CurrentUser})
	.exec((err,result)=>{
		console.log("CurrentUserid==>>>>>>>>>>>>>:",result);
		if(err) {res.status(500).send(err);}
		postModel.find({'userId':{ $in: result.friends }})
		.populate('comment')//it works
		.exec((err,posts)=>{
			if(err) {res.status(500).send(err);console.log("ERROR", err)}
			console.log("POSTS...",posts); 
			res.status(200).send(posts);
		})
	})
}

postController.uploadFile = function(req,res){
	console.log("req files =============>" , req.files.uploadfile);
	var samplefile = req.files.uploadfile;
	console.log("single File test",samplefile);
	samplefile.mv('./uploads/'+samplefile.name,function(err,result){
		if(err){
			console.log("Error---->>>>>>",err);
			return res.status(500).send(err);

		}else{

			var userId = req.body.userId;
			console.log("===========>>userId",userId);
			var FileName = req.body.fileName;
			console.log("==============>>file name",FileName);
			var fileNameArr = FileName.split("\\");
			console.log(" =========++>" , fileNameArr);
			FileName = fileNameArr[2];
			console.log("FileName =======>" , FileName);

			var words = req.body.content;
			console.log("words===>>>",words); 
			var tagslistarr = words.split(' ');
			console.log(tagslistarr);
			var arr=[];

			for(var i=0;i<tagslistarr.length;i++){

				if(tagslistarr[i].charAt(0) == '#'){                  
					arr.push(tagslistarr[i]);  
				}

			}

			var post_data = {
				content : req.body.content,
				datetime : req.body.datetime,
				publish: req.body.publish,
				fileName : "/uploads/"+FileName,
				userId: userId,
				hashtags:arr
				
			};

			var post = new postModel(post_data);
			console.log('addPost',post);

			post.save(function(err,savedPost){
				console.log(err,savedPost);
				res.send(savedPost);
				console.log(savedPost);
			})

			

		}

	})
}

postController.like = function(req,res){

	var userID = req.body.userID;
	var postID = req.body.postId;

	postModel.findOne({_id:postID}).exec((err,post)=>{
		console.log("Response from post Controller",post)
		if(err){res.status(500).send("Server Error")}
			else{
				post.like.push(userID);
				post.save();
				res.status(200).send(post);
			}
		})
}


postController.getHashTag = function(req,res) { 

	console.log("function is calling",req.body);
	var words = req.body.content;
	console.log("words===>>>",words); 
	var tagslistarr = words.split(' ');
	console.log(tagslistarr);
	var arr=[];

	for(var i=0;i<tagslistarr.length;i++){

		if(tagslistarr[i].charAt(0) == '#'){                  
			arr.push(tagslistarr[i]);  
		}

	}

	console.log(arr);
}


postController.getPostByHashtag = function(req,res){

	var key=req.body.key;
	console.log("function is calling",key);

	postModel.find({hashtags:key},function(err,foundpost)
	{
		res.send(err || foundpost);
		console.log(foundpost);
	})




}


module.exports = postController;

