var messageModel = require('../model/message.model');
let messageController = {};

messageController.getMessage = function(req,res){

	var srcId=req.body.srcId;
	var dstId=req.body.dstId;

	
	messageModel.find({$or:[{srcId:srcId},{dstId:dstId},{srcId:dstId},{dstId:srcId}]},function(err,message)
	{
		res.send(err || message);
		console.log(message);
	})

}

module.exports = messageController;