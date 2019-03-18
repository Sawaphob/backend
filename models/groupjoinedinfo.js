var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GroupJoinedInfoSchema = new Schema({
    userID:  Schema.ObjectId,
    groupID:  Schema.ObjectId,
    lastRead: Number,
    isExit: Boolean
});
module.exports = GroupJoinedInfo = mongoose.model('GroupJoinedInfo', GroupJoinedInfoSchema);