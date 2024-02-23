import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

function Login() {
      // ユーザー名とパスワードの状態を定義
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const navigate = useNavigate();
      const { login } = useAuth();
        // フォームの送信処理
    async function handleSubmit(event) {
      event.preventDefault(); // デフォルトのフォーム送信を阻止

      try {
        const response = await fetch('http://3.112.191.54:3000/api/v1/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: {
              username,
              password
            }
          })
        });

        if (response.ok) {
          const { data } = await response.json();
          console.log(data);
          localStorage.setItem('token', data.token); // Save token to local storage
          alert('Registration successful!');

          const { token, user_id } = data;
          if (user_id) {
            login(token, user_id);
              navigate(`/api/v1/users/${user_id}/microposts`); // Navigate to user's microposts
          } else {
              console.error('User ID is undefined.');
              alert('Failed to retrieve user ID.');
          }
      } else {
          const errorData = await response.json();
          console.error('Failed to register:', errorData);
          alert(`Error: ${errorData.error}`);
      }
  } catch (error) {
      console.error('There was an error!', error);
      alert(error.message);
  }
}
  return (
    <div>
    <div className= "main">
      <p className= "sign" align="center">
       Login
      </p>
      <form className="form1" onSubmit={handleSubmit}>
        <input className= "username" type = "text" placeholder= "Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input className= "password" type = "password" placeholder= "password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <p className="login-link" align= "center">Forgot Password?</p>
          <button className="submit" align= "center" value="Login">Login</button>
      </form>
    </div>
    </div>
  )
}

export default Login
