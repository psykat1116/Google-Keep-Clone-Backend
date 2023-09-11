require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected To Database Successfully")
}).catch((err) => {
    console.log(err)
})
mongoose.set("strictQuery", true);
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Saikat!')
})

app.use('/api/auth', require('./Router/auth'))
app.use('/api/note', require('./Router/note'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})