import React, { useState } from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';

const Nav = () => {
    // If setIsUserLoggedIn won't be used for now but may be used in the future,
    // you can ignore the eslint warning with the following line:
    // eslint-disable-next-line no-unused-vars
    const [ isUserLoggedIn ] = useState(false);

    return (
        <nav>
          <ul className="nav_link">
            <li><Link to='/'><p className="logo_text">Home</p></Link></li>
            <li><Link to='/about'><p className="logo_text">About</p></Link></li>
            <li><Link to='/api/v1/users/:user_id/microposts'><p className="logo_text">Post</p></Link></li>
            <li><Link to='/api/v1/users/:user_id/micropost'><p className="logo_text">NewPost</p></Link></li>
            <li><Link to='/api/v1/users/:user_id/micropost/:id'><p className="logo_text">PostId</p></Link></li>
          </ul>

            {/* Mobile Navigation */}
            {isUserLoggedIn ? (
                <div>
                    <Link to="/create-prompt" className="black_btn">
                        Create Post
                    </Link>
                </div>
            ) : (
                <>
                    {/* Insert Login/Sign up Links here */}
                </>
            )}
        </nav>
    );
};

export default Nav;
