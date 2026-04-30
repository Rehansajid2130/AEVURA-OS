import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { UserProfile } from '../types/index.js';

export interface Module7Output {
    options: string[];
    comparison: string;
    recommendation: string;
    reasoning: string;
}

const module7Schema: Schema = {
    type: Type.OBJECT,
    properties: {
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        comparison: { type: Type.STRING },
        recommendation: { type: Type.STRING },
        reasoning: { type: Type.STRING }
    },
    required: ["options", "comparison", "recommendation", "reasoning"]
};

export async function decideOption(question: string, userProfile: UserProfile): Promise<Module7Output | null> {
    const systemInstruction = `
You are the Decision Engine (Module 7) for AI Success OS.
Your PURPOSE is to help the user choose between multiple options based specifically on their profile.
INSTRUCTIONS:
You will receive a user question (e.g. "Should I learn Next.js or raw React first?") and their User Profile.
Present the options, compare them, give a definitive recommendation, and justify the reasoning using the user's explicit profile (their level, timeline, goals, etc.).
`;

    const prompt = `
Question: "${question}"

User Profile:
${JSON.stringify(userProfile, null, 2)}
`;

    return await generateStructuredOutput<Module7Output>(
        prompt, 
        systemInstruction, 
        module7Schema
    );
}
