
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Scene, Screen, EditorMode, ThemeName, OriginalImage } from './types';
import { SCENE_OPTIONS } from './constants';
import { fileToBase64, editImageWithScene, checkApiHealth } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import SceneShiftEditor from './components/SceneShiftEditor';
import MemeSmithEditor from './components/MemeSmithEditor';
import CloneCastEditor from './components/CloneCastEditor';
import SmartCropEditor from './components/SmartCropEditor';
import StyleTransferEditor from './components/StyleTransferEditor';
import UpscaleEditor from './components/UpscaleEditor';
import GifCreatorEditor from './components/GifCreatorEditor';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SavedImages from './components/SavedImages';
import Settings from './components/Settings';
import SplashScreen from './components/SplashScreen';
import { MagicIcon, MemeIcon, QRIcon, ResetIcon, CloneCastIcon, CropIcon, StyleIcon, UpscaleIcon, GifIcon } from './components/Icons';
import { THEMES } from './themes';
import DreamCanvas from './components/DreamCanvas';

const isScreenValue = (value: unknown): value is Screen =>
  Object.values(Screen).includes(value as Screen);

const isEditorModeValue = (value: unknown): value is EditorMode =>
  Object.values(EditorMode).includes(value as EditorMode);

interface PersistedSessionState {
  originalImage: Pick<OriginalImage, 'dataUrl' | 'base64' | 'mimeType'> | null;
  editorMode: EditorMode;
  screen: Screen;
}

const App: React.FC = () => {
  const SESSION_STORAGE_KEY = 'qPandaStudioCurrentSession';
  const SPLASH_SHOWN_KEY = 'qPandaStudioSplashShown';
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash only once per session
    const splashShown = sessionStorage.getItem(SPLASH_SHOWN_KEY);
    return !splashShown;
  });
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>(Screen.Home);
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.None);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [theme, setTheme] = useState<ThemeName>('qPanda');
  
  // API health state
  const [isApiHealthy, setIsApiHealthy] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isCheckingApi, setIsCheckingApi] = useState<boolean>(true);

  // State for SceneShift editor history
  const [sceneShiftHistory, setSceneShiftHistory] = useState<string[]>([]);
  const [sceneShiftHistoryIndex, setSceneShiftHistoryIndex] = useState<number>(-1);
  const hasHydratedSession = useRef(false);

  const restoreSessionFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as PersistedSessionState;
      if (parsed?.originalImage && typeof parsed.originalImage.dataUrl === 'string' && typeof parsed.originalImage.base64 === 'string' && typeof parsed.originalImage.mimeType === 'string') {
        setOriginalImage({
          dataUrl: parsed.originalImage.dataUrl,
          base64: parsed.originalImage.base64,
          mimeType: parsed.originalImage.mimeType,
        });
      }

      if (parsed?.screen && isScreenValue(parsed.screen)) {
        setScreen(parsed.screen);
      }

      if (parsed?.editorMode && isEditorModeValue(parsed.editorMode)) {
        setEditorMode(parsed.editorMode);
      }
    } catch (e) {
      console.error('Failed to restore session state from localStorage', e);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      hasHydratedSession.current = true;
    }
  }, [SESSION_STORAGE_KEY]);

  const handleScreenChange = useCallback((nextScreen: Screen) => {
    setScreen(nextScreen);
    if (nextScreen !== Screen.Home) {
      setEditorMode(EditorMode.None);
    }
  }, []);

  const enterEditorMode = useCallback((mode: EditorMode) => {
    setScreen(Screen.Home);
    setEditorMode(mode);
  }, []);

  useEffect(() => {
    restoreSessionFromStorage();
    
    // Check API health on app load
    const performHealthCheck = async () => {
      setIsCheckingApi(true);
      const healthStatus = await checkApiHealth();
      setIsApiHealthy(healthStatus.isHealthy);
      if (!healthStatus.isHealthy) {
        setApiError(healthStatus.error || 'API is not available');
      }
      setIsCheckingApi(false);
    };
    
    performHealthCheck();
  }, [restoreSessionFromStorage]);

  useEffect(() => {
    if (!hasHydratedSession.current) {
      return;
    }

    try {
      if (!originalImage) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return;
      }

      const sessionToPersist: PersistedSessionState = {
        originalImage: {
          dataUrl: originalImage.dataUrl,
          base64: originalImage.base64,
          mimeType: originalImage.mimeType,
        },
        editorMode,
        screen,
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionToPersist));
    } catch (e) {
      console.error('Failed to persist session state', e);
    }
  }, [originalImage, editorMode, screen, SESSION_STORAGE_KEY]);

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
      root.style.setProperty(key, value as string);
    });
    Object.entries(activeTheme.backgroundStyles).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
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
    // Check API health before allowing image upload
    if (!isApiHealthy) {
      setError(apiError || 'API is not available. Please check your API key configuration.');
      return;
    }
    
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
    setScreen(Screen.Home);
  };

  const handleBack = () => {
    if (editorMode !== EditorMode.None) {
      setEditorMode(EditorMode.None);
      return;
    }

    if (screen !== Screen.Home) {
      setScreen(Screen.Home);
      return;
    }

    if (originalImage) {
      const confirmReset = window.confirm('Going back will remove your current upload and any unsaved edits. Do you want to continue?');
      if (confirmReset) {
        handleReset();
      }
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
      return (
        <>
          {!isApiHealthy && !isCheckingApi && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
              <p className="text-red-200 font-semibold mb-2">⚠️ API Connection Failed</p>
              <p className="text-red-100 text-sm">{apiError || 'Cannot connect to Gemini API'}</p>
              <p className="text-red-100 text-xs mt-2">Please check your API key configuration and try refreshing the page.</p>
            </div>
          )}
          {isCheckingApi && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-center">
              <p className="text-blue-200 text-sm">🔄 Checking API connection...</p>
            </div>
          )}
          <ImageUploader onImageSelect={handleImageSelect} />
        </>
      );
    }

    if (editorMode === EditorMode.None) {
      return (
        <div className="w-full flex flex-col items-center">
            <img src={originalImage.dataUrl} alt="Your upload" className="max-w-full w-auto h-auto max-h-[40vh] rounded-2xl shadow-lg mb-6"/>
            
            {!isApiHealthy && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center w-full">
                <p className="text-red-200 text-sm">⚠️ API unavailable - Features disabled</p>
                <p className="text-red-100 text-xs mt-1">{apiError}</p>
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-secondary)]">Choose your magic</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => enterEditorMode(EditorMode.SceneShift)} 
                disabled={!isApiHealthy}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] rounded-full font-bold transition-all transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <MagicIcon className="w-5 h-5"/>
                <span>SceneShift</span>
              </button>
              <button 
                onClick={() => enterEditorMode(EditorMode.MemeSmith)} 
                disabled={!isApiHealthy}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-secondary-text)] rounded-full font-bold transition-all transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <MemeIcon className="w-5 h-5"/>
                <span>MemeSmith</span>
              </button>
              <button 
                onClick={() => enterEditorMode(EditorMode.CloneCast)} 
                disabled={!isApiHealthy}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] text-[var(--color-tertiary-text)] rounded-full font-bold transition-all transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <CloneCastIcon className="w-5 h-5"/>
                <span>CloneCast</span>
              </button>
              <button 
                onClick={() => enterEditorMode(EditorMode.SmartCrop)} 
                disabled={!isApiHealthy}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] rounded-full font-bold transition-all transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <CropIcon className="w-5 h-5"/>
                <span>SmartCrop</span>
              </button>
              <button 
                onClick={() => enterEditorMode(EditorMode.StyleTransfer)} 
                disabled={!isApiHealthy}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-secondary-text)] rounded-full font-bold transition-all transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <StyleIcon className="w-5 h-5"/>
                <span>Styles</span>
              </button>
              <button 
                onClick={() => enterEditorMode(EditorMode.Upscale)} 
                disabled={!isApiHealthy}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] text-[var(--color-tertiary-text)] rounded-full font-bold transition-all transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <UpscaleIcon className="w-5 h-5"/>
                <span>Upscale</span>
              </button>
              <button 
                onClick={() => enterEditorMode(EditorMode.GifCreator)} 
                disabled={!isApiHealthy}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] rounded-full font-bold transition-all transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <GifIcon className="w-5 h-5"/>
                <span>GIF Maker</span>
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

    if (editorMode === EditorMode.SmartCrop) {
      return <SmartCropEditor image={originalImage} onSave={handleSaveImage} />;
    }

    if (editorMode === EditorMode.StyleTransfer) {
      return <StyleTransferEditor image={originalImage} onSave={handleSaveImage} />;
    }

    if (editorMode === EditorMode.Upscale) {
      return <UpscaleEditor image={originalImage} onSave={handleSaveImage} />;
    }

    if (editorMode === EditorMode.GifCreator) {
      return <GifCreatorEditor image={originalImage} onSave={handleSaveImage} />;
    }

    return null;
  };

  const showHeaderBack = editorMode !== EditorMode.None || screen !== Screen.Home || originalImage !== null;

  return (
  <>
    {/* Splash Screen - Render first for proper layering */}
    {showSplash && (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
          sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
        }}
      />
    )}

    <div className="w-full h-full bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans flex justify-center items-center p-0 sm:p-4 relative overflow-hidden">

      {/* The Phone Mockup */}
      <div
        className="w-full h-[100dvh] flex flex-col sm:max-w-[400px] sm:h-[90vh] sm:max-h-[850px] sm:rounded-[40px] sm:shadow-2xl sm:border-[10px] sm:border-[var(--color-bg-tertiary)] overflow-hidden relative"
        style={{
            backgroundColor: 'var(--color-bg-primary)',
            backgroundImage: 'var(--bg-primary-image)',
        }}
      >
        <Header onBack={showHeaderBack ? handleBack : undefined} />
        <main className="flex-1 overflow-y-auto min-h-0">
          <div
            key={screen}
            className="w-full max-w-md mx-auto p-4 animate-screen-fade-in"
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
        <BottomNav activeScreen={screen} setScreen={handleScreenChange} />
      </div>
    </div>
  </>
  );
};

export default App;