
import React, { useState } from 'react';
import { smartCropImage } from '../services/geminiService';
import { DownloadIcon } from './Icons';
import LoadingShimmer from './LoadingShimmer';
import { OriginalImage } from '../types';

interface SmartCropEditorProps {
  image: OriginalImage;
  onSave: (imageUrl: string) => void;
}

const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square', description: 'Instagram post' },
  { value: '16:9', label: 'Wide', description: 'YouTube thumbnail' },
  { value: '9:16', label: 'Story', description: 'Instagram/TikTok' },
  { value: '4:3', label: 'Classic', description: 'Standard photo' },
  { value: '21:9', label: 'Cinematic', description: 'Ultra-wide' },
];

const SmartCropEditor: React.FC<SmartCropEditorProps> = ({ image, onSave }) => {
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrop = async () => {
    if (!selectedRatio || isLoading) return;

    setIsLoading(true);
    setError(null);
    setCroppedImage(null);

    try {
      const resultUrl = await smartCropImage(image.base64, image.mimeType, selectedRatio);
      setCroppedImage(resultUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not crop image.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndDownload = () => {
    if (!croppedImage) return;
    onSave(croppedImage);

    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = `PandaStudio_SmartCrop_${selectedRatio.replace(':', 'x')}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Smart Crop</h2>
      <p className="text-sm text-[var(--color-text-secondary)] text-center -mt-2">
        AI-powered cropping for perfect compositions
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

      {/* Aspect Ratio Selection */}
      <div className="w-full space-y-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Choose Aspect Ratio</h3>
        <div className="grid grid-cols-2 gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => setSelectedRatio(ratio.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedRatio === ratio.value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary)]/50'
              }`}
              disabled={isLoading}
            >
              <div className="font-bold text-[var(--color-text-primary)]">{ratio.label}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">{ratio.value}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">{ratio.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleCrop}
        disabled={isLoading}
        className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? 'Cropping...' : 'Smart Crop'}
      </button>

      {/* Result Preview */}
      {(croppedImage || isLoading) && (
        <div className="w-full space-y-2">
          <h3 className="text-xs font-semibold text-[var(--color-text-secondary)]">Cropped Result</h3>
          <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl overflow-hidden relative shadow-lg">
            {isLoading && <LoadingShimmer />}
            {croppedImage && !isLoading && (
              <img src={croppedImage} alt="Cropped" className="w-full h-auto" />
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      {croppedImage && !isLoading && (
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

export default SmartCropEditor;
