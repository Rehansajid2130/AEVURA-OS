import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { GlobalUserProfile } from '../types/index.js';

export interface ProfileOptimizeOutput {
    title: string;
    description: string;
    tips: string[];
}

const profileOptimizeSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tips: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    },
    required: ["title", "description", "tips"]
};

export async function optimizeProfile(
    userProfile: GlobalUserProfile, 
    currentTitle: string = "", 
    currentBio: string = "", 
    targetSkills: string = ""
): Promise<ProfileOptimizeOutput | null> {
    const systemInstruction = `
You are the Profile Optimizer (Freelancer Assistant) for AI Success OS.
Your PURPOSE is to rewrite and optimize the user's freelance marketplace profile (Upwork/Fiverr).

INSTRUCTIONS:
1. Analyze the user's GLOBAL PROFILE and their PROVIDED current title/bio.
2. Focus on the TARGET SKILLS they want to highlight (${targetSkills}).
3. Generate a punchy, professional Profile Title.
4. Generate a CLIENT-FOCUSED Description.
   - IMPORTANT: The description must be detailed and of PROFESSIONAL LENGTH (3-4 paragraphs).
   - Use a "Problem -> Solution -> Result" structure.
   - Highlight why the user's specific mix of skills (${userProfile.freelance_skills.join(', ')}) makes them a low-risk, high-reward hire.
5. Provide 3-5 specific tips for their profile.
`;

    const prompt = `
User Context:
${JSON.stringify(userProfile, null, 2)}

Current Marketplace Title: "${currentTitle}"
Current Marketplace Bio: "${currentBio}"
Target Skills to emphasize: "${targetSkills}"
`;

    return await generateStructuredOutput<ProfileOptimizeOutput>(
        prompt, 
        systemInstruction, 
        profileOptimizeSchema
    );
}
