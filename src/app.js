const express = require("express");
const app = express();
const login = require("./routes/login");
require("dotenv").config();
const port = process.env.PORT | 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/users", (req, res) => {
    res.send("Hello world user");
});

app.listen(port, () => {
    console.log("App listening on port 3000");
});
