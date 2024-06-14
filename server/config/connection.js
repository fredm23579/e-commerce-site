require('dotenv').config();

const mongoose = require('mongoose');

const connectionString =
  typeof process.env.MONGODB_URI === 'string'
    ? process.env.MONGODB_URI
    : 'mongodb+srv://motta:baFi5HJmumvX4NtL@cluster0.gdbtbna.mongodb.net/cleanDB?retryWrites=true&w=majority';

console.log('MONGODB_URI:', process.env.MONGODB_URI); 

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected to', connectionString);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message); // Log detailed error
  // Additional error handling (e.g., retry logic) if needed
});
 
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose is disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed gracefully on SIGINT.'); 
  process.exit(0);
});

module.exports = mongoose.connection;

