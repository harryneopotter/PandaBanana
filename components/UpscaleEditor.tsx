
import React, { useState } from 'react';
import { upscaleImage } from '../services/geminiService';
import { DownloadIcon } from './Icons';
import LoadingShimmer from './LoadingShimmer';
import { OriginalImage } from '../types';

interface UpscaleEditorProps {
  image: OriginalImage;
  onSave: (imageUrl: string) => void;
}

const UpscaleEditor: React.FC<UpscaleEditorProps> = ({ image, onSave }) => {
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleUpscale = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setUpscaledImage(null);

    try {
      const resultUrl = await upscaleImage(image.base64, image.mimeType);
      setUpscaledImage(resultUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not upscale image.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndDownload = () => {
    if (!upscaledImage) return;
    onSave(upscaledImage);

    const link = document.createElement('a');
    link.href = upscaledImage;
    link.download = `PandaStudio_Upscaled_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Image Upscaler</h2>
      <p className="text-sm text-[var(--color-text-secondary)] text-center -mt-2">
        Enhance resolution and quality with AI
      </p>

      {/* Feature Highlights */}
      <div className="w-full grid grid-cols-3 gap-2 p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
        <div className="text-center">
          <div className="text-2xl mb-1">✨</div>
          <div className="text-xs text-[var(--color-text-secondary)]">Sharper Details</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xs text-[var(--color-text-secondary)]">Noise Reduction</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🔍</div>
          <div className="text-xs text-[var(--color-text-secondary)]">Enhanced Clarity</div>
        </div>
      </div>

      {/* Original Image Preview */}
      <div className="w-full">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Original</h3>
        <img 
          src={image.dataUrl} 
          alt="Original" 
          className="w-full rounded-xl shadow-md" 
        />
      </div>

      {/* Upscale Button */}
      <button
        onClick={handleUpscale}
        disabled={isLoading}
        className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? 'Upscaling...' : '⬆️ Upscale & Enhance'}
      </button>

      {/* Result Preview */}
      {(upscaledImage || isLoading) && (
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[var(--color-text-secondary)]">Enhanced Result</h3>
            {upscaledImage && !isLoading && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                {showComparison ? 'Hide Original' : 'Compare'}
              </button>
            )}
          </div>
          <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl overflow-hidden relative shadow-lg">
            {isLoading && <LoadingShimmer />}
            {upscaledImage && !isLoading && (
              <>
                <img src={upscaledImage} alt="Upscaled" className="w-full h-auto" />
                {showComparison && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div>
                        <div className="text-xs text-white mb-1 text-center">Before</div>
                        <img src={image.dataUrl} alt="Before" className="w-full rounded" />
                      </div>
                      <div>
                        <div className="text-xs text-white mb-1 text-center">After</div>
                        <img src={upscaledImage} alt="After" className="w-full rounded" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      {upscaledImage && !isLoading && (
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

      {/* Info Message */}
      {!upscaledImage && !isLoading && !error && (
        <div className="w-full p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg text-center text-sm text-[var(--color-text-secondary)]">
          💡 AI will analyze and enhance your image with improved sharpness, detail, and clarity.
        </div>
      )}
    </div>
  );
};

export default UpscaleEditor;
