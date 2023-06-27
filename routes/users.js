// jslint esversion:6
const router = require("express").Router();
const verifyToken = require("../middleware/jwt_token");

const userModel = require("../models/userModel");
const User = userModel;

// GET all the users
router.get("/users", verifyToken, async (req, res) => {
    const users = await User.find({}).exec();
    res.send(users);
});

// GET a single user When the current user clicks on any other user's profile
router.get("/users/:id", verifyToken, (req, res, next) => {
    const userID = req.params.id;
    User.findById(userID).exec()
        .then(userData => res.json({ error: false, userData }))
        .catch(e => res.json({ error: true, response: "Couldn't find user. " + e }))
});

// PATCH "friends" field in the current user's data object (ADD/REMOVE friends)
router.patch("/users/friends/:operation", verifyToken, (req, res, next) => {
    const operation = req.params.operation;
    const user = req.query.from;
    const newFriend = req.query.to;

    console.log(operation, user, newFriend);

    if (operation === "add") {
        User.findByIdAndUpdate(user, { $addToSet: { friends: newFriend } }).exec()
            .then(user => console.log("User:", user))
            .then(user => res.json({ error: false, response: "Followed successfully!" }))
            .catch({ error: true, response: "Something went wrong while adding them as your friend!" });
    } else if (operation === "remove") {
        // Remove user from current user's friend list
        // Code goes here
        User.findByIdAndUpdate(user, { $pull: { friends: newFriend } }).exec()
            .then(user => console.log("User:", user))
            .then(user => res.json({ error: false, response: "Unfollowed successfully!" }))
            .catch({ error: true, response: "Something went wrong while removing them as your friend!" });
    } else {
        console.error("Wrong operation sent. Expected add/remove");
        res.json({ error: true, response: "Wrong operation sent. Expected add/remove" });
    }
});


module.exports = router;