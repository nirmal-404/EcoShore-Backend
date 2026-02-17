const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const chatService = require('./chat.service');
const { ROLES } = require('../constants/roles');

const registerUser = async ({ email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('USER_EXISTS');
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashed,
    role: role || ROLES.VOLUNTEER,
  });

  await user.save();

  // Auto-add to GLOBAL_VOLUNTEER group
  try {
    await chatService.addToGlobalVolunteerGroup(user._id.toString());
  } catch (error) {
    console.error('Failed to add user to global volunteer group:', error);
    // Don't fail registration if chat group assignment fails
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};

const findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails?.[0]?.value;

  let user = await User.findOne({ googleId: profile.id });
  if (user) return user;

  if (email) {
    user = await User.findOne({ email });
    if (user) {
      user.googleId = profile.id;
      await user.save();
      return user;
    }
  }

  // Create new user
  user = await User.create({
    googleId: profile.id,
    email,
    name: profile.displayName,
    role: ROLES.VOLUNTEER,
  });

  // Auto-add to GLOBAL_VOLUNTEER group
  try {
    await chatService.addToGlobalVolunteerGroup(user._id.toString());
  } catch (error) {
    console.error('Failed to add user to global volunteer group:', error);
    // Don't fail registration if chat group assignment fails
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  findOrCreateGoogleUser,
};
