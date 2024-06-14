import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100 
  },
  description: {
    type: String,
    maxlength: 500 
  },
  image: String, 
  price: {
    type: Number,
    required: true,
    min: 0.99
  },
  salePrice: { 
    type: Number,
    min: 0.99,
    validate: {
      validator: function(value) {
        return value < this.price; // Sale price must be lower than original price
      },
      message: 'Sale price must be less than the original price'
    }
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  sku: String, 
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
