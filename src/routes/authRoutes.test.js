const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const authRoutes = require("./authRoutes");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { hashPassword } = require("../utils/passwordHash");

let mongoServer;
let app;

beforeAll(async () => {
    process.env.JWT_SECRET = "test-secret-key-for-testing";

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    app = express();
    app.use(express.json());
    app.use("/auth", authRoutes);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany({});
    await RefreshToken.deleteMany({});
});

describe("POST /auth - Register", () => {
    it("should register a new user successfully", async () => {
        const res = await request(app).post("/auth").send({
            email: "test@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User created");

        const user = await User.findOne({ email: "test@example.com" });
        expect(user).toBeTruthy();
        expect(user.password).not.toBe("password123"); // Should be hashed
    });

    it("should return 409 if user already exists", async () => {
        const hashedPassword = await hashPassword("password123");
        await User.create({
            email: "existing@example.com",
            password: hashedPassword,
        });

        const res = await request(app).post("/auth").send({
            email: "existing@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe("User exists already");
    });

    it("should return 400 for invalid email format", async () => {
        const res = await request(app).post("/auth").send({
            email: "invalid-email",
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
    });

    it("should return 400 for invalid password format", async () => {
        const res = await request(app).post("/auth").send({
            email: "test@example.com",
            password: "ab", // Too short
        });

        expect(res.statusCode).toBe(400);
    });
});

describe("POST /auth/login - Login", () => {
    beforeEach(async () => {
        const hashedPassword = await hashPassword("password123");
        await User.create({
            email: "user@example.com",
            password: hashedPassword,
        });
    });

    it("should login successfully with valid credentials", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "user@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();

        // Verify refresh token was stored in database
        const storedToken = await RefreshToken.findOne({
            token: res.body.refreshToken,
        });
        expect(storedToken).toBeTruthy();
    });

    it("should return 401 for non-existent user", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "nonexistent@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Invalid credentials");
    });

    it("should return 401 for wrong password", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "user@example.com",
            password: "wrongpassword",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Invalid credentials");
    });
});

describe("POST /auth/refresh - Refresh Token", () => {
    let validRefreshToken;
    let userId;

    beforeEach(async () => {
        const hashedPassword = await hashPassword("password123");
        const user = await User.create({
            email: "user@example.com",
            password: hashedPassword,
        });
        userId = user._id;

        validRefreshToken = "valid-refresh-token-123";
        await RefreshToken.create({
            token: validRefreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
    });

    it("should return new access token with valid refresh token", async () => {
        const res = await request(app).post("/auth/refresh").send({
            refreshToken: validRefreshToken,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
    });

    it("should return 400 if refresh token not provided", async () => {
        const res = await request(app).post("/auth/refresh").send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Refresh token required");
    });

    it("should return 401 for invalid refresh token", async () => {
        const res = await request(app).post("/auth/refresh").send({
            refreshToken: "invalid-token",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Invalid refresh token");
    });

    it("should return 401 for expired refresh token", async () => {
        const expiredToken = "expired-token-123";
        await RefreshToken.create({
            token: expiredToken,
            userId: userId,
            expiresAt: new Date(Date.now() - 1000), // Expired
        });

        const res = await request(app).post("/auth/refresh").send({
            refreshToken: expiredToken,
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Refresh token expired");

        // Verify expired token was deleted
        const deletedToken = await RefreshToken.findOne({ token: expiredToken });
        expect(deletedToken).toBeNull();
    });
});

describe("POST /auth/logout - Logout", () => {
    let validRefreshToken;

    beforeEach(async () => {
        const hashedPassword = await hashPassword("password123");
        const user = await User.create({
            email: "user@example.com",
            password: hashedPassword,
        });

        validRefreshToken = "valid-refresh-token-for-logout";
        await RefreshToken.create({
            token: validRefreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
    });

    it("should logout successfully and delete refresh token", async () => {
        const res = await request(app).post("/auth/logout").send({
            refreshToken: validRefreshToken,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logged out successfully");

        // Verify token was deleted from database
        const deletedToken = await RefreshToken.findOne({
            token: validRefreshToken,
        });
        expect(deletedToken).toBeNull();
    });

    it("should return 400 if refresh token not provided", async () => {
        const res = await request(app).post("/auth/logout").send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Refresh token required");
    });

    it("should return 400 for non-existent token", async () => {
        const res = await request(app).post("/auth/logout").send({
            refreshToken: "non-existent-token",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Token not found");
    });
});
