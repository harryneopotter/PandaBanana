
import React from 'react';
import { Scene } from '../types';
import { SCENE_OPTIONS } from '../constants';
import LoadingShimmer from './LoadingShimmer';
import { DownloadIcon, UndoIcon, RedoIcon } from './Icons';

interface SceneShiftEditorProps {
  originalImageUrl: string;
  generatedImageUrl: string | null;
  onSceneChange: (scene: Scene) => void;
  isLoading: boolean;
  selectedScene: Scene | null;
  onSave: (imageUrl: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const SceneShiftEditor: React.FC<SceneShiftEditorProps> = ({
  originalImageUrl,
  generatedImageUrl,
  onSceneChange,
  isLoading,
  selectedScene,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const imageUrl = generatedImageUrl || originalImageUrl;

  const handleSaveAndDownload = () => {
    if (!generatedImageUrl) return;
    onSave(generatedImageUrl);

    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `BananaStudio_SceneShift_${selectedScene?.replace(' ', '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Image Preview */}
      <div className="w-full aspect-[9/16] max-w-[300px] bg-black rounded-2xl overflow-hidden relative shadow-lg shadow-[var(--color-bg-primary)]/50">
        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        {isLoading && <LoadingShimmer />}
      </div>
      
      {/* Horizontal Scene Selector */}
      <div className="w-full max-w-[320px]">
        <div className="flex space-x-3 overflow-x-auto py-2 px-2 hide-scrollbar">
          {SCENE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSceneChange(option.value)}
              className={`flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center rounded-xl text-xs transition-all duration-200 text-[var(--color-text-primary)] ${
                selectedScene === option.value
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] scale-105 shadow-lg shadow-[var(--color-primary)]/30'
                  : 'bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)]'
              }`}
              title={option.label}
              disabled={isLoading}
            >
              <span className="text-3xl mb-1">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-center items-center space-x-4 pt-2">
        <button onClick={onUndo} disabled={!canUndo || isLoading} className="p-3 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-full font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Undo">
            <UndoIcon className="w-6 h-6" />
        </button>
        <button onClick={handleSaveAndDownload} disabled={!generatedImageUrl || isLoading} className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] rounded-full font-bold transition-colors disabled:opacity-50 disabled:bg-[var(--color-border)] disabled:cursor-not-allowed">
          <DownloadIcon className="w-5 h-5" />
          <span>Save & Download</span>
        </button>
        <button onClick={onRedo} disabled={!canRedo || isLoading} className="p-3 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-full font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Redo">
            <RedoIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SceneShiftEditor;
