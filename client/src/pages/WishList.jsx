// client/src/pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from 'react-router-dom';
import { QUERY_WISHLIST } from "../utils/queries";
import { idbPromise } from "../utils/helpers";
import { useStoreContext } from "../utils/GlobalState";
import { Alert, Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';

const Wishlist = () => {
  const [state, dispatch] = useStoreContext();
  const [errorMessage, setErrorMessage] = useState(''); // For error messages
  const { loading, error, data } = useQuery(QUERY_WISHLIST);

  useEffect(() => {
    // Handle query errors
    if (error) {
      setErrorMessage('Error fetching wishlist data. Please try again later.');
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (data && data.wishlist) {
      // Update state and store in IndexedDB only for new items
      const wishlistItems = data.wishlist.filter(item => !state.wishlist.find(w => w._id === item._id));
      dispatch({ type: "UPDATE_WISHLIST", wishlist: wishlistItems });
      wishlistItems.forEach(item => idbPromise('wishlist', 'put', item));
    } else if (!loading && !data?.wishlist) { 
      // Retrieve from IndexedDB when no data or loading finished without results
      idbPromise('wishlist', 'get').then(items => dispatch({ type: "UPDATE_WISHLIST", wishlist: items }));
    }
  }, [data, loading, dispatch, state.wishlist]);

  return (
    <Container>
      <h2>My Wishlist</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : state.wishlist.length ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {state.wishlist.map(item => (
            <Col key={item._id}>
              <Card>
                <Link to={`/products/${item._id}`}>
                  {/* Add product image here (if available) */}
                  <Card.Img variant="top" src={item.image} />
                </Link>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>${item.price}</Card.Text>
                  <Button variant="primary">Add to Cart</Button>
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
