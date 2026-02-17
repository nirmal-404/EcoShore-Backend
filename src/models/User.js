const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants/roles');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role: {
      type: String,
      enum: [ROLES.VOLUNTEER, ROLES.ORGANIZER, ROLES.ADMIN],
      default: ROLES.VOLUNTEER,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('User', UserSchema);
