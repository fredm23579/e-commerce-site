// server/models/Category.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [3, 'Category name must be at least 3 characters long'],
    maxlength: [50, 'Category name cannot exceed 50 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  urlSlug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true, // Add index for faster queries based on urlSlug
  },
});

// Pre-save middleware for slug generation and uniqueness check
categorySchema.pre('save', async function (next) {
  try {
    if (!this.urlSlug) {
      this.urlSlug = slugify(this.name, { lower: true });
    }

    // Check for uniqueness (and handle collisions) 
    let slugExists = await this.constructor.findOne({ urlSlug: this.urlSlug });
    let counter = 1;
    while (slugExists) {
      this.urlSlug = `${slugify(this.name, { lower: true })}-${counter}`;
      counter++;
      slugExists = await this.constructor.findOne({ urlSlug: this.urlSlug });
    }

    next();
  } catch (error) {
    // Handle errors that might occur during slug generation or DB query
    next(error); // Pass the error to the next middleware (or the save operation)
  }
});

// Post-save middleware for logging (optional)
categorySchema.post('save', function (doc) {
  console.log('%s has been saved', doc._id); // Log the saved category's ID
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
