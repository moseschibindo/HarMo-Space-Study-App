import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const summarizeMaterial = async (title: string, description: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an academic assistant. Please provide a concise summary and 3 key study takeaways for the following study material:
      Title: ${title}
      Category: ${category}
      Description: ${description}
      
      Format the response in a clean, professional way with emojis.`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate summary. Please try again later.");
  }
};
