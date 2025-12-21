import express, { Request, Response } from "express";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken";
import { validateRegister } from "../middleware/validation";
import { hashPassword, comparePassword } from "../utils/passwordHash";

const router = express.Router();

const generateAccessToken = (user: IUser): string => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex");
};

router.post(
    "/",
    validateRegister,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const existingUser = await User.findOne({ email: req.body.email });

            if (existingUser) {
                console.log("User exists already dudes");
                res.status(409).json({ error: "User exists already" });
                return;
            }

            const hashedPassword = await hashPassword(req.body.password);

            await User.create({
                email: req.body.email,
                password: hashedPassword,
            });

            console.log("User created");
            res.status(201).json({ message: "User created" });
        } catch (err) {
            res.status(400).json({ error: "User was not created" });
        }
    }
);

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const isMatch = await comparePassword(req.body.password, user.password);

        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
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

router.post("/refresh", async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ error: "Refresh token required" });
            return;
        }

        const storedToken = await RefreshToken.findOne({ token: refreshToken });

        if (!storedToken) {
            res.status(401).json({ error: "Invalid refresh token" });
            return;
        }

        if (storedToken.expiresAt < new Date()) {
            await RefreshToken.deleteOne({ _id: storedToken._id });
            res.status(401).json({ error: "Refresh token expired" });
            return;
        }

        const user = await User.findById(storedToken.userId);

        if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
        }

        const accessToken = generateAccessToken(user);

        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(500).json({ error: "Token refresh failed" });
    }
});

router.post("/logout", async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ error: "Refresh token required" });
            return;
        }

        const result = await RefreshToken.deleteOne({ token: refreshToken });

        if (result.deletedCount === 0) {
            res.status(400).json({ error: "Token not found" });
            return;
        }

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: "Logout failed" });
    }
});

export default router;
