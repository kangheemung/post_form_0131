import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div >
      <div className='submit_body'>
        <p>
          <Link to="/api/v1/auth">
            <button className='submit'>Login</button>
          </Link>
        </p>
        <p>
          <Link to="/api/v1/users">
            <button className='submit'>signup</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Home
