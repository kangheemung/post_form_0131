// ThemeSwitch.js

import React, { useContext } from 'react';
import { ThemeContext } from '../App'; // Make sure this path matches the location of your App.js file
import ReactSwitch from 'react-switch'; // Ensure ReactSwitch is imported

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Using context to get theme and toggleTheme

  return (
    <div >
      <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
    </div>
  );
};

export default ThemeSwitch;