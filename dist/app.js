"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const database_1 = __importDefault(require("./config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, database_1.default)();
app.use(express_1.default.json());
app.use("/auth", authRoutes_1.default);
app.get("/", (_req, res) => {
    res.send("Server is up and running");
});
app.get("/test", (_req, res) => {
    res.status(200).send("Hello this works now");
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map