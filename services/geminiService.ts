
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { CloneCastPose } from "../types";

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

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY as string }) : null;

const handleGeminiError = (error: unknown, context: string): Error => {
    console.error(`Error during ${context}:`, error);
    if (error instanceof Error) {
        return new Error(`API Error during ${context}: ${error.message}`);
    }
    return new Error(`An unknown error occurred during ${context}.`);
};

export const editImageWithScene = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!ai) {
    throw new Error("API Key is not configured");
  }
  try {
    const response = await ai.models.generateContent({
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
    });

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
  if (!ai) {
    throw new Error("API Key is not configured");
  }
  try {
    const response = await ai.models.generateContent({
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
    });
    
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

        const response = await ai.models.generateContent({
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
        });

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
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

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