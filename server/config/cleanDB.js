// server/config/cleanDB.js
import mongoose from 'mongoose';

async function cleanDB(modelName, collectionName) {
  try {
    const model = mongoose.models[modelName];
    if (!model) {
      console.warn(`Model '${modelName}' not found. Skipping collection.`);
      return;
    }
    const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();
    if (collectionExists) {
      const result = await model.deleteMany({}); // Drop all documents from the collection
      console.log(`Dropped all documents from collection: ${collectionName}`);
      return result;
    } else {
      console.log(`Collection '${collectionName}' not found. Skipping drop.`);
    }
  } catch (error) {
    console.error(`Error cleaning database: ${error.message}`);
    throw error; 
  }
}

export default cleanDB;
