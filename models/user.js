const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    nickName: String,
    userId: String,
    displayName: String,
    pictureUrl: String,
    userStatus: String,
}, {timestapms:true})

module.exports = mongoose.model("user_db", userSchema);