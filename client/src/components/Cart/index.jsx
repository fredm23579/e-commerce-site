import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery, useMutation } from '@apollo/client'; // Use useLazyQuery instead of useQuery
import { QUERY_CHECKOUT, CREATE_CHECKOUT_SESSION } from '../../utils/queries';  // Import from queries.jsimport { idbPromise } from '../../utils/helpers';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { Alert, Container, Row, Col, Button, Spinner } from 'react-bootstrap';


import './style.css';

const stripePromise = loadStripe('pk_test_51POVBjP9wvI3QZJomGf7dJhG9bbY8SsOp99Y9IKchswkbRBgnurqqyliGagcAFPygoyj9BUKnmU399ZbnJVng83k007L5gGETN'); 

const Cart = () => {
    const [state, dispatch] = useStoreContext();
    const [getCheckout, { loading, data }] = useLazyQuery(QUERY_CHECKOUT);
    const [checkoutSession, { error: mutationError }] = useMutation(CREATE_CHECKOUT_SESSION); 

    const [checkoutError, setCheckoutError] = useState(null);

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
        }

        if (!state.cart.length) {
            getCart();
        }
    }, [state.cart.length, dispatch]);

    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session });
            });
        }
    }, [data]);

    function toggleCart() {
        dispatch({ type: TOGGLE_CART });
    }

    function calculateTotal() {
        let sum = 0;
        state.cart.forEach((item) => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    async function submitCheckout() {
        try {
            const products = state.cart.map(item => ({
                _id: item._id,
                name: item.name,
                description: item.description,
                image: item.image,
                price: item.price,
                purchaseQuantity: item.purchaseQuantity
            }));
    
            await checkoutSession({
                variables: { products },
            });

            if (mutationError) {
                throw new Error('Error creating checkout session');
            }

            getCheckout(); // Call the lazy query to fetch checkout session ID
        } catch (error) {
            console.error('Checkout Error:', error);
            setCheckoutError(error.message);
        }
    }
    
    if (!state.cartOpen) {
        return (
            <div className="cart-closed" onClick={toggleCart}>
                <span role="img" aria-label="trash">
                    🛒
                </span>
            </div>
        );
    }

    return (
        <Container>
            <div className="close" onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {checkoutError && <Alert variant="danger">{checkoutError}</Alert>}
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : state.cart.length ? (
                <>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {state.cart.map(item => (
                            <Col key={item._id}>
                                <CartItem item={item} />
                            </Col>
                        ))}
                    </Row>
                    <div className="flex-row space-between">
                        <strong>Total: ${calculateTotal()}</strong>
                        {Auth.loggedIn() ? (
                            <Button variant="primary" onClick={submitCheckout}>Checkout</Button>
                        ) : (
                            <span>(log in to check out)</span>
                        )}
                    </div>
                </>
            ) : (
                <h3>Your cart is empty.</h3>
            )}
        </Container>
    );
};

export default Cart;
