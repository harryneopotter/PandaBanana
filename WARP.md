# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Q Panda Studio is an AI-powered creative photo studio built with React 19, TypeScript, and Google's Gemini AI. The application provides multiple creative tools for transforming images including SceneShift (environment transformation), MemeSmith (meme generation), CloneCast (artistic variations), and Dream Canvas (text-to-image generation).

## Common Commands

### Development Server
```bash
npm run dev
```
Note: This starts the Vite development server on http://localhost:5173. Do not run this command directly in terminal - use PowerShell or another method to avoid terminal hijacking.

### Build & Preview
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Package Management
```bash
npm install          # Install dependencies
npm install <package> # Add new dependency
```

## Environment Setup

The application requires a Gemini API key from Google AI Studio. Create a `.env.local` file:
```bash
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
```

## Architecture Overview

### State Management
- Uses React hooks for state management with no external state library
- Main app state includes: originalImage, selectedScene, isLoading, screen navigation, editor modes
- Local storage integration for saved images and theme preferences
- History management for SceneShift editor with undo/redo functionality

### Core Application Flow
1. **Image Upload**: Users upload images via ImageUploader component
2. **Mode Selection**: Choose between SceneShift, MemeSmith, CloneCast, or Dream Canvas
3. **AI Processing**: Images are processed using Gemini AI through geminiService.ts
4. **Result Display**: Generated images are displayed with save/download options
5. **Local Storage**: Results saved to browser localStorage for persistence

### Component Architecture
- **App.tsx**: Main container managing global state and routing between screens
- **Screen Components**: Home, Dream, Saved, Settings managed via Screen enum
- **Editor Components**: SceneShiftEditor, MemeSmithEditor, CloneCastEditor for different creation modes
- **Navigation**: Header (with back functionality) and BottomNav for screen switching
- **Utility Components**: ImageUploader, LoadingShimmer, SavedImages, Settings

### AI Service Integration
- **geminiService.ts**: Central service for all Gemini AI interactions
- **Scene Editing**: Uses gemini-2.5-flash-image-preview model for image transformation
- **Meme Generation**: Analyzes images and generates captions with structured JSON responses
- **Clone Cast**: Generates variations with different poses (walking, leaning, portrait)
- **Dream Canvas**: Text-to-image generation using imagen-4.0-generate-001 model

### Theme System
- Dynamic CSS custom properties system defined in themes.ts
- Three built-in themes: Q Panda (default), Mint, Crimson
- Theme persistence via localStorage
- Runtime theme switching updates CSS custom properties on document root

### Type Safety
- Comprehensive TypeScript definitions in types.ts
- Enums for Scene, Screen, EditorMode, CloneCastPose, ThemeName
- Strict typing for all AI service responses and component props

### Build Configuration
- Vite build system with TypeScript support
- Environment variable injection for API keys via vite.config.ts
- Path aliases configured (@/* points to root directory)
- React JSX transform with fast refresh

## Key Development Patterns

### Error Handling
- Centralized error handling in geminiService with handleGeminiError function
- User-friendly error messages displayed in UI error states
- Graceful fallbacks for localStorage access failures

### Image Processing Pipeline
1. File validation and conversion to base64
2. API request to appropriate Gemini model
3. Response parsing and error handling
4. Data URL generation for display
5. Optional save to localStorage

### Mobile-First Design
- Responsive design with mobile-first approach
- Phone mockup container on desktop with side content
- Touch-friendly interface with large buttons and gestures
- Optimized for portrait orientation

### Local Storage Strategy
- Saved images stored as base64 data URLs in JSON array
- Theme preference persistence
- Error handling for storage quota and access restrictions
- Cleanup mechanisms for corrupted data

## File Structure Notes

### Root Level Files
- `App.tsx`: Main application component with state management
- `index.tsx`: React DOM rendering entry point
- `types.ts`: TypeScript definitions for all application types
- `constants.ts`: Static configuration like SCENE_OPTIONS
- `themes.ts`: Theme definitions and CSS custom properties

### Components Directory
Each component is self-contained with specific responsibilities:
- Editors handle their respective AI processing modes
- UI components are reusable and theme-aware
- Navigation components manage screen transitions

### Services Directory
- `geminiService.ts`: All AI API interactions with proper error handling and type safety

## API Integration Notes

### Google Gemini AI Models
- **Image Editing**: gemini-2.5-flash-image-preview for scene transformations
- **Text Analysis**: gemini-2.5-flash for meme caption generation  
- **Image Generation**: imagen-4.0-generate-001 for text-to-image

### Rate Limiting & Error Handling
- API errors are caught and transformed into user-friendly messages
- No built-in rate limiting - relies on API provider limits
- Graceful degradation when API is unavailable

## Development Guidelines

When working with this codebase:

1. **Follow React 19 patterns**: Use functional components with hooks, leverage React 19 features
2. **Maintain type safety**: Add proper TypeScript types for new features
3. **Theme consistency**: Use CSS custom properties for all styling to support theme switching
4. **Error boundaries**: Implement proper error handling for all async operations
5. **Mobile optimization**: Test all changes on mobile viewports first
6. **API efficiency**: Batch API calls where possible, implement proper loading states
7. **Local storage**: Handle storage failures gracefully with fallback behaviors

## Testing Considerations

- Test image upload with various file formats and sizes
- Verify theme switching functionality across all components
- Test offline behavior and API failure scenarios
- Validate mobile responsiveness across different screen sizes
- Test localStorage edge cases (quota exceeded, disabled storage)
