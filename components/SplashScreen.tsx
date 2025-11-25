import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.src = '/banana-panda.jpg';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Proceed even if image fails to load
  }, []);

  useEffect(() => {
    // Wait for image to load before starting timers
    if (!imageLoaded) return;

    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complete splash screen after fade animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800); // 2s display + 0.8s fade

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, imageLoaded]);

  // Don't render until image is loaded
  if (!imageLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          animation: 'splashPulse 1.5s ease-in-out infinite',
        }}
      >
        {/* Logo Image */}
        <img
          src="/banana-panda.jpg"
          alt="Banana Panda"
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        />

        {/* App Name */}
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Banana Panda
          </h1>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#666',
              margin: '0.5rem 0 0 0',
              fontWeight: 500,
            }}
          >
            AI-Powered Creative Studio
          </p>
        </div>

        {/* Loading Indicator */}
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
