import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostsList from './posts/PostsList';
import Page from './posts/Page';
import EditPostComponent from './posts/EditPostComponent';
import Todo from './posts/Todo';
// Removed the unused Post import
import NewPost from './posts/Newpost';
import Nav from './components/Nav';
import Home from './Home';
import About from './components/About';
import './App.css';
// Import ShowPostComponent if it exists
// import ShowPostComponent from 'path-to-ShowPostComponent';

function App() {
  const [todos, setTodos] = useState([]);

  return (
    <div className="app">
      <Router>
        <Nav />
        <div className="todo-list">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route
               path="/api/v1/users/:user_id/microposts"
               element={<PostsList todos={todos} setTodos={setTodos}/>}
            />
            <Route path='/api/v1/users/:user_id/micropost' element={<NewPost todos={todos} setTodos={setTodos} />} />
            {/* Make sure to define ShowPostComponent or remove this line if it's not needed */}
            <Route path="/api/v1/users/:user_id/microposts/:id" element={<Page />} />
            <Route path="/api/v1/users/:user_id/micropost/:id" element={<EditPostComponent />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
