"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const validation_1 = require("../middleware/validation");
const passwordHash_1 = require("../utils/passwordHash");
const router = express_1.default.Router();
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = () => {
    return crypto_1.default.randomBytes(64).toString("hex");
};
router.post("/", validation_1.validateRegister, async (req, res) => {
    try {
        const existingUser = await User_1.default.findOne({ email: req.body.email });
        if (existingUser) {
            console.log("User exists already dudes");
            res.status(409).json({ error: "User exists already" });
            return;
        }
        const hashedPassword = await (0, passwordHash_1.hashPassword)(req.body.password);
        await User_1.default.create({
            email: req.body.email,
            password: hashedPassword,
        });
        console.log("User created");
        res.status(201).json({ message: "User created" });
    }
    catch (err) {
        res.status(400).json({ error: "User was not created" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const user = await User_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isMatch = await (0, passwordHash_1.comparePassword)(req.body.password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();
        await RefreshToken_1.default.create({
            token: refreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        res.status(200).json({ accessToken, refreshToken });
    }
    catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ error: "Refresh token required" });
            return;
        }
        const storedToken = await RefreshToken_1.default.findOne({ token: refreshToken });
        if (!storedToken) {
            res.status(401).json({ error: "Invalid refresh token" });
            return;
        }
        if (storedToken.expiresAt < new Date()) {
            await RefreshToken_1.default.deleteOne({ _id: storedToken._id });
            res.status(401).json({ error: "Refresh token expired" });
            return;
        }
        const user = await User_1.default.findById(storedToken.userId);
        if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
        }
        const accessToken = generateAccessToken(user);
        res.status(200).json({ accessToken });
    }
    catch (err) {
        res.status(500).json({ error: "Token refresh failed" });
    }
});
router.post("/logout", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ error: "Refresh token required" });
            return;
        }
        const result = await RefreshToken_1.default.deleteOne({ token: refreshToken });
        if (result.deletedCount === 0) {
            res.status(400).json({ error: "Token not found" });
            return;
        }
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Logout failed" });
    }
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map