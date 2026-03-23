const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  // Filename of the product image stored under client/images/.
  image: {
    type: String,
  },
  // Price in USD.  The minimum of $0.99 matches Stripe's minimum charge amount.
  price: {
    type: Number,
    required: true,
    min: 0.99,
  },
  // Tracks available stock.  Decremented on purchase via the updateProduct mutation.
  quantity: {
    type: Number,
    min: 0,
    default: 0,
  },
  // Each product belongs to exactly one category.
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
