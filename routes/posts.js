// jslint esversion:6
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/jwt_token");
const postModel = require("../models/postModel");

const Post = postModel;




router.post("/posts", verifyToken, async (req, res) => {

    jwt.verify(req.token, process.env.JWT_SECRET, (e, authData) => {
        if (e) {
            console.error("Token invalid:", e);
            res.json({ error: true, response: "Authentication failed!" });
        } else {
            const newPost = new Post({
                username: req.body.username,
                body: req.body.body,
                file: req.body.file,
                likes: [],
                createdAt: Date.now()
            });
            newPost.save();
            res.json({ error: false, response: "Post has been saved successfully!" });
        }
    })
});

router.get("/posts", async (req, res) => {
    const posts = await Post.find({}).exec();
    res.send(posts);
});

router.post("/posts/c/", verifyToken, async (req, res) => {
    const postId = req.query.id;
    const comment = req.body;
    const commentUpdate = {
        $push: { comments: { username: comment.username, commentString: comment.commentBody, displayImage: comment.displayImage } }
    }
    const update = await Post.findByIdAndUpdate(postId, commentUpdate);
    console.log(update);
    res.status(200).json({ error: false, response: "Comment Added" });
});

router.patch("/posts/l/", verifyToken, async (req, res) => {
    const postId = req.query.id;
    const likeAction = JSON.parse(req.query.liked);
    console.log(likeAction);
    const likeUpdate = likeAction ? {
        $addToSet: { likes: req.body.username }
    } : {
        $pull: { likes: req.body.username }
    }
    const updates = await Post.findByIdAndUpdate(postId, likeUpdate).exec();
    console.log(updates.likes);

});

module.exports = router;