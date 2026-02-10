const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  },
  { timestamps: true }
);

// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password') || !this.password) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });
//
// UserSchema.methods.matchPassword = function (enteredPassword) {
//     return bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model('User', UserSchema);
