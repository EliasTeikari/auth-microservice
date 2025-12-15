const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { validateRegister } = require("../middleware/validation");

router.post("/", validateRegister, async (req, res) => {
    try {
        // #region agent log
        fetch(
            "http://127.0.0.1:7242/ingest/f0904bed-98b4-4dea-b911-7af1cce2de11",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: "authRoutes.js:7",
                    message: "Route entry",
                    data: { email: req.body.email },
                    timestamp: Date.now(),
                    sessionId: "debug-session",
                    runId: "initial",
                    hypothesisId: "A,B,C",
                }),
            }
        ).catch(() => {});
        // #endregion

        // check to see if user exists
        // #region agent log
        const existingUser = await User.findOne({ email: req.body.email });
        fetch(
            "http://127.0.0.1:7242/ingest/f0904bed-98b4-4dea-b911-7af1cce2de11",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: "authRoutes.js:10",
                    message: "Query executed with await and specific email",
                    data: {
                        emailQueried: req.body.email,
                        userFound: !!existingUser,
                        userId: existingUser?._id,
                    },
                    timestamp: Date.now(),
                    sessionId: "debug-session",
                    runId: "post-fix",
                    hypothesisId: "FIX",
                }),
            }
        ).catch(() => {});
        // #endregion

        if (existingUser) {
            // #region agent log
            fetch(
                "http://127.0.0.1:7242/ingest/f0904bed-98b4-4dea-b911-7af1cce2de11",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        location: "authRoutes.js:13",
                        message: "User exists - returning 409",
                        data: { existingUserEmail: existingUser.email },
                        timestamp: Date.now(),
                        sessionId: "debug-session",
                        runId: "post-fix",
                        hypothesisId: "FIX",
                    }),
                }
            ).catch(() => {});
            // #endregion
            console.log("User exists already dudes");
            return res.status(409).json({ error: "User exists already" });
        }

        // #region agent log
        fetch(
            "http://127.0.0.1:7242/ingest/f0904bed-98b4-4dea-b911-7af1cce2de11",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: "authRoutes.js:19",
                    message: "After if block - attempting to create user",
                    data: { email: req.body.email },
                    timestamp: Date.now(),
                    sessionId: "debug-session",
                    runId: "initial",
                    hypothesisId: "A,B",
                }),
            }
        ).catch(() => {});
        // #endregion

        const newUser = await User.create({
            email: req.body.email,
            password: req.body.password,
        });

        // #region agent log
        fetch(
            "http://127.0.0.1:7242/ingest/f0904bed-98b4-4dea-b911-7af1cce2de11",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: "authRoutes.js:26",
                    message: "User created successfully",
                    data: { userId: newUser._id, email: newUser.email },
                    timestamp: Date.now(),
                    sessionId: "debug-session",
                    runId: "initial",
                    hypothesisId: "A,B,C",
                }),
            }
        ).catch(() => {});
        // #endregion
        console.log("user created guys");
        res.status(201).json({ message: "User created guys!" });
    } catch (err) {
        // #region agent log
        fetch(
            "http://127.0.0.1:7242/ingest/f0904bed-98b4-4dea-b911-7af1cce2de11",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: "authRoutes.js:33",
                    message: "Error caught",
                    data: {
                        errorMessage: err.message,
                        errorName: err.name,
                        errorCode: err.code,
                    },
                    timestamp: Date.now(),
                    sessionId: "debug-session",
                    runId: "initial",
                    hypothesisId: "C",
                }),
            }
        ).catch(() => {});
        // #endregion
        res.status(400).json({ error: "User was not created fam" });
    }
});

module.exports = router;
