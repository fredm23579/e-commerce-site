// client/src/pages/Wishlist.jsx
import React, { useEffect } from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { Link } from 'react-router-dom';
import { REMOVE_FROM_WISHLIST, ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import { Alert, Container, Row, Col, Card, Button } from 'react-bootstrap'; // Using React Bootstrap for styling
import Auth from '../../utils/auth'; // Import authentication utility

const Wishlist = () => {
  const [state, dispatch] = useStoreContext();
  const { wishlist } = state;

  const removeFromWishlist = async (item) => {
    try {
      dispatch({ type: REMOVE_FROM_WISHLIST, _id: item._id });
      await idbPromise('wishlist', 'delete', { _id: item._id });
      Alert.success(`${item.name} removed from wishlist!`, 3000); 
    } catch (error) {
      console.error(error);
      Alert.error('Failed to remove item from wishlist.'); 
    }
  };

  const addToCart = (item) => {
    // Check if the item is already in the cart
    const cartItem = state.cart.find((cartItem) => cartItem._id === item._id);
    if (cartItem) {
      // Update cart quantity if it's already in the cart
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: parseInt(cartItem.purchaseQuantity) + 1,
      });
      idbPromise('cart', 'put', {
        ...cartItem,
        purchaseQuantity: parseInt(cartItem.purchaseQuantity) + 1,
      });
    } else {
      // Add to cart if it's not already there
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 },
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
    removeFromWishlist(item); // Remove from wishlist after adding to cart
  };

  return (
    <Container>
      <h2>My Wishlist</h2>
      {!Auth.loggedIn() ? (
        <p>
          <Link to="/login">Log in</Link> to view your wishlist!
        </p>
      ) : wishlist.length ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {wishlist.map((item) => (
            <Col key={item._id}>
              <Card>
                <Link to={`/products/${item._id}`}>
                  <Card.Img variant="top" src={`/images/${item.image}`} alt={item.name} /> 
                </Link>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>${item.price}</Card.Text>
                  <Button variant="primary" onClick={() => addToCart(item)}>Add to Cart</Button>
                  <Button variant="danger" onClick={() => removeFromWishlist(item)}>Remove</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </Container>
  );
};

export default Wishlist;
