const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// Load the JWT secret from the environment so it is never hard-coded in source.
// Fall back to a placeholder only in development to keep the dev server
// startable without a .env file, but log a loud warning.
const secret = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(
      '[auth] WARNING: JWT_SECRET env var is not set. ' +
      'Using an insecure fallback — set JWT_SECRET in your .env file!'
    );
  }
  return 'INSECURE_FALLBACK_CHANGE_ME';
})();

// Token lifetime — 2 hours is a reasonable balance between security and UX.
const expiration = '2h';

module.exports = {
  // Standard GraphQL error returned whenever authentication fails.
  // Using a single error object keeps error messages vague on purpose
  // (we don't want to hint whether an email exists in the system).
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  // Express/Apollo middleware that reads a JWT from the request and attaches
  // the decoded user payload to req.user so resolvers can authorise actions.
  authMiddleware: function ({ req }) {
    // The token may arrive in the body, query-string, or Authorization header.
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Strip the "Bearer " prefix that Apollo Client adds automatically.
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      // No token provided — continue without a user context.
      return req;
    }

    try {
      // Verify the token signature and expiry; extract the data payload.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      // An invalid or expired token is silently ignored so that public
      // queries still work — protected resolvers will throw AuthenticationError.
      console.warn('[auth] Invalid or expired token received.');
    }

    return req;
  },

  // Creates a signed JWT containing the user's id, email, and first name.
  signToken: function ({ firstName, email, _id }) {
    const payload = { firstName, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
