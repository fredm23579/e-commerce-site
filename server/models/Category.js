import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],  // Array for custom error message
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
  }
});

// Pre-save middleware to generate a unique slug 
categorySchema.pre('save', async function (next) {
  if (!this.urlSlug) { 
    this.urlSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Remove non-alphanumeric characters
      .replace(/-+/g, '-')         // Replace multiple hyphens with one
      .replace(/^-+|-+$/g, '');    // Remove hyphens at start or end
  }
  
  // Check for uniqueness and handle duplicates (if needed)
  let slugExists = await this.constructor.findOne({ urlSlug: this.urlSlug });
  let counter = 1;
  while (slugExists) {
    this.urlSlug = `${this.name.toLowerCase().replace(/ /g, '-')}-${counter}`;
    counter++;
    slugExists = await this.constructor.findOne({ urlSlug: this.urlSlug });
  }
  
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
