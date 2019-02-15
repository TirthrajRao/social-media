var exp = require('express');
var mongoose = require('mongoose');
var userController = require('./controller/user.controller');
var postController = require('./controller/post.controller');
var messageController = require('./controller/message.controller');
var commentController = require('./controller/comment.controller');
var hashtagController = require('./controller/hashtag.controller');


var cors = require('cors');
var msgModel = require('./model/message.model');
var bodyParser = require('body-parser');
var app = exp();
var http = require('http');
const port = 8010;
var server = app.listen(port);
var io = require('socket.io').listen(server);

var fileupload = require("express-fileupload");


// var socketIO = require('socket.io');
// var io = socketIO(server);

mongoose.connect('mongodb://localhost:27017/socialmedia', {useNewUrlParser: true})
.then(() => console.log("Connected"))
.catch(err => console.log(err));

app.use(fileupload());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Routes for user Controller
app.post('/user/withprofile',userController.updateUser);
app.post('/user/updateData',userController.updateData);


app.post('/user',userController.signUp);
app.get('/user',userController.getUser);
app.get('/user/personal-detail/:myId',userController.getDetail);
app.get('/user/friends-name/:currentUserID',userController.getFriendName);
app.post('/user/login',userController.login);
app.get('/user/search',userController.searchUser);
app.post('/user/add-friend',userController.addFriend);
app.post('/user/remove-friend',userController.removeFriend);



//Routes for Post Controller

app.post('/post',postController.addPost);
app.get('/post/getFriendPosts/:currentUserID',postController.getFriendPosts);
app.get('/post/:userId',postController.getPosts);
app.get('/post/:id',postController.getPostById);

app.post('/post/search',postController.getPostByHashtag);


app.post('/post/file-upload',postController.uploadFile);

app.post('/post/addlike',postController.like);
app.post('/post/hashtag',postController.getHashTag);

//Routes for comment Controller

app.post('/comment',commentController.addComment);
app.get('/comment/:postID',commentController.getComment);

app.post('/hashtag',hashtagController.addtag);


//Routes for Message Controller

app.post('/message',messageController.getMessage);

app.get('/hashtag',hashtagController.getHash);


io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('new-message', (message) => {
      	console.log(message);
      	var msg = new msgModel(message);
      	msg.save(function(){
    		io.emit('new-message', message);
      	})
    });
});