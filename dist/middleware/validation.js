"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;
const joi_1 = __importDefault(require("joi"));
const registerSchema = joi_1.default.object({
    email: joi_1.default.string()
        .required()
        .min(3)
        .max(50)
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: joi_1.default.string()
        .min(3)
        .max(50)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .required()
        .min(3)
        .max(50)
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: joi_1.default.string()
        .min(3)
        .max(50)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
function validateRegister(req, res, next) {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        console.log("middleware: input does not follow register schema");
        res.status(400).json({ error: error.message });
        return;
    }
    next();
}
function validateLogin(req, res, next) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        console.log("middleware: input does not follow login schema");
        res.status(400).send({ error: error.message });
        return;
    }
    next();
}
//# sourceMappingURL=validation.js.map