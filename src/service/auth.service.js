const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

const registerUser = async ({ email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('USER_EXISTS');
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashed,
    role: role || 'volunteer',
  });

  await user.save();

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

  return await User.create({
    googleId: profile.id,
    email,
    name: profile.displayName,
    role: 'volunteer',
  });
};

const registerAgent = async ({ email, password, name, nic, assignedBeach }) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error('USER_EXISTS');
  }

  const existingNic = await User.findOne({ nic });
  if (existingNic) {
    throw new Error('NIC_EXISTS');
  }

  const Beach = require('../models/Beach');
  const beach = await Beach.findById(assignedBeach);
  if (!beach || !beach.isActive) {
    throw new Error('BEACH_NOT_FOUND');
  }

  const hashed = await bcrypt.hash(password, 10);

  const agent = new User({
    email,
    password: hashed,
    name,
    nic,
    assignedBeach,
    role: 'agent',
  });

  await agent.save();

  return {
    agent: {
      id: agent._id,
      email: agent.email,
      name: agent.name,
      nic: agent.nic,
      assignedBeach: agent.assignedBeach,
      role: agent.role,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
  findOrCreateGoogleUser,
  registerAgent,
};
