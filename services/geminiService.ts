import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, ValidationResult } from "../types";

// Helper to validate if the input is a single, drawable object
export const validateInput = async (apiKey: string, input: string): Promise<ValidationResult> => {
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are a strict content validator for an art class application for ARGEM (Research Development Education Center).
        
        Analyze the following user input: "${input}".

        Criteria for VALID input:
        1. It must be a single physical object (noun) that can be drawn (e.g., "apple", "chair", "cat").
        2. It must NOT be a verb, abstract concept (e.g., "freedom"), or complex scene.
        3. It must NOT be offensive, sexual, violent, or inappropriate for a school environment.
        4. It must be a single word or a very short compound noun (max 2 words).

        Return a JSON object strictly with this format:
        {
          "isValid": boolean,
          "reason": "string (localized in Turkish, explaining why if invalid)",
          "sanitizedQuery": "string (the english translation of the object for better image generation prompts)"
        }
      `,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from validation model");
    
    return JSON.parse(text) as ValidationResult;
  } catch (error) {
    console.error("Validation error:", error);
    return { 
      isValid: false, 
      reason: "Doğrulama servisi şu anda kullanılamıyor. Lütfen tekrar deneyin." 
    };
  }
};

// Helper to generate a single image
const generateSingleImage = async (ai: GoogleGenAI, objectName: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `Create a charcoal sketch of a ${objectName} in the style of Vincent Van Gogh. 
                   High contrast, black strokes on a white background. 
                   The drawing should look like a rough, expressive sketch with visible hatching and lines.
                   Isolate the object. Do not add background details.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Generation failed for one instance", e);
    return null;
  }
};

export const generateSketches = async (apiKey: string, objectName: string): Promise<GeneratedImage[]> => {
  const ai = new GoogleGenAI({ apiKey });
  
  // We need 3 images. Since numberOfImages might not be reliably supported across all endpoints/models via the SDK wrapper yet 
  // or restricted on some tiers, we strictly execute 3 parallel requests to ensure distinct seeds/outputs.
  
  const promises = [
    generateSingleImage(ai, objectName),
    generateSingleImage(ai, objectName),
    generateSingleImage(ai, objectName)
  ];

  const results = await Promise.all(promises);
  
  const images: GeneratedImage[] = [];
  
  results.forEach((base64, index) => {
    if (base64) {
      images.push({
        id: `${Date.now()}-${index}`,
        url: base64,
        prompt: objectName,
        createdAt: Date.now()
      });
    }
  });

  if (images.length === 0) {
    throw new Error("Görseller oluşturulamadı.");
  }

  return images;
};
