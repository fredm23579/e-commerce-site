import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'mysecretssshhhhhhh'; // Use environment variable if available
const expiration = '2h';

const auth = {
  // Custom Authentication Error
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

// Authentication Middleware
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.error('Invalid token:', err); // Log error for debugging
      throw new AuthenticationError('Invalid token'); // Throw custom error
    }

    return req;
  },

  // Sign Token Function
  signToken: function ({ firstName, email, _id }) {
    const payload = { firstName, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

export default auth;
