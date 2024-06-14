// server/config/cleanDB.js
import mongoose from 'mongoose';

async function cleanDB(modelName, collectionName) {
  try {
    const model = mongoose.models[modelName];
    if (!model) {
      console.warn(`Model '${modelName}' not found. Skipping collection.`);
      return;
    }

    const collectionExists = await model.db.listCollections({ name: collectionName }).hasNext();
    if (collectionExists) {
      const result = await model.collection.drop(); 
      console.log(`Dropped collection: ${collectionName}`);
      return result;
    } else {
      console.log(`Collection '${collectionName}' not found. Skipping drop.`);
    }
  } catch (error) {
    console.error(`Error cleaning database: ${error.message}`);
    throw error; // Allow the error to bubble up to be handled in the seeding script
  }
}

export default cleanDB;
