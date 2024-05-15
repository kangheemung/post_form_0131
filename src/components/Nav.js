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

    const handleLogoutClick = async () => {
        await logout(); // Wait for the logout process to finish
        navigate('/'); // Redirect to the home page after logging out
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



    return (
      <header className={theme === 'dark' ? 'dark-mode' : ''}>
              {/* Always visible links */}
              {isUserLoggedIn ? (
                // Render these links only when the user is logged in
                <div className='header_box'>
                <ul className="navlinks">
                  <div className="nav_link_text">
                      <li className="navlinks_log">
                        <p>Post_App</p>
                      </li>
                        <li className="items"><Link to="/microposts">FullPost</Link></li>
                        <li className="items"><Link to={`/users/${userId}`}>mypage</Link></li>
                        <li className="items"><Link to={`/users/${userId}/micropost`}>NewPost</Link></li>
                        <li className="items" onClick={handleLogoutClick}>Logout</li>
                        <div className="items_switch">
                          {themeSwitch}
                        </div>
                        <ul className='open_img_box'>
                          <li onClick={showSidebar}>
                              <ion-icon name="menu-outline">
                                  <img className="opnen_img" src={process.env.PUBLIC_URL + '/align-justify-svgrepo-com.svg'} />
                              </ion-icon>
                          </li>
                       </ul>
                  </div>
                </ul>
                  <ul className="sidebar">
                      <li onClick={closeSidebar}><ion-icon name="close-outline">x</ion-icon></li>
                      <li><Link to="/microposts"  style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>FullPost</Link></li>
                      <li><Link to={`/users/${userId}`}   style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>mypage</Link></li>
                      <li><Link to={`/users/${userId}/micropost`}   style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>NewPost</Link></li>
                      <li onClick={handleLogoutClick}   style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>Logout</li>
                      <li className="items_switch_box">
                        {themeSwitch}
                       </li>
                      <img src={process.env.PUBLIC_URL + '/hand.png'} alt="" className="logo" />
                  </ul>
                </div>
              ) : (
                // Render these links only when the user is not logged in
               <div className='header_box'>
                <ul className="navlinks">
                  <div className="nav_link_text">
                    <li className="navlinks_log">
                      <h1>Post_App</h1>
                    </li>
                    <li className="items"><Link to="/">home</Link></li>
                    <li className="items"><Link to="/about">About</Link></li>
                    <li className="items"><Link to="/auth">Login</Link></li>
                    <li className="items"><Link to="/users">Sign_up</Link></li>
                    <div className="items_switch">
                    {themeSwitch}
                   </div>
                   <ul className='open_img_box'>
                    <li onClick={showSidebar}>
                        <ion-icon name="menu-outline">
                            <img className="opnen_img" src={process.env.PUBLIC_URL + '/align-justify-svgrepo-com.svg'} />
                        </ion-icon>
                    </li>
                   </ul>
                  </div>
                </ul>
                <ul className="sidebar">
                  <li onClick={closeSidebar}><ion-icon name="close-outline">ｘ</ion-icon></li>
                  <li className="items"><Link to="/" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>home</Link></li>
                    <li className="items"><Link to="/about" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>About</Link></li>
                    <li className="items"><Link to="/auth" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>Login</Link></li>
                    <li className="items"><Link to="/users" style={{ color: theme === 'dark' ? '#004A54' : 'white' }}>Sign_up</Link></li>
                    <li className="items_switch_box">
                    {themeSwitch}
                   </li>
                    <img className='logo' src={process.env.PUBLIC_URL + '/hand.png'} alt="" ></img>
                </ul>
              </div>
              )}
  
       <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
       <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
      </header> 
    );
};

export default Nav;