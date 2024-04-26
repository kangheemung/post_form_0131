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
      <div>
        <nav className="navbar_container">
              {/* Always visible links */}
          <div className="nav_links_container">
              {isUserLoggedIn ? (
                // Render these links only when the user is logged in
                <div className = "nav_link_text">
                  <p><Link to="/microposts" className='header_a'><p>FullPost</p></Link></p>
                  <p><Link to={`/users/${userId}`} className='header_a'><p>mypage</p></Link></p>
                  <p><Link to={`/users/${userId}/micropost`} className='header_a'><p>NewPost</p></Link></p>
                  <p><Link  onClick={handleLogoutClick} className='header_a'><p>Logout</p></Link></p><br/>
                </div>
              ) : (
                // Render these links only when the user is not logged in
                <div className="nav_link_text">
                  <p><Link to='/' className='header_a'>home</Link></p>
                  <p><Link to='/about' className='header_a'>About</Link></p>
                  <p><Link to='/auth' className='header_a'>Login</Link></p>
                  <p><Link to='/users' className='header_a'>Sign_up</Link></p>
                </div>
              )}
               <div className="switch_box">
                 {themeSwitch}
               </div>
          </div>
          <div className="greeting_box">
          <p className="greeting">{userName}様こんにちは</p>
          </div>
       </nav>
     </div>
    );
};

export default Nav;
