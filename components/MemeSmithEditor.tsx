
import React, { useState, useEffect, useRef } from 'react';
import { generateMemeCaptions } from '../services/geminiService';
import { DownloadIcon } from './Icons';

interface OriginalImage {
  file: File;
  dataUrl: string;
  base64: string;
  mimeType: string;
}

interface MemeSmithEditorProps {
  image: OriginalImage;
  onSave: (imageUrl: string) => void;
}

const MemeSmithEditor: React.FC<MemeSmithEditorProps> = ({ image, onSave }) => {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [suggestedCaptions, setSuggestedCaptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getCaptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateMemeCaptions(image.base64, image.mimeType);
        
        if (result && Array.isArray(result.captions)) {
          setSuggestedCaptions(result.captions);
          if (result.captions.length > 0) {
            // Auto-apply first suggestion
            const firstCaption = result.captions[0];
            const sentences = firstCaption.split('. ').filter(s => s);
            setTopText(sentences[0] || '');
            setBottomText(sentences[1] || '');
          }
        } else {
            throw new Error("Invalid caption data received from server.");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not generate captions.';
        setError(message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getCaptions();
  }, [image]);

  const handleSaveAndDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
        setError("Canvas element not found.");
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.dataUrl;

    img.onerror = () => {
        setError("Failed to load image onto canvas.");
    };
    
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError("Could not get canvas context.");
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Meme text style
      const fontSize = Math.max(20, Math.floor(img.width / 12));
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(1, fontSize / 20);
      ctx.textAlign = 'center';
      
      const x = canvas.width / 2;

      // Draw top text
      if (topText) {
        const topY = fontSize * 1.2;
        ctx.strokeText(topText.toUpperCase(), x, topY);
        ctx.fillText(topText.toUpperCase(), x, topY);
      }
      
      // Draw bottom text
      if (bottomText) {
        const bottomY = canvas.height - (fontSize * 0.4);
        ctx.strokeText(bottomText.toUpperCase(), x, bottomY);
        ctx.fillText(bottomText.toUpperCase(), x, bottomY);
      }

      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'BananaStudio_Meme.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Image Preview with Text Overlay */}
      <div className="w-full aspect-square max-w-[350px] bg-black rounded-2xl overflow-hidden relative shadow-lg shadow-[var(--color-bg-primary)]/50 select-none">
        <img src={image.dataUrl} alt="Meme Preview" className="w-full h-full object-contain" />
        <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
            <p className="w-full text-center text-3xl md:text-4xl font-black text-white break-words" style={{ WebkitTextStroke: '1px black' }}>{topText.toUpperCase()}</p>
            <p className="w-full text-center text-3xl md:text-4xl font-black text-white break-words" style={{ WebkitTextStroke: '1px black' }}>{bottomText.toUpperCase()}</p>
        </div>
      </div>

      {/* Text Inputs */}
      <div className="w-full space-y-2">
        <input type="text" value={topText} onChange={e => setTopText(e.target.value)} placeholder="Top Text" className="w-full p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]" />
        <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="Bottom Text" className="w-full p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]" />
      </div>

       {/* Caption Suggestions */}
      {isLoading ? <p className="text-[var(--color-text-secondary)]">Getting suggestions...</p> : (
        <div className="w-full space-y-2">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Suggestions from Gemini:</h3>
            <div className="flex flex-wrap gap-2">
            {suggestedCaptions.map((caption, i) => (
                <button key={i} onClick={() => {
                    const sentences = caption.split('. ').filter(s => s);
                    setTopText(sentences[0] || '');
                    setBottomText(sentences[1] || '');
                }} className="text-xs px-3 py-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] rounded-full transition-colors">
                    "{caption}"
                </button>
            ))}
            </div>
        </div>
      )}
      {error && <p className="text-[var(--color-danger)]">{error}</p>}

      {/* Action Buttons */}
      <div className="w-full flex justify-center items-center space-x-4 pt-2">
        <button onClick={handleSaveAndDownload} className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-secondary-text)] rounded-full font-bold transition-colors">
          <DownloadIcon className="w-5 h-5" />
          <span>Save & Download</span>
        </button>
      </div>
    </div>
  );
};

export default MemeSmithEditor;
