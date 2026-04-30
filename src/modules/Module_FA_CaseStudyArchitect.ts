import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { GlobalUserProfile } from '../types/index.js';

export interface PortfolioCaseStudy {
    title: string;
    role: string;
    summary: string;
    challenge: string;
    solution: string;
    results: string;
    tech_stack: string[];
    case_study_markdown: string;
}

const portfolioSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        role: { type: Type.STRING },
        summary: { type: Type.STRING },
        challenge: { type: Type.STRING },
        solution: { type: Type.STRING },
        results: { type: Type.STRING },
        tech_stack: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        case_study_markdown: { 
            type: Type.STRING,
            description: "A full, professional case study in Markdown format. Use headings for Problem, Solution, and Results."
        }
    },
    required: ["title", "role", "summary", "challenge", "solution", "results", "tech_stack", "case_study_markdown"]
};

export async function generatePortfolioCaseStudy(
    userProfile: GlobalUserProfile,
    projectContext: string,
    rawInputs: string // e.g. code snippets or rough notes
): Promise<PortfolioCaseStudy | null> {
    const systemInstruction = `
You are the "Case Study Architect" (Module 03) for AI Success OS.
Your PURPOSE is to transform messy, raw project notes and code snippets into high-impact, professional case studies.

CORE PHILOSOPHY:
1. Don't just list tasks; sell the OUTCOME.
2. Use the "Problem -> Solution -> Result" (PSR) framework.
3. The tone should be authoritative yet accessible—engineered and premium.

INSTRUCTIONS:
1. Analyze the 'projectContext' and 'rawInputs'.
2. Cross-reference with the user's GLOBAL PROFILE to ensure the role matches their experience level.
3. Generate a structured case study that highlights technical problem-solving.
4. 'summary' should be a 1-sentence hook that makes a client want to read more.
5. 'case_study_markdown' should be formatted for a sleek presentation.
`;

    const prompt = `
User Profile:
${JSON.stringify(userProfile, null, 2)}

Project Overview/Context:
"${projectContext}"

Raw Technical Inputs/Notes:
"${rawInputs}"
`;

    return await generateStructuredOutput<PortfolioCaseStudy>(
        prompt, 
        systemInstruction, 
        portfolioSchema
    );
}
