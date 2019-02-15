var userModel = require('../model/user.model');
let userController = {};

userController.signUp = function(req,res){

	var user = new userModel(req.body);

	user.save(function(err,savedUser){
		console.log(err,savedUser);
		res.send(savedUser);
		console.log(savedUser);
	})

}

userController.login = function(req,res){

	useremail = req.body.email;
	userModel.findOne({email:useremail}).exec((err,foundUser)=>{
		if(err){
			res.status(500).send(err);
		}else if(foundUser){
			console.log(foundUser);
			if(foundUser.pswd == req.body.pswd){
				res.status(200).json(foundUser);
			}else{
				res.status(403).json({msg:"password not match"});
			}
		}else{
			res.status(403).json({msg:"unauthorized Access"});
		}
	})

}

userController.getUser = function(req,res){

}

userController.searchUser = function(req,res){

	var key=req.query.key;
	console.log("key from userController",key);

	userModel.find({$or:[{firstname:key}, {lastname:key}]},function(err,foundUser)
	{
		res.send(err || foundUser);
		console.log(foundUser);
	})



}
userController.addFriend = function (req,res){
	var currentUser = req.body.requestedUser;
	var user = req.body.userTobeFollowed;
	userModel.findOne({_id: currentUser},function(err,foundUser){
		console.log(foundUser);
		foundUser.friends.push(user);
		foundUser.save();
		res.send(foundUser);
	})
}

userController.removeFriend = function(req,res){

	var currentUser=req.body.requestedUser;
	var user=req.body.userTobeUnFollowed;
	userModel.findOne({_id: currentUser},function(err,foundUser){
		console.log(foundUser);
		var index = foundUser.friends.indexOf(user);
		console.log(index);
		if(index == -1){

			console.log("User not found");
			res.status(401).send("Bad data");
		}else{

			foundUser.friends.splice(index,1);
			foundUser.save();
			res.send(foundUser);
		}


	})
}

userController.getDetail = function(req,res){

	var currentUser=req.params.myId;
	console.log(currentUser);
	userModel.findOne({_id:currentUser},function(err,foundUser){
		console.log(foundUser,err);
		res.send(foundUser);
		
	})
}


userController.getFriendName = function(req,res){

	var CurrentUser = req.params.currentUserID;
	console.log("id:",req.body.currentUserID);
	userModel.findOne({_id:CurrentUser})
	.exec((err,result)=>{
		if(err) {res.status(500).send(err);}
		userModel.find({'_id':{$in: result.friends}})
		.populate('users')
		.exec((err,user)=>{
			if(err) {res.status(500).send(err);}
			console.log("POSTS...",user);
			res.status(200).send(user);
		})
	})


}


userController.updateUser = function(req,res){
	console.log("req files =============>" , req.files.uploadfile);
	var samplefile = req.files.uploadfile;
	console.log("single File test",samplefile);
	samplefile.mv('./profile/'+samplefile.name,function(err,result){
		if(err){
			console.log("Error---->>>>>>",err);
			return res.status(500).send(err);

		}else{

			switch(req.body.change){
				case "profile":
				var postdata = {
					profile:'/profile/'+samplefile.name
				};
				console.log("postdata here=========>>>>>>>",postdata);
				break;

				case "cover":
				var postdata = {
					cover:'/profile/'+samplefile.name

				};
				console.log("postdata here=========>>>>>>>",postdata);

				break;
			}

			var userId = req.body.userId;
			console.log("userId========>>>>>>",userId);
			userModel.findOneAndUpdate({_id:userId},{$set:postdata},{upsert:true,new:true},function(err,updateUser){
				console.log(updateUser);
				res.send(updateUser);

			})

		}

		
	})
}

userController.updateData = function(req,res){
	var userId = req.body.userID;
	console.log("userID====>>>",userId);
	var detail = {
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		email:req.body.email,
		dob:req.body.dob
	}
	console.log("details================>>",detail);
	userModel.findOneAndUpdate({_id:userId},{$set:detail},{upsert:true,new:true},function(err,updateUser){
		console.log("updated user detail====>>>",updateUser);
		res.send(updateUser);
	})
}






module.exports = userController;