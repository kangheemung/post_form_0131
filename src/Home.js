import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
function Home() {
  return (
    <div className='home_kao'>
      <div className="home_body">
        <div className="top_main">
          <div>
              <Link to="/auth" className='large-button_1'>Login</Link>
          </div>
          <div className="animated-img-container">
            <img className="top_img" src={process.env.PUBLIC_URL + '/hand.png'} alt="Description" />
          </div>
          <div>
            <Link to="/users" className="btn">Signup</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
