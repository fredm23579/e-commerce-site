// server/models/Category.js
import mongoose from 'mongoose';
import mongooseSlugUpdater from 'mongoose-slug-updater';
import slugify from 'slugify';

const { Schema } = mongoose;

mongoose.plugin(mongooseSlugUpdater); 

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
    trim: true
  },
  urlSlug: {
    type: String,
    slug: "name",  
    unique: true,
    slugPaddingSize: 4,
    index: true  
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware for slug generation and uniqueness check (with error handling)
categorySchema.pre('save', async function (next) {
  try {
    if (!this.urlSlug) {
      this.urlSlug = slugify(this.name, { lower: true });
    }

    // Robust uniqueness check with retries
    let slug = this.urlSlug;
    let counter = 1;
    while (await this.constructor.exists({ urlSlug: slug })) {
      slug = `${this.urlSlug}-${counter}`;
      counter++;
    }
    this.urlSlug = slug;

    next();
  } catch (error) {
    next(new Error('Slug generation or uniqueness check failed')); 
  }
});


// Custom validation for name (with error handling)
categorySchema.path('name').validate(async function (value) {
  try {
    const existingSlug = slugify(value, { lower: true });
    const existingCategory = await this.constructor.findOne({ urlSlug: existingSlug });
    return !existingCategory; // True if slug is unique
  } catch (error) {
    console.error("Error during name validation:", error);
    throw new Error('Category validation failed'); 
  }
}, 'Category with similar name already exists');


const Category = mongoose.model('Category', categorySchema);

export default Category;
