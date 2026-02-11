const UserModel = require('../models/User.model');
const User = require('../../../domain/entities/User');

class UserRepository {
// Find user by ID
  async findById(id) {
    const userDoc = await UserModel.findById(id);
    return userDoc ? this._toDomainEntity(userDoc) : null;
  }

// Find user by email
  async findByEmail(email) {
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
    return userDoc ? this._toDomainEntity(userDoc) : null;
  }

// Find user by Google ID
  async findByGoogleId(googleId) {
    const userDoc = await UserModel.findOne({ googleId });
    return userDoc ? this._toDomainEntity(userDoc) : null;
  }

// Create new user
  async create(userData) {
    const userDoc = new UserModel(userData);
    await userDoc.save();
    return this._toDomainEntity(userDoc);
  }

// Update user by ID
  async update(id, userData) {
    const userDoc = await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    });
    return userDoc ? this._toDomainEntity(userDoc) : null;
  }

// Delete user by ID
  async delete(id) {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

// Find all users with optional filters
  async findAll(filters = {}) {
    const userDocs = await UserModel.find(filters);
    return userDocs.map((doc) => this._toDomainEntity(doc));
  }

// Check if user exists by email
  async existsByEmail(email) {
    const count = await UserModel.countDocuments({
      email: email.toLowerCase(),
    });
    return count > 0;
  }

// Get user document with password (for authentication)
  async findByIdWithPassword(id) {
    return await UserModel.findById(id);
  }

// Get user document with password by email (for authentication)
  async findByEmailWithPassword(email) {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }

// Convert Mongoose document to User domain entity
  _toDomainEntity(userDoc) {
    if (!userDoc) return null;

    return new User({
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      googleId: userDoc.googleId,
      role: userDoc.role,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    });
  }
}

module.exports = new UserRepository();
