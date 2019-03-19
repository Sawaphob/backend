const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Group = require('./models/group');
const JoinedGroupInfo = require('./models/groupjoinedinfo');
const Message = require('./models/message');

const APP_PORT = 4000;

// DB ---------------------------------------------------------------------------
mongoose.connect('mongodb://localhost/test'); // test =  database name
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('DB connected!')});
//--------------------------------------
var aUser = new User({ name: 'userNameKub' });
aUser.save();
var aGroup = new Group({ name: 'Group101kub' });
var aUser2 = new User({ name: 'user2NameKub' });

//-----------------------------------------------------------------------------

var app = express();
var server = app.listen(APP_PORT, () => console.log('Listening on APP_PORT ' + APP_PORT));
app.get('/', (req, res) => {
  User.find({}, function (err, users) {
    if (err) return console.error(err);
    console.log(users);
    res.send(users); // for go to localhost:4000 and see data in browser
  })
})
