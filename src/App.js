import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Post from './posts/Post' ;
import NewPost from './posts/NewPost';
import Home from './Home';
import About from './components/About';
//jsmastery.pro/masterclass
// /posts/:postId
// /posts/blog-post-1
// /posts/blog-post-2
// /posts/blog-post-3
const App = () => {
  return (
      <Router>
        <Routes>
          <Route path= '/' element={<Home />}/>
          <Route path= 'about' element={<About />}/>
          <Route path= 'posts' element={<Post />}/>
          <Route path= 'new' element={<NewPost />}/>
          <Route path= ':postId' element={<Post />}/>
        </Routes>
      </Router>
  );
}

export default App;
