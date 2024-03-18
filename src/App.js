import React, { createContext,useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostsList from './users/PostsList';
import Page from './posts/Page';
import EditPostComponent from './posts/EditPostComponent';
import Todo from './posts/Todo';
// Removed the unused Post import
import NewPost from './posts/Newpost';
import Nav from './components/Nav';
import Home from './Home';
import About from './components/About';
import './App.css';
import jwtDecode from 'jwt-decode';
import Login from './users/Login';
import Form from './users/Form';
import { AuthProvider } from './components/AuthContext';
import ThemeSwitch from './components/ThemeSwitch';

import Fullposts from './posts/Fullposts';
// Import ShowPostComponent if it exists
// import ShowPostComponent from 'path-to-ShowPostComponent';
export const ThemeContext = createContext(null);

function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
      <Router>
      <div className={`app ${theme === 'dark' ? 'dark-mode' : ''}`} id={theme}>
        <div className='content-below-header'>
        <Nav className='header' themeSwitch={<ThemeSwitch className='switch'/>} />
        </div>
  
       
          <Routes className='contain_main'>
            {/*<Route path='/' element={<Home />} />*/}
            <Route path='/about' element={<About />} />
            <Route path='/auth' element={<Login />} />
            <Route path='/users' element={<Form />} />
            <Route
               path='/users/:id'
               element={<PostsList todos={todos} setTodos={setTodos}/>}
            />
            <Route path='/microposts' element={<Fullposts/>}/>
            <Route path='/users/:user_id/micropost' element={<NewPost todos={todos} setTodos={setTodos} />} />
            {/* Make sure to define ShowPostComponent or remove this line if it's not needed */}
            <Route path='/users/:user_id/microposts/:id' element={<Page />} />
            <Route path='/users/:user_id/micropost/:id' element={<EditPostComponent />} />
          </Routes>
      </div>
      </Router>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

export default App;
