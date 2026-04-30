import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { GlobalUserProfile } from '../types/index.js';

export interface SkillGapAnalysis {
    match_score: number;
    missing_skills: string[];
    missing_tools: string[];
    missing_experience_depth: string;
    action_plan: {
        task: string;
        priority: 'High' | 'Medium' | 'Low';
    }[];
    analysis: string;
}

const skillGapSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        match_score: { 
            type: Type.NUMBER,
            description: "A percentage (0-100) representing how well the user fits the job description."
        },
        missing_skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        missing_tools: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        missing_experience_depth: { 
            type: Type.STRING,
            description: "Detailed analysis of where the user's experience falls short (e.g. 'Lack of enterprise-scale project experience')."
        },
        action_plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    task: { type: Type.STRING },
                    priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                },
                required: ["task", "priority"]
            }
        },
        analysis: { 
            type: Type.STRING,
            description: "A brutal, data-driven summary of the gap analysis. Don't sugarcoat it."
        }
    },
    required: ["match_score", "missing_skills", "missing_tools", "missing_experience_depth", "action_plan", "analysis"]
};

export async function analyzeSkillGap(
    userProfile: GlobalUserProfile,
    jobDescription: string
): Promise<SkillGapAnalysis | null> {
    const systemInstruction = `
You are the "Skill Gap Analyzer" (Module 04) for Aevura OS.
Your PURPOSE is to scan a target Job Description against the user's GLOBAL PROFILE and identify exactly where they are failing to meet requirements.

CORE PHILOSOPHY:
1. BRUTAL HONESTY: If the user is a 20% match, tell them. Don't give false hope.
2. DATA-DRIVEN: Focus on specific skills, tools, and years of experience mentioned in the job description vs the user profile.
3. ELIMINATE WEAKNESS: The 'action_plan' should focus on the fastest way to bridge the most critical gaps.

INSTRUCTIONS:
1. Compare the 'jobDescription' against the 'userProfile'.
2. Identify missing hard skills and tools.
3. Analyze the 'level' and 'experience' mismatch.
4. Generate a 'match_score' that is realistic (be strict).
5. 'analysis' should sound like a high-level technical recruiter giving blunt feedback.
`;

    const prompt = `
User Profile:
${JSON.stringify(userProfile, null, 2)}

Target Job Description:
"${jobDescription}"
`;

    return await generateStructuredOutput<SkillGapAnalysis>(
        prompt, 
        systemInstruction, 
        skillGapSchema
    );
}
