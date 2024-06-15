import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import Order from './Order.js';

const { Schema } = mongoose;

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
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!']  // Validate email format
  },
  password: {
    type: String,
    required: true,
    minlength: 8,  // Increase minlength for better security
  },
  orders: [Order.schema],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 12;  // Stronger hashing with 12 salt rounds 
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
 // Use ES Module export 
