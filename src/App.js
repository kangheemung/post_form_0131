import React, { createContext,useState,useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import PostsList from './users/PostsList';
import Page from './posts/Page';
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
import { AuthProvider } from './components/AuthContext';
import ThemeSwitch from './components/ThemeSwitch';
import { useAuth } from './components/AuthContext';
import Fullposts from './posts/Fullposts';
// Import ShowPostComponent if it exists
// import ShowPostComponent from 'path-to-ShowPostComponent';
export const ThemeContext = createContext(null);

function App() {
  const auth = useAuth();
  const [redirectPath, setRedirectPath] = useState(null);
  const [todos, setTodos] = useState([]);
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

  useEffect(() => {
    if (auth === null) {
      // Handle the case where useAuth() returns null by setting the redirect path to '/auth'
      setRedirectPath('/auth');
    }
  }, [auth]);



  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
      <Router>
        <div className='App' id={theme}>
          <Nav themeSwitch={<ThemeSwitch className='switch'/>} />
          <div className='container_box'>
            <Routes>
            {redirectPath && <Route path="*" element={<Navigate to={redirectPath} />} />}

              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/auth' element={<Login />} />
              <Route path='/users' element={<Form />} />
              <Route path="/micropost/:id" element={<MicropostDetailPage />} />
              <Route path='/microposts' element={<Fullposts/>}/>
              <Route path='/users/:user_id/micropost' element={<NewPost todos={todos} setTodos={setTodos} />} />
              {/* Make sure to define ShowPostComponent or remove this line if it's not needed */}
              <Route path='/users/:user_id/microposts/:id' element={<Page />} />
              <Route path='/users/:user_id/micropost/:id' element={<EditPostComponent />} />
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