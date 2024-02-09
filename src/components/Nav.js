import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
    // If setIsUserLoggedIn won't be used for now but may be used in the future,
    // you can ignore the eslint warning with the following line:
    // eslint-disable-next-line no-unused-vars
    const [ isUserLoggedIn ] = useState(false);

    return (
        <nav>
            <Link to='/'>
              <p className="logo_text">Home</p>
            </Link>
            <Link to='api/v1/about'>
              <p className="logo_text">About</p>
            </Link>
            <Link to='api/v1/posts'>
              <p className="logo_text">Post</p>
            </Link>
            <Link to='api/v1/new'>
              <p className="logo_text">NewPost</p>
            </Link>
            <Link to='api/v1/:postId'>
              <p className="logo_text">PostId</p>
            </Link>

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
