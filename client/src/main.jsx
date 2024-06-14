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
  onError,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { toast } from 'react-toastify'; // For error notifications

import App from './App';

const httpLink = createHttpLink({
  uri: 'https://e-commerce-site-us2y.onrender.com/graphql',
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      // Show user-friendly error notifications
      toast.error(`GraphQL Error: ${message}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    toast.error('Network Error: Unable to connect to the server.');
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]), // Compose links
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
