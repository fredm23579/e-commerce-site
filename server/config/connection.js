const mongoose = require('mongoose');

// Connect to MongoDB.
// MONGODB_URI is set by the hosting platform in production (e.g. MongoDB Atlas).
// The local URI is used as a fallback during development.
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern-shopping'
);

// Log connection errors so they surface clearly during development.
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose.connection;
