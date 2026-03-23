import { createContext, useContext, useReducer } from 'react';
import { reducer } from './reducers';

// ─── Global store (Context + useReducer) ─────────────────────────────────────
//
// The store holds three pieces of shared state:
//   - products: the full product catalogue fetched from the API
//   - categories: list of category objects for the filter menu
//   - currentCategory: the _id of the selected category filter ('' = all)
//   - cart: items the user has added to their shopping cart
//   - cartOpen: whether the cart drawer is visible
//
// We use Context + useReducer instead of Redux to keep the dependency footprint
// small — the app is straightforward enough that full Redux isn't needed.

const StoreContext = createContext();
const { Provider } = StoreContext;

// StoreProvider wraps the application (see App.jsx) and makes [state, dispatch]
// available to any component via the useStoreContext hook below.
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: '',
  });

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

// Convenience hook — equivalent to useContext(StoreContext).
// Components should always use this rather than accessing StoreContext directly.
const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
