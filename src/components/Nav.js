import React from 'react';
import './Nav.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const Nav = ({ themeSwitch }) => {
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const isUserLoggedIn = Boolean(currentUser && currentUser.jwtToken);
    const userId = currentUser?.id; // Assuming 'id' exists on currentUser
    //const userName = currentUser?.name || 'Guest'; // Use 'Guest' if no user name
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
       <header> 
      
              {/* Always visible links */}
              {isUserLoggedIn ? (
                // Render these links only when the user is logged in
                <>
                  <ul class="navlinks">
                      <div className = "nav_link_text_login">
                        <li className="items"><Link to="/microposts">FullPost</Link></li>
                        <li className="items"><Link to={`/users/${userId}`}>mypage</Link></li>
                        <li className="items"><Link to={`/users/${userId}/micropost`}>NewPost</Link></li>
                        <li className="items" onClick={handleLogoutClick}>Logout</li>
                      </div>
                      <div className="switch_box">
                        {themeSwitch}
                      </div>
                      <li onClick={showSidebar}><ion-icon name="menu-outline"></ion-icon></li>
                  </ul>
                  <ul className="sidebar">
                      <li onClick={closeSidebar}><ion-icon name="close-outline"></ion-icon></li>
                      <li><Link to="/microposts">FullPost</Link></li>
                      <li><Link to={`/users/${userId}`}>mypage</Link></li>
                      <li><Link to={`/users/${userId}/micropost`}>NewPost</Link></li>
                      <li onClick={handleLogoutClick}>Logout</li>
                      <img src={process.env.PUBLIC_URL + '/hand.png'} alt="" className="logo" />
                      <div className="switch_box">
                        {themeSwitch}
                      </div>
                  </ul>
                </>
              ) : (
                // Render these links only when the user is not logged in
               <>
                <ul className="navlinks">
                  <div className="nav_link_text">
                    <li className="items"><Link to="/">home</Link></li>
                    <li className="items"><Link to="/about">About</Link></li>
                    <li className="items"><Link to="/auth">Login</Link></li>
                    <li className="items"><Link to="/users">Sign_up</Link></li>
                    <div className="switch_box">
                    {themeSwitch}
                   </div>
                  </div>
                </ul>
                <ul>
                    <li onClick={showSidebar}>
                        <ion-icon name="menu-outline">アイコン</ion-icon> {/* Icon for opening the sidebar */}
                    </li>
                </ul>
                <ul className="sidebar">
                  <li onClick={closeSidebar}><ion-icon name="close-outline">ｘ</ion-icon></li>
                    <li className="items"><Link to="/">home</Link></li>
                    <li className="items"><Link to="/about">About</Link></li>
                    <li className="items"><Link to="/auth">Login</Link></li>
                    <li className="items"><Link to="/users">Sign_up</Link></li>
                    <li className="items_switch_box">
                    {themeSwitch}
                   </li>
                    <img src={process.env.PUBLIC_URL + '/hand.png'} alt="" ></img>
                </ul>
              </>
              )}
  
       <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
       <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
      </header> 
    );
};

export default Nav;
