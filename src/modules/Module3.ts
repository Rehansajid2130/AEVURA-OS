import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { UserProfile } from '../types/index.js';

export interface Module3Output {
    goal_type: string;
    difficulty: string;
    estimated_time: string;
    required_skills: string[];
    analysis: string;
}

const module3Schema: Schema = {
    type: Type.OBJECT,
    properties: {
        goal_type: { type: Type.STRING },
        difficulty: { type: Type.STRING },
        estimated_time: { type: Type.STRING },
        required_skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        analysis: { 
            type: Type.STRING,
            description: "A friendly, hype, hyper-motivating life-coach snippet. STRICTLY maximum 2-3 short sentences."
        }
    },
    required: ["goal_type", "difficulty", "estimated_time", "required_skills", "analysis"]
};

export async function analyzeGoal(userGoal: string, userProfile: UserProfile): Promise<Module3Output | null> {
    const systemInstruction = `
You are the Goal Analyzer (Module 3) for AI Success OS.
Your PURPOSE is to understand the complexity and direction of the user's goal based on their current profile.
INSTRUCTIONS:
You will be provided with the user's target goal and their detailed USER PROFILE.
Determine the goal type, difficulty relative to their current level, estimated time to completion, and required skills.

CRITICAL TONE RULES FOR 'analysis' FIELD:
1. You MUST sound like a friendly, hyper-motivating life-coach.
2. The user is easily discouraged. Focus on their strengths and frame gaps as exciting challenges.
3. The 'analysis' MUST BE STRICTLY 2 or 3 short, punchy sentences maximum. DO NOT write a long, boring paragraph.
`;

    const prompt = `
Goal: "${userGoal}"

User Profile:
${JSON.stringify(userProfile, null, 2)}
`;

    return await generateStructuredOutput<Module3Output>(
        prompt, 
        systemInstruction, 
        module3Schema
    );
}
