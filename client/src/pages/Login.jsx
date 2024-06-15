// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, Navigate } from 'react-router-dom';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { Form, Button, Alert } from 'react-bootstrap'; // Import Bootstrap components

function Login(props) {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, loading }] = useMutation(LOGIN_USER); // Add loading state
  const [showAlert, setShowAlert] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({ variables: { ...formState } });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true); // Show alert if error
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  // Check if user is logged in, if so, redirect to home page
  if (Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="my-1">
      <Link to="/signup" className="btn btn-link">← Go to Signup</Link>

      <h2>Login</h2>
      <Form onSubmit={handleFormSubmit}>
        <Alert variant='danger' show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          <p className="error-text">The provided credentials are incorrect</p> 
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email address:</Form.Label>
          <Form.Control
            type="email" 
            placeholder="youremail@test.com"
            name="email"
            id="email"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="pwd">Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="******"
            name="password"
            id="pwd"
            onChange={handleChange}
          />
        </Form.Group>

        {loading ? (
          <Button variant="primary" type="submit" disabled>
            <Spinner animation="border" size="sm" /> Loading...
          </Button>
        ) : (
          <Button variant="primary" type="submit">Submit</Button>
        )}
      </Form>
    </Container>
  );
}

export default Login;
