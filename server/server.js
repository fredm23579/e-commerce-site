// server/server.js
import * as dotenv from 'dotenv'; // See Note below
dotenv.config();
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import cors from 'cors';
import stripe from 'stripe';

import connectDB from './config/connection.js';
import { authMiddleware } from './utils/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

// Error Handling Middleware (Improved)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log detailed error stack trace
  const statusCode = err.statusCode || 500; // Set appropriate status code
  res.status(statusCode).json({
    error: {
      message: err.message,
      extensions: err.extensions, // Include additional error details for GraphQL errors
    },
  });
});

const startApolloServer = async () => {
  await server.start();
 
  // CORS configuration (replace with your React app's origin)
  const corsOptions = {
    origin: process.env.REACT_APP_FRONTEND_URL || 'https://e-commerce-site-us2y.onrender.com/', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
  };
  app.use(cors(corsOptions)); 

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/images', express.static(path.join(__dirname, '../client/dist/images')));  //Serve images from client/dist 

  app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

  // Create checkout session route (ensure proper image paths)
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
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainUrl}/`,
      });

      res.json({ id: session.id });
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error.message);
      res.status(500).json({ error: 'Failed to create checkout session.' }); // More descriptive message
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
  try {
    await connectDB(); 
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startApolloServer();
