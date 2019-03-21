var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    username: String,
    groupname: String,
    timestamp: Date,
    text: String,
});
module.exports = Message = mongoose.model('Message', MessageSchema);