var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
<<<<<<< HEAD
    username: String,
    groupname: String,
=======
    userName:  String,
    groupName:  String,
>>>>>>> 2be6d4897ad1f1f7fba4666f544cdc1c066b9262
    timestamp: Date,
    text: String,
});
module.exports = Message = mongoose.model('Message', MessageSchema);