import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { GlobalUserProfile } from '../types/index.js';

export interface ProposalOutput {
    proposal: string;
    tone: string;
    strategy: string;
}

const proposalSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        proposal: { type: Type.STRING },
        tone: { type: Type.STRING },
        strategy: { type: Type.STRING }
    },
    required: ["proposal", "tone", "strategy"]
};

export async function generateProposal(userProfile: GlobalUserProfile, jobDescription: string): Promise<ProposalOutput | null> {
    const systemInstruction = `
You are the Proposal Generator (Freelancer Assistant) for AI Success OS.
Your PURPOSE is to generate high-converting, personalized client proposals.
INSTRUCTIONS:
Analyze the user's GLOBAL PROFILE and the provided JOB DESCRIPTION.
The proposal must be adapted to the user's current level (${userProfile.current_level}).
If beginner: Focus on value, quick turnaround, and eagerness to learn/prove.
If advanced/expert: Focus on niche expertise, portfolio results, and high-level strategy.
Include: A greeting, understanding of the job, relevant skills from the profile, and a clear call to action.
`;

    const prompt = `
User Profile:
${JSON.stringify(userProfile, null, 2)}

Job Description:
"${jobDescription}"
`;

    return await generateStructuredOutput<ProposalOutput>(
        prompt, 
        systemInstruction, 
        proposalSchema
    );
}
