import React, { createContext, useState} from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import PostsList from './users/PostsList';
import Bottom from './components/Bottom';
import NewPost from './posts/Newpost';
import Nav from './components/Nav';
import Home from './Home';
import About from './components/About';
import './App.css';
import Login from './users/Login';
import Form from './users/Form';
import { useAuth,AuthProvider} from './components/AuthContext';
import ThemeSwitch from './components/ThemeSwitch';
import Fullposts from './posts/Fullposts';
import MicropostDetailPage from './posts/MicropostDetailPage';

export const ThemeContext = createContext(null);


function App() {
  const [theme, setTheme] = useState('light');
  const authContext = useAuth();
  
  const toggleTheme = () => {
    const body = document.body;
    setTheme((current) => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      body.classList.remove(`${current}-mode`);
      body.classList.add(`${newTheme}-mode`);
      return newTheme;
    });
  };

  const handleUserAccess = (event) => {
    const { user } = authContext; // Assume user object contains user information
    const urlUserId = event.params.user_id;

    if (user.id.toString() !== urlUserId) {
      alert('You are not authorized to access this page');
      return <Navigate to="/" />;
    }

    return null;
  };


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
      <Router>
        <div className='App' id={theme}>
          <Nav themeSwitch={<ThemeSwitch className='switch'/>} />
          <div className='container_box'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/users" element={<Form />} />
            <Route path="/*" element={<Login />} />
            <Route path="/microposts" element={<Fullposts />} />
            <Route path="/microposts/:id" element={<MicropostDetailPage />} />
            <Route path="/users/:id" element={<PostsList />} redirectTo="/auth" />
            <Route path="/users/:user_id/micropost" element={<NewPost />} redirectTo="/auth" />
          </Routes>

          </div>
          <Bottom/>
        </div>
      </Router>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

export default App;