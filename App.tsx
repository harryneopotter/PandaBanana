
import React, { useState, useCallback, useEffect } from 'react';
import { Scene, Screen, EditorMode, ThemeName } from './types';
import { SCENE_OPTIONS } from './constants';
import { fileToBase64, editImageWithScene } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import SceneShiftEditor from './components/SceneShiftEditor';
import MemeSmithEditor from './components/MemeSmithEditor';
import CloneCastEditor from './components/CloneCastEditor';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SavedImages from './components/SavedImages';
import Settings from './components/Settings';
import { MagicIcon, MemeIcon, QRIcon, ResetIcon, CloneCastIcon } from './components/Icons';
import { THEMES } from './themes';
import DreamCanvas from './components/DreamCanvas';

interface OriginalImage {
  file: File;
  dataUrl: string;
  base64: string;
  mimeType: string;
}

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>(Screen.Home);
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.None);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [theme, setTheme] = useState<ThemeName>('qPanda');

  // State for SceneShift editor history
  const [sceneShiftHistory, setSceneShiftHistory] = useState<string[]>([]);
  const [sceneShiftHistoryIndex, setSceneShiftHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('qPandaStudioTheme') as ThemeName;
      if (savedTheme && THEMES[savedTheme]) {
        setTheme(savedTheme);
      }
    } catch (e) {
      console.error("Failed to access localStorage for theme", e);
    }
  }, []);

  useEffect(() => {
    const activeTheme = THEMES[theme];
    const root = document.documentElement;
    if (activeTheme) {
        Object.entries(activeTheme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        Object.entries(activeTheme.backgroundStyles).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }
    try {
        localStorage.setItem('qPandaStudioTheme', theme);
    } catch (e) {
        console.error("Failed to save theme to localStorage", e);
    }
  }, [theme]);


  useEffect(() => {
    try {
      const storedImages = localStorage.getItem('qPandaStudioSavedImages');
      if (storedImages) {
        try {
            const parsedImages = JSON.parse(storedImages);
            if (Array.isArray(parsedImages)) {
                setSavedImages(parsedImages);
            }
        } catch (e) {
            console.error("Failed to parse saved images from localStorage", e);
            // Clear corrupted data
            localStorage.removeItem('qPandaStudioSavedImages');
        }
      }
    } catch (e) {
      console.error("Failed to access localStorage", e);
      setError("Could not load saved images due to browser restrictions.");
    }
  }, []);

  const handleSaveImage = (imageUrl: string) => {
    if (!imageUrl) return;
    setSavedImages(prev => {
      const newSavedImages = [imageUrl, ...prev];
      try {
        localStorage.setItem('qPandaStudioSavedImages', JSON.stringify(newSavedImages));
      } catch (e) {
        console.error("Failed to save image to localStorage", e);
        setError("Could not save image. Storage might be full or blocked.");
      }
      return newSavedImages;
    });
  };

  const handleDeleteImage = (index: number) => {
    setSavedImages(prev => {
      const newSavedImages = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('qPandaStudioSavedImages', JSON.stringify(newSavedImages));
      } catch (e) {
        console.error("Failed to update localStorage after delete", e);
        setError("Could not update saved images list.");
      }
      return newSavedImages;
    });
  };

  const handleClearSavedImages = () => {
    if (window.confirm("Are you sure you want to delete all saved images? This action cannot be undone.")) {
        setSavedImages([]);
        try {
            localStorage.removeItem('qPandaStudioSavedImages');
        } catch (e) {
            console.error("Failed to clear localStorage", e);
            setError("Could not clear saved images. Storage might be blocked.");
        }
    }
  };

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
  };


  const handleImageSelect = async (file: File) => {
    // Validation logic is now in ImageUploader
    try {
        const { imageData, mimeType } = await fileToBase64(file);
        const dataUrl = `data:${mimeType};base64,${imageData}`;
        setOriginalImage({ file, dataUrl, base64: imageData, mimeType });
        setSelectedScene(null);
        setError(null);
        setEditorMode(EditorMode.None);
        setSceneShiftHistory([]);
        setSceneShiftHistoryIndex(-1);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Could not process the image file.';
        setError(errorMessage);
        console.error(e);
    }
  };

  const handleSceneChange = useCallback((scene: Scene) => {
    setSelectedScene(scene);
  }, []);

  const handleReset = () => {
    setOriginalImage(null);
    setSelectedScene(null);
    setError(null);
    setIsLoading(false);
    setEditorMode(EditorMode.None);
    setSceneShiftHistory([]);
    setSceneShiftHistoryIndex(-1);
  };

  const handleBack = () => {
    if (editorMode !== EditorMode.None) {
      setEditorMode(EditorMode.None);
      setSelectedScene(null);
      setSceneShiftHistory([]);
      setSceneShiftHistoryIndex(-1);
    } else if (originalImage) {
      handleReset();
    }
  };
  
  const handleUndo = () => {
    if (sceneShiftHistoryIndex >= 0) {
      setSceneShiftHistoryIndex(prev => prev - 1);
    }
  };
  
  const handleRedo = () => {
      if (sceneShiftHistoryIndex < sceneShiftHistory.length - 1) {
          setSceneShiftHistoryIndex(prev => prev + 1);
      }
  };

  useEffect(() => {
    const generateImage = async () => {
      if (!originalImage || !selectedScene || editorMode !== EditorMode.SceneShift) {
        return;
      }

      const sceneOption = SCENE_OPTIONS.find(opt => opt.value === selectedScene);
      if (!sceneOption) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const resultUrl = await editImageWithScene(
          originalImage.base64,
          originalImage.mimeType,
          sceneOption.prompt
        );
        
        const newHistory = sceneShiftHistory.slice(0, sceneShiftHistoryIndex + 1);
        const updatedHistory = [...newHistory, resultUrl];
        setSceneShiftHistory(updatedHistory);
        setSceneShiftHistoryIndex(updatedHistory.length - 1);

      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Oops, something went wrong. ${message}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [originalImage, selectedScene, editorMode]);
  
  const renderHome = () => {
    if (!originalImage) {
      return <ImageUploader onImageSelect={handleImageSelect} />;
    }

    if (editorMode === EditorMode.None) {
      return (
        <div className="w-full flex flex-col items-center">
            <img src={originalImage.dataUrl} alt="Your upload" className="max-w-full w-auto h-auto max-h-[40vh] rounded-2xl shadow-lg mb-6"/>
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-secondary)]">Choose your magic</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => setEditorMode(EditorMode.SceneShift)} className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] rounded-full font-bold transition-all transform hover:scale-105">
                <MagicIcon className="w-6 h-6"/>
                <span>SceneShift</span>
              </button>
              <button onClick={() => setEditorMode(EditorMode.MemeSmith)} className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-secondary-text)] rounded-full font-bold transition-all transform hover:scale-105">
                <MemeIcon className="w-6 h-6"/>
                <span>MemeSmith</span>
              </button>
              <button onClick={() => setEditorMode(EditorMode.CloneCast)} className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] text-[var(--color-tertiary-text)] rounded-full font-bold transition-all transform hover:scale-105">
                <CloneCastIcon className="w-6 h-6"/>
                <span>CloneCast</span>
              </button>
            </div>
             <button onClick={handleReset} className="flex items-center space-x-2 mt-6 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                <ResetIcon className="w-4 h-4" />
                <span>Start Over</span>
            </button>
        </div>
      );
    }

    if (editorMode === EditorMode.SceneShift) {
      const generatedImageUrl = sceneShiftHistory[sceneShiftHistoryIndex] || null;
      return (
        <SceneShiftEditor
          originalImageUrl={originalImage.dataUrl}
          generatedImageUrl={generatedImageUrl}
          onSceneChange={handleSceneChange}
          isLoading={isLoading}
          selectedScene={selectedScene}
          onSave={handleSaveImage}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={sceneShiftHistoryIndex >= 0}
          canRedo={sceneShiftHistoryIndex < sceneShiftHistory.length - 1}
        />
      );
    }

    if (editorMode === EditorMode.MemeSmith) {
      return <MemeSmithEditor image={originalImage} onSave={handleSaveImage} />;
    }

    if (editorMode === EditorMode.CloneCast) {
      return <CloneCastEditor image={originalImage} onSave={handleSaveImage} />;
    }

    return null;
  };

  const showHeaderBack = screen === Screen.Home && originalImage !== null;

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans flex items-center justify-center p-0 sm:p-4 bg-gradient-to-br from-[var(--color-gradient-from)] via-[var(--color-gradient-via)] to-[var(--color-gradient-to)] relative overflow-hidden">
        
      {/* Background Decorations */}
      <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--color-blob-2)] rounded-full filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-[var(--color-blob-1)] rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Desktop-only side content */}
      <div className="hidden lg:flex flex-col items-center text-center mr-16 text-gray-500">
          <QRIcon className="w-32 h-32 mb-4" />
          <p className="font-semibold text-lg text-gray-300">Q Panda Studio</p>
          <p className="text-sm">Teleport your photos to new worlds.</p>
          <p className="text-xs mt-8">QR code will appear when your app is ready</p>
      </div>

      {/* The Phone Mockup */}
      <div 
        className="w-full h-full sm:max-w-[400px] sm:h-[90vh] sm:max-h-[850px] sm:rounded-[40px] sm:shadow-2xl sm:border-[10px] sm:border-[var(--color-bg-tertiary)] overflow-hidden relative flex flex-col"
        style={{
            backgroundColor: 'var(--color-bg-primary)',
            backgroundImage: 'var(--bg-primary-image)',
        }}
      >
        <Header onBack={showHeaderBack ? handleBack : undefined} />
        <main className="flex-grow flex flex-col items-center overflow-y-auto">
          <div
            key={screen}
            className="w-full max-w-md mx-auto p-4 flex-grow flex flex-col justify-center animate-screen-fade-in"
          >
            {screen === Screen.Home && renderHome()}
            {screen === Screen.Dream && <DreamCanvas onSave={handleSaveImage} />}
            {screen === Screen.Saved && <SavedImages images={savedImages} onDelete={handleDeleteImage} />}
            {screen === Screen.Settings && <Settings onClearSavedImages={handleClearSavedImages} activeTheme={theme} onThemeChange={handleThemeChange} />}

            {error && (
              <div className="mt-4 p-3 bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/50 rounded-lg text-center">
                  {error}
              </div>
            )}
          </div>
        </main>
        <BottomNav activeScreen={screen} setScreen={setScreen} />
      </div>
    </div>
  );
};

export default App;