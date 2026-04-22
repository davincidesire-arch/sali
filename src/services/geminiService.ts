import { GoogleGenAI, Type } from "@google/genai";
import { AIParseResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function parseNaturalLanguageQuery(query: string): Promise<AIParseResult> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("Gemini API key missing. Returning default parse result.");
    return { type: 'all' };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following user query for a service discovery app: "${query}". 
      Extract the service type (plumber, electrician, or all), radius in km (if mentioned), name keywords, and location keywords.
      Return ONLY a JSON object with keys: type, radiusKm, nameKeyword, locationKeywords.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['plumber', 'electrician', 'all'] },
            radiusKm: { type: Type.NUMBER },
            nameKeyword: { type: Type.STRING },
            locationKeywords: { type: Type.STRING },
          },
          required: ["type"],
        },
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as AIParseResult;
    }
  } catch (error) {
    console.error("Error parsing query with Gemini:", error);
  }

  return { type: 'all' };
}
