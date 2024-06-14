// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy } from 'react'; // For lazy loading and Suspense

import Nav from './components/Nav';
import { StoreProvider } from './utils/GlobalState';
import Home from './pages/Home';
import Detail from './pages/Detail';
import NoMatch from './pages/NoMatch';

// Lazy Load Other Pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Success = lazy(() => import('./pages/Success'));
const Wishlist = lazy(() => import('./pages/Wishlist')); // Add Wishlist here

function App() {
  return (
    <StoreProvider>
      <Nav />
      <ToastContainer />
      <Suspense fallback={<div>Loading...</div>}> {/* Add Suspense fallback */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Suspense>
    </StoreProvider>
  );
}

export default App;
