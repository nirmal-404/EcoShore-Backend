const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role: {
      type: String,
      enum: ['admin', 'collector', 'organizer', 'volunteer'],
      default: 'volunteer',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
