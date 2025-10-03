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
}

export enum CloneCastPose {
  Walking = 'walking',
  Leaning = 'leaning',
  Portrait = 'portrait',
}

export type ThemeName = 'qPanda' | 'mint' | 'crimson';

export interface OriginalImage {
  dataUrl: string;
  base64: string;
  mimeType: string;
  file?: File;
}