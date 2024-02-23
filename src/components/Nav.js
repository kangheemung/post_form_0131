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
            <li><Link to='/'className = 'header_a'><p>Home</p></Link></li>
            <li><Link to='/about'className = 'header_a'><p>About</p></Link></li>
            <li><Link to='/api/v1/auth'className = 'header_a'><p>Login</p></Link></li>
            <li><Link to='/api/v1/users'className = 'header_a'><p>Sign up</p></Link></li>
            <li><Link to='/api/v1/users/:user_id/microposts'className = 'header_a'><p>Post</p></Link></li>
            <li><Link to='/api/v1/users/:user_id/micropost'className = 'header_a'><p>NewPost</p></Link></li>
             {/*<li><Link to='/api/v1/users/:user_id/micropost/:id'><p>PostId</p></Link></li>*/}
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
