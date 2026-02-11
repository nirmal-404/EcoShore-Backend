/**
 * Auth Routes - Interface Layer (HTTP)
 * Defines authentication routes and their handlers
 */
const express = require('express');
const passport = require('passport');
const validate = require('../middleware/validate.middleware');
const auth = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');
const {
  registerSchema,
  loginSchema,
} = require('./validation/auth.validation');

const router = express.Router();

// Register
router.post('/register', validate(registerSchema), authController.register);

// Login
router.post('/login', validate(loginSchema), authController.login);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  authController.googleCallback
);

// Current user
router.get('/me', auth(), authController.getMe);

module.exports = router;
