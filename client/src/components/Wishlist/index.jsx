// client/src/components/Wishlist/index.jsx
import React, { useEffect, useState } from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { Link } from 'react-router-dom';
import { 
  REMOVE_FROM_WISHLIST, 
  ADD_TO_CART, 
  UPDATE_CART_QUANTITY 
} from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import { Alert, Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import Auth from '../../utils/auth';

function Wishlist() {
  const [state, dispatch] = useStoreContext();
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [errorMessage, setErrorMessage] = useState(''); // For error messages

  useEffect(() => {
    async function getWishlist() {
      try {
        const wishlist = await idbPromise('wishlist', 'get');
        dispatch({ type: ADD_MULTIPLE_TO_CART, products: wishlist });
        setIsLoading(false); // Data is loaded
      } catch (err) {
        setErrorMessage('Error fetching wishlist.');
        console.error(err);
      }
    }

    if (!state.wishlist.length) {
      getWishlist();
    }
  }, [state.wishlist.length, dispatch]);

  const removeFromWishlist = async (_id) => {
    try {
      dispatch({ type: REMOVE_FROM_WISHLIST, _id });
      await idbPromise('wishlist', 'delete', { _id });
      Alert.success('Item removed from wishlist!', 3000); 
    } catch (error) {
      console.error(error);
      Alert.error('Failed to remove item from wishlist.'); 
    }
  };

  const addToCart = (item) => {
    const cartItem = state.cart.find(cartItem => cartItem._id === item._id);
    const quantity = cartItem ? cartItem.purchaseQuantity + 1 : 1;

    dispatch({ 
      type: cartItem ? UPDATE_CART_QUANTITY : ADD_TO_CART,
      _id: item._id,
      purchaseQuantity: quantity 
    });
    idbPromise('cart', 'put', { ...item, purchaseQuantity: quantity });
    removeFromWishlist(item._id);
  };

  return (
    <Container>
      <h2>My Wishlist</h2>

      {!Auth.loggedIn() ? (
        <p>
          <Link to="/login">Log in</Link> to view your wishlist!
        </p>
      ) : (
        <>
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> 
          ) : errorMessage ? (
            <Alert variant="danger">{errorMessage}</Alert>
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
                      <Button variant="danger" onClick={() => removeFromWishlist(item._id)}>Remove</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </>
      )}
    </Container>
  );
}

export default Wishlist;
