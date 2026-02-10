const User = require('../models/User');
const { generateToken } = require('../config/jwt');

const registerUser = async ({ email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('USER_EXISTS');
    }

    const user = new User({
        email,
        password,
        role: role || 'customer',
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

    const isMatch = await user.matchPassword(password);
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
        role: 'customer',
    });
};

module.exports = {
    registerUser,
    loginUser,
    findOrCreateGoogleUser
}