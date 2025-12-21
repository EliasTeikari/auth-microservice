const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { validateRegister } = require("../middleware/validation");

router.post("/", validateRegister, async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            console.log("User exists already dudes");
            return res.status(409).json({ error: "User exists already" });
        }

        const newUser = await User.create({
            email: req.body.email,
            password: req.body.password,
        });

        console.log("user created guys");
        res.status(201).json({ message: "User created guys!" });
    } catch (err) {
        res.status(400).json({ error: "User was not created fam" });
    }
});

router.post("/", async (req, res) => {});

module.exports = router;
