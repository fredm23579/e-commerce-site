import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mongooseSlugUpdater from 'mongoose-slug-updater';
const Category = mongoose.model('Category', categorySchema);
export default Category; // Export the Mongoose model

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopShopDB';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('MongoDB Connected:', MONGODB_URI);
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); // Exit on error
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

connectDB(); // Initialize the connection
export default mongoose.connection; // Export for use in other modules
