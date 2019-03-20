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
mongoose.connect('mongodb://localhost/LLL',{ useNewUrlParser: true }); // test =  database name
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('DB connected!')});
//--------------------------------------

//-------------------
// var aUser = new User({ name: 'userNameKub' });
// var aGroup = new Group({ name: 'Group101kub' });
// var aUser2 = new User({ name: 'user2NameKub' });
// var stamp = new Date('December 17, 1995 03:24:00');
// aUser.save()
// User.find({}, function(users) {
//   console.log(users)

// })
// //-----------------------------------------------------------------------------

// function userEnter(data) {
//   // TODO [DB] : Create user if not existed

// }
var allChats = {
  member:{}
}

function foo (allChats, c) {
  Group.find({},function(err,allGroups) {
    for (var i in allGroups){
      var groupName = allGroups[i].name
      c(allChats, groupName);
    }
  })
}

var eiei = foo (allChats, function (allChats, groupName) {
  Message.find({group:groupName}, function(err,msg){
    allChats.member[groupName] = msg
    // console.log(allChats.member)
  }).then(function(){
    console.log(allChats.member)
    return allChats.member
  })
});

// // function addGroup(){
//   Group.find({},function(err,allGroups) {
//     // console.log(data[0]._id);
//     // console.log(allGroups.length)
//     // var groupName = ""
//     for (var i in allGroups){
//       var groupName = allGroups[i].name
//       // console.log(groupName)
//       Message.find({group:groupName}, function(err,msg){
//         allChats.member[groupName] = msg
//         console.log(allChats.member)
//       })
//       // adddata(ee, groupName)
//       console.log(allChats.member)
//     }
//     // return ee;
//   })
// // }

// function adddata(allChats, groupName) {
//   Message.find({group:groupName}, function(err,msg){
//     allChats.member[groupName] = msg
//     console.log(allChats.member)
//     // console.log(msg)
//     return allChats.member;
//   })
// }

function GetAllChats() {

}

// function storeMessage(message) {
// 	// TODO [DB] : Store message in DB !
// }

// io.on('connection', function (socket) {
// 	io.emit('this', { will: 'be received by everyone'});

//   // After click enter button , data = username 
//   socket.on('enter', function (data) {
//     console.log('Received [enter] event!');
//     console.log(data);  
//     userEnter(data);
//     socket.emit('allchat',GetAllChats());
//     console.log('sendallChat lew!')
//   });
  
//   socket.on('sendMessage', function(data){
//     console.log('Received [sendMessage] event!');
//     console.log(data);
//     var dummyMessage = {        
//       username: "This",
//       content: "This",
//       timeStamp: "1:23"
//     }
//     storeMessage();
//     socket.emit('updateSendMessages',function(datakub) {
//       /* Send Messages to others in chat */
//       /* Message must be TOTAL ORDER something -- maybe store all message in DB and query ALL message in TOTAL ORDER and sendback?  */
//       // see more -- broadcast , but tun: think wa mai na ja work
//   });
//   })

//   function joinGroup(socket, db, groupId) {
//   	if (!groupId) {
//   		socket.emit('errUnknownGroup');
//   	} else{
//   		//[TODO DB INSERT USER TO GROUP]
//         socket.join(groupId);
//       }
//   }

//   socket.on('joinGroup', (data) => {
//     if (data.groupId) { //Id from each group
//     	joinGroup(socket, db, data.groupId);
//       /* แปะเผื่อไว้ก่อนต้องใช้
//       refreshGroups(socket, db, false); 
//       refreshMembers(socket, db, data.gid, true);
//       */
//   } else {
//   	socket.emit('errUnknownGroup');
//   }
// })

//   socket.on('leaveGroup', (data) => {

//   	if (!data.groupId) {
//   		socket.emit('errUnknownGroup');
//   	} else {
//     //[TODO DB Delete user from group]

// 	/* แปะเผื่อไว้ก่อนต้องใช้
//       refreshGroups(socket, db, false); 
//       refreshMembers(socket, db, data.gid, true);
//       */

//   }
// })
//   socket.on('createGroup', (data) => {
//   	//[TODO DB INSERT NEW GROUP]
//         joinGroup(socket, db, groupId);

//         /* แปะเผื่อไว้ก่อนต้องใช้
//       refreshGroups(socket, db, false); 
//       refreshMembers(socket, db, data.gid, true);
//       */
//       })
    


//   socket.on('disconnect', function () {
//   	io.emit('a user disconnected');
//   });

// });

//-------------------------