import React from 'react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onDarkModeToggle }) => {
  return (
    <div className="dark-mode-toggle">
      <label htmlFor="darkModeToggle">
        <input 
          className='dark-mode-text'
          type="checkbox"
          id="darkModeToggle"
          checked={isDarkMode}
          onChange={onDarkModeToggle}
        />
        Dark Mode
      </label>
    </div>
  );
};

export default DarkModeToggle;