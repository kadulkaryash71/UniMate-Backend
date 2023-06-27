require("dotenv").config();
const jwt = require("jsonwebtoken");

/* middleware */
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(":")[1];
    if (bearerHeader) {
        // if bearerHeader is not null
        req.token = token;
        next();
    } else {
        // if bearerHeader is null
        res.json({ error: true, response: "Token is invalid!" })
    }
}
/* middleware */

module.exports = verifyToken;