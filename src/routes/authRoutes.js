const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        // check to see if user exists
        if (User.find({ email: { $exists: true } })) {
            return res.status(409).json({ error: "User exists already" });
        }

        const newUser = await User.create({
            email: req.body.email,
            password: req.body.password,
        });
        console.log("user created guys")
        res.status(201).json({ message: "User created guys!" });
    } catch (err) {
        res.status(400).json({ error: "User was not created fam" });
    }
});

module.exports = router;