import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
   const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (e) => {
        setEmail(e.target.value);
      };

      const handlePassword = (e) => {
        setPassword(e.target.value);
      };

      const handleLogin = (e) => {
        e.preventDefault(); // Prevent form refresh
    
        //  Authentication check (Replace with real authentication logic)
        if (email === "farouk.afolabi@yahoo.com" && password === "12345") {
          navigate("/home"); // Redirect to HomePage
        } else {
          alert("Invalid credentials, please try again.");
        }
      };

    return (
        <div>
            <h2>Login</h2>
            <form>
                <div className='input'>
                    <label htmlFor='email'>Email</label>
                    <input
                        id="email" 
                        type="text" 
                        value={email}
                        onChange={handleEmail}
                        placeholder="Enter your email"

                       
                    />
                </div>

                <div className='input'>
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password" 
                        value={password}
                        onChange={handlePassword}
                        placeholder="Enter your password"
                        
                    />
                </div>

                <button type="submit" onClick={handleLogin}>Login</button>
            </form>
            <p>Don't have an account? <span onClick={() => navigate("/register")}>Register</span></p>
        </div>
    );
}

export default Login;
