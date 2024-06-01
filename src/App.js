import React, { useState } from 'react';
import { BrowserRouter as Router,Routes, Route ,Navigate} from 'react-router-dom'; // Import BrowserRouter and Navigate
import PostsList from './users/PostsList';
import Bottom from './components/Bottom';
import EditPostComponent from './posts/EditPostComponent';
import NewPost from './posts/Newpost';
import Nav from './components/Nav';
import Home from './Home';
import About from './components/About';
import './App.css';
import Login from './users/Login';
import Form from './users/Form';
import MicropostDetailPage from './posts/MicropostDetailPage';
import { AuthProvider, useAuth } from './components/AuthContext';
import ThemeSwitch from './components/ThemeSwitch';
import Fullposts from './posts/Fullposts';

export const ThemeContext = React.createContext(null);

function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState('light');
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  const toggleTheme = () => {
    const body = document.body;
    setTheme((current) => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      body.classList.remove(`${current}-mode`);
      body.classList.add(`${newTheme}-mode`);
      return newTheme;
    });
  };
  function privateRoutes() {
    return (
      <>
        <Route path='/microposts/*'>
          <Fullposts />
          <Route path=':id' element={<MicropostDetailPage />} />
        </Route>
        <Route path='/users/*'>
         <Route path=':user_id/micropost' element={<NewPost todos={todos} setTodos={setTodos} />} />
         <Route path=':user_id' element={<PostsList />} />
          <Route path=':user_id/micropost/:id' element={<EditPostComponent />} />
        </Route>
      </>
    );
  }

  return (
  <Router>
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
          <div className='App' id={theme}>
            <Nav themeSwitch={<ThemeSwitch className='switch' />} />
            <div className='container_box'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/auth' element={<Login />} />
              <Route path='/users' element={<Form />} />
              {currentUser ? (
                  privateRoutes()
                ) : (
                  <Navigate to="/auth" replace={true} />
                )}
            </Routes>
            </div>
          <Bottom/>
        </div>
      </AuthProvider>
    </ThemeContext.Provider>
  </Router>
  );
}

export default App;