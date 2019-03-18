var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    userID:  Schema.ObjectId,
    groupID:  Schema.ObjectId,
    timestamp: Date,
    text: String,
});
module.exports = Message = mongoose.model('Message', MessageSchema);