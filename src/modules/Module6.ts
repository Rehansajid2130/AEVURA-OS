import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { UserProfile } from '../types/index.js';

export interface Module6Output {
    proposal: string;
    tips: string[];
    gig_suggestions: string[];
}

const module6Schema: Schema = {
    type: Type.OBJECT,
    properties: {
        proposal: { type: Type.STRING },
        tips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
        },
        gig_suggestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
        }
    },
    required: ["proposal", "tips", "gig_suggestions"]
};

export async function generateFreelanceMaterials(userProfile: UserProfile, jobDescription: string): Promise<Module6Output | null> {
    const systemInstruction = `
You are the Freelance Assistant (Module 6) for AI Success OS.
Your PURPOSE is to help the user start earning money or gaining practical experience based on their specific profile and a target job.
INSTRUCTIONS:
You are given the User Profile and a specific Job Description or niche idea.
Generate a tailored proposal template they can send to real clients, an array of tips to stand out, and realistic gig suggestions they can currently execute based on their skill level.
`;

    const prompt = `
Job/Gig Context: "${jobDescription}"

User Profile:
${JSON.stringify(userProfile, null, 2)}
`;

    return await generateStructuredOutput<Module6Output>(
        prompt, 
        systemInstruction, 
        module6Schema
    );
}
