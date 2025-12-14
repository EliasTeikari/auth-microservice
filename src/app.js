const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const userSchema = require("./models/User.js");
const registerRoutes = require("./routes/authRoutes.js");
const connectDB = require("./config/database.js");
require("dotenv").config();

connectDB(); // connected mongoDB config

app.use(express.json());
app.use("/register", registerRoutes);

app.get("/", (req, res) => {
    res.send("Server is up and running");
});

app.get("/test", (req, res) => {
    if (!req) res.status(500).send("Request does not exist");
    if (req) res.status(200).send("Hello this works now");
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
