// server/config/connection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('MongoDB Connected:', MONGODB_URI);
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); 
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to', MONGODB_URI);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log(
      'Mongoose default connection disconnected through app termination'
    );
    process.exit(0);
  } catch (err) {
    console.error(
      'Error closing MongoDB connection on app termination:',
      err
    );
    process.exit(1);
  }
});
export default connectDB; // Export the connectDB function
