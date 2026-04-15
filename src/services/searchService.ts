import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const expandSearchQuery = async (query: string): Promise<string[]> => {
  if (!query || query.length < 3) return [query.toLowerCase()];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an intelligent search assistant. Given a search query, provide a list of 5-8 related keywords, synonyms, or categories that a user might be interested in. 
      For example, if the query is "phone", return ["phone", "mobile", "smartphone", "iphone", "android", "samsung", "electronics"].
      If the query is "laptop", return ["laptop", "computer", "macbook", "pc", "notebook", "dell", "hp", "electronics"].
      
      Query: "${query}"
      
      Return ONLY a JSON array of strings.`,
      config: {
        systemInstruction: "You are an intelligent search assistant. You expand search queries into relevant keywords for better search results. Return ONLY a JSON array of strings.",
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    
    // Clean the response text to ensure it's valid JSON
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const keywords = JSON.parse(jsonMatch[0]);
      // Ensure the original query is included
      if (!keywords.includes(query.toLowerCase())) {
        keywords.unshift(query.toLowerCase());
      }
      return keywords.map((k: string) => k.toLowerCase());
    }
    
    return [query.toLowerCase()];
  } catch (error) {
    console.error("Error expanding search query:", error);
    return [query.toLowerCase()];
  }
};

export const intelligentFilter = (item: any, keywords: string[], fields: string[]): boolean => {
  if (!keywords || keywords.length === 0) return true;
  
  return keywords.some(keyword => {
    return fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(keyword.toLowerCase());
      }
      return false;
    });
  });
};
