const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Group = require('./models/group');
const JoinedGroupInfo = require('./models/groupjoinedinfo');
const Message = require('./models/message');

const APP_PORT = 4000;

<<<<<<< HEAD
// DB ---------------------------------------------------------------------------
mongoose.connect('mongodb://localhost/test'); // test =  database name
=======
mongoose.connect('mongodb://127.0.0.1/test');
>>>>>>> 837e48b11d1977a0ca0f766c7588e0f37e359d4a
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('DB connected!')});
//--------------------------------------
var aUser = new User({ name: 'userNameKub' });
aUser.save();
var aGroup = new Group({ name: 'Group101kub' });
var aUser2 = new User({ name: 'user2NameKub' });

//-----------------------------------------------------------------------------

<<<<<<< HEAD
var app = express();
var server = app.listen(APP_PORT, () => console.log('Listening on APP_PORT ' + APP_PORT));
app.get('/', (req, res) => {
  User.find({}, function (err, users) {
=======
var kittySchema = new mongoose.Schema({
  Catname: String,
  color: String
});/* 
kittySchema.methods.speak = function () {
    var greeting = this.Catname ? "Meow name is " + this.Catname : "I don't have a name";
    console.log(greeting);
  }   */
var Kitten = mongoose.model('Kitten', kittySchema);
var silence = new Kitten({ Catname: 'Silence' });
var witness = new Kitten({ Catname: 'Witness' });
var fluffy = new Kitten({ Catname : 'Fluffy' });
//Kitten.save();
Kitten.find({}, function (err, kittens) {
>>>>>>> 837e48b11d1977a0ca0f766c7588e0f37e359d4a
    if (err) return console.error(err);
    console.log(users);
    res.send(users); // for go to localhost:4000 and see data in browser
  })
})
