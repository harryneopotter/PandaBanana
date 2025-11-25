
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { CloneCastPose } from "../types";

// API proxy configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const USE_PROXY = import.meta.env.VITE_USE_API_PROXY === 'true';

// Direct API client (fallback when proxy is disabled)
const ai = !USE_PROXY && process.env.API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.API_KEY as string }) 
  : null;

export const fileToBase64 = (file: File): Promise<{imageData: string; mimeType: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        const result = reader.result as string;
        if (!result || !result.startsWith('data:')) {
             return reject(new Error("Invalid file data."));
        }
        const parts = result.split(',');
        if (parts.length !== 2) {
            return reject(new Error("Invalid data URL format"));
        }
        const imageData = parts[1];
        const mimeType = result.substring(result.indexOf(":") + 1, result.indexOf(";"));
        resolve({ imageData, mimeType });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const handleGeminiError = (error: unknown, context: string): Error => {
    console.error(`Error during ${context}:`, error);
    if (error instanceof Error) {
        return new Error(`API Error during ${context}: ${error.message}`);
    }
    return new Error(`An unknown error occurred during ${context}.`);
};

// Proxy API calls through backend server with rate limiting
const callProxyAPI = async (endpoint: string, body: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    
    // Handle rate limit errors specifically
    if (response.status === 429) {
      throw new Error(errorData.error || 'Rate limit exceeded. Please try again later.');
    }
    
    throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Health check to verify API connectivity
export const checkApiHealth = async (): Promise<{ isHealthy: boolean; error?: string }> => {
  try {
    // Use a minimal test request to check if the API is working
    const testRequestBody = {
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            text: 'test',
          },
        ],
      },
    };

    if (USE_PROXY) {
      // Check if proxy server is reachable and API key is valid
      const response = await fetch(`${API_BASE_URL}/api/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequestBody),
      });

      if (response.status === 401 || response.status === 403) {
        return { isHealthy: false, error: 'Invalid or missing API key' };
      }

      if (!response.ok && response.status !== 400) {
        // 400 is expected for our test request, any other error is a problem
        return { isHealthy: false, error: 'API server unreachable' };
      }

      return { isHealthy: true };
    } else {
      // Direct API check
      if (!ai) {
        return { isHealthy: false, error: 'API key not configured' };
      }

      // Test with a simple request
      await ai.models.generateContent(testRequestBody);
      return { isHealthy: true };
    }
  } catch (error) {
    console.error('API health check failed:', error);
    
    if (error instanceof Error) {
      // Check for common API key errors
      if (error.message.includes('API key') || 
          error.message.includes('401') || 
          error.message.includes('403') ||
          error.message.includes('PERMISSION_DENIED')) {
        return { isHealthy: false, error: 'Invalid or missing API key' };
      }
      
      if (error.message.includes('ECONNREFUSED') || 
          error.message.includes('Failed to fetch')) {
        return { isHealthy: false, error: 'Cannot connect to API server' };
      }
      
      return { isHealthy: false, error: error.message };
    }
    
    return { isHealthy: false, error: 'Unknown API error' };
  }
};

export const editImageWithScene = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const requestBody = {
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Magically transform this photo to look like it was taken during ${prompt}. Retain the original subject and composition. The result should be photorealistic.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    };

    const response = USE_PROXY 
      ? await callProxyAPI('/api/generate-content', requestBody)
      : await ai!.models.generateContent(requestBody);

    const firstCandidate = response.candidates?.[0];
    if (!firstCandidate) {
        throw new Error('No valid candidates returned from the API.');
    }

    for (const part of firstCandidate.content.parts) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No image was generated. The response may contain safety blocks or other issues.');

  } catch (error) {
    throw handleGeminiError(error, 'image scene editing');
  }
};

export const generateMemeCaptions = async (
  base64ImageData: string,
  mimeType: string,
): Promise<{isMemeTemplate: boolean; memeName: string | null; captions: string[]}> => {
  try {
    const requestBody = {
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this image. Is it a known meme template? If so, what is its name? Generate 5 witty, modern meme captions for it, with each caption being a short sentence. Return the result as JSON.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isMemeTemplate: {
              type: Type.BOOLEAN,
              description: 'Whether the image is a known meme template.',
            },
            memeName: {
              type: Type.STRING,
              description: 'The name of the meme template, or null if not applicable.',
            },
            captions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'An array of 5 suggested meme captions.',
            },
          },
          required: ['isMemeTemplate', 'captions'],
        },
      },
    };

    const response = USE_PROXY 
      ? await callProxyAPI('/api/generate-content', requestBody)
      : await ai!.models.generateContent(requestBody);
    
    const jsonText = response.text?.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    
    const parsedJson = JSON.parse(jsonText);

    if (typeof parsedJson.isMemeTemplate !== 'boolean' || !Array.isArray(parsedJson.captions)) {
        throw new Error("Received malformed JSON data from the API.");
    }

    return parsedJson;

  } catch (error) {
    if (error instanceof SyntaxError) {
        console.error('Failed to parse JSON response:', error);
        throw new Error('Received an invalid response from the server.');
    }
    throw handleGeminiError(error, 'meme caption generation');
  }
}

export const generateSinglePose = async (
  base64ImageData: string,
  mimeType: string,
  userPrompt: string,
  pose: CloneCastPose
): Promise<string> => {
    try {
        const poseInstruction = {
            [CloneCastPose.Walking]: 'a full-body shot of them in a walking pose.',
            [CloneCastPose.Leaning]: 'a full-body shot of them casually leaning against something.',
            [CloneCastPose.Portrait]: 'a waist-up portrait shot.'
        };

        const requestBody = {
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
            {
                inlineData: { data: base64ImageData, mimeType: mimeType },
            },
            {
                text: `Re-imagine the person from this photo in a new scene based on the following description: "${userPrompt}". 
                The new image should be ${poseInstruction[pose]} 
                It is crucial to maintain their facial features, hair, and body shape. The result must be photorealistic.`,
            },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
        };

        const response = USE_PROXY 
          ? await callProxyAPI('/api/generate-content', requestBody)
          : await ai!.models.generateContent(requestBody);

        const firstCandidate = response.candidates?.[0];
        if (!firstCandidate) {
            throw new Error(`API returned no valid candidates for the ${pose} pose.`);
        }

        for (const part of firstCandidate.content.parts) {
            if (part.inlineData?.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        
        throw new Error(`No image was generated for the ${pose} pose. This could be due to safety filters.`);
    } catch (error) {
        throw handleGeminiError(error, `generating ${pose} pose`);
    }
};

export const generateImageFromPrompt = async (
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '9:16'
): Promise<string> => {
  try {
    const requestBody = {
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    };

    const response = USE_PROXY 
      ? await callProxyAPI('/api/generate-images', requestBody)
      : await ai!.models.generateImages(requestBody);

    const generatedImage = response.generatedImages?.[0];
    if (!generatedImage || !generatedImage.image?.imageBytes) {
      throw new Error('No image was generated. The prompt may have been blocked or is invalid.');
    }

    const base64ImageBytes: string = generatedImage.image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;

  } catch (error) {
    throw handleGeminiError(error, 'image generation from prompt');
  }
};

export const smartCropImage = async (
  base64ImageData: string,
  mimeType: string,
  targetAspectRatio: string
): Promise<string> => {
  try {
    const requestBody = {
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Create a smart crop of this image for ${targetAspectRatio} aspect ratio. Focus on the most interesting subject or composition. Maintain high quality and ensure the main subject is well-framed. Return a cropped version that works perfectly for this aspect ratio.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    };

    const response = USE_PROXY 
      ? await callProxyAPI('/api/generate-content', requestBody)
      : await ai!.models.generateContent(requestBody);

    const firstCandidate = response.candidates?.[0];
    if (!firstCandidate) {
        throw new Error('No valid candidates returned from the API.');
    }

    for (const part of firstCandidate.content.parts) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No cropped image was generated.');

  } catch (error) {
    throw handleGeminiError(error, 'smart crop');
  }
};

export const applyStyleTransfer = async (
  base64ImageData: string,
  mimeType: string,
  style: string
): Promise<string> => {
  try {
    const requestBody = {
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Transform this image into the artistic style of ${style}. Maintain the composition and subject matter, but completely reimagine it in ${style}'s distinctive style, technique, color palette, and brushwork. The result should look like an authentic artwork in this style.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    };

    const response = USE_PROXY 
      ? await callProxyAPI('/api/generate-content', requestBody)
      : await ai!.models.generateContent(requestBody);

    const firstCandidate = response.candidates?.[0];
    if (!firstCandidate) {
        throw new Error('No valid candidates returned from the API.');
    }

    for (const part of firstCandidate.content.parts) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No styled image was generated.');

  } catch (error) {
    throw handleGeminiError(error, 'style transfer');
  }
};

export const upscaleImage = async (
  base64ImageData: string,
  mimeType: string
): Promise<string> => {
  try {
    const requestBody = {
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Enhance and upscale this image to a higher resolution. Improve sharpness, clarity, and detail while maintaining the original composition. Add realistic texture enhancement and noise reduction. The result should be a high-quality, crisp version of the original.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    };

    const response = USE_PROXY 
      ? await callProxyAPI('/api/generate-content', requestBody)
      : await ai!.models.generateContent(requestBody);

    const firstCandidate = response.candidates?.[0];
    if (!firstCandidate) {
        throw new Error('No valid candidates returned from the API.');
    }

    for (const part of firstCandidate.content.parts) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No upscaled image was generated.');

  } catch (error) {
    throw handleGeminiError(error, 'image upscaling');
  }
};

export const generateGifFrame = async (
  base64ImageData: string,
  mimeType: string,
  framePrompt: string
): Promise<string> => {
  try {
    const requestBody = {
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Create a variation of this image for an animated sequence: ${framePrompt}. Maintain the core subject and composition but apply the specified transformation. The result should be suitable as a frame in an animated GIF.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    };

    const response = USE_PROXY 
      ? await callProxyAPI('/api/generate-content', requestBody)
      : await ai!.models.generateContent(requestBody);

    const firstCandidate = response.candidates?.[0];
    if (!firstCandidate) {
        throw new Error('No valid candidates returned from the API.');
    }

    for (const part of firstCandidate.content.parts) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No frame was generated.');

  } catch (error) {
    throw handleGeminiError(error, 'GIF frame generation');
  }
};