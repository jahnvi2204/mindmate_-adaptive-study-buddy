import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LearningStyle, StudyMaterial, StudyPlanDay, QuizQuestion } from "../types";

// Resolve API key from Vite env (dev/build) or process.env as a fallback.
const apiKey =
  // Vite injects env vars under import.meta.env at build/runtime
  // We support both plain and VITE_ prefix in case the user chooses either.
  import.meta.env.GEMINI_API_KEY ??
  import.meta.env.VITE_GEMINI_API_KEY ??
  process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY. Set it in .env.local");
}

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

const MODEL_FAST = "gemini-2.5-flash";
const MODEL_REASONING = "gemini-2.5-flash"; // Flash is capable enough for this and faster

// --- Helper to combine materials into context ---
const getContextFromMaterials = (materials: StudyMaterial[]): string => {
  if (materials.length === 0) return "No specific study materials provided.";
  
  // Truncate to avoid context limit issues if massive, though 2.5 Flash has huge context.
  // We'll take the first 50k chars from combined materials for safety in this demo.
  const combined = materials.map(m => `--- SOURCE: ${m.title} ---\n${m.content}\n`).join("\n");
  return combined.slice(0, 100000); 
};

// --- Generate Study Plan ---
export const generateStudyPlan = async (materials: StudyMaterial[], durationDays: number = 5): Promise<StudyPlanDay[]> => {
  const context = getContextFromMaterials(materials);
  
  const prompt = `
    You are an expert curriculum designer. 
    Create a ${durationDays}-day study plan based strictly on the provided learning materials.
    The plan should be logical, progressive, and cover key concepts found in the source text.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        day: { type: Type.INTEGER },
        topic: { type: Type.STRING },
        focusArea: { type: Type.STRING },
        activities: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING } 
        }
      },
      required: ["day", "topic", "focusArea", "activities"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: [
        { role: 'user', parts: [{ text: `CONTEXT MATERIALS:\n${context}` }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a helpful study planner."
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText) as StudyPlanDay[];
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan.");
  }
};

// --- Generate Quiz ---
export const generateQuiz = async (materials: StudyMaterial[], topic?: string): Promise<QuizQuestion[]> => {
  const context = getContextFromMaterials(materials);
  const topicPrompt = topic ? `Focus specifically on the topic: "${topic}".` : "Cover a mix of important topics from the material.";

  const prompt = `
    Generate 5 multiple-choice questions based on the provided study materials.
    ${topicPrompt}
    Ensure the questions test understanding, not just memorization.
    Provide 4 options per question.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }
        },
        correctAnswerIndex: { type: Type.INTEGER, description: "Index (0-3) of the correct answer" },
        explanation: { type: Type.STRING, description: "Why this answer is correct" }
      },
      required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: [
        { role: 'user', parts: [{ text: `CONTEXT MATERIALS:\n${context}` }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz.");
  }
};

// --- Explain Topic (Chat/Tutor) ---
export const explainTopic = async (
  query: string, 
  materials: StudyMaterial[], 
  style: LearningStyle,
  chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[]
): Promise<string> => {
  const context = getContextFromMaterials(materials);

  let styleInstruction = "";
  switch (style) {
    case LearningStyle.SIMPLE:
      styleInstruction = "Explain simply and clearly, avoiding jargon where possible. Explain it like I'm 12.";
      break;
    case LearningStyle.DETAILED:
      styleInstruction = "Provide a comprehensive, academic explanation with technical details and nuance.";
      break;
    case LearningStyle.ANALOGY:
      styleInstruction = "Use real-world analogies and metaphors to explain the concepts.";
      break;
    case LearningStyle.SOCHRATIC:
      styleInstruction = "Don't give the answer directly. Ask guiding questions to help the user derive the answer. Be a tutor.";
      break;
  }

  const systemInstruction = `
    You are MindMate, an AI study buddy. 
    Use the provided CONTEXT MATERIALS to answer questions.
    If the answer isn't in the materials, use your general knowledge but mention that it wasn't in the notes.
    Adopt the following teaching style: ${styleInstruction}
  `;

  try {
    // We append the new message to history manually for the request
    const contents = [
      { role: 'user', parts: [{ text: `CONTEXT MATERIALS (Use this as your primary knowledge base):\n${context}` }] },
      ...chatHistory,
      { role: 'user', parts: [{ text: query }] }
    ];

    const response = await ai.models.generateContent({
      model: MODEL_REASONING,
      contents: contents as any, // Cast to avoid strict type mismatch on role strings if distinct types exist
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("Error explaining topic:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};