import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { UserProfile } from '../types/index.js';

const module2Schema: Schema = {
    type: Type.OBJECT,
    properties: {
        skill: { type: Type.STRING },
        level: { type: Type.STRING },
        tools: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        goal: { type: Type.STRING },
        timeline: { type: Type.STRING },
        experience: { type: Type.STRING },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        preferences: {
            type: Type.OBJECT,
            properties: {
                learning_style: { type: Type.STRING },
                work_type: { type: Type.STRING }
            },
            required: ["learning_style", "work_type"]
        }
    },
    required: ["skill", "level", "tools", "goal", "timeline", "experience", "strengths", "weaknesses", "preferences"]
};

export async function buildUserProfile(userGoal: string, questionsAndAnswers: Record<string, string>): Promise<UserProfile | null> {
    const systemInstruction = `
You are the User Profile Builder (Module 2) for AI Success OS.
Your PURPOSE is to convert the user's base goal and their answers to profiling questions into a highly structured USER PROFILE JSON.
INSTRUCTIONS:
You will be provided with the user's initial goal and a dictionary of the questions they were asked alongside their answers.
Analyze their responses to infer their true skill level, preferences, strengths, weaknesses, and tools.
Fill out the structured JSON object completely. Do not leave fields empty; put a reasonable default or "Unknown" if you absolutely cannot infer from context.
`;

    const prompt = `
Initial Goal: "${userGoal}"

Q&A Responses:
${Object.entries(questionsAndAnswers).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}
`;

    return await generateStructuredOutput<UserProfile>(
        prompt, 
        systemInstruction, 
        module2Schema
    );
}
