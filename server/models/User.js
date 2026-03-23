const mongoose = require('mongoose');
const { Schema } = mongoose;
// bcryptjs is the pure-JavaScript implementation of bcrypt — identical API to
// the native 'bcrypt' package but with no node-gyp/tar transitive dependency,
// which eliminates the tar path-traversal CVE (GHSA-qffp-2rhf-9h96).
const bcrypt = require('bcryptjs');
const Order = require('./Order');

// Number of bcrypt salt rounds — 10 is the generally recommended default.
// Higher values are more secure but slower; change with care.
const SALT_ROUNDS = 10;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // enforced at the database level
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  // Orders are embedded directly in the user document for fast retrieval.
  orders: [Order.schema],
});

// Hash the password before saving so we never store plaintext credentials.
// This runs on both new users (isNew) and password changes (isModified).
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
  next();
});

// Instance method used by the login resolver to validate a submitted password.
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
