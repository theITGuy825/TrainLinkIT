import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from '../../firebase'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase sign-in function

import './login.css'
function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For general errors like sign up failure

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form refresh

    if (email && password) {
      try {
        // Firebase authentication
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/home"); // Redirect to HomePage after successful login
      } catch (err) {
        setError("Invalid credentials, please try again.");
      }
    } else {
      setError("Please enter both email and password.");
    }
  };

  return (
    <div className="login-container">
      {/* Logo Image */}
      <img src='/image073263.png' alt="description"  className='logo'/>

      <div className="login-form">
        <h2>LOGIN</h2>
        <form className='form'>
          <div className="input">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmail}
              placeholder="Enter your email"
            />
          </div>

          <div className="input">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePassword}
              placeholder="Enter your password"
            />
          </div>

          {/* Show error message if there is one */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" onClick={handleLogin}>LOGIN</button>
        </form>

        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
