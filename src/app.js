const express = require("express");
const app = express();
const login = require("./routes/login");
const port = process.env.PORT | 3000;
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.send("Hello world");
});

const user = new Sche();

app.listen(port, () => {
    console.log("App listening on port 3000");
});
