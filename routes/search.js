// jslint esversion:6
const router = require("express").Router();
const verifyToken = require("../middleware/jwt_token");

const postModel = require("../models/postModel");

const Post = postModel;

router.get("/s", verifyToken, async (req, res) => {
    const query = req.query.q;
    const searchResults = []
    const posts = await Post.find({}).exec();
    const searchedContent = (content, query) => {
        return content.filter((item) => (item.body.includes(query) || item.username.includes(query)))
    }
    const filteredPosts = searchedContent(posts, query)
    res.send(filteredPosts);
});

module.exports = router;
