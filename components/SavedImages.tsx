import React from 'react';
import { TrashIcon, SavedEmptyStateIcon } from './Icons';

interface SavedImagesProps {
  images: string[];
  onDelete: (index: number) => void;
}

const SavedImages: React.FC<SavedImagesProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-secondary)] py-10 flex flex-col items-center">
        <SavedEmptyStateIcon className="w-40 h-40 mb-6" />
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Your Gallery is Empty</h2>
        <p className="mt-2">Creations you save will appear here.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Your Saved Creations</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imgSrc, index) => (
          <div key={index} className="relative group aspect-square">
            <img src={imgSrc} alt={`Saved creation ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
              <button 
                onClick={() => onDelete(index)}
                className="p-3 bg-[var(--color-danger)] rounded-full text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
                aria-label="Delete image"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedImages;