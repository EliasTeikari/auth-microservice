const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { validateRegister } = require("../middleware/validation");
const { hashPassword } = require("../utils/passwordHash");

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

router.post("/", async (req, res) => {});

module.exports = router;
