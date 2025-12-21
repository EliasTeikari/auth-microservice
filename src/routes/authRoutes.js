const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { validateRegister } = require("../middleware/validation");
const { hashPassword, comparePassword } = require("../utils/passwordHash");

router.post("/", validateRegister, async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            console.log("User exists already dudes");
            return res.status(409).json({ error: "User exists already" });
        }

        const hashedPassword = await hashPassword(req.body.password);

        const newUser = await User.create({
            email: req.body.email,
            password: hashedPassword,
        });

        console.log("User created");
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(400).json({ error: "User was not created" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await comparePassword(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
