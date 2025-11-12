// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getGeminiClient = () => {
  if (!aiInstance) {
    const apiKey = window.process.env.API_KEY;
    // The API key is assumed to be valid and accessible. No warning for placeholder string.
    if (!apiKey) {
      throw new Error("Gemini API Key is not configured.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getFunFact = async (topic: string): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const prompt = `Tell me a fun and interesting "Did You Know?" fact about ${topic} for kids (under 12 years old). Keep it to one concise sentence.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 25 },
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching fun fact:", error);
    return "Did you know that the Earth is a giant magnet?"; // Fallback
  }
};

export const generateQuizQuestion = async (category: string, difficulty: string): Promise<QuizQuestion | null> => {
  try {
    const ai = getGeminiClient();
    const prompt = `Generate a multiple-choice quiz question about ${category} for a ${difficulty} difficulty level, suitable for kids (under 12 years old). Provide 4 options, and indicate the correct answer.
    
    Format the response as a JSON object with the following structure:
    {
      "question": "The quiz question.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option from the options array."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
          },
          required: ["question", "options", "answer"],
        },
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 100 },
      },
    });

    const jsonStr = response.text.trim();
    const quizQuestion: QuizQuestion = JSON.parse(jsonStr);

    // Basic validation
    if (quizQuestion.question && quizQuestion.options && quizQuestion.options.length === 4 && quizQuestion.answer) {
      return quizQuestion;
    } else {
      console.error("Invalid quiz question format received:", quizQuestion);
      return null;
    }

  } catch (error) {
    console.error("Error generating quiz question:", error);
    return {
      question: `What color is the sky?`,
      options: ['Red', 'Green', 'Blue', 'Yellow'],
      answer: 'Blue',
    }; // Fallback quiz question
  }
};