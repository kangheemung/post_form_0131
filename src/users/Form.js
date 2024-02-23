import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Form() {
    // ユーザー名とパスワードの状態を定義
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const navigate = useNavigate();
      // フォームの送信処理
  async function handleSubmit(event) {
    event.preventDefault(); // デフォルトのフォーム送信を阻止

    try {
      const response = await fetch('http://3.112.191.54:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            username,
            password,
            password_confirmation: passwordConfirmation

          }
        })
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem('token', data.data.token); // Save token to local storage
        alert('Registration successful!');

        const userId = data.user && data.user.id;
        if (userId) {
            navigate(`/api/v1/users/${userId}/microposts`); // Navigate to user's microposts
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
    <div className= "main">
      <p className= "sign" align="center">
        Sign in
      </p>
      <form className="form1" onSubmit={handleSubmit}>
        <input className= "username" type = "text" placeholder= "Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className= "password" type = "password" placeholder= "password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className= "password" type = "password" placeholder= "password_confirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}/>
        <button type="submit" className="submit">Submit</button>
      </form>
    </div>
  )
}

export default Form