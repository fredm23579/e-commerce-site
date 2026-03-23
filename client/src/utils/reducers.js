import {
  UPDATE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  CLEAR_CART,
  TOGGLE_CART,
} from './actions';

// Pure reducer function that derives the next state from an action.
// All state updates return new objects/arrays — never mutate state directly.
export const reducer = (state, action) => {
  switch (action.type) {
    // Replace the full product list (called after fetching products from the API).
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };

    // Add a single product to the cart and open the cart panel.
    case ADD_TO_CART:
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.product],
      };

    // Hydrate the cart with multiple items at once (e.g. restoring from IndexedDB).
    case ADD_MULTIPLE_TO_CART:
      return {
        ...state,
        cart: [...state.cart, ...action.products],
      };

    // Update the purchase quantity for a specific cart item.
    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map((product) => {
          if (action._id === product._id) {
            product.purchaseQuantity = action.purchaseQuantity;
          }
          return product;
        }),
      };

    // Remove one item from the cart; close the panel if the cart is now empty.
    case REMOVE_FROM_CART: {
      const newCart = state.cart.filter((product) => product._id !== action._id);
      return {
        ...state,
        cartOpen: newCart.length > 0,
        cart: newCart,
      };
    }

    // Empty the cart completely and close the panel (used after a successful checkout).
    case CLEAR_CART:
      return {
        ...state,
        cartOpen: false,
        cart: [],
      };

    // Toggle the cart panel open/closed.
    case TOGGLE_CART:
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };

    // Replace the full category list (called after fetching categories from the API).
    case UPDATE_CATEGORIES:
      return {
        ...state,
        categories: [...action.categories],
      };

    // Set the active category filter (empty string means "all categories").
    case UPDATE_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.currentCategory,
      };

    // Unknown action — return state unchanged so the app doesn't break.
    default:
      return state;
  }
};
