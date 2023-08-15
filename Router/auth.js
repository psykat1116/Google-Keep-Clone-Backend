const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../Models/User');
const authUser = require('../Middleware/authUser');
const fetchUser = require('../Middleware/authUser');
const router = express.Router();

router.post('/signup', [
    body('name', 'Enter A Valid Name').isLength({ min: 3 }),
    body('email', 'Enter A Valid Email').isEmail(),
    body('password', 'Password Length Is Minimum 8').isLength({ min: 8 }),
], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let success = false;
        let user = await User.findOne({ email: req.body.email });
        let salt = await bcryptjs.genSalt(10);
        let encryptPass = await bcryptjs.hash(req.body.password, salt);
        if (user) {
            return res.status(400).json({ success, error: "Sorry A User Already Exist With This Username" });
        }
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: encryptPass
        })
        let data = {
            userData: {
                id: user.id
            }
        }
        let authToken = jwt.sign(data, process.env.SECRET_KEY);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal error occured");
    }
})

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credidentials" })
        }
        let compasePass = bcryptjs.compare(password, user.password);
        if (!compasePass) {
            return res.status(400).json({ success, error: "Please Check Your Username or Password" });
        }
        let data = {
            userData: {
                id: user.id
            }
        }
        let authToken = jwt.sign(data, process.env.SECRET_KEY);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error Occured");
    }
})

router.post('/getuser', authUser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId);
        let compasePass = bcryptjs.compare(req.body.password, user.password);
        if (compasePass) {
            res.json({ isAuth: true });
        }
        else {
            res.json({ isAuth: false });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error Occured");
    }
})

module.exports = router