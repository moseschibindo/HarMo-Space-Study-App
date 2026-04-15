import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateDailyMotivation = async (displayName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, unique, and powerful daily motivational quote for a student named ${displayName}. 
      The quote should be inspiring, professional, and feel like it's coming from "HarMoTech Ventures Company". 
      Keep it under 150 characters. Do not include quotes around the text.`,
      config: {
        systemInstruction: "You are a professional motivational coach from HarMoTech Ventures Company. Your goal is to inspire students to achieve their best in technology and life.",
        temperature: 0.8,
      },
    });

    return response.text || "Keep pushing forward, your potential is limitless. - HarMoTech Ventures Company";
  } catch (error) {
    console.error("Error generating motivation:", error);
    return "Success is not final, failure is not fatal: it is the courage to continue that counts. - HarMoTech Ventures Company";
  }
};
