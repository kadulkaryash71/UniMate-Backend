// jslint esversion:6

const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    username: String,
    commentString: String,
    displayImage: String 
});

module.exports = mongoose.model("Comment", commentSchema);