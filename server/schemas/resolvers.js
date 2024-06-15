import User from '../models/User.js'; // Add .js extension for explicit import
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import { signToken } from '../utils/auth.js';
import stripe from 'stripe';
import { AuthenticationError } from 'apollo-server-express';

const resolvers = {
  Query: {
    categories: async () => {
      try {
        return await Category.find();
      } catch (err) {
        console.error('Error fetching categories:', err);
        throw new Error('Could not fetch categories.'); 
      }
    },
    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        params.name = { $regex: name, $options: 'i' };
      }

      try {
        return await Product.find(params).populate('category');
      } catch (err) {
        console.error('Error fetching products:', err);
        throw new Error('Could not fetch products.'); 
      }
    },
    product: async (parent, { _id }) => {
      try {
        return await Product.findById(_id).populate('category');
      } catch (err) {
        console.error('Error fetching product:', err);
        throw new Error('Could not fetch product details.'); 
      }
    },
    user: async (parent, args, context) => {
      if (context.user) {
        try {
          const user = await User.findById(context.user._id)
            .populate({
              path: 'orders.products',
              populate: 'category'
            })
            .populate('wishlist')
            .populate('favorites');

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
            path: 'orders.products',
            populate: 'category'
          });
          const order = user.orders.id(_id);
          if (!order) {
            throw new Error('Order not found');
          }
          return order;
        } catch (error) {
          console.error('Error fetching order:', error);
          throw new Error('Failed to fetch order details.');
        }
      }
      throw new AuthenticationError('Not logged in');
    },
    checkout: async (parent, { products }, context) => {
      const url = new URL(context.headers.referer).origin;
      const line_items = [];
      let orderTotal = 0; 

      try {
        for (const productInput of products) {
          const dbProduct = await Product.findById(productInput._id);
          if (!dbProduct) {
            throw new Error(`Product not found: ${productInput._id}`);
          }

          line_items.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: dbProduct.name,
                description: dbProduct.description,
                images: [dbProduct.image], 
              },
              unit_amount: Math.round(dbProduct.price * 100), // Stripe requires integer amounts
            },
            quantity: productInput.purchaseQuantity,
          });

          orderTotal += dbProduct.price * productInput.purchaseQuantity;
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${url}/`,
        });

        const order = await Order.create({ 
          products, 
          total: orderTotal,
          user: context.user._id 
        });

        return { session: session.id, order: order._id };
      } catch (error) {
        console.error('Error creating Stripe checkout session:', error.message);
        throw new Error('Failed to create checkout session.'); 
      }
    } 
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addOrder: async (parent, { products }, context) => {
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

        return order;
      }

      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    updateProduct: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;

      return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
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
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { wishlist: productId } },
          { new: true }
        ).populate('wishlist');

        return updatedUser;
      }

      throw new AuthenticationError('Not logged in');
    },
    removeFromWishlist: async (parent, { productId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { wishlist: productId } },
          { new: true }
        ).populate('wishlist');

        return updatedUser;
      }

      throw new AuthenticationError('Not logged in');
    },
    addToFavorites: async (parent, { productId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { favorites: productId } },
          { new: true }
        ).populate('favorites');

        return updatedUser;
      }

      throw new AuthenticationError('Not logged in');
    },
    removeFromFavorites: async (parent, { productId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { favorites: productId } },
          { new: true }
        ).populate('favorites');

        return updatedUser;
      }

      throw new AuthenticationError('Not logged in');
    }
  }
};

export default resolvers;
