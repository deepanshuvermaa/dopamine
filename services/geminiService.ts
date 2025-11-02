import { GoogleGenAI, Type } from "@google/genai";
import type { KnowledgeContent, KnowledgeSchema } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';
const videoModel = 'veo-3.1-fast-generate-preview';

const knowledgeSchema = {
  type: Type.OBJECT,
  properties: {
    fact: {
      type: Type.STRING,
      description: 'A short, interesting, and obscure fact from topics like science, history, or nature. Should be surprising and easily digestible.',
    },
    funnyCaption: {
      type: Type.STRING,
      description: 'A witty, meme-style caption that relates to the fact in a humorous way. Should be short and punchy.',
    },
    mediaType: {
        type: Type.STRING,
        enum: ['image', 'video'],
        description: "Choose 'image' for a static meme. Choose 'video' for a short, looping, silent animation, similar to a modern GIF. Make videos/GIFs appear about 20-25% of the time."
    },
    mediaPrompt: {
      type: Type.STRING,
      description: 'A detailed, creative prompt. For an image, describe a photorealistic or stylized scene. For a video, describe a 4-second looping action that is expressive and humorous, perfect for a reaction GIF.',
    },
  },
  required: ['fact', 'funnyCaption', 'mediaType', 'mediaPrompt'],
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


export const generateKnowledgeContent = async (preferences: string[] = [], region: string): Promise<KnowledgeContent> => {
  
  const generateTextPrompt = `
    You are a witty and culturally-aware AI that creates 'knowledge memes' for a global audience with a local touch.
    Your goal is to provide a fascinating, obscure, or surprising fact and present it in a humorous way that resonates with current internet culture.

    **CRITICAL CONTEXT: The user is from ${region}.**
    You MUST tailor the fact, and especially the humor, to be highly relevant and engaging for someone from this country.
    - **Humor & Slang:** Use humor, slang, and cultural references that are popular in ${region}. For example, for "India", you might reference Bollywood or cricket. For the "United Kingdom", you could use British slang or wit.
    - **Fact Selection:** If possible, select facts related to ${region}'s history, inventions, or culture, but only if they are genuinely surprising. Otherwise, use a globally interesting fact but frame the humor for a ${region} audience.
    
    **Topic Preference:** ${preferences.length > 0 ? `The fact must be from one of the following topics: ${preferences.join(', ')}.` : 'Pick a random interesting topic.'}

    **Meme Style:** The caption should be in the style of modern, viral internet memes. Think short, punchy, relatable, and slightly ironic or absurd. Use the 'video' mediaType to create expressive, GIF-style reactions where appropriate.

    Generate a JSON object based on the provided schema. The fact should be easily digestible in a few seconds. Do not repeat facts.
  `;

  // Step 1: Generate the fact, caption, and media prompt
  const textResponse = await ai.models.generateContent({
    model: textModel,
    contents: generateTextPrompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: knowledgeSchema,
      temperature: 1.0,
    },
  });

  const textDataString = textResponse.text.trim();
  const textData: KnowledgeSchema = JSON.parse(textDataString);
  
  if (!textData.fact || !textData.funnyCaption || !textData.mediaPrompt || !textData.mediaType) {
      throw new Error("Failed to generate complete knowledge content.");
  }
    let mediaUrl: string;

    if (textData.mediaType === 'video') {
        let operation = await ai.models.generateVideos({
            model: videoModel,
            prompt: textData.mediaPrompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16'
            }
        });
        
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Failed to generate video URL.");
        }
        
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download video file: ${videoResponse.statusText}`);
        }
        const videoBlob = await videoResponse.blob();
        mediaUrl = await blobToBase64(videoBlob);

    } else { // 'image'
        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: textData.mediaPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '9:16',
            },
        });

        const base64ImageBytes = imageResponse.generatedImages[0]?.image?.imageBytes;
        if (!base64ImageBytes) {
            throw new Error("Failed to generate image.");
        }
        mediaUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
    }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    fact: textData.fact,
    funnyCaption: textData.funnyCaption,
    mediaUrl: mediaUrl,
    mediaType: textData.mediaType,
  };
};

export const generateKnowledgeBatch = async (preferences: string[], count: number, region: string): Promise<KnowledgeContent[]> => {
  const promises = Array(count).fill(null).map(() => generateKnowledgeContent(preferences, region));
  
  const results = await Promise.allSettled(promises);
  
  const successfulContent = results
    .filter(result => result.status === 'fulfilled')
    .map(result => (result as PromiseFulfilledResult<KnowledgeContent>).value);

  if (successfulContent.length === 0) {
    const firstError = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined;
    console.error("Batch generation failed. Reason:", firstError?.reason);
    throw new Error("Failed to generate any content. Please check the connection or API key.");
  }

  return successfulContent;
};

export const getExplanation = async (fact: string, mode: 'simple' | 'deep'): Promise<string> => {
    const prompt = mode === 'simple'
        ? `A user wants a simple explanation of a fact. Explain the following fact in one or two short paragraphs, as if you're talking to a curious teenager. Keep it clear, concise, and engaging.\n\nFact: "${fact}"`
        : `A user wants a detailed explanation of a fact. Go deeper into the following fact. Provide more context, history, or related interesting details. Aim for a few well-structured paragraphs.\n\nFact: "${fact}"`;

    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error(`Error getting AI explanation (mode: ${mode}):`, error);
        throw new Error('Failed to get explanation from AI.');
    }
}