const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const authRoutes = require("./authRoutes");
const User = require("../models/User");

let mongoServer;
let app;

beforeAll(async () => {
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
});

describe("Registering a user POST /auth", () => {
    it("should register a new user successfully", async () => {
        const res = await request(app).post("/auth").send({
            email: "test@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User created");

        const user = await User.findOne({ email: "test@example.com" });
        expect(user).toBeTruthy();
    });

    it("should return 409 if user already exists", async () => {
        await User.create({
            email: "existing@example.com",
            password: "password123",
        });

        const res = await request(app).post("/auth").send({
            email: "existing@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe("User exists already");
    });
});

// describe("Logging in a user", () => {
//     it("should log in a user successfully", async() => {
//         const res = (await request(app).post("/auth")).send({
//             email:
//         })
//     })
// });
