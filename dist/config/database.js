"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = "mongodb://127.0.0.1:27017/auth-microservice";
        mongoose_1.default
            .connect(mongoURI)
            .then(() => console.log("Connected to database"))
            .catch((err) => console.log(err));
    }
    catch (err) {
        console.log("Did not connect to database");
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map