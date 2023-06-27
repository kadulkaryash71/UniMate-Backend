// jslin esversion:6

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    username: String,
    password: String,
    file: String,
    university: String,
    city: String,
    country: String,
    dialCode: String,
    mobile: String,
    friends: Array
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
