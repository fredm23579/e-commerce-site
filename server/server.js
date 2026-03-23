// Load environment variables from .env before anything else.
// In production these are set by the hosting platform (Heroku, Render, etc.).
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Create the Apollo GraphQL server with our schema and resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  // Apollo Server 4 requires an explicit start() call before mounting middleware.
  await server.start();

  // Parse URL-encoded form data and JSON request bodies.
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Configure CORS.  In development the Vite dev server runs on port 3000 and
  // proxies /graphql to this server, so we allow both origins.  In production
  // the client is served from the same origin so CORS is not needed, but we
  // keep this permissive for simplicity — tighten the origin list for a real
  // production deployment.
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? true               // same-origin in prod — allow all
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  }));

  // Serve static assets from the client directory.
  app.use('/images', express.static(path.join(__dirname, '../client/images')));
  app.use(
    '/serviceWorker.js',
    express.static(path.join(__dirname, '../client/src/serviceWorker.js'))
  );
  app.use(
    '/manifest.json',
    express.static(path.join(__dirname, '../client/public/manifest.json'))
  );

  // Mount the GraphQL endpoint.  The authMiddleware attaches req.user when a
  // valid JWT is present so resolvers can protect authenticated operations.
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware,
  }));

  // In production Vite builds the React app to client/dist — serve it here
  // and let React Router handle all client-side routes via the catch-all.
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Wait for the MongoDB connection to open before accepting requests.
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
