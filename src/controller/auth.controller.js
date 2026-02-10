const authService = require('../service/auth.service');
const { generateToken } = require('../config/jwt');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message === 'USER_EXISTS') {
      return res.status(400).json({ error: 'User already exists' });
    }
    return res.status(500).json({ error: 'Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }
    return res.status(500).json({ error: 'Server Error' });
  }
};

const googleCallback = (req, res) => {
  const user = req.user;
  const token = generateToken(user);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/login?token=${token}`);
};

const getMe = async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user, token: req.token });
};

module.exports = {
  register,
  login,
  googleCallback,
  getMe,
};
