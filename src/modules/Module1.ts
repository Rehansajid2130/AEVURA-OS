import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';

export interface ProfilingQuestion {
    question_text: string;
    options: string[];
}

export interface Module1Output {
    questions: ProfilingQuestion[];
}

const module1Schema: Schema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question_text: { type: Type.STRING },
                    options: { 
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "3 to 4 multiple choice options for the user to pick from."
                    }
                },
                required: ["question_text", "options"]
            },
            description: "An array of 4-5 intelligent, adaptive profiling questions."
        }
    },
    required: ["questions"],
};

export async function generateProfilingQuestions(userGoal: string): Promise<Module1Output | null> {
    const systemInstruction = `
You are the Profiling Question Generator (Module 1) for the AI Success OS.
Your PURPOSE is to deeply understand the user before generating any development or learning plan.
INSTRUCTIONS:
Analyze the user's base goal and generate 4 to 5 short, friendly, and highly readable adaptive questions.
For each question, provide 3 to 4 multiple choice options so the user doesn't have to type if they don't want to. Keep options concise.
These questions should discover their current experience level, tools, timeline, and style.
`;
    
    const prompt = `User goal: "${userGoal}"`;

    return await generateStructuredOutput<Module1Output>(
        prompt, 
        systemInstruction, 
        module1Schema
    );
}
