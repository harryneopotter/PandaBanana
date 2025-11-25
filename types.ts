export enum Scene {
  Sunrise = 'Sunrise',
  GoldenHour = 'Golden Hour',
  BlueHour = 'BlueHour',
  Midnight = 'Midnight',
  Rainy = 'Rainy',
  Foggy = 'Foggy',
}

export enum Screen {
  Home = 'Home',
  Dream = 'Dream',
  Saved = 'Saved',
  Settings = 'Settings',
}

export enum EditorMode {
  None = 'None',
  SceneShift = 'SceneShift',
  MemeSmith = 'MemeSmith',
  CloneCast = 'CloneCast',
  SmartCrop = 'SmartCrop',
  StyleTransfer = 'StyleTransfer',
  Upscale = 'Upscale',
  GifCreator = 'GifCreator',
}

export enum CloneCastPose {
  Walking = 'walking',
  Leaning = 'leaning',
  Portrait = 'portrait',
}

export enum StylePreset {
  VanGogh = 'Van Gogh',
  Picasso = 'Picasso',
  Monet = 'Monet',
  Dali = 'Salvador Dali',
  Warhol = 'Andy Warhol',
  Anime = 'Anime',
  Watercolor = 'Watercolor',
  OilPainting = 'Oil Painting',
  Cyberpunk = 'Cyberpunk',
  PixelArt = 'Pixel Art',
}

export interface CropSuggestion {
  aspectRatio: string;
  x: number;
  y: number;
  width: number;
  height: number;
  reason: string;
}

export type ThemeName = 'qPanda' | 'mint' | 'crimson';

export interface OriginalImage {
  dataUrl: string;
  base64: string;
  mimeType: string;
  file?: File;
}