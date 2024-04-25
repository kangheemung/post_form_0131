import React from 'react'
import { Link } from 'react-router-dom';



function Home() {
  return (
      <div >
        <div className ="top_main">
        <p>
          <Link to="/auth">
            <button className='submit'>Login</button>
          </Link>
        </p>
        <p>
          <Link to="/users">
            <button className='submit'>signup</button>
          </Link>
        </p>
        </div>
        <img className='top' src={process.env.PUBLIC_URL + '/hand.png'} alt="Description" />
      </div>
  );
}

export default Home
