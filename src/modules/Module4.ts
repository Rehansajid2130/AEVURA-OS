import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { UserProfile } from '../types/index.js';

export interface RoadmapItem {
    level: number;
    title: string;
    description: string;
}

export interface Module4Output {
    roadmap: RoadmapItem[];
}

const module4Schema: Schema = {
    type: Type.OBJECT,
    properties: {
        roadmap: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    level: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["level", "title", "description"]
            },
            description: "A fun progression tree consisting of exactly 3 to 4 levels/milestones."
        }
    },
    required: ["roadmap"]
};

export async function generateRoadmap(userProfile: UserProfile, goalAnalysis: any): Promise<Module4Output | null> {
    const systemInstruction = `
You are the Learning Roadmap Generator (Module 4) for AI Success OS.
Your PURPOSE is to create a fun, highly engaging starter progression tree based on the user's profile and goal analysis.
INSTRUCTIONS:
You will receive the User Profile and the output of the Goal Analyzer.
DO NOT CREATE A DAUNTING 60-DAY PLAN.
Produce a 'Starter Fun-Map' Array. Each item represents a milestone or 'Level'.
Keep it to STRICTLY 3 to 4 Levels total so it is extremely bite-sized and motivating.
Make the titles sound fun and gamified (e.g., 'Level 1: Unlocking the Basics').
`;

    const prompt = `
User Profile:
${JSON.stringify(userProfile, null, 2)}

Goal Analysis Context:
${JSON.stringify(goalAnalysis, null, 2)}
`;

    return await generateStructuredOutput<Module4Output>(
        prompt, 
        systemInstruction, 
        module4Schema
    );
}
