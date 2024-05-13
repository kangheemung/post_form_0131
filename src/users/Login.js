import { useState ,useEffect} from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [flashMessage, setFlashMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateFields = () => {
    let isValid = true;
    if (!email) {
      setErrors(prevErrors => ({ ...prevErrors, email: "Email is required." }));
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      setErrors(prevErrors => ({ ...prevErrors, email: "Please enter a valid email address." }));
      isValid = false;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, email: '' })); // Clear error
    }

    if (!password) {
      setErrors(prevErrors => ({ ...prevErrors, password: "Password is required." }));
      isValid = false;
    } else if (password.length < 8) {
      setErrors(prevErrors => ({ ...prevErrors, password: "Password must be at least 8 characters long." }));
      isValid = false;
    } else {
      setErrors(prevErrors => ({ ...prevErrors, password: '' })); // Clear error
    }
    if (!email || !password) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: !email ? "Email is required." : "",
        password: !password ? "Password is required." : ""
    }));
    isValid = false;
    }
    return isValid;
  };
  useEffect(() => {
    let timer;
    if (flashMessage) {
        timer = setTimeout(() => {
            setFlashMessage(''); // Clear the flash message after 3000ms (3 seconds)
        }, 2000);
    }
    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts or flashMessage changes
}, [flashMessage]);

  async function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission
    setErrors({ email: '', password: '' });
    setFlashMessage('');


    if (!validateFields()) {
      return;
    }
    const payload = {
      email: email,
      password: password
    };

    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {

        const decodedToken = jwtDecode(data.data.token); // Use the token from data.data
        const userId = decodedToken.user_id;
        localStorage.setItem('token', data.data.token); // Adjusted for nested data structure
        //alert('Login successful!');

        if (userId) {
          login(data.data.token, userId);
          setFlashMessage('Login出来ました!');
          setTimeout(() => {
            navigate(`/users/${userId}`); // Navigate after the timeout
          }, 2000)
        } else {
          console.errors('User ID is undefined.');
          setFlashMessage('This is an ID that is not registered as a member.');
        }
      } else {
          if (data.error === 'UserNotFound') {
              setErrors(prevErrors => ({ ...prevErrors, email: "User not found. Please check your email." }));
              setFlashMessage('User not found. Please check your email.');
            } else {
              setErrors(prevErrors => ({ ...prevErrors, email: data.message }));
              setFlashMessage("Please check your email or password.");
          }
      }
    } catch (error) {
      console.error('There was an error!', error); // Corrected from console.errors to console.error
      setFlashMessage('This ID is not registered as a member.'); // Set a flash message for login failure
      if (error.message === 'UserNotFound') {
          setErrors(prevErrors => ({ ...prevErrors, email: "User not found. Please check your email." }));
          setFlashMessage('User not found. Please check your email.');
      } else {
          console.error('Failed to login:', error);
          setErrors(prevErrors => ({ ...prevErrors, email: error.message }));
          setFlashMessage('User not found. Please check your email.');
      }
    }
}
  return (
    <div className='main_body'>
    <div className="main_body_box">
      <form className="main_form" onSubmit={handleSubmit}>
      <p className="sign" align="center">
        Login
      </p>
      {flashMessage && <div className="flash-message">{flashMessage}</div>}
        <input
          className="username"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <div className="flash-error">{errors.email}</div>}
        <input
          className="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <div className="flash-error">{errors.password}</div>}
        {/*<p className="login-link" align="center">Forgot Password?</p>*/}
        <button className="submit" align="center" type="submit">Login</button>
      </form>
    </div>
  </div>
  );
}

export default Login;
