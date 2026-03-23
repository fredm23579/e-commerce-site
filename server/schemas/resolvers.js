const { User, Product, Category, Order } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

// Load the Stripe secret key from the environment — never hard-code API keys.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || (() => {
  console.warn('[resolvers] WARNING: STRIPE_SECRET_KEY env var is not set.');
  return 'sk_test_placeholder';
})());

const resolvers = {
  Query: {
    // Return all product categories (used to populate the category filter menu).
    categories: async () => {
      return await Category.find();
    },

    // Return products, optionally filtered by category ID and/or name substring.
    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        // Case-insensitive substring match on the product name.
        params.name = { $regex: name, $options: 'i' };
      }

      return await Product.find(params).populate('category');
    },

    // Return a single product by its MongoDB _id, with its category populated.
    product: async (parent, { _id }) => {
      return await Product.findById(_id).populate('category');
    },

    // Return the authenticated user's profile together with their order history.
    // Requires a valid JWT — throws AuthenticationError otherwise.
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category',
        });

        // Show the most recent orders first.
        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw AuthenticationError;
    },

    // Return a specific order belonging to the authenticated user.
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category',
        });

        return user.orders.id(_id);
      }

      throw AuthenticationError;
    },

    // Create a Stripe Checkout session for the provided products and return
    // the session ID so the client can redirect to the Stripe-hosted checkout.
    checkout: async (parent, args, context) => {
      // Determine the site origin from the referer header so success/cancel
      // URLs work in both development and production.
      const url = new URL(context.headers.referer).origin;

      // Persist a pending order record so we can save it on the success page.
      await Order.create({ products: args.products.map(({ _id }) => _id) });

      // Build the Stripe line items array from the cart contents.
      // eslint-disable-next-line camelcase
      const line_items = args.products.map((product) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
            images: [`${url}/images/${product.image}`],
          },
          // Stripe expects amounts in the smallest currency unit (cents for USD).
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.purchaseQuantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });

      return { session: session.id };
    },
  },

  Mutation: {
    // Register a new user and return a signed token so the client is
    // immediately logged in after signup.
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    // Append a new order to the authenticated user's order history.
    addOrder: async (parent, { products }, context) => {
      if (context.user) {
        const order = new Order({ products });
        await User.findByIdAndUpdate(
          context.user._id,
          { $push: { orders: order } }
        );
        return order;
      }

      throw AuthenticationError;
    },

    // Update profile fields for the authenticated user.
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw AuthenticationError;
    },

    // Decrement the on-hand quantity of a product after purchase.
    updateProduct: async (parent, { _id, quantity }) => {
      // Always subtract — Math.abs prevents accidental additions if the
      // client sends a negative number.
      const decrement = Math.abs(quantity) * -1;
      return await Product.findByIdAndUpdate(
        _id,
        { $inc: { quantity: decrement } },
        { new: true }
      );
    },

    // Authenticate an existing user and return a signed token.
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      // Use the same generic error for both "user not found" and "wrong password"
      // to avoid leaking whether an email address is registered.
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
