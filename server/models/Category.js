// server/models/Category.js
import mongoose from 'mongoose';
import mongooseSlugUpdater from 'mongoose-slug-updater';

const { Schema } = mongoose;

mongoose.plugin(mongooseSlugUpdater);  // Apply the slug updater plugin

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
    slug: "name",   // Generate slug from the 'name' field
    unique: true,
    lowercase: true,
    index: true,      // Add an index for efficient queries
    slugPaddingSize: 4,  // Minimum length for the auto-incrementing suffix
  },
}, { timestamps: true }); // Add timestamps for created/updated dates

// Custom validation for name (optional)
categorySchema.path('name').validate(async (value) => {
  const slug = slugify(value, { lower: true });
  const count = await mongoose.models.Category.countDocuments({ urlSlug: slug });
  return !count; // Return true if the slug doesn't exist yet
}, 'Category name already exists');


const Category = mongoose.model('Category', categorySchema);

export default Category;
