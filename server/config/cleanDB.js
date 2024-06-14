import mongoose from "mongoose";
import db from '../config/connection.js';
//import {User, Product, Category} from '../models';

export default async function cleanDB(modelName, collectionName) {
  try {
    const model = mongoose.models[modelName]; // Get the Mongoose model

    // Check if the collection exists
    const collections = await db.db.listCollections({ name: collectionName }).toArray();
    if (collections.length > 0) {
      await model.collection.drop(); // Drop the collection
      console.log(`Dropped collection: ${collectionName}`);
    } else {
      console.log(`Collection ${collectionName} does not exist.`);
    }
  } catch (err) {
    console.error(`Error cleaning database: ${err.message}`);
    throw err; 
  }
}
