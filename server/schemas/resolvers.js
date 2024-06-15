// server/schemas/resolvers.js
import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { User, Product, Category, Order } from '../models/index.js';
import { signToken, authMiddleware } from '../utils/auth.js';
import stripe from 'stripe';

// Initialize Stripe
const stripeKey = process.env.STRIPE_KEY;
if (!stripeKey) {
  throw new Error('STRIPE_KEY environment variable is not set');
}
const stripeInstance = new stripe(stripeKey);

const resolvers = {
  Query: {
    categories: async () => {
      try {
        return await Category.find();
      } catch (err) {
        console.error('Error fetching categories:', err);
        throw new ApolloError('Could not fetch categories.');
      }
    },
    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = await Category.findOne({
          $or: [{ name: category }, { urlSlug: category }] 
        }).select('_id');

        if (!params.category) {
          throw new ApolloError('Category not found', 'CATEGORY_NOT_FOUND');
        }
      }

      if (name) {
        params.name = { $regex: name, $options: 'i' };
      }

      try {
        const products = await Product.find(params).populate('category');
        return products;
      } catch (err) {
        console.error('Error fetching products:', err);
        throw new ApolloError('Could not fetch products.');
      }
    },

    product: async (parent, { _id }) => {
      try {
        return await Product.findById(_id).populate('category');
      } catch (err) {
        console.error('Error fetching product:', err);
        throw new ApolloError('Could not fetch product details.');
      }
    },

    user: async (parent, args, context) => {
      if (context.user) {
        try {
          const user = await User.findById(context.user._id)
            .populate({
              path: 'orders.products',
              populate: 'category',
            })
            .populate('wishlist');

          user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
          return user;
        } catch (error) {
          console.error('Error fetching user:', error);
          throw new AuthenticationError('Failed to fetch user details.');
        }
      }
      throw new AuthenticationError('Not logged in');
    },

    order: async (parent, { _id }, context) => {
      if (context.user) {
        try {
          const user = await User.findById(context.user._id).populate({
            path: 'orders',
            populate: {
              path: 'products.product',
              populate: 'category',
            },
          });
          const order = user.orders.id(_id);
          if (!order) {
            throw new ApolloError('Order not found', 'ORDER_NOT_FOUND'); // Custom error for not found
          }
          return order;
        } catch (error) {
          console.error('Error fetching order:', error);
          throw new ApolloError('Failed to fetch order details.');
        }
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
          throw new ApolloError('Email already exists', 'DUPLICATE_EMAIL');
        } else if (err.name === 'ValidationError') {
          throw new ApolloError('Invalid input data', 'VALIDATION_ERROR', { details: err.errors });
        }
        console.error(err);
        throw new ApolloError('Failed to create user.');
      }
    },
   addOrder: async (parent, { products }, context) => {
      if (context.user) {
        try {
          const order = new Order({ products });
          await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });
          return order;
        } catch (err) {
          console.error(err);
          throw new ApolloError('Failed to add order.');
        }
      }
      throw new AuthenticationError('Not logged in');
    },

    updateUser: async (parent, args, context) => {
      if (context.user) {
        try {
          const user = await User.findByIdAndUpdate(context.user._id, args, { new: true });
          if (!user) {
            throw new ApolloError('User not found', 'USER_NOT_FOUND');
          }
          return user;
        } catch (error) {
          console.error('Error fetching user:', error);
          throw new AuthenticationError('Failed to fetch user details.');
        }
      }

      throw new AuthenticationError('Not logged in');
    },

    updateProduct: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;

      try {
        const updatedProduct = await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
        if (!updatedProduct) {
          throw new ApolloError('Product not found', 'PRODUCT_NOT_FOUND');
        }
        return updatedProduct;
      } catch (err) {
        console.Console.error(err);
        throw new ApolloError('Failed to update product.');
      }
    }
  },
  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('Incorrect credentials');
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError('Incorrect credentials');
    }

    const token = signToken(user);
    return { token, user };
  },

  addToWishlist: async (parent, { productId }, context) => {
    if (context.user) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { wishlist: productId } },
        { new: true }
      ).populate('wishlist');

      return updatedUser;
    }
    throw new AuthenticationError('Not logged in');
  },
  removeFromWishlist: async (parent, { productId }, context) => {
    if (context.user) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { wishlist: productId } },
        { new: true }
      ).populate('wishlist');

      return updatedUser;
    }
    throw new AuthenticationError('Not logged in');
  },
  addCategory: async (parent, args) => {
    try {
      const category = await Category.create(args);
      return category;
    } catch (err) {
      if (err.code === 11000) { 
        throw new ApolloError('Category already exists', 'CATEGORY_DUPLICATE_ERROR');
      } else {
        console.error('Error creating category:', err);
        throw new ApolloError('Failed to create category.');
      }
    }
  },
  addProduct: async (parent, { name, description, image, price, quantity, category }, context) => {
    if (context.user.isAdmin) { // Add this check
      try {
        const product = await Product.create({ name, description, image, price, quantity, category });
        return product;
      } catch (err) {
        console.error(err);
        throw new ApolloError('Failed to create product.');
      }
    }
    throw new AuthenticationError('Unauthorized: You must be an admin to create products.');
  },
  removeOrder: async (parent, { _id }, context) => {
    if (context.user) {
      try {
        const updated = await User.findByIdAndUpdate( context.user._id, { $pull: { orders: { _id } } }, { new: true });
        return updated;
      } catch (err) {
        console.error('Error removing order:', err);
        throw new ApolloError('Failed to remove order.');
      }
    }
    throw new AuthenticationError('Not logged in');
  }
};

export default resolvers;

