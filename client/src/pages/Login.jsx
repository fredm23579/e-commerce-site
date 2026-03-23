import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  // useMutation captures the error so we can display it in the form.
  const [login, { error }] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      // Store the JWT and redirect to the home page.
      Auth.login(token);
    } catch (e) {
      // The Apollo error is already captured above; log for developer debugging.
      console.error('[Login] Authentication failed:', e.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <div className="container my-1">
      <Link to="/signup">← Go to Signup</Link>

      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email address:</label>
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
            placeholder="••••••"
            name="password"
            type="password"
            id="pwd"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Display a friendly message when credentials are wrong */}
        {error && (
          <div className="my-1">
            <p className="error-text">The provided credentials are incorrect</p>
          </div>
        )}

        <div className="flex-row flex-end">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
