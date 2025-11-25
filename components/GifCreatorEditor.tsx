
import React, { useState, useRef, useEffect } from 'react';
import { generateGifFrame } from '../services/geminiService';
import { DownloadIcon, TrashIcon } from './Icons';
import LoadingShimmer from './LoadingShimmer';
import { OriginalImage } from '../types';
// @ts-ignore - gif.js types may not be perfect
import GIF from 'gif.js';

interface GifCreatorEditorProps {
  image: OriginalImage;
  onSave: (imageUrl: string) => void;
}

interface GeneratedFrame {
  url: string;
  prompt: string;
}

const ANIMATION_PRESETS = [
  { 
    name: 'Color Shift', 
    prompts: ['original colors', 'warm sunset tones', 'cool blue tones', 'vibrant neon colors'] 
  },
  { 
    name: 'Weather Changes', 
    prompts: ['sunny day', 'cloudy sky', 'rainy weather', 'dramatic storm'] 
  },
  { 
    name: 'Time of Day', 
    prompts: ['dawn lighting', 'midday sun', 'golden hour', 'moonlit night'] 
  },
  { 
    name: 'Artistic Styles', 
    prompts: ['original style', 'watercolor painting', 'oil painting', 'cartoon style'] 
  },
  {
    name: 'Zoom Effect',
    prompts: ['original view', 'slightly zoomed in', 'more zoomed in', 'close-up detail']
  },
];

const GifCreatorEditor: React.FC<GifCreatorEditorProps> = ({ image, onSave }) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPrompts, setCustomPrompts] = useState<string>('');
  const [frames, setFrames] = useState<GeneratedFrame[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingGif, setIsCreatingGif] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [frameDelay, setFrameDelay] = useState(500); // milliseconds between frames
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewFrameIndex, setPreviewFrameIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const handleGenerateFrames = async () => {
    const prompts = selectedPreset
      ? ANIMATION_PRESETS.find(p => p.name === selectedPreset)?.prompts || []
      : customPrompts.split('\n').filter(p => p.trim());

    if (prompts.length === 0) {
      setError('Please select a preset or enter custom prompts.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setFrames([]);
    setGifUrl(null);

    const newFrames: GeneratedFrame[] = [];

    for (let i = 0; i < prompts.length; i++) {
      try {
        setCurrentFrameIndex(i + 1);
        const frameUrl = await generateGifFrame(image.base64, image.mimeType, prompts[i]);
        newFrames.push({ url: frameUrl, prompt: prompts[i] });
        setFrames([...newFrames]);
      } catch (err) {
        console.error(`Failed to generate frame ${i + 1}:`, err);
        setError(`Failed to generate frame ${i + 1}. Continuing with others...`);
      }
    }

    if (newFrames.length === 0) {
      setError('Failed to generate any frames. Please try again.');
    }

    setIsGenerating(false);
    setCurrentFrameIndex(0);
  };

  const handleCreateGif = async () => {
    if (frames.length < 2) {
      setError('Need at least 2 frames to create a GIF.');
      return;
    }

    setIsCreatingGif(true);
    setError(null);

    try {
      // Load all frames as images
      const imageElements = await Promise.all(
        frames.map(frame => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = frame.url;
          });
        })
      );

      // Get dimensions from first image
      const width = imageElements[0].width;
      const height = imageElements[0].height;

      // Create GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width,
        height,
        workerScript: '/gif.worker.js', // We'll need to copy this to public
      });

      // Add each frame to the GIF
      imageElements.forEach((img) => {
        gif.addFrame(img, { delay: frameDelay });
      });

      // Handle GIF rendering completion
      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setGifUrl(url);

        // Automatically download the GIF
        const link = document.createElement('a');
        link.href = url;
        link.download = 'animation.gif';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsCreatingGif(false);
      });

      gif.on('progress', (progress: number) => {
        console.log('GIF encoding progress:', Math.round(progress * 100) + '%');
      });

      // Start rendering
      gif.render();

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create GIF.';
      setError(message);
      console.error(err);
      setIsCreatingGif(false);
    }
  };

  const handleDeleteFrame = (index: number) => {
    setFrames(frames.filter((_, i) => i !== index));
  };

  // Animation preview effect
  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      animationRef.current = window.setInterval(() => {
        setPreviewFrameIndex((prev) => (prev + 1) % frames.length);
      }, frameDelay);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, frames.length, frameDelay]);

  const togglePreview = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setPreviewFrameIndex(0);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">GIF Creator</h2>
      <p className="text-sm text-[var(--color-text-secondary)] text-center -mt-2">
        Create animated sequences with AI
      </p>

      {/* Original Image Preview */}
      <div className="w-full">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Base Image</h3>
        <img 
          src={image.dataUrl} 
          alt="Base" 
          className="w-full rounded-xl shadow-md max-h-48 object-cover" 
        />
      </div>

      {/* Preset Selection */}
      <div className="w-full space-y-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Animation Presets</h3>
        <div className="space-y-2">
          {ANIMATION_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setSelectedPreset(preset.name);
                setCustomPrompts('');
              }}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                selectedPreset === preset.name
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary)]/50'
              }`}
              disabled={isGenerating}
            >
              <div className="font-bold text-sm text-[var(--color-text-primary)]">{preset.name}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                {preset.prompts.length} frames
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompts */}
      <div className="w-full space-y-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Or Custom Prompts</h3>
        <textarea
          value={customPrompts}
          onChange={e => {
            setCustomPrompts(e.target.value);
            setSelectedPreset(null);
          }}
          placeholder="Enter one transformation per line:&#10;sunny weather&#10;rainy weather&#10;snowy weather"
          className="w-full p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] h-24 resize-none text-sm"
          disabled={isGenerating}
        />
      </div>

      {/* Frame Duration Control */}
      <div className="w-full space-y-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Frame Duration</h3>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={frameDelay}
            onChange={(e) => setFrameDelay(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-[var(--color-text-secondary)] min-w-[80px]">
            {frameDelay}ms ({(1000 / frameDelay).toFixed(1)} fps)
          </span>
        </div>
      </div>

      {/* Generate Frames Button */}
      <button
        onClick={handleGenerateFrames}
        disabled={isGenerating || (!selectedPreset && !customPrompts.trim())}
        className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isGenerating ? `Generating Frame ${currentFrameIndex}...` : '🎬 Generate Frames'}
      </button>

      {/* Animation Preview */}
      {frames.length > 0 && (
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Animation Preview
            </h3>
            <button
              onClick={togglePreview}
              className="px-3 py-1 bg-[var(--color-primary)] text-[var(--color-primary-text)] rounded-full text-xs font-bold hover:bg-[var(--color-primary-hover)] transition-all"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          </div>
          <div className="w-full rounded-xl shadow-lg overflow-hidden bg-[var(--color-bg-tertiary)]">
            <img
              src={frames[previewFrameIndex].url}
              alt={`Preview Frame ${previewFrameIndex + 1}`}
              className="w-full"
            />
            <div className="p-2 text-center text-xs text-[var(--color-text-secondary)]">
              Frame {previewFrameIndex + 1} of {frames.length}
            </div>
          </div>
        </div>
      )}

      {/* Frames Grid */}
      {frames.length > 0 && (
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              All Frames ({frames.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {frames.map((frame, index) => (
              <div key={index} className="relative group">
                <img
                  src={frame.url}
                  alt={`Frame ${index + 1}`}
                  className="w-full rounded-lg shadow-md"
                />
                <button
                  onClick={() => handleDeleteFrame(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center rounded-b-lg">
                  Frame {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create GIF Button */}
      {frames.length >= 2 && !isGenerating && (
        <button
          onClick={handleCreateGif}
          disabled={isCreatingGif}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-secondary-text)] font-bold rounded-full transition-all disabled:opacity-50 transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>{isCreatingGif ? 'Creating GIF...' : '🎞️ Create & Download GIF'}</span>
        </button>
      )}

      {/* Created GIF Preview */}
      {gifUrl && (
        <div className="w-full space-y-2">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Created GIF</h3>
          <img src={gifUrl} alt="Created GIF" className="w-full rounded-xl shadow-lg" />
          <p className="text-sm text-center text-[var(--color-text-secondary)]">
            ✅ GIF created and downloaded successfully!
          </p>
        </div>
      )}

      {/* Hidden canvas for GIF creation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Error Display */}
      {error && (
        <div className="w-full p-3 bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/50 rounded-lg text-center text-sm">
          {error}
        </div>
      )}

      {/* Info Message */}
      {frames.length === 0 && !isGenerating && (
        <div className="w-full p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg text-center text-sm text-[var(--color-text-secondary)]">
          💡 Select a preset or write custom prompts to generate animated frames of your image.
        </div>
      )}
    </div>
  );
};

export default GifCreatorEditor;
