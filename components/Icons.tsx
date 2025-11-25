import React from 'react';

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

export const ResetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-3.18-3.182a8.25 8.25 0 00-11.664 0l-3.18 3.185" 
    />
  </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M3 13.5V21a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 21v-7.5M12 21V12" />
    </svg>
);

export const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const MagicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.433 2.433 3 3 0 001.128 5.78m1.128-5.78l2.433-2.433m0 0a2.25 2.25 0 013.182 0l2.433 2.433m-3.182-2.433l2.433 2.433m0 0a2.25 2.25 0 010 3.182l-2.433 2.433m2.433-2.433l2.433 2.433" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const MemeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15l-6.364-6.364M15.182 15a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM8.818 9a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15C14.12 16.1 12.58 17 11 17s-3.12-.9-4.182-2" />
  </svg>
);

export const CloneCastIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a3 3 0 100 6 3 3 0 000-6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5c-2.485 0-4.5 2.015-4.5 4.5V18h9v-3c0-2.485-2.015-4.5-4.5-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 9.5a2 2 0 100 4 2 2 0 000-4z" opacity="0.6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 13.5c-1.657 0-3 1.343-3 3V18h3.5v-1.5c0-1.657-1.343-3-3-3h-.5z" opacity="0.6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 9.5a2 2 0 100 4 2 2 0 000-4z" opacity="0.6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 13.5c1.657 0 3 1.343 3 3V18H6v-1.5c0-1.657 1.343-3-3-3h.5z" opacity="0.6" />
    </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.533c-1.124 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const BackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

export const QRIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M15 15H1V1H15V15Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M15 65H1V51H15V65Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M65 15H51V1H65V15Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="33" y="1" width="14" height="14" fill="#9CA3AF"/>
        <rect x="65" y="33" width="14" height="14" fill="#9CA3AF"/>
        <rect x="1" y="33" width="14" height="14" fill="#9CA3AF"/>
        <rect x="33" y="33" width="14" height="14" fill="#9CA3AF"/>
        <rect x="51" y="51" width="14" height="14" fill="white"/>
        <rect x="33" y="51" width="14" height="14" fill="#9CA3AF"/>
        <rect x="33" y="65" width="14" height="14" fill="white"/>
        <rect x="1" y="15" width="14" height="14" fill="#9CA3AF"/>
        <rect x="15" y="33" width="14" height="14" fill="white"/>
        <rect x="51" y="15" width="14" height="14" fill="#9CA3AF"/>
        <rect x="65" y="15" width="14" height="14" fill="white"/>
    </svg>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.554-.22 1.196-.22 1.75 0 .554.22 1.02.684 1.11 1.226M13.5 21v-2.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h-4.5zM12 4.5a3.75 3.75 0 00-3.75 3.75v5.25a3.75 3.75 0 003.75 3.75h.001a3.75 3.75 0 003.75-3.75v-5.25A3.75 3.75 0 0012 4.5zM3.75 10.5a2.25 2.25 0 00-2.25 2.25v.75c0 1.242.99 2.25 2.25 2.25h.75v-5.25h-.75zM20.25 10.5a2.25 2.25 0 012.25 2.25v.75c0 1.242-.99 2.25-2.25 2.25h-.75v-5.25h.75z" />
    </svg>
);

export const WalkingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a2 2 0 100 4 2 2 0 000-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v4l-2 4m2-4l2 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 18l-1.5 3" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 18l1.5 3" />
    </svg>
);

export const LeaningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4a2 2 0 100 4 2 2 0 000-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 10l-1.5 8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 18l-2-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v16" />
    </svg>
);

export const PortraitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.485 0-4.5 1.12-4.5 2.5V18h9v-1.25c0-1.38-2.015-2.5-4.5-2.5z" />
    </svg>
);

export const UndoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);

export const RedoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
    </svg>
);

export const HomeEmptyStateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 64 64" {...props}>
    <g transform="rotate(-8 32 32)">
      <rect x="10" y="14" width="44" height="36" rx="4" fill="var(--color-bg-tertiary)" stroke="currentColor" strokeWidth="1"/>
      <rect x="12" y="16" width="40" height="28" rx="2" fill="var(--color-bg-secondary)" />
    </g>
    <g transform="rotate(6 32 32)">
      <rect x="10" y="14" width="44" height="36" rx="4" fill="var(--color-bg-tertiary)" stroke="currentColor" strokeWidth="1"/>
      <rect x="12" y="16" width="40" height="28" rx="2" fill="var(--color-bg-secondary)" />
    </g>
    <g>
      <rect x="10" y="14" width="44" height="36" rx="4" fill="var(--color-bg-tertiary)" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="12" y="16" width="40" height="28" rx="2" fill="var(--color-bg-secondary)" />
      <path d="M14 38 l 8-10 l 6 6 l 7-8 l 9 10" stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="42" cy="24" r="3" fill="var(--color-primary)" />
    </g>
  </svg>
);

export const SavedEmptyStateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 64 64" {...props}>
    <path d="M12 8 H 52 C 54 8, 56 10, 56 12 V 52 C 56 54, 54 56, 52 56 H 12 C 10 56, 8 54, 8 52 V 12 C 8 10, 10 8, 12 8 Z" fill="var(--color-bg-tertiary)" stroke="currentColor" strokeWidth="1.5" />
    <rect x="4" y="6" width="4" height="52" rx="2" fill="var(--color-bg-secondary)" />
    <line x1="32" y1="10" x2="32" y2="54" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M20 28 L 26 34 L 20 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    <path d="M44 28 L 38 34 L 44 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
);

export const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const DreamEmptyStateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 64 64" {...props}>
    <rect x="8" y="10" width="48" height="36" rx="4" fill="var(--color-bg-tertiary)" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="10" y="12" width="44" height="32" rx="2" fill="var(--color-bg-secondary)" />
    <path d="M14 40 q 10 -20 20 0 t 20 0" stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 46 H 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 50 H 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 46 V 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M26 54 H 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="46" cy="20" r="4" fill="var(--color-primary)" />
  </svg>
);

export const CropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);

export const StyleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
  </svg>
);

export const UpscaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-11.25 5.25v-4.5m0 4.5h4.5m-4.5 0L9 15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" />
  </svg>
);

export const GifIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M12 10.875v2.25" />
  </svg>
);