
// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, LessonSegment, StorySegment } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getGeminiClient = () => {
  if (!aiInstance) {
    // The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
    // Assume this variable is pre-configured, valid, and accessible.
    // As per guidelines, 'process.env.API_KEY' is injected automatically and guaranteed to be available.
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

export const generateLessonSegment = async (
  topic: string,
  lessonHistory: LessonSegment[],
  userQuestion?: string
): Promise<string> => {
  try {
    const ai = getGeminiClient();
    let prompt = `You are Luno the Lion, a friendly and knowledgeable tutor for kids under 12. Guide a child through a lesson on "${topic}". Keep explanations simple, engaging, and in short paragraphs.

Current lesson history:
${lessonHistory.map(s => `${s.speaker === 'luno' ? 'Luno' : 'You'}: ${s.text}`).join('\n')}

`;

    if (userQuestion) {
      prompt += `The child just asked: "${userQuestion}". Please answer their question clearly and then continue the lesson based on the previous segment.`;
    } else {
      prompt += `Provide the next part of the lesson.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are Luno the Lion, a friendly and knowledgeable tutor for kids under 12. Guide a child through a lesson on "${topic}". Keep explanations simple, engaging, and in short paragraphs.`,
        maxOutputTokens: 150,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 50 },
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating lesson segment:", error);
    return userQuestion
      ? "Oops! I'm having trouble thinking. Could you try asking again or move to the next part?"
      : "Let's learn something new!";
  }
};

export const generateStorySegment = async (
  genre: string,
  storyHistory: StorySegment[],
  userChoice?: string
): Promise<StorySegment | null> => {
  try {
    const ai = getGeminiClient();
    let prompt = `You are Luno the Lion, a magical storyteller for kids under 12. Tell an interactive story in the "${genre}" genre. Keep each segment short and exciting. After a few segments, offer two distinct choices for the child to decide what happens next.

Current story:
${storyHistory.map(s => s.text + (s.choices ? `\nChoices: ${s.choices.join(' or ')}` : '')).join('\n')}
`;

    if (userChoice) {
      prompt += `The child chose: "${userChoice}". Continue the story based on this choice.`;
    } else {
      prompt += `Start the story, or provide the next segment.`;
    }

    // Fix: Changed prompt to request 'text' property instead of 'storyText' to match StorySegment interface.
    prompt += `\n\nFormat your response as a JSON object with "text" and an optional "choices" array (2 choices).`;


    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are Luno the Lion, a magical storyteller for kids under 12. Tell an interactive story in the "${genre}" genre. Keep each segment short and exciting. After a few segments, offer two distinct choices for the child to decide what happens next.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            // Fix: Changed responseSchema to define 'text' property instead of 'storyText'.
            text: { type: Type.STRING },
            choices: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              maxItems: 2,
              minItems: 2,
              description: "Optional choices for the user to make to continue the story. Provide exactly two choices when present."
            }
          },
          // Fix: Changed required property to 'text'.
          required: ["text"],
        },
        maxOutputTokens: 250,
        temperature: 0.9,
        thinkingConfig: { thinkingBudget: 120 },
      },
    });

    const jsonStr = response.text.trim();
    const storySegment: StorySegment = JSON.parse(jsonStr);

    // Fix: Validated 'text' property instead of 'storyText'.
    if (storySegment.text) {
      return storySegment;
    } else {
      console.error("Invalid story segment format received:", storySegment);
      return { text: "The story took an unexpected turn and needs to restart. Let's try again!" };
    }

  } catch (error) {
    console.error("Error generating story segment:", error);
    return { text: "Luno got tangled in his own story! Let's try to tell a different one.", choices: [] };
  }
};
