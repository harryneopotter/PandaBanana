import React, { useState } from 'react';
import { generateImageFromPrompt } from '../services/geminiService';
import { DownloadIcon, DreamEmptyStateIcon } from './Icons';
import LoadingShimmer from './LoadingShimmer';

interface DreamCanvasProps {
  onSave: (imageUrl: string) => void;
}

type AspectRatio = '1:1' | '9:16' | '16:9';

const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: 'Square' },
    { value: '9:16', label: 'Story' },
    { value: '16:9', label: 'Wide' },
];

const EXAMPLE_PROMPTS = [
    "A cute panda mascot wearing futuristic cybernetic glasses, sitting in front of a glowing neural network, digital art",
    "A neon-lit cyberpunk cityscape at night, with flying cars and holographic ads, cinematic",
    "A cozy, cluttered artist's studio filled with plants and sunlight, impressionist painting",
    "A cute, fluffy red panda wearing a tiny astronaut helmet, digital art",
];

const DreamCanvas: React.FC<DreamCanvasProps> = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultUrl = await generateImageFromPrompt(prompt, aspectRatio);
      setGeneratedImage(resultUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not generate image.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndDownload = () => {
    if (!generatedImage) return;
    onSave(generatedImage);

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `BananaStudio_Dream_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1': return 'aspect-square';
      case '9:16': return 'aspect-[9/16]';
      case '16:9': return 'aspect-[16/9]';
      default: return 'aspect-square';
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Dream Canvas</h1>
      <p className="text-[var(--color-text-secondary)] -mt-2 text-center">Turn your words into art with Gemini.</p>
      
      {/* Image Preview or Empty State */}
      <div className={`w-full max-w-[320px] bg-[var(--color-bg-tertiary)] rounded-2xl overflow-hidden relative shadow-lg shadow-[var(--color-bg-primary)]/50 flex items-center justify-center transition-all duration-300 ${getAspectRatioClass()}`}>
        {isLoading && <LoadingShimmer />}
        {generatedImage && !isLoading && <img src={generatedImage} alt="Generated art" className="w-full h-full object-cover" />}
        {!generatedImage && !isLoading && (
            <div className="text-center p-4 text-[var(--color-text-secondary)]">
                <DreamEmptyStateIcon className="w-24 h-24 mx-auto mb-2" />
                <p className="text-sm">Your creation will appear here.</p>
            </div>
        )}
      </div>

      {/* Prompt Input */}
      <div className="w-full space-y-2">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your vision..."
          className="w-full p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] h-24 resize-none"
          disabled={isLoading}
        />
        {/* Example Prompts */}
        <div className="flex flex-wrap gap-1">
            {EXAMPLE_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => setPrompt(p)} disabled={isLoading} className="text-xs px-2 py-1 bg-[var(--color-bg-tertiary)]/70 hover:bg-[var(--color-border)] rounded-md transition-colors disabled:opacity-50">
                    "{p.substring(0, 30)}..."
                </button>
            ))}
        </div>
      </div>
      
      {/* Aspect Ratio Selector */}
      <div className="w-full flex justify-center gap-2">
          {ASPECT_RATIO_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setAspectRatio(opt.value)}
                disabled={isLoading}
                className={`flex-1 text-sm py-2 px-4 rounded-lg font-semibold transition-colors ${aspectRatio === opt.value ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)]' : 'bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)]'}`}
              >
                  {opt.label}
              </button>
          ))}
      </div>

      {error && <p className="text-[var(--color-danger)] text-center text-sm">{error}</p>}
      
      {/* Action Buttons */}
      <div className="w-full flex justify-center items-center space-x-4 pt-2">
        {!generatedImage ? (
            <button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isLoading}
              className="w-full px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] rounded-full font-bold transition-colors disabled:opacity-50 disabled:bg-[var(--color-border)] disabled:cursor-not-allowed"
            >
              {isLoading ? 'Dreaming...' : 'Generate'}
            </button>
        ) : (
            <>
                <button 
                  onClick={handleGenerate} 
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-full font-bold transition-colors disabled:opacity-50"
                >
                  Regenerate
                </button>
                <button 
                  onClick={handleSaveAndDownload}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] rounded-full font-bold transition-colors"
                >
                  <DownloadIcon className="w-5 h-5" />
                  <span>Save</span>
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default DreamCanvas;