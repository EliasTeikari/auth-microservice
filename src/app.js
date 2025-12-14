const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();

app.use(express.json());

mongoose
    .connect("mongodb://127.0.0.1:27017/auth-microservice")
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));

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

app.post("/register", async (req, res) => {
    try {
        const newUser = new User({
            email: "markus@gmail.com",
            password: "1234abcd",
        });
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("Server is up and running");
});

app.get("/test", (req, res) => {
    if (!req) res.status(500).send("Request does not exist");
    if (req) res.status(200).send("Hello this works now");
});

const user = new Schema();

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
