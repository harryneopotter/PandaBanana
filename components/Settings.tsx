import React from 'react';
import { TrashIcon } from './Icons';
import { THEMES } from '../themes';
import { ThemeName } from '../types';

interface SettingsProps {
  onClearSavedImages: () => void;
  activeTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClearSavedImages, activeTheme, onThemeChange }) => {
  return (
    <div className="w-full p-4 text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
      
      <div className="space-y-6">
        {/* Appearance Section */}
        <div>
          <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Appearance</h2>
          <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-2 space-y-2">
            <p className="text-sm text-[var(--color-text-secondary)] px-2">Choose a color theme for the app.</p>
            <div className="grid grid-cols-3 gap-2">
                {(Object.keys(THEMES) as ThemeName[]).map((themeKey) => {
                    const theme = THEMES[themeKey];
                    const isActive = activeTheme === themeKey;
                    return (
                        <button
                            key={themeKey}
                            onClick={() => onThemeChange(themeKey)}
                            className={`w-full text-center p-2 rounded-md transition-all ${
                                isActive ? 'bg-[var(--color-border)] ring-2 ring-[var(--color-primary)]' : 'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)]'
                            }`}
                        >
                            <div className="flex justify-center space-x-1 mb-1">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors['--color-primary'] }}></div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors['--color-secondary'] }}></div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors['--color-tertiary'] }}></div>
                            </div>
                            <span className="text-xs font-medium text-[var(--color-text-primary)]">{theme.name}</span>
                        </button>
                    );
                })}
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div>
          <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Data Management</h2>
          <div className="bg-[var(--color-bg-tertiary)] rounded-lg">
            <button 
              onClick={onClearSavedImages}
              className="w-full flex justify-between items-center p-4 text-[var(--color-danger)] hover:bg-[var(--color-danger-hover-bg)] transition-colors rounded-lg"
            >
              <span className="font-medium">Clear All Saved Images</span>
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
           <p className="text-xs text-[var(--color-text-secondary)] mt-2 px-2">This will permanently delete all your saved creations from this device.</p>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">About</h2>
          <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4 text-[var(--color-text-secondary)]">
            <div className="flex justify-between items-center">
              <span>App Version</span>
              <span className="font-mono text-[var(--color-text-primary)]">1.0.0</span>
            </div>
             <div className="border-b border-[var(--color-border)] my-3"></div>
            <p className="text-sm">
              Powered by <span className="font-bold text-[var(--color-primary)]">Gemini</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
