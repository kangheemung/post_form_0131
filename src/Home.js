import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <div className="home_body">
        <div className="top_main">
          <div className='large-button_1'>
              <Link to="/auth" >Login</Link>
          </div>
          <div>
            <img className="top_img" src={process.env.PUBLIC_URL + '/hand.png'} alt="Description" />
          </div>
          <div className="btn">
            <Link to="/users" >Signup</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
