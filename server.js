// const express = require('express');
const APP_PORT = 4000;
const io = require('socket.io').listen(APP_PORT);

const mongoose = require('mongoose');
const User = require('./models/user');
const Group = require('./models/group');
const JoinedGroupInfo = require('./models/groupjoinedinfo');
const Message = require('./models/message');

// DB ---------------------------------------------------------------------------
mongoose.connect('mongodb://localhost/test'); // test =  database name
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('DB connected!')});
//--------------------------------------
var aUser = new User({ name: 'userNameKub' });
var aGroup = new Group({ name: 'Group101kub' });
var aUser2 = new User({ name: 'user2NameKub' });
//-----------------------------------------------------------------------------

function userEnter(data) {
  // TODO [DB] : Create user if not existed

}

function GetAndSendAllChats() {
  // TODO [DB] : Get All chats and send back
  var allChats = { /* QUERYed */
    "Group1" : [
      {
        username: "This",
        content: <p>This</p>,
        timeStamp: "1:23"
      },
      {
        username: "is",
        content: <p>is</p>,
        timeStamp: "2:34"
      },
      {
        username: "Group1",
        content: <p>group1</p>,
        timeStamp: "3.45"
      },
    ],
    "Group2" : [
      {
        username: "This",
        content: <p>This</p>,
        timeStamp: "1:23"
      },
      {
        username: "is",
        content: <p>is</p>,
        timeStamp: "2:34"
      }
    ]
  }
  socket.emit('Allchat',allChats); 
}

function storeMessage(message) {
  // TODO [DB] : Store message in DB !
}

io.on('connection', function (socket) {
  io.emit('this', { will: 'be received by everyone'});

  // After click enter button , data = username 
  socket.on('enter', function (data) {
    console.log('Received [enter] event!');
    console.log(data);  
    userEnter(data);
    GetAndSendAllChats();
  });
  
  socket.on('sendMessage', function(data){
    console.log('Received [enter] event!');
    console.log(data);
    var dummyMessage = {}
    storeMessage();
    socket.emit('updateSendMessages',function(datakub) {
      /* Send Messages to others in chat */
      /* Message must be TOTAL ORDER something -- maybe store all message in DB and query ALL message in TOTAL ORDER and sendback?  */
      // see more -- broadcast , but tun: think wa mai na ja work
    });
  })

  socket.on('disconnect', function () {
    io.emit('a user disconnected');
  });
});

