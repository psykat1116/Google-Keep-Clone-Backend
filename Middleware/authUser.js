const jwt = require("jsonwebtoken");

let authUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please Authenticate Using Valid Token" });
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.user = data.userData;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).send({ error: "Please Authenticate Yourself Using Valid Token" });
    }
}

module.exports = authUser;