import express from 'express';
import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import cors from 'cors';
import stripe from 'stripe';
import http from 'http';
import { fileURLToPath } from 'url';

import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './utils/auth.js';
import db from './config/connection.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      extensions: err.extensions, // Include additional error details for GraphQL errors
    },
  });
});

async function startApolloServer() {
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
  // ... (Stripe checkout route logic) ...

  // Serve static assets
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

    // Access server.graphqlPath AFTER server.start()
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`); 
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startApolloServer();