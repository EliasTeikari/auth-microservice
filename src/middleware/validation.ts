import { Request, Response, NextFunction } from "express";
import Joi from "joi";

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

export function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    console.log("middleware: input does not follow register schema");
    res.status(400).json({ error: error.message });
    return;
  }

  next();
}

export function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    console.log("middleware: input does not follow login schema");
    res.status(400).send({ error: error.message });
    return;
  }

  next();
}

