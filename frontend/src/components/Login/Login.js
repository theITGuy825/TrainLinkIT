import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (e) => {
        setEmail(e.target.value);
      };

      const handlePassword = (e) => {
        setPassword(e.target.value);
      };

    return (
        <div>
            <h2>Login</h2>
            <form>
                <div className='input'>
                    <label>Email</label>
                    <input 
                        type="text" 
                        value={email}
                        onChange={handleEmail}
                        placeholder="Enter your email"

                       
                    />
                </div>

                <div className='input'>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={handlePassword}
                        placeholder="Enter your password"
                        
                    />
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
