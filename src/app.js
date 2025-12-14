const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const userSchema = require("./models/registerDB.js");
const registerRoutes = require("./routes/registerRoutes.js");
require("dotenv").config();

app.use(express.json());
app.use("/register", registerRoutes);

mongoose
    .connect("mongodb://127.0.0.1:27017/auth-microservice")
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));

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
