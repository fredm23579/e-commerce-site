// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error'; 
import { setContext } from '@apollo/client/link/context';
import { toast, ToastContainer, Slide } from 'react-toastify';


import App from './App';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL || '/graphql', // Use environment variable or fallback
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Operation: ${operation.operationName}` // Added operation name
      );
      // Show user-friendly error notifications based on error type
      if (message.includes("Not logged in") || message.includes("Unauthorized")) {
        // Handle authentication errors (e.g., redirect to login)
        toast.error("Please log in to perform this action.");
        // You might want to redirect to the login page here
      } else {
        toast.error(`GraphQL Error: ${message}`);
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    toast.error('Network Error: Unable to connect to the server.');
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
        <ToastContainer transition={Slide} />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
