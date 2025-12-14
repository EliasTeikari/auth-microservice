const express = require("express");
const User = require("../models/registerDB");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newUser = await User.create({
            email: req.body.email,
            password: req.body.password,
        });

        res.status(201).json({ message: "User created guys!" });
    } catch (err) {
        res.status(400).json({ error: "User was not created fam" });
    }
});

module.exports = router;