// jslint esversion:6

const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const User = userModel;

const verifyToken = require("../middleware/jwt_token");



router.get("/login", (req, res, next) => {
    console.log("Inside GET /login");
});

router.post("/login", async (req, res, next) => {

    console.log("Inside login");


    const user = await User.find({ username: req.body.username }).exec();
    if (user.length !== 0) {
        bcrypt
            .compare(req.body.password, user[0].password)
            .then(passwordMatched => {
                if (passwordMatched) {
                    const incomingUser = user[0];
                    const { password, ...userInfo } = { password: incomingUser.password, ...incomingUser };

                    jwt.sign({ user: userInfo, password }, process.env.JWT_SECRET, { expiresIn: "300s" }, (e, token) => {
                        if (e) {
                            console.error("Something went wrong:", e);
                            res.json({ error: true, response: "Authentication failed!" });
                        } else {
                            res.json({ error: false, token, userInfo });
                            next();
                        }
                    })
                }
                else
                    res.status(401).json({ error: true, response: "Incorrect username or password" })
            })
            .catch(err => console.error(err.message))
    } else {
        res.status(400).json({ error: true, response: "User not found!" });
    }
});

router.post("/signup", (req, res) => {
    console.log("Inside signup");
    const incomingUser = req.body;
    const { password, ...userInfo } = { password: incomingUser.password, ...incomingUser };
    bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS)).then(hash => {
        jwt.sign({ user: incomingUser, password: hash }, process.env.JWT_SECRET, { expiresIn: "360s" }, (e, token) => {
            if (e) {
                console.error("Something went wrong while assigning auth token:", e);
                res.json({ error: true, response: "Authentication failed!" });
            } else {
                const encryptedUser = { password: hash, ...userInfo };
                const newUser = new User(encryptedUser);
                newUser.save();
                res.json({ error: false, response: "New User registered", token, userInfo });
            }
        })
    }).catch(e => {
        console.error("Could not hash the password: ", e);
        res.json({ error: true, response: "Failed to save the password. Please try again!" })
    });
});


/* logout */
router.delete("/login", verifyToken, (req, res, next) => {
    console.log("Inside logout");
    // jwt.destroy(req.token);
})
/* logout */


module.exports = router;























/* passport setup: use when server sessions are important */
// router.use(passport.initialize());
// router.use(passport.session())

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((id, done) => {
//     User.findById({ _id: id }).then(user => done(null, user._id));
// })

// passport.use(new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }).then((user, err) => {
//         if (err) { console.log("Something went wrong", err); return done(null, false); }
//         else if (!user) { console.log("User not found", err); return done(null, false); }
//         else if (user.password !== password) { console.log("Password did not match"); return done(null, false); }
//         else return done(null, user)
//     })
// }));

/* passport setup */