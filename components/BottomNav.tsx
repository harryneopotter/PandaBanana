
import React from 'react';
import { Screen } from '../types';
import { HomeIcon, SaveIcon, SettingsIcon, PaintBrushIcon } from './Icons';

interface BottomNavProps {
  activeScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setScreen }) => {
  const navItems = [
    { screen: Screen.Home, label: 'Home', icon: HomeIcon },
    { screen: Screen.Dream, label: 'Dream', icon: PaintBrushIcon },
    { screen: Screen.Saved, label: 'Saved', icon: SaveIcon },
    { screen: Screen.Settings, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav 
      className="w-full h-16 border-t border-[var(--color-border)] flex justify-around items-center shadow-lg flex-shrink-0"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        backgroundImage: 'var(--bg-secondary-image)',
      }}
    >
      {navItems.map(({ screen, label, icon: Icon }) => {
        const isActive = activeScreen === screen;
        return (
          <button
            key={screen}
            onClick={() => setScreen(screen)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className={`text-xs font-semibold ${isActive ? 'font-bold' : ''}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;