const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { UserRoles } = require('../../../domain/types/UserRole');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: UserRoles,
      default: 'volunteer',
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });

module.exports = mongoose.model('User', UserSchema);
