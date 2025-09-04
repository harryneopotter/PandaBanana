
import React from 'react';

const LoadingShimmer: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full h-full animate-pulse bg-gradient-to-r from-transparent via-[var(--color-border)]/80 to-transparent bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
       <div className="absolute text-center">
         <div className="text-[var(--color-primary)] text-lg font-semibold">Brewing Magic...</div>
         <div className="text-[var(--color-text-primary)] text-sm mt-1">This can take a moment</div>
      </div>
    </div>
  );
};

export default LoadingShimmer;
