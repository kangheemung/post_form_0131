import { useState ,useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
function Form() {
    // ユーザー名とパスワードの状態を定義
    const [name, setName] = useState('');
    const [email,setEmail]= useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [flashMessage, setFlashMessage] = useState('');
    const [error, setError] = useState({ name: '', email: '', password: '', passwordConfirmation: '' });
    const navigate = useNavigate();
    const { login } = useAuth();

    const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };
    const checkDuplicateEmail = (email) => {
      const registeredEmails = ['example1@example.com', 'example2@example.com'];
      return registeredEmails.includes(email);
  };



    useEffect(() => {
      let timer;
      if (flashMessage) {
          timer = setTimeout(() => {
              setFlashMessage(''); // Clear the flash message after 3000ms (3 seconds)
          }, 3000);
      }
      return () => clearTimeout(timer); // Cleanup the timer when the component unmounts or flashMessage changes
  }, [flashMessage]);
      // フォームの送信処理
  async function handleSubmit(event) {
    event.preventDefault(); // デフォルトのフォーム送信を阻止
    setError({ name: '', email: '', password: '', passwordConfirmation: '' });

    let hasError = false;

    if (!name.trim()) {
      setError(prev => ({ ...prev, name: "Name is required." }));
      hasError = true;
    }
    if (!isValidEmail(email)) {
      setError(prev => ({ ...prev, email: "Please enter a valid email." }));
      hasError = true;
    }
    if (checkDuplicateEmail(email)) {
      setError({ email: 'Email is already registered.' });
      setFlashMessage('Email is already registered.');
      hasError = true;
  }

    if (password.length < 8) {
      setError(prev => ({ ...prev, password: "The password must be at least 8 characters long." }));
      hasError = true;
    }
    if (!passwordConfirmation || password !== passwordConfirmation) {
      setError(prev => ({ ...prev, passwordConfirmation: "Passwords do not match." }));
      hasError = true;
    }
      if (hasError) return;
    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation
          }
        })
      });
      if (!response.ok) {
        throw new Error('Failed to register.');
    }

    const data = await response.json();

    if (!data.token) {
        throw new Error('Invalid token received.');
    }

    localStorage.setItem('token', data.token);

    const decodedToken = jwtDecode(data.token);
    const userId = decodedToken.user_id;

    login(data.token, userId);
    setFlashMessage('会員登録 successful!');

    setTimeout(() => {
        navigate(`/users/${userId}`);
    }, 2000);
} catch (error) {
  console.error(error);
  if (error.message === 'Invalid token received.') {
      setError({ global: 'Invalid token received. Please try again.' });
      setFlashMessage('Email is already registered.');
  } else {
      setError({ global: 'Unexpected error occurred. Registration failed.' });
      setFlashMessage('Failed to register.');
  }
 }
}
  return (
    <div className='main_body'>
    <div className='main_body_box'>
      <form className="main_form" onSubmit={handleSubmit}>
        <p className= "sign" align="center">
          Sign up
        </p>
      {flashMessage && <div className="flash-message">{flashMessage}</div>}
        <input className= "username" type = "text" placeholder= "Username" value={name} onChange={(e) => setName(e.target.value)} />
        {error.name && <div className="flash-error">{error.name}</div>}
        <input className= "username" type = "text" placeholder= "Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error.email && <div className="flash-error">{error.email}</div>}
        <input className= "password" type = "password" placeholder= "password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error.password && <div className="flash-error">{error.password}</div>}
        <input className= "password" type = "password" placeholder= "password_confirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}/>
        {error.passwordConfirmation && <div className="flash-error">{error.passwordConfirmation}</div>}
        <button type="submit" className="submit">Submit</button>
      </form>
    </div>
  </div>
  );
}

export default Form