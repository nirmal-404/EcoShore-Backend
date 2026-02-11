const bcrypt = require('bcryptjs');
const userRepository = require('../../infrastructure/database/repositories/user.repository');
const { generateToken } = require('../../config/jwt');

class AuthService {
/// Register new user
  async registerUser({ email, password, role }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('USER_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      role: role || 'volunteer',
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: user.toSafeObject(),
    };
  }

// Login user with email and password
  async loginUser({ email, password }) {
    // Find user with password
    const userDoc = await userRepository.findByEmailWithPassword(email);
    if (!userDoc) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Convert to domain entity
    const user = userRepository._toDomainEntity(userDoc);

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: user.toSafeObject(),
    };
  }

// Find or create user based on Google profile
  async findOrCreateGoogleUser(profile) {
    const email = profile.emails?.[0]?.value;

    // Try to find by Google ID
    let user = await userRepository.findByGoogleId(profile.id);
    if (user) {
      return user;
    }

    // Try to find by email and link Google ID
    if (email) {
      user = await userRepository.findByEmail(email);
      if (user) {
        // Link Google ID to existing user
        await userRepository.update(user.id, { googleId: profile.id });
        return await userRepository.findById(user.id);
      }
    }

    // Create new user
    return await userRepository.create({
      googleId: profile.id,
      email,
      role: 'volunteer',
    });
  }

// Get user by ID
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return user;
  }
}

module.exports = new AuthService();
