const jwt = require("jsonwebtoken");
const JWT_SECRET = "googlekeep";

let authUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please Authenticate Using Valid Token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.userData;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).send({ error: "Please Authenticate Yourself Using Valid Token" });
    }
}

module.exports = authUser;