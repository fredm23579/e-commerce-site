// client/src/components/ProductItem/index.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers";
import { useStoreContext } from "../../utils/GlobalState";
import { ADD_TO_CART, UPDATE_CART_QUANTITY, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { useMutation } from '@apollo/client';
import { ADD_TO_WISHLIST as ADD_TO_WISHLIST_MUTATION, ADD_TO_FAVORITES as ADD_TO_FAVORITES_MUTATION } from '../../utils/mutations';

function ProductItem(item) {
  const [state, dispatch] = useStoreContext();
  const [addToWishlistMutation] = useMutation(ADD_TO_WISHLIST_MUTATION);
  const [addToFavoritesMutation] = useMutation(ADD_TO_FAVORITES_MUTATION);

  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const { cart, wishlist, favorites } = state;

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  };

  const handleAddToWishlist = async () => {
    const itemInWishlist = wishlist.find((wishlistItem) => wishlistItem._id === _id);
    if (itemInWishlist) {
      dispatch({
        type: REMOVE_FROM_WISHLIST,
        _id: _id
      });
      idbPromise('wishlist', 'delete', { ...item });
    } else {
      try {
        await addToWishlistMutation({
          variables: { productId: _id }
        });
        dispatch({
          type: ADD_TO_WISHLIST,
          product: { ...item }
        });
        idbPromise('wishlist', 'put', { ...item });
        alert('Added to Wishlist');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAddToFavorites = async () => {
    const itemInFavorites = favorites.find((favoriteItem) => favoriteItem._id === _id);
    if (itemInFavorites) {
      dispatch({
        type: REMOVE_FROM_FAVORITES,
        _id: _id
      });
      idbPromise('favorites', 'delete', { ...item });
    } else {
      try {
        await addToFavoritesMutation({
          variables: { productId: _id }
        });
        dispatch({
          type: ADD_TO_FAVORITES,
          product: { ...item }
        });
        idbPromise('favorites', 'put', { ...item });
        alert('Added to Favorites');
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to Cart</button>
      <button onClick={handleAddToWishlist}>
        {wishlist.find((wishlistItem) => wishlistItem._id === _id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
      <button onClick={handleAddToFavorites}>
        {favorites.find((favoriteItem) => favoriteItem._id === _id) ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  );
}

export default ProductItem;
