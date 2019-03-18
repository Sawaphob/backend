const express = require('express');
const mongoose = require('mongoose');
const APP_PORT = 4000;

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

const server = app.listen(APP_PORT, () => console.log('Listening on APP_PORT ' + APP_PORT));
//---------------------------------------------------------------------------

mongoose.connect('mongodb://127.0.0.1/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('DB connected!')});

//--------------------------------------------------------------------------


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
    if (err) return console.error(err);
    console.log(kittens);
  })
