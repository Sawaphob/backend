// const express = require('express');
const APP_PORT = 8000;
const io = require('socket.io').listen(APP_PORT);
console.log('listening on port ', APP_PORT);
const mongoose = require('mongoose');
const User = require('./models/user');
const Group = require('./models/group');
const JoinedGroupInfo = require('./models/groupjoinedinfo');
const Message = require('./models/message');

// DB ---------------------------------------------------------------------------
mongoose.connect('mongodb://127.0.0.1/test',{ useNewUrlParser: true }); // test =  database name
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('DB connected!')});
//--------------------------------------
var aUser = new User({ name: 'userNameKub' });
var aGroup = new Group({ name: 'Group101kub' });
var aUser2 = new User({ name: 'user2NameKub' });
var stamp = new Date('December 17, 1995 03:24:00');

//-----------------------------------------------------------------------------

function userEnter(data) { //data = {username : "Dongglue"}
  User.find({name:data.username},function(err,users){
    if(err) {console.log(err);}
    // TODO [DB] : Create user if not existed
    if(!users || !users.length) { //แก้แบ้วเรียบร้อย by pun
      var newUser = new User({name:data.username});
      newUser.save();
    }
  })
}

function GetAllChats() {
  // TODO [DB] : Get All chats and send back
  var allChats = { /* QUERYed */
    "Group1isBack" : [
      {
        username: "This",
        content: "content = kuy",
        timeStamp: "1:23"
      },
      {
        username: "is",
        content: "is",
        timeStamp: "2:34"
      },
      {
        username: "Group1",
        content: "group1",
        timeStamp: "3.45"
      },
    ],
    "Group2woy" : [
      {
        username: "This",
        content: "This",
        timeStamp: "1:23"
      },
      {
        username: "is",
        content: "is",
        timeStamp: "2:34"
      }
    ]
  }
  return allChats; 
}

function storeMessage(message) {
	// TODO [DB] : Store message in DB !
}

io.on('connection', function (socket) {
  console.log('a user connected');
  
  // After click enter button , data = username 
  socket.on('enter', function (data) {
    console.log('Received [enter] event!');
    console.log(data);  
    userEnter(data);
    socket.emit('allchat',GetAllChats());
    console.log('sendallChat lew!')
  });
  
  socket.on('sendMessage', function(data){
    console.log('Received [sendMessage] event!');
    console.log(data);
    var dummyMessage = {        
      username: "This",
      content: "This",
      timeStamp: "1:23"
    }
    storeMessage(message); // อาจจะเขียนเป็น new Message แล้ว newMessage.save() ไปเลย ไม่ต้องแยก function เพราะ function ข้างนอกมองไม่เห็น socket
    socket.emit('updateSendMessages',function(datakub) {
      /* Send Messages to others in chat */
      /* Message must be TOTAL ORDER something -- maybe store all message in DB and query ALL message in TOTAL ORDER and sendback?  */
      // see more -- broadcast , but tun: think wa mai na ja work
  });
  })
  socket.on('joinGroup', function(data){ //data = {username:'dongglue',groupname:'3L'}
      var joinNewGroup = new JoinedGroupInfo({username:data.username,groupname:data.groupname})
      console.log(joinNewGroup);
      newGroupJoin.save()
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
    })
    
  socket.on('leaveGroup', function(data){//data = {username:'dongglue',groupname:'3L'}
      JoinedGroupInfo.deleteOne(data);
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
    })
  
  socket.on('createGroup', function(data){ //data = {username:'dongglue',groupname:'3L'}
  	   var newGroupJoin = new JoinedGroupInfo({username:data.username,groupname:data.groupname});
       console.log(newGroupJoin);
       newGroupJoin.save();
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
  })
    
  socket.on('disconnect', function () {
  	io.emit('a user disconnected');
  });

});

//-------------------------