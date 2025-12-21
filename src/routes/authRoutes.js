const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const RefreshToken = require("../models/RefreshToken");
const { validateRegister } = require("../middleware/validation");
const { hashPassword, comparePassword } = require("../utils/passwordHash");

const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

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

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        await RefreshToken.create({
            token: refreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token required" });
        }

        const storedToken = await RefreshToken.findOne({ token: refreshToken });

        if (!storedToken) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        if (storedToken.expiresAt < new Date()) {
            await RefreshToken.deleteOne({ _id: storedToken._id });
            return res.status(401).json({ error: "Refresh token expired" });
        }

        const user = await User.findById(storedToken.userId);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const accessToken = generateAccessToken(user);

        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(500).json({ error: "Token refresh failed" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token required" });
        }

        const result = await RefreshToken.deleteOne({ token: refreshToken });

        if (result.deletedCount === 0) {
            return res.status(400).json({ error: "Token not found" });
        }

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: "Logout failed" });
    }
});

module.exports = router;
