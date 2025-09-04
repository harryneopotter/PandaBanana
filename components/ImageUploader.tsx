import React, { useRef, useCallback, useState, useEffect } from 'react';
import { HomeEmptyStateIcon } from './Icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: number;
    if (error) {
      timer = window.setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => window.clearTimeout(timer);
  }, [error]);

  const handleFileSelect = useCallback((file: File | null | undefined) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please use JPG or PNG.');
      return;
    }

    const maxSizeInBytes = 12 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError('File is too large. Please select a file under 12MB.');
      return;
    }
    
    setError(null);
    onImageSelect(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onImageSelect]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0]);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFileSelect(event.dataTransfer.files?.[0]);
  }, [handleFileSelect]);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  
  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Start your creation</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">Upload a photo to begin your magical edit.</p>
      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`w-full aspect-square max-w-sm p-8 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-[var(--color-primary)] bg-[var(--color-bg-tertiary)]/50 scale-105' : error ? 'border-[var(--color-danger)] bg-[var(--color-danger)]/20' : 'border-[var(--color-border)] hover:border-[var(--color-text-secondary)] bg-[var(--color-bg-primary)]/50'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
        />
        <div className={error ? "text-[var(--color-danger)] mb-4" : "text-[var(--color-text-secondary)] mb-4"}>
          <HomeEmptyStateIcon className="w-32 h-32" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {error ? 'Upload Failed' : 'Drop your photo here'}
        </h2>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {error ? <span className="text-[var(--color-danger)]">{error}</span> : 'or click to browse'}
        </p>
        <p className="text-xs text-gray-500 mt-4">Supports JPG, PNG up to 12MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;