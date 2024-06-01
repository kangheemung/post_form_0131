import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostsList from './users/PostsList';

import Bottom from './components/Bottom';
import NewPost from './posts/Newpost';
import Nav from './components/Nav';
import Home from './Home';
import About from './components/About';
import './App.css';
import Login from './users/Login';
import Form from './users/Form';
import { AuthProvider} from './components/AuthContext';
import ThemeSwitch from './components/ThemeSwitch';
import Fullposts from './posts/Fullposts';
import MicropostDetailPage from './posts/MicropostDetailPage';
export const ThemeContext = createContext(null);


function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const body = document.body;
    setTheme((current) => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      body.classList.remove(`${current}-mode`);
      body.classList.add(`${newTheme}-mode`);
      return newTheme;
    });
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
            <Route path="/users/:id" element={<PostsList />} />
            <Route path="/microposts" element={<Fullposts />} />
            <Route path="/users/:user_id/micropost" element={<NewPost />} />
            <Route path="/microposts/:id" element={<MicropostDetailPage />} />
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