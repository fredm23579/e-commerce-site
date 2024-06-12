require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
  }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/images', express.static(path.join(__dirname, '../client/images')));

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Create checkout session route
  app.post('/create-checkout-session', async (req, res) => {
    const { products } = req.body;

    const line_items = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description,
          images: [`${req.protocol}://${req.get('host')}/images/${product.image}`],
        },
        unit_amount: product.price * 100, // Convert price to cents
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
      console.error('Error creating Stripe checkout session:', error);
      res.status(500).json({ error: 'An error occurred, unable to create session' });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
