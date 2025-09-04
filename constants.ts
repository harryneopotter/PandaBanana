
import { Scene } from './types';

export const SCENE_OPTIONS: { value: Scene; label: string; prompt: string; icon: string; }[] = [
  { value: Scene.Sunrise, label: 'Sunrise', prompt: 'a beautiful sunrise with soft, warm light', icon: '🌅' },
  { value: Scene.GoldenHour, label: 'Golden Hour', prompt: 'golden hour lighting, with long shadows and a warm, magical glow', icon: '🌇' },
  { value: Scene.BlueHour, label: 'Blue Hour', prompt: 'blue hour, with deep blue skies and cool, ambient light just after sunset', icon: '🌃' },
  { value: Scene.Midnight, label: 'Midnight', prompt: 'a clear midnight scene, with moonlight and stars visible', icon: '🌉' },
  { value: Scene.Rainy, label: 'Rainy', prompt: 'a moody, rainy day with wet surfaces and reflections', icon: '🌧️' },
  { value: Scene.Foggy, label: 'Foggy', prompt: 'a thick, mysterious fog enveloping the scene', icon: '🌫️' },
];
