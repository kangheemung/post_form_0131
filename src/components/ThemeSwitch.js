// ThemeSwitch.js

import  {  useContext, useEffect} from 'react';
import { ThemeContext } from '../App'; // Make sure this path matches the location of your App.js file
import ReactSwitch from 'react-switch'; // Ensure ReactSwitch is imported

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Using context to get theme and toggleTheme
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (theme === 'dark') {
      bodyClass.add('dark-mode');
    } else {
      bodyClass.remove('dark-mode');
    }
  }, [theme]);

  return (
    <div className='darkmode_box'>
    <label>
      <p><span>{theme === 'dark' ? 'Dark ' : 'Light'}</span></p>
      <p><ReactSwitch onChange={toggleTheme} checked={theme === 'dark'} /></p>
    </label>
    </div>
  );
};

export default ThemeSwitch;