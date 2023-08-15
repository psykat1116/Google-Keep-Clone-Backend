const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Notes = mongoose.model("note", noteSchema);
Notes.createIndexes();
module.exports = Notes;