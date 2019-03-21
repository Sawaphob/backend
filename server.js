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
// PlayGround --------------------------------------
/*
var aUser = new User({ name: 'user1' });
var aUser2 = new User({ name: 'user2' });
var aUser3 = new User({ name: 'user3' });
var aGroup = new Group({ name: 'Group101' });
var aGroup2 = new Group({ name: 'Group102' });
var aGroup3 = new Group({ name: 'Group103' });
aUser.save();
aUser2.save();
aUser3.save();
aGroup.save();
aGroup2.save();
aGroup3.save();
new GroupJoinedInfo({username: 'user1', groupname: 'Group101'}).save();
new GroupJoinedInfo({username: 'user1', groupname: 'Group102'}).save();
new GroupJoinedInfo({username: 'user2', groupname: 'Group101'}).save();
new GroupJoinedInfo({username: 'user2', groupname: 'Group103'}).save();
new Message({    username: 'user1',
                groupname: 'Group101',
                timestamp: new Date('December 17, 1995 03:24:00'),
                text: 'user1messagekubbbbbbbbbbbbbbbbbbbbb',
            }).save();
*/
// var query = Group.find();
// query.then(function(group) {console.log(group)});
//-----------------------------------------------------------------------------

// function userEnter(data) { //data = {username : "Dongglue"}
//   User.find({name:data.username},function(err,users){
//     if(err) {console.log(err);}
//     // TODO [DB] : Create user if not existed
//     if(!users) { // user == [] อันนี้เขียนๆไปก่อน ไม่รู้ js เช๊คไง
//       var newUser = new User({name:data.username});
//       newUser.save();
//     }
//   })
// }

function GetGroupInfo(username){
  // var groupListkub = [] ;
  // Group.find({},function(err,groups){
  //   for (let i = 0; i < groups.length ;i++ ){
  //     groupListkub.push(groups[i].username)
  //   }
  //   // groupListkub = ['Group101','Group102','Group103']
  //   console.log(groupListkub)
  //   var isJoinGroupListkub = [];      
  //   for (let j = 0; j < groupListkub.length ; j++){
  //     JoinedGroupInfo.find({username:username,groupname:groupListkub[j]}, function(err,info){
  //       if (info.length == 0) {
  //         isJoinGroupListkub.push(false);
  //       } else {
  //         isJoinGroupListkub.push(true);
  //       }
  //       if (j == groupListkub.length -1) {
  //         console.log({groupList:groupListkub, isJoinGroupList:isJoinGroupListkub});
  //       }
        
  //     })
  //   }

  // })  

  var groupListkub = [] ;
  Group.find({},function(err,data){
    data.forEach(function(element) { 
      groupListkub.push(element.name);
    })
    console.log('1')
    console.log(groupListkub)
    var isJoinGroupListkub = [];
    let j = 0;      
    groupListkub.forEach(function(element){
      j += 1; 
      JoinedGroupInfo.find({username:username,groupname:element},function(err,data){
        if (data.length == 0) {
          isJoinGroupListkub.push(false);
        } else {
          isJoinGroupListkub.push(true);
        }
        console.log('2.5')
        console.log(j)
        console.log(groupListkub.length)
        console.log({groupList:groupListkub, isJoinGroupList:isJoinGroupListkub});
      })
    })
//--------------------------------------

//-------------------
// var aUser = new User({ name: 'userNameKub' });
// var aGroup = new Group({ name: 'Group101kub' });
// var aUser2 = new User({ name: 'user2NameKub' });
// var stamp = new Date('December 17, 1995 03:24:00');
// aUser.save()
// User.find({}, function(users) {
//   console.log(users)

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
GetGroupInfo('user1');

function storeMessage(data) { //data = {userName:"tstkub",groupName:"3L",timestamp:blabla,text:"Hello World"}
	var newMessage = new Message({userName:data.userName,groupName:data.groupName,timestamp:data.timestamp,text:data.text});
	console.log(newMessage);
	newMessage.save();
	// TODO [DB] : Store message in DB !
}

var allChats = {
  member:{}
}

function foo (allChats, call) {
  Group.find({},function(err,allGroups) {
    // console.log(2)
    for (var i in allGroups){
      var groupName = allGroups[i].name
      call(allChats, groupName);
    }
  })
}
// var eiei = 
foo (allChats, function (allChats, groupName) {             //callback
  // console.log(1)
  Message.find({groupName:groupName}, function(err,msg){
    allChats.member[groupName] = msg
    // console.log(allChats.member)
  }).then(function(){                                         //Promise
    // console.log(3)
    console.log(allChats.member)
    // return allChats.member
  })
})

io.on('connection', function (socket) {
  console.log('a user connected');
  console.log()

  // After click enter button , data = username 
  socket.on('enter', function (data) {
    console.log('Received [enter] event!');
    console.log(data);  
    // userEnter(data);
    socket.emit('updateAllChats',GetAllChats());
    console.log('updateAllChats lew! [from enter]')
  });
  
  socket.on('sendMessage', function(data){
    console.log('Received [sendMessage] event!');
    console.log(data);
<<<<<<< HEAD
    //new message 
    // store message
    
    /* Send Messages to others in chat */
    /* Message must be TOTAL ORDER something -- maybe store all message in DB and query ALL message in TOTAL ORDER and sendback?  */
    // see more -- broadcast , but tun: think wa mai na ja work
 
=======
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
>>>>>>> 2be6d4897ad1f1f7fba4666f544cdc1c066b9262
  })
  socket.on('joinGroup', function(data){ //data = {username:'dongglue',groupname:'3L'}
      var joinNewGroup = new JoinedGroupInfo({username:data.username,groupname:data.groupname})
      console.log('joinNewGroup');      console.log(joinNewGroup);
      joinNewGroup.save();
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
      var groupListkub = [] ;
      Group.find({},function(err,data){
        data.forEach(function(element) { 
          groupListkub.push(element.name);
        })
        var isJoinGroupListkub = [];      
        groupListkub.forEach(function(element){ 
          JoinedGroupInfo.find({username:data.username,groupname:element},function(err,data){
            console.log(element)
            if (data.length == 0) {
              isJoinGroupListkub.push(false);
            } else {
              isJoinGroupListkub.push(true);
            }
            socket.broadcast.emit('updateGroups', {groupList:groupListkub, isJoinGroupList:isJoinGroupListkub});
          })
  
        }) 
      })  
  
    })
    
  socket.on('leaveGroup', function(data){//data = {username:'dongglue',groupname:'3L'}
      JoinedGroupInfo.deleteOne(data);
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
      var groupListkub = [] ;
      Group.find({},function(err,groups){
        for (let i = 0; i < groups.length ;i++ ){
          groupListkub.push(groups[i].username)
        }
        // groupListkub = ['Group101','Group102','Group103']
        var isJoinGroupListkub = [];      
        for (let j = 0; j < groupListkub.length ; j++){
          JoinedGroupInfo.find({username:data.username,groupname:groupListkub[j]}, function(err,info){
            if (info.length == 0) {
              isJoinGroupListkub.push(false);
            } else {
              isJoinGroupListkub.push(true);
            }
            if (j == groupListkub.length -1) {
              console.log({groupList:groupListkub, isJoinGroupList:isJoinGroupListkub});
              socket.broadcast.emit('updateGroups', {groupList:groupListkub, isJoinGroupList:isJoinGroupListkub});
            }
            
          })
        }
 
      })  
  
    })
  
  socket.on('createGroup', function(data){ //data = {username:'dongglue',groupname:'3L'}
  	   var newGroupJoin = new JoinedGroupInfo({username:data.username,groupname:data.groupname});
       console.log(newGroupJoin);
       newGroupJoin.save();
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
      var username = data.username;
      var groupListkub = [] ;
      Group.find({},function(err,data){
        data.forEach(function(element) { 
          groupListkub.push(element.name);
        })
        console.log('hi here')
        console.log(groupListkub)
        var isJoinGroupListkub = [];      
        groupListkub.forEach(function(element){ 
          JoinedGroupInfo.find({username:username,groupname:element},function(err,data){
            console.log(element)
            if (data.length == 0) {
              isJoinGroupListkub.push(false);
            } else {
              isJoinGroupListkub.push(true);
            }
            socket.broadcast.emit('updateGroups', {groupList:groupListkub, isJoinGroupList:isJoinGroupListkub});
          })
  
        }) 
      })  
  
  })
    
  socket.on('disconnect', function () {
  	io.emit('a user disconnected');
  });

})
