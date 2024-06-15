import * as dotenv from 'dotenv'; // See Note below
dotenv.config();
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import cors from 'cors';
import stripePackage from 'stripe';

// Import your Mongoose connection module
import connectDB from './config/connection.js';
import { authMiddleware } from './utils/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
// Import necessary models for seeding if necessary
//import { Category, Product, User } from './models'; 

// Get your Stripe secret key from environment variables 
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  // CORS configuration (replace with your React app's origin)
  app.use(cors({
    origin: process.env.REACT_APP_FRONTEND_URL || 'https://e-commerce-site-us2y.onrender.com/', 
    methods: ['GET', 'POST'], // Adjust if necessary
    credentials: true,      
  }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve images from the correct path 
  app.use('/images', express.static(path.join(__dirname, '../client/public/images'))); 

  app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

  // Create checkout session route (ensure proper image paths)
  app.post('/create-checkout-session', async (req, res) => {
    const { products } = req.body;

    const line_items = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description,
          images: [product.image],  // Assuming image is already a full URL
        },
        unit_amount: product.price * 100, 
      },
      quantity: product.purchaseQuantity,
    }));

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/`,
      });

      res.json({ id: session.id });
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error.message || error);
      res.status(500).json({ error: 'An error occurred, unable to create session' });
    }
  });

  // Serve static assets in production ONLY
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the server after the database connection is established
  connectDB().then(() => { 
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at https://e-commerce-site-us2y.onrender.com/graphql`);
    });
  });
};

startApolloServer();
