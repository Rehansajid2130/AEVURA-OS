import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { GlobalUserProfile } from '../types/index.js';

export interface GigSuggestion {
    title: string;
    difficulty: string;
    earning_potential: string;
    reason: string;
}

export interface GigSuggestionOutput {
    guidance: string;
    gig_suggestions: GigSuggestion[];
}

const gigSuggestionSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        guidance: { 
            type: Type.STRING,
            description: "A short guidance message. If the user's target skills match their profile, keep it brief. If they mismatch (e.g. asking for Backend while being a Frontend dev), provide friendly coaching."
        },
        gig_suggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                    earning_potential: { type: Type.STRING },
                    reason: { type: Type.STRING }
                },
                required: ["title", "difficulty", "earning_potential", "reason"]
            }
        }
    },
    required: ["guidance", "gig_suggestions"]
};

export async function suggestGigs(userProfile: GlobalUserProfile, targetQualities: string): Promise<GigSuggestionOutput | null> {
    const systemInstruction = `
You are the Gig Suggestion Engine & Consultant (Freelancer Assistant) for AI Success OS.
Your PURPOSE is to suggest specific gigs based on what the user wants to do, while providing "Life-Coach" style guidance if they are straying from their core expertise.

INSTRUCTIONS:
1. Analyze the user's GLOBAL PROFILE vs. their requested TARGET QUALITIES.
2. If they ask for skills they AREN'T profiled for (e.g. asking for Backend while profile says Frontend): 
   - In the 'guidance' field, mention this mismatch politely. 
   - Example: "I see you're an expert Frontend dev! Python is a great new direction. I've found some Python gigs that might fit a beginner."
3. If they match, keep guidance brief and encouraging.
4. Suggest 3-5 specific gig ideas matching the TARGET QUALITIES.
5. Difficulty should be relative to their skill level in those specific qualities.
`;

    const prompt = `
User Profile:
${JSON.stringify(userProfile, null, 2)}

Target Qualities/Skills User wants to use:
"${targetQualities}"
`;

    return await generateStructuredOutput<GigSuggestionOutput>(
        prompt, 
        systemInstruction, 
        gigSuggestionSchema
    );
}
