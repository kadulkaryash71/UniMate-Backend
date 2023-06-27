// jslint esversion:6

const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    username: String,
    body: String,
    file: String,
    comments: Array,
    likes: Array,
    createdAt: Date
    
})

module.exports = mongoose.model("Post", postSchema);