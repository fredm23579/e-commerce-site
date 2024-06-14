// server/config/connection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connection String (from Environment Variable or Default)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://motta:baFi5HJmumvX4NtL@cluster0.gdbtbna.mongodb.net/cleanDB?retryWrites=true&w=majority';

// Mongoose Configuration Options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Add more options as needed (e.g., bufferCommands, autoIndex)
};

// Connection Logic
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('MongoDB connected:', MONGODB_URI);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Consider a retry mechanism or graceful shutdown here
    process.exit(1); // Exit with an error code if connection fails
  }
};

// Event Handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to', MONGODB_URI);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// Handle Application Termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection on app termination:', err);
    process.exit(1);
  }
});

// Initialize Connection
connectDB(); 

// Export the Mongoose Connection
export default mongoose.connection; 
