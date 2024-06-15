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
          $or: [{ name: category }, { urlSlug: category }] // Find by name or slug
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
          console.error('Error updating user:', error);
          throw new ApolloError('Failed to update user details.');
        }
      }
      throw new AuthenticationError('Not logged in');
    },

    updateProduct: async (parent, { _id, input }) => { // Use input object for product updates
      try {
        const updatedProduct = await Product.findByIdAndUpdate(_id, input, { new: true });
        if (!updatedProduct) {
          throw new ApolloError('Product not found', 'PRODUCT_NOT_FOUND');
        }
        return updatedProduct;
      } catch (err) {
        console.error('Error updating product:', err);
        throw new ApolloError('Failed to update product.');
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

    // ... (addToWishlist and removeFromWishlist resolvers)

    addCategory: async (parent, { input }) => { // Input is destructured here
      try {
        const category = await Category.create(input);
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
 
    removeCategory: async (parent, { _id }) => {
      try {
        const removedCategory = await Category.findByIdAndRemove(_id);
        if (!removedCategory) {
          throw new ApolloError('Category not found', 'CATEGORY_NOT_FOUND');
        }
        // (Optional) Cascade delete products in this category
        await Product.deleteMany({ category: _id });
        return removedCategory;
      } catch (err) {
        console.error('Error removing category:', err);
        throw new ApolloError('Failed to remove category.');
      }
    },

    removeProduct: async (parent, { _id }) => {
      try {
        const removedProduct = await Product.findByIdAndRemove(_id);
        if (!removedProduct) {
          throw new ApolloError('Product not found', 'PRODUCT_NOT_FOUND');
        }
        return removedProduct;
      } catch (err) {
        console.error('Error removing product:', err);
        throw new ApolloError('Failed to remove product.');
      }
    },
  
    checkout: async (parent, args, context) => {
      const domainUrl = process.env.DOMAIN_URL || 'http://localhost:3000';
      const line_items = [];
      let orderTotal = 0; 

      try {
        const products = await Product.find({ _id: { $in: args.products } }); 

        for (let i = 0; i < products.length; i++) {
          const product = await stripeInstance.products.create({
            name: products[i].name,
            description: products[i].description,
            images: [`${domainUrl}/images/${products[i].image}`]
          });

          const price = await stripeInstance.prices.create({
            product: product.id,
            unit_amount: products[i].price * 100,
            currency: 'usd',
          });

          line_items.push({
            price: price.id,
            quantity: 1
          });
          orderTotal += products[i].price;
        }

        const session = await stripeInstance.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${domainUrl}/`
        });
        
        const order = new Order({
          products: args.products, 
          total: orderTotal,
          user: context.user._id,
          shippingAddress: args.shippingAddress // Added shippingAddress from input
        });

        await order.save();
        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order._id } });

        return { session: session.id, order: order._id };
      } catch (error) {
        console.error('Error creating Stripe checkout session:', error.message);
        throw new Error('Failed to create checkout session.'); 
      }
    } 
  },
};

export default resolvers;