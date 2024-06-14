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
import Wishlist from './components/Wishlist/index.jsx';


// Lazy Load Other Pages
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const OrderHistory = lazy(() => import('./pages/OrderHistory.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));
const Success = lazy(() => import('./pages/Success.jsx'));
//const Wishlist = lazy(() => import(new URL('./pages/Wishlist.jsx', import.meta.url)));


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
