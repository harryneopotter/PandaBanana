
import React, { useState, useCallback } from 'react';
import { generateSinglePose } from '../services/geminiService';
import { DownloadIcon, WalkingIcon, LeaningIcon, PortraitIcon } from './Icons';
import LoadingShimmer from './LoadingShimmer';
import { CloneCastPose } from '../types';

interface OriginalImage {
  file: File;
  dataUrl: string;
  base64: string;
  mimeType: string;
}

interface CloneCastEditorProps {
  image: OriginalImage;
  onSave: (imageUrl: string) => void;
}

const POSE_OPTIONS = [
  { value: CloneCastPose.Walking, label: 'Walking', icon: WalkingIcon, description: "Full-body, in motion" },
  { value: CloneCastPose.Leaning, label: 'Leaning', icon: LeaningIcon, description: "Full-body, casual lean" },
  { value: CloneCastPose.Portrait, label: 'Portrait', icon: PortraitIcon, description: "Waist-up, focused shot" },
];

const CloneCastEditor: React.FC<CloneCastEditorProps> = ({ image, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedPoses, setSelectedPoses] = useState<Set<CloneCastPose>>(
    new Set([CloneCastPose.Walking, CloneCastPose.Leaning, CloneCastPose.Portrait])
  );
  const [generatedImages, setGeneratedImages] = useState<{ [key in CloneCastPose]?: string }>({});
  const [loadingPoses, setLoadingPoses] = useState<Set<CloneCastPose>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const handlePoseToggle = (pose: CloneCastPose) => {
    if (isGenerating) return;
    setSelectedPoses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pose)) {
        newSet.delete(pose);
      } else {
        newSet.add(pose);
      }
      return newSet;
    });
  };

  const handleGenerate = useCallback(async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || selectedPoses.size === 0 || isGenerating) {
        if (!trimmedPrompt) setError("Please enter a prompt to describe the scene.");
        return;
    }

    setIsGenerating(true);
    setLoadingPoses(new Set(selectedPoses));
    setError(null);

    const newGeneratedImages = { ...generatedImages };
    selectedPoses.forEach(pose => {
      delete newGeneratedImages[pose];
    });
    setGeneratedImages(newGeneratedImages);

    const posesToGenerate = Array.from(selectedPoses);
    const failedPoses: string[] = [];

    await Promise.all(posesToGenerate.map(async (pose) => {
      try {
        const resultUrl = await generateSinglePose(image.base64, image.mimeType, trimmedPrompt, pose);
        setGeneratedImages(prev => ({ ...prev, [pose]: resultUrl }));
      } catch (err) {
        console.error(`Failed to generate pose ${pose}:`, err);
        failedPoses.push(pose);
      } finally {
        setLoadingPoses(prev => {
          const newSet = new Set(prev);
          newSet.delete(pose);
          return newSet;
        });
      }
    }));
    
    if (failedPoses.length > 0) {
        if (failedPoses.length === posesToGenerate.length) {
            setError("All poses failed to generate. Please try a different prompt or image.");
        } else {
            setError(`Failed to generate: ${failedPoses.join(', ')}.`);
        }
    }

    setIsGenerating(false);
  }, [prompt, selectedPoses, image.base64, image.mimeType, isGenerating, generatedImages]);

  const handleSaveAndDownload = (imageUrl: string) => {
    if (!imageUrl) return;
    onSave(imageUrl);

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `BananaStudio_CloneCast_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-[var(--color-tertiary)]">CloneCast</h2>
      <p className="text-sm text-[var(--color-text-secondary)] text-center -mt-2 mb-2">1. Select poses. 2. Describe a scene. 3. Generate!</p>
      
       {/* Pose Selection */}
      <div className="w-full flex justify-center gap-2 text-center">
        {POSE_OPTIONS.map(({ value, label, icon: Icon, description }) => (
          <button
            key={value}
            onClick={() => handlePoseToggle(value)}
            disabled={isGenerating}
            className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 text-sm rounded-lg transition-all border-2 h-28 ${
              selectedPoses.has(value)
                ? 'bg-[var(--color-tertiary)] border-[var(--color-tertiary)] text-[var(--color-tertiary-text)]'
                : 'bg-[var(--color-bg-tertiary)]/50 border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-text-secondary)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="font-semibold">{label}</span>
            <span className={`text-xs font-normal ${selectedPoses.has(value) ? 'opacity-80' : 'text-[var(--color-text-secondary)]'}`}>{description}</span>
          </button>
        ))}
      </div>

      <div className="w-full space-y-2">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g., modeling a leather jacket on a rainy Tokyo street, Vogue lighting"
          className="w-full p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] h-24 resize-none"
          disabled={isGenerating}
        />
        <button 
          onClick={handleGenerate} 
          disabled={!prompt.trim() || selectedPoses.size === 0 || isGenerating}
          className="w-full px-6 py-3 bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] text-[var(--color-tertiary-text)] rounded-full font-bold transition-colors disabled:opacity-50 disabled:bg-[var(--color-border)] disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : `Generate ${selectedPoses.size} Pose(s)`}
        </button>
      </div>

      {error && <p className="text-[var(--color-danger)] text-center text-sm">{error}</p>}

      <div className="w-full grid grid-cols-3 gap-2 pt-4">
        {POSE_OPTIONS.map(({ value, label, icon: Icon }) => (
            <div
                key={value}
                className="aspect-square bg-[var(--color-bg-tertiary)] rounded-lg overflow-hidden relative group flex flex-col items-center justify-center"
                onClick={() => generatedImages[value] && setEnlargedImage(generatedImages[value]!)}
            >
                {loadingPoses.has(value) && <LoadingShimmer />}
                {generatedImages[value] ? (
                <img
                    src={generatedImages[value]}
                    alt={`Generated pose ${label}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-pointer"
                />
                ) : !loadingPoses.has(value) ? (
                <div className="text-center text-[var(--color-text-secondary)]">
                    <Icon className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs font-medium">{label}</span>
                </div>
                ) : null}
            </div>
        ))}
      </div>
      
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img src={enlargedImage} alt="Enlarged view" className="max-w-[90vw] max-h-[70vh] rounded-lg shadow-2xl" />
            <button
                onClick={() => handleSaveAndDownload(enlargedImage)}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center space-x-2 px-6 py-3 bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] text-[var(--color-tertiary-text)] rounded-full font-bold transition-colors"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Save & Download</span>
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CloneCastEditor;
