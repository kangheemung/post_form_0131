// Other imports...
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Adjust the following import paths according to your file structure
// If the files have `.jsx` extension
import PostsList from './posts/PostsList';
import Post from './posts/Post';
import NewPost from './posts/NewPost';
// Corrected name based on provided code
import Nav from './components/Nav';
import Home from './Home';
import About from './components/About';

function App() {
  const [todos, setTodos] = useState([]);

  return (
    <div className="app">
      <Router>
        <Nav/>
        <div className="todo-list">
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/api/v1/about' element={<About />}/>
            <Route path='/api/v1/posts' element={<PostsList todos = {todos} setTodos = {setTodos} />}/>
            <Route path='/api/v1/new' element={<NewPost todos = {todos} setTodos = {setTodos} />}/>
            <Route path='/api/v1/posts/:postId' element={<Post todos= {todos} />}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
