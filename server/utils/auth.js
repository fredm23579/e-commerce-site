// server/utils/auth.js
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

// Load JWT secret from environment variable (or a default for development)
const secret = process.env.JWT_SECRET || 'mysecretssshhhhhhh'; // Securely store in env vars
const expiration = '2h';

// Define a custom AuthenticationError class
export class AuthenticationError extends GraphQLError {
  constructor(message = 'Could not authenticate user.') {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 }, // Set HTTP status to 401 Unauthorized
      },
    });
  }
}

// Authentication middleware function
export function authMiddleware({ req }) {
  // Allow token to be sent via req.headers.authorization
  let token = req.headers.authorization || '';

  // Check for "Bearer " prefix and extract the token
  if (token.startsWith('Bearer ')) {
    token = token.split('Bearer ')[1].trim();
  }

  if (!token) {
    // No token, allow request to proceed (unauthenticated)
    return req; 
  }

  try {
    // Verify token and get user data out of it
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data; // Attach user data to the request for later use
  } catch (err) {
    console.error('Invalid token:', err);
    throw new AuthenticationError('Invalid token');
  }

  return req;
}

// Function to sign a new JWT token
export function signToken({ username, email, _id }) { 
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

// Helper functions for authentication checks (optional)
export function isLoggedIn(context) {
  return context.user !== undefined;
}

export function isAdmin(context) {
  return isLoggedIn(context) && context.user.isAdmin;
}
