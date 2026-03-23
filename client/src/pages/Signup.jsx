import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations';

function Signup() {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // useMutation returns an error object we can use to display feedback.
  const [addUser, { error }] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await addUser({
        variables: {
          email: formState.email,
          password: formState.password,
          firstName: formState.firstName,
          lastName: formState.lastName,
        },
      });
      const token = mutationResponse.data.addUser.token;
      // Store the JWT and redirect to the home page.
      Auth.login(token);
    } catch (e) {
      // The mutation error is already captured by useMutation above and
      // displayed in the form; we only log here for developer debugging.
      console.error('[Signup] Registration failed:', e.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <div className="container my-1">
      <Link to="/login">← Go to Login</Link>

      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="firstName">First Name:</label>
          <input
            placeholder="First"
            name="firstName"
            type="text"
            id="firstName"
            value={formState.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="lastName">Last Name:</label>
          <input
            placeholder="Last"
            name="lastName"
            type="text"
            id="lastName"
            value={formState.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email:</label>
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="pwd">Password:</label>
          <input
            placeholder="Minimum 5 characters"
            name="password"
            type="password"
            id="pwd"
            minLength={5}
            value={formState.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Show server-side errors (e.g. duplicate email) */}
        {error && (
          <div className="my-1">
            <p className="error-text">{error.message}</p>
          </div>
        )}

        <div className="flex-row flex-end">
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
