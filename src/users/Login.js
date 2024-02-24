import { useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission

    try {
      const response = await fetch('http://54.238.178.130:3000/api/v1/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            email,
            password
          }
        })
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data); 
        localStorage.setItem('token', data.data.token);
        alert('Login successful!');

        const decodedToken = jwtDecode(data.data.token);
        const userId = decodedToken.user_id;
        if (userId) {
            navigate(`/api/v1/users/${userId}/micropost`); // Navigate to user's microposts or another appropriate route after login
        } else {
            console.error('User ID is undefined.');
            alert('Failed to retrieve user ID.');
        }
    } else {
        const errorData = await response.json();
        console.error('Failed to login:', errorData);
        alert(`Error: ${errorData.error}`);
    }
} catch (error) {
    console.error('There was an error!', error);
    alert(error.message);
}
}

  return (
    <div className="main">
      <p className="sign" align="center">
        Login
      </p>
      <form className="form1" onSubmit={handleSubmit}>
        <input
          className="username"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="login-link" align="center">Forgot Password?</p>
        <button className="submit" align="center" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
