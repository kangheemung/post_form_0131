import React, { useContext } from 'react';
import './Nav.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ThemeContext } from '../App';


const Nav = ({ themeSwitch }) => {
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const isUserLoggedIn = Boolean(currentUser && currentUser.jwtToken);
    const userId = currentUser?.id; // Assuming 'id' exists on currentUser
    //const userName = currentUser?.name || 'Guest'; // Use 'Guest' if no user name
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleSidebarLinkClick = () => {
        // Close the sidebar when a sidebar link is clicked
        closeSidebar();
    };
       //console.log(currentUser);       // Debug current user state
       //console.log(isUserLoggedIn);    // Debug login flag state
       // Define showSidebar function
        const showSidebar = () => {
          const sidebar = document.querySelector(".sidebar");
          sidebar.style.display = 'flex';
          setTimeout(() => {
            sidebar.style.transform = 'translateX(0)';
          });
        };

        const closeSidebar = () => {
          const sidebar = document.querySelector(".sidebar");
          sidebar.style.transform = 'translateX(100%)';
          setTimeout(() => {
            sidebar.style.display = 'none';
          }, 300); // Adjust the timing here if needed
        };
        const handleLogoutClick = async () => {
            await logout();
            // Close the sidebar upon logout
            closeSidebar();
            navigate('/');
        };


        return (
          <header className={theme === 'dark' ? 'dark-mode' : ''}>
              <div className='header_box'>
                  <ul className="navlinks">
                      <li className="navlinks_log">
                        <p>Post_App</p>
                      </li>
                      <div className='navlinks_header'>
                          <ul className='header_center'>
                              {/* Render links based on user login status */}
                              {isUserLoggedIn ? (
                                  <>
                                      {/* Links for logged-in users */}
                                      <div className='header_center_body'>
                                      <li className="items"><Link to="/microposts">FullPost</Link></li>
                                      <li className="items"><Link to={`/users/${userId}`}>mypage</Link></li>
                                      <li className="items"><Link to={`/users/${userId}/micropost`}>NewPost</Link></li>
                                      <li className="items" onClick={handleLogoutClick}>Logout</li>
                                      </div>
                                  </>
                              ) : (
                                  <>
                                    <div className='header_main'>
                                    < div className='header_center_body'>
                                      {/* Links for non-logged-in users */}
                                      <li className="items"><Link to="/">home</Link></li>
                                      <li className="items"><Link to="/about">About</Link></li>
                                      <li className="items"><Link to="/auth">Login</Link></li>
                                      <li className="items"><Link to="/users">Sign_up</Link></li>
                                    </div>
                                    </div>
                                  </>
                              )}
                          </ul>
                      </div>
                      <div className="switch_box">
                                          {themeSwitch}
                      </div>
                      <div className='open_img_box'>
                      <li onClick={showSidebar}>
                          <ion-icon name="menu-outline">
                              <img className="opnen_img" src={process.env.PUBLIC_URL + '/align-justify-svgrepo-com.svg'} />
                          </ion-icon>
                      </li>
                      </div>
                  </ul>
                  <ul className="sidebar">
                      <li onClick={closeSidebar}>
                          <ion-icon name="close-outline">x</ion-icon>
                      </li>
                      {isUserLoggedIn ? (
                          <>
                              <li onClick={handleSidebarLinkClick}><Link to="/microposts" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>FullPost</Link></li>
                              <li onClick={handleSidebarLinkClick}><Link to={`/users/${userId}`} style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>mypage</Link></li>
                              <li onClick={handleSidebarLinkClick}><Link to={`/users/${userId}/micropost`} style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>NewPost</Link></li>
                              <li onClick={handleLogoutClick} style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>Logout</li>
                              <li onClick={handleSidebarLinkClick} className="side_switch_box">
                                  {themeSwitch}
                              </li>
                              <img src={process.env.PUBLIC_URL + '/hand.png'} alt="" className="logo" />
                          </>
                      ) : (
                          <>
                              <li onClick={handleSidebarLinkClick}><Link to="/" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>home</Link></li>
                              <li onClick={handleSidebarLinkClick}><Link to="/about" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>About</Link></li>
                              <li onClick={handleSidebarLinkClick}><Link to="/auth" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>Login</Link></li>
                              <li onClick={handleSidebarLinkClick}><Link to="/users" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>Sign_up</Link></li>
                              <li onClick={handleSidebarLinkClick} className="side_switch_box">
                                  {themeSwitch}
                              </li>
                              <img src={process.env.PUBLIC_URL + '/hand.png'} alt="" className="logo" />
                          </>
                      )}


                  </ul>
              </div>
          </header>
      );
  };

export default Nav;