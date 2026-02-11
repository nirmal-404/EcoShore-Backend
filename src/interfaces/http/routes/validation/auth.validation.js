/**
 * Auth Validation Schemas - Interface Layer (HTTP)
 * Joi validation schemas for authentication endpoints
 */
const Joi = require('joi');

const registerSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid('admin', 'collector', 'organizer', 'volunteer')
      .optional(),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
};
