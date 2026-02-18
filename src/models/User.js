const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role: {
      type: String,
      enum: ['admin', 'collector', 'organizer', 'volunteer', 'agent'],
      default: 'volunteer',
    },
    name: {
      type: String,
      trim: true,
    },
    nic: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    assignedBeach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beach',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
