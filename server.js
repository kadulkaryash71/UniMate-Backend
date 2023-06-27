// jslint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

/* monoogse */
const mongoose = require("mongoose");
const client = mongoose.connect("mongodb://localhost:27017/material-users");
/* monoogse */


/* import routes*/
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const searchRoute = require("./routes/search");
/* import routes*/

const app = express();
app.use(
    cors({
        origin: "*"
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* use routes */
app.use(authRoute);
app.use(postsRoute);
app.use(usersRoute);
app.use(searchRoute);
/* use routes */




/* Test routes and server playground */
app.post("/newsletter", (req, res) => {
    console.log(req.body.email);
    res.redirect("/");
})

/* Test routes and server playground */




app.listen(5000, () => console.log("Server listening on port 5000"));
