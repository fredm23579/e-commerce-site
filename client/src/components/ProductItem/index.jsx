// client/src/components/ProductItem/index.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { pluralize } from '../../utils/helpers';
import { useStoreContext } from '../../utils/GlobalState';
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import { useMutation } from '@apollo/client';
import { 
  ADD_TO_WISHLIST, 
  ADD_TO_FAVORITES,
  REMOVE_FROM_WISHLIST,
  REMOVE_FROM_FAVORITES
} from '../../utils/mutations';
import { toast } from 'react-toastify';
import { Card, Button, Spinner } from 'react-bootstrap'; // Import Bootstrap components
import './style.css'; 

function ProductItem({ item }) { // Destructure item directly
  const [state, dispatch] = useStoreContext();
  const [addToWishlist, { loading: wishlistLoading, error: wishlistError }] = useMutation(ADD_TO_WISHLIST);
  const [addToFavorites, { loading: favoritesLoading, error: favoritesError }] = useMutation(ADD_TO_FAVORITES);
  const [removeFromWishlist, { loading: removeWishlistLoading }] = useMutation(REMOVE_FROM_WISHLIST);
  const [removeFromFavorites, { loading: removeFavoritesLoading }] = useMutation(REMOVE_FROM_FAVORITES);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

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
    const isItemInWishlist = wishlist.find(wishlistItem => wishlistItem._id === item._id);
    const mutation = isItemInWishlist ? removeFromWishlist : addToWishlist;

    try {
      await mutation({
        variables: { productId: item._id }
      });
      dispatch({
        type: isItemInWishlist ? REMOVE_FROM_WISHLIST : ADD_TO_WISHLIST,
        _id: item._id,
      });
      idbPromise('wishlist', isItemInWishlist ? 'delete' : 'put', item);
      const toastMessage = isItemInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!';
      toast(toastMessage, { type: isItemInWishlist ? 'error' : 'success' });

    } catch (e) {
      console.error(e);
      toast.error('An error occurred while updating the wishlist.');
    }
  };

  const handleAddToFavorites = async () => {
    const isItemInFavorites = favorites.find(favoriteItem => favoriteItem._id === item._id);
    const mutation = isItemInFavorites ? removeFromFavorites : addToFavorites;
    try {
      await mutation({
        variables: { productId: item._id }
      });
      dispatch({
        type: isItemInFavorites ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES,
        _id: item._id,
      });
      idbPromise('favorites', isItemInFavorites ? 'delete' : 'put', item);

      const toastMessage = isItemInFavorites ? 'Removed from favorites!' : 'Added to favorites!';
      toast(toastMessage, { type: isItemInFavorites ? 'error' : 'success' });
    } catch (e) {
      console.error(e);
      toast.error('An error occurred while updating favorites.');
    }
  };

  return (
    <Card style={{ width: '18rem' }}>
      <Link to={`/products/${_id}`}>
        <Card.Img variant="top" src={`/images/${image}`} alt={name} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>${price}</Card.Text>
          {/* Add to Cart Button */}
          <Button onClick={addToCart} disabled={cart.find(cartItem => cartItem._id === _id)}>
            Add to cart
            {cart.find(cartItem => cartItem._id === _id) && <span> ({cart.find(cartItem => cartItem._id === _id).purchaseQuantity})</span>}
          </Button>
          {/* Add to Wishlist Button */}
          <Button variant="info" onClick={handleAddToWishlist} disabled={wishlistLoading || removeWishlistLoading}>
            {wishlistLoading || removeWishlistLoading ? <Spinner animation="border" size="sm"/> : wishlist.find(wishlistItem => wishlistItem._id === _id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
          {/* Add to Favorites Button */}
          <Button variant="secondary" onClick={handleAddToFavorites} disabled={favoritesLoading || removeFavoritesLoading}>
            {favoritesLoading || removeFavoritesLoading ? <Spinner animation="border" size="sm"/> : favorites.find(favoriteItem => favoriteItem._id === _id) ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </Card.Body>
      </Link>
    </Card>
  );
}
  

export default ProductItem;
