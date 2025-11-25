
import React from 'react';
import { BackIcon } from './Icons';

interface HeaderProps {
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header 
      className="relative w-full p-4 flex items-center justify-center border-b border-[var(--color-border)] shadow-md flex-shrink-0"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        backgroundImage: 'var(--bg-secondary-image)',
      }}
    >
      {onBack && (
        <button onClick={onBack} className="absolute left-4 p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" aria-label="Go back">
          <BackIcon className="w-6 h-6" />
        </button>
      )}
      <div className="flex items-center gap-2">
        <img src="/assets/bananapandalogo.png" alt="Banana Panda Logo" className="h-8" />
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-hover)]">
          Banana Panda
        </h1>
      </div>
    </header>
  );
};

export default Header;