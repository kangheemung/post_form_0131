import React from 'react';
import './Nav.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Nav = ({ themeSwitch }) => {
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const isUserLoggedIn = Boolean(currentUser && currentUser.jwtToken);
    const userId = currentUser?.id; // Assuming 'id' exists on currentUser
    const userName = currentUser?.name || 'Guest'; // Use 'Guest' if no user name
    const handleLogoutClick = async () => {
        await logout(); // Wait for the logout process to finish
        navigate('/'); // Redirect to the home page after logging out
    };
    //console.log(currentUser);       // Debug current user state
    //console.log(isUserLoggedIn);    // Debug login flag state

    return (
        <nav className="navbar_container">
          <div className="nav_and_greeting_container">
          <div className="nav_links_container">
            <ul className="nav_link">
              {/* Always visible links */}
             

              {isUserLoggedIn ? (
                // Render these links only when the user is logged in
                <>
                  <li><Link to="/microposts" className='header_a'><p>FullPost</p></Link></li>
                  <li><Link to={`/users/${userId}`} className='header_a'><p>mypage</p></Link></li>
                  <li><Link to={`/users/${userId}/micropost`} className='header_a'><p>NewPost</p></Link></li>
                  <li><Link  onClick={handleLogoutClick} className='header_a'><p>Logout</p></Link></li><br/>
                </>
              ) : (
                // Render these links only when the user is not logged in
                <>
                 <li><Link to='/' className='header_a'><p>Home</p></Link></li>
                  <li> <Link to='/about' className='header_a'><p>About</p></Link></li>
                  <li><Link to='/auth' className='header_a'><p>Login</p></Link></li>
                  <li><Link to='/users' className='header_a'><p>Sign up</p></Link></li>
                </>
              )}
              <li>{themeSwitch}</li>
            </ul>
          </div>
          </div>
          <div className="greeting_box">
           <p className="greeting">{userName}様こんにちは</p>
          </div>
        </nav>

    );
};

export default Nav;
