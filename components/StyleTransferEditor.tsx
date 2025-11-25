
import React, { useState } from 'react';
import { applyStyleTransfer } from '../services/geminiService';
import { DownloadIcon } from './Icons';
import LoadingShimmer from './LoadingShimmer';
import { OriginalImage, StylePreset } from '../types';

interface StyleTransferEditorProps {
  image: OriginalImage;
  onSave: (imageUrl: string) => void;
}

const STYLE_OPTIONS = [
  { value: StylePreset.VanGogh, emoji: '🌻', description: 'Swirling brushstrokes' },
  { value: StylePreset.Picasso, emoji: '🎨', description: 'Cubist abstraction' },
  { value: StylePreset.Monet, emoji: '🌸', description: 'Impressionist beauty' },
  { value: StylePreset.Dali, emoji: '⏰', description: 'Surrealist dreams' },
  { value: StylePreset.Warhol, emoji: '🎭', description: 'Pop art vibrancy' },
  { value: StylePreset.Anime, emoji: '⚡', description: 'Japanese animation' },
  { value: StylePreset.Watercolor, emoji: '💧', description: 'Soft watercolor' },
  { value: StylePreset.OilPainting, emoji: '🖌️', description: 'Classic oil painting' },
  { value: StylePreset.Cyberpunk, emoji: '🌃', description: 'Neon futuristic' },
  { value: StylePreset.PixelArt, emoji: '👾', description: '8-bit retro gaming' },
];

const StyleTransferEditor: React.FC<StyleTransferEditorProps> = ({ image, onSave }) => {
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [styledImage, setStyledImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyStyle = async () => {
    if (!selectedStyle || isLoading) return;

    setIsLoading(true);
    setError(null);
    setStyledImage(null);

    try {
      const resultUrl = await applyStyleTransfer(image.base64, image.mimeType, selectedStyle);
      setStyledImage(resultUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not apply style.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndDownload = () => {
    if (!styledImage) return;
    onSave(styledImage);

    const link = document.createElement('a');
    link.href = styledImage;
    link.download = `PandaStudio_Style_${selectedStyle?.replace(/\s+/g, '')}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Style Transfer</h2>
      <p className="text-sm text-[var(--color-text-secondary)] text-center -mt-2">
        Transform your photos into masterpieces
      </p>

      {/* Original Image Preview */}
      <div className="w-full">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Original</h3>
        <img 
          src={image.dataUrl} 
          alt="Original" 
          className="w-full rounded-xl shadow-md" 
        />
      </div>

      {/* Style Selection */}
      <div className="w-full space-y-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Choose Art Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedStyle === style.value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary)]/50'
              }`}
              disabled={isLoading}
            >
              <div className="text-2xl mb-1">{style.emoji}</div>
              <div className="font-bold text-sm text-[var(--color-text-primary)]">{style.value}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyStyle}
        disabled={!selectedStyle || isLoading}
        className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? 'Applying Style...' : 'Apply Style'}
      </button>

      {/* Result Preview */}
      {(styledImage || isLoading) && (
        <div className="w-full space-y-2">
          <h3 className="text-xs font-semibold text-[var(--color-text-secondary)]">Styled Result</h3>
          <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl overflow-hidden relative shadow-lg">
            {isLoading && <LoadingShimmer />}
            {styledImage && !isLoading && (
              <img src={styledImage} alt="Styled" className="w-full h-auto" />
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      {styledImage && !isLoading && (
        <button
          onClick={handleSaveAndDownload}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-secondary-text)] font-bold rounded-full transition-all transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Save & Download</span>
        </button>
      )}

      {/* Error Display */}
      {error && (
        <div className="w-full p-3 bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/50 rounded-lg text-center text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default StyleTransferEditor;
