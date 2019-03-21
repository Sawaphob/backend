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
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true }); // test =  database name
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('DB connected!')});
// PlayGround --------------------------------------

// var aUser = new User({ name: 'user1' });
// var aUser2 = new User({ name: 'user2' });
// var aUser3 = new User({ name: 'user3' });
// var aGroup = new Group({ name: 'Group101' });
// var aGroup2 = new Group({ name: 'Group102' });
// var aGroup3 = new Group({ name: 'Group103' });
// aUser.save();
// aUser2.save();
// aUser3.save();
// aGroup.save();
// aGroup2.save();
// aGroup3.save();
// new GroupJoinedInfo({username: 'user1', groupname: 'Group101'}).save();
// new GroupJoinedInfo({username: 'user1', groupname: 'Group102'}).save();
// new GroupJoinedInfo({username: 'user2', groupname: 'Group101'}).save();
// new GroupJoinedInfo({username: 'user2', groupname: 'Group103'}).save();
// new Message({    userName: 'usertst',
//                 groupName: 'Group101',
//                 timestamp: new Date('December 17, 1995 03:22:00'),
//                 text: 'another Messageeeeeeeee',
//             }).save();

// var query = Group.find();
// query.then(function(group) {console.log(group)});
//-----------------------------------------------------------------------------

function userEnter(data) { //data = username "Dongglue"}
  User.find({name:data},function(err,users){
    if(err) {console.log(err);}
    // TODO [DB] : Create user if not existed
    if(!users.length) { // user == [] อันนี้เขียนๆไปก่อน ไม่รู้ js เช๊คไง
      console.log('Create New User na')
      var newUser = new User({name:data});
      newUser.save();
    }
  })
}

function EmitGroupInfo(username,socket){

  var groupListkub = [] ;
  Group.find({},function(err,data){
    data.forEach(function(element) { 
      groupListkub.push(element.name);
    })
    var isJoinGroupListkub = [];
    let j = 0;      
    groupListkub.forEach(function(element){
      JoinedGroupInfo.find({username:username,groupname:element},function(err,data){
        if (data.length == 0) {
          isJoinGroupListkub.push(false);
        } else {
          isJoinGroupListkub.push(true);
        }
        j += 1; 
        if(j==groupListkub.length)
          socket.emit("updateIsJoined",{groupList:groupListkub, isJoinGroupList:isJoinGroupListkub});
          console.log('emit groupListSomething lew!')
      })
    })
  })

}

function EmitAllChats(socket){
  var allChats = {};
  var allChat = [];
  Group.find({},function(err,allGroups) {
    allGroups.forEach(function(data){
      allChat.push(data.name);
    })
    let j = 0;
    allChat.forEach(function(data){
      Message.find({groupName:data}).sort('timestamp').exec(function(err,msg){
        // console.log("msg")
        // console.log(msg)
        allChats[data] = msg.map(function(item,index){
          return {username:item.userName, content:item.text, timeStamp:item.timestamp.getHours()+":"+item.timestamp.getMinutes() }
        });
        j+=1
        if(j==allChat.length){
          console.log(allChats)
          socket.emit('updateAllChats',allChats);
          console.log('emitAllChat lew !')
        }
      })
    })
  })
}

io.on('connection', function (socket) {
  console.log('a user connected');

  // After click enter button , data = username 
  socket.on('enter', function (data) {
    console.log('Received [enter] event!');
    console.log(data);  
    userEnter(data);
    EmitAllChats(socket);
    EmitGroupInfo(data,socket)
  });
  
  socket.on('sendMessage', function(data){
    console.log('Received [sendMessage] event!');
    console.log(data);
    //new message 
    var newMessage = new Message(data).save();
    console.log('1')
    // store message
    socket.broadcast.emit('updateAllChats',GetAllChats());
    console.log('2')
    /* Send Messages to others in chat */
    /* Message must be TOTAL ORDER something -- maybe store all message in DB and query ALL message in TOTAL ORDER and sendback?  */
    // see more -- broadcast , but tun: think wa mai na ja work
 
  })
  socket.on('joinGroup', function(data){ //data = {username:'dongglue',groupname:'3L'}
      console.log('Received [joinGroup] event!');
      console.log(data);
      var joinNewGroup = new JoinedGroupInfo({username:data.username,groupname:data.groupname})
      console.log('joinNewGroup');      console.log(joinNewGroup);
      joinNewGroup.save();
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
      EmitGroupInfo(data.username,socket);
    })
    
  socket.on('leaveGroup', function(data){//data = {username:'dongglue',groupname:'3L'}
      console.log('Received [leaveGroup] event!');
      console.log(data);
      JoinedGroupInfo.deleteOne(data);
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
      EmitGroupInfo(data.username,socket);
    })
  
  socket.on('createGroup', function(data){ //data = {username:'dongglue',groupname:'3L'}
      console.log('Received [createGroup] event!');
      console.log(data);
      new Group({name:data.groupname}).save();
      var newGroupJoin = new JoinedGroupInfo({username:data.username,groupname:data.groupname});
      console.log(newGroupJoin);
      newGroupJoin.save();
      // น่าจะต้อง emit สักอย่างกลับไปให้ front ด้วย [ นึกไม่ออก เดียวค่อยมาดู ] by tun
      socket.broadcast.emit('notifyNewGroup')
  })
  socket.on('getUpdateIsjoined',function(data){ // data = username
      EmitGroupInfo(data,socket);
  })
  socket.on('disconnect', function () {
    io.emit('a user disconnected');
    console.log('a user diconnected kub')
  });

});

//-------------------------