const express = require("express");
const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string()
        .required()
        .min(3)
        .max(50)
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string()
        .min(3)
        .max(50)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .min(3)
        .max(50)
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string()
        .min(3)
        .max(50)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

function validateRegister(req, res, next) {
    const { error } = registerSchema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.message });
    }

    next();
}

function validateLogin(req, res, next) {
    const { error } = loginSchema.validate(req.body);

    if (error) {
        res.status(400).send({ error: error.message });
    }

    next();
}

module.exports = (validateRegister, validateLogin);
