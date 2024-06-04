import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: React.lazy(() => import('./pages/NoMatch')),
    children: [
      { index: true, element: React.lazy(() => import('./pages/Home')) },
      { path: 'login', element: React.lazy(() => import('./pages/Login')) },
      { path: 'signup', element: React.lazy(() => import('./pages/Signup')) },
      { path: 'success', element: React.lazy(() => import('./pages/Success')) },
      { path: 'orderHistory', element: React.lazy(() => import('./pages/OrderHistory')) },
      { path: 'products/:id', element: React.lazy(() => import('./pages/Detail')) }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
