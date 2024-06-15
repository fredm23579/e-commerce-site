// server/server.js
import express from 'express';
import * as dotenv from 'dotenv'; // Load environment variables
dotenv.config();
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import cors from 'cors';
import stripe from 'stripe';
import http from 'http';
import { fileURLToPath } from 'url';

import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './utils/auth.js';
import connectDB from './config/connection.js'; // Import the connectDB function

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = http.createServer(app);
const stripeKey = process.env.STRIPE_SECRET_KEY;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startApolloServer() {
  try {
    await server.start();

    // CORS configuration (replace with your React app's origin)
    const corsOptions = {
      origin: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };
    app.use(cors(corsOptions));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/images', express.static(path.join(__dirname, '../client/dist/images')));

    app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

    // Create checkout session route
    app.post('/create-checkout-session', async (req, res) => {
      const { products } = req.body;
      const domainUrl = process.env.DOMAIN_URL || 'http://localhost:3000';

      const line_items = products.map(product => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
            images: [`${domainUrl}/images/${product.image}`],
          },
          unit_amount: product.price * 100,
        },
        quantity: product.purchaseQuantity,
      }));

      try {
        const session = await stripe(stripeKey).checkout.sessions.create({
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${domainUrl}/`,
        });

        res.json({ id: session.id });
      } catch (error) {
        console.error('Error creating Stripe checkout session:', error.message);
        res.status(500).json({ error: 'Failed to create checkout session.' });
      }
    });

    // Serve static assets
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    // Error Handling Middleware
    app.use((err, req, res, next) => {
      console.error(err.stack); // Log the error
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        error: {
          message: err.message,
          extensions: err.extensions,
        },
      });
    });

    // Unhandled Promise Rejection Handler
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Optionally exit the process if it's a critical error: process.exit(1);
    });

    // Connect to the database, then start the server
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting Apollo Server:', error.message);
    process.exit(1);
  }
};

startApolloServer();
