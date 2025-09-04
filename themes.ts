import { ThemeName } from './types';

export interface Theme {
  name: string;
  colors: {
    '--color-primary': string;
    '--color-primary-hover': string;
    '--color-primary-text': string;
    '--color-secondary': string;
    '--color-secondary-hover': string;
    '--color-secondary-text': string;
    '--color-tertiary': string;
    '--color-tertiary-hover': string;
    '--color-tertiary-text': string;
    '--color-text-primary': string;
    '--color-text-secondary': string;
    '--color-bg-primary': string;
    '--color-bg-secondary': string;
    '--color-bg-tertiary': string;
    '--color-border': string;
    '--color-gradient-from': string;
    '--color-gradient-via': string;
    '--color-gradient-to': string;
    '--color-blob-1': string;
    '--color-blob-2': string;
    '--color-danger': string;
    '--color-danger-hover-bg': string;
  };
  backgroundStyles: {
    '--bg-primary-image': string;
    '--bg-secondary-image': string;
  };
}

const NOISE_TEXTURE_URL = `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0ibm9pc2VGaWx0ZXIiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjgiIG51bU9jdGF2ZXM9IjEiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')`;

const subtleGradient = (topColor: string, bottomColor: string) => 
  `linear-gradient(180deg, ${topColor} 0%, transparent 30%, transparent 70%, ${bottomColor} 100%)`;

export const THEMES: Record<ThemeName, Theme> = {
  qPanda: {
    name: 'Q Panda',
    colors: {
      '--color-primary': '#21ccdb',
      '--color-primary-hover': '#19a9b8',
      '--color-primary-text': '#0a0a14',
      '--color-secondary': '#A78BFA',
      '--color-secondary-hover': '#8B5CF6',
      '--color-secondary-text': '#FFFFFF',
      '--color-tertiary': '#F43F5E',
      '--color-tertiary-hover': '#E11D48',
      '--color-tertiary-text': '#FFFFFF',
      '--color-text-primary': '#E5E7EB',
      '--color-text-secondary': '#9CA3AF',
      '--color-bg-primary': '#0a0a14',
      '--color-bg-secondary': '#11111c',
      '--color-bg-tertiary': '#1c1c2e',
      '--color-border': '#3f3f46',
      '--color-gradient-from': '#0a0a14',
      '--color-gradient-via': '#1c1c2e',
      '--color-gradient-to': '#0a0a14',
      '--color-blob-1': 'rgba(167, 139, 250, 0.1)',
      '--color-blob-2': 'rgba(33, 204, 219, 0.1)',
      '--color-danger': '#F87171',
      '--color-danger-hover-bg': 'rgba(239, 68, 68, 0.2)',
    },
    backgroundStyles: {
      '--bg-primary-image': `${subtleGradient('rgba(255,255,255,0.02)', 'rgba(0,0,0,0.02)')}, ${NOISE_TEXTURE_URL}`,
      '--bg-secondary-image': `${subtleGradient('rgba(255,255,255,0.03)', 'rgba(0,0,0,0.03)')}, ${NOISE_TEXTURE_URL}`,
    }
  },
  mint: {
    name: 'Mint',
    colors: {
      '--color-primary': '#34D399', // emerald-400
      '--color-primary-hover': '#10B981', // emerald-500
      '--color-primary-text': '#1F2937',
      '--color-secondary': '#22D3EE', // cyan-400
      '--color-secondary-hover': '#06B6D4', // cyan-500
      '--color-secondary-text': '#1F2937',
      '--color-tertiary': '#A78BFA', // violet-400
      '--color-tertiary-hover': '#8B5CF6', // violet-500
      '--color-tertiary-text': '#FFFFFF',
      '--color-text-primary': '#E5E7EB',
      '--color-text-secondary': '#9CA3AF',
      '--color-bg-primary': '#0f172a', // slate-900
      '--color-bg-secondary': '#1e293b', // slate-800
      '--color-bg-tertiary': '#334155', // slate-700
      '--color-border': '#475569', // slate-600
      '--color-gradient-from': '#0f172a',
      '--color-gradient-via': '#132a2e',
      '--color-gradient-to': '#0f172a',
      '--color-blob-1': 'rgba(52, 211, 153, 0.1)',
      '--color-blob-2': 'rgba(34, 211, 238, 0.1)',
      '--color-danger': '#F87171',
      '--color-danger-hover-bg': 'rgba(239, 68, 68, 0.2)',
    },
    backgroundStyles: {
        '--bg-primary-image': `${subtleGradient('rgba(255,255,255,0.04)', 'rgba(0,0,0,0.04)')}, ${NOISE_TEXTURE_URL}`,
        '--bg-secondary-image': `${subtleGradient('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.05)')}, ${NOISE_TEXTURE_URL}`,
    }
  },
  crimson: {
    name: 'Crimson',
    colors: {
      '--color-primary': '#F43F5E', // rose-500
      '--color-primary-hover': '#E11D48', // rose-600
      '--color-primary-text': '#FFFFFF',
      '--color-secondary': '#F97316', // orange-500
      '--color-secondary-hover': '#EA580C', // orange-600
      '--color-secondary-text': '#FFFFFF',
      '--color-tertiary': '#EAB308', // yellow-500
      '--color-tertiary-hover': '#CA8A04', // yellow-600
      '--color-tertiary-text': '#1F2937',
      '--color-text-primary': '#E5E7EB',
      '--color-text-secondary': '#9CA3AF',
      '--color-bg-primary': '#111111',
      '--color-bg-secondary': '#18181b', // zinc-900
      '--color-bg-tertiary': '#27272a', // zinc-800
      '--color-border': '#3f3f46', // zinc-700
      '--color-gradient-from': '#111111',
      '--color-gradient-via': '#2e1a1a',
      '--color-gradient-to': '#111111',
      '--color-blob-1': 'rgba(244, 63, 94, 0.1)',
      '--color-blob-2': 'rgba(249, 115, 22, 0.1)',
      '--color-danger': '#F87171',
      '--color-danger-hover-bg': 'rgba(239, 68, 68, 0.2)',
    },
    backgroundStyles: {
        '--bg-primary-image': `${subtleGradient('rgba(255,255,255,0.04)', 'rgba(0,0,0,0.04)')}, ${NOISE_TEXTURE_URL}`,
        '--bg-secondary-image': `${subtleGradient('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.05)')}, ${NOISE_TEXTURE_URL}`,
    }
  },
};