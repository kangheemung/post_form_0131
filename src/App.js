import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Post from './posts/Post';
import NewPost from './posts/NewPost';
import Nav from './components/Nav';
import Home from './Home';
import About from './components/About';
//jsmastery.pro/masterclass
// /posts/:postId
// /posts/blog-post-1
// /posts/blog-post-2
// /posts/blog-post-3
const App = () => {
  return (
    <>

      <Router>
      <Nav/>
        <Routes>
          <Route path= '/' element={<Home />}/>
          <Route path= 'api/v1/about' element={<About />}/>
          <Route path= 'api/v1/posts' element={<Post />}/>
          <Route path= 'api/v1/new' element={<NewPost />}/>
          <Route path= 'api/v1/:postId' element={<Post />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
