const express = require('express');
const { body, validationResult } = require('express-validator');
const Note = require('../Models/Note');
const authUser = require('../Middleware/authUser');
const { route } = require('./auth');
const router = express.Router();

router.get('/fetchnote', authUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/addnote', authUser, [
    body('title', 'Title Must Be Atleat 3 Char').isLength({ min: 3 }),
    body('description', 'Description Must Be Atleast 5 Characters').isLength({ min: 5 }),
], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let note = new Note({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id
        })
        let savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.put('/updatenote/:id', authUser, async (req, res) => {
    try {
        let findNote = await Note.findById(req.params.id);
        if (!findNote) {
            res.status(404).send("Not Found");
        }
        if (findNote.user.toString() !== req.user.id) {
            return res.status(401).send("You Are Not Authorised");
        }
        findNote = await Note.findByIdAndUpdate(req.params.id, { $set: { title: req.body.title, description: req.body.description } });
        res.json({ findNote });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.delete('/deletenote/:id', authUser, async (req, res) => {
    try {
        let findNote = await Note.findById(req.params.id);
        if (!findNote) {
            res.status(404).send("Not Found");
        }
        if (findNote.user.toString() != req.user.id) {
            return res.status(401).send("You Are Not Authorised");
        }
        findNote = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", findNote });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;