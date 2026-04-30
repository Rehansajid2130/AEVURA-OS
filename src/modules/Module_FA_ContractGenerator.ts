import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { GlobalUserProfile } from '../types/index.js';

export interface ContractOutput {
    contract_title: string;
    client_name: string;
    project_name: string;
    sections: {
        heading: string;
        content: string;
    }[];
    brutality_notes: string;
    contract_markdown: string;
}

const contractSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        contract_title: { type: Type.STRING },
        client_name: { type: Type.STRING },
        project_name: { type: Type.STRING },
        sections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    heading: { type: Type.STRING },
                    content: { type: Type.STRING }
                },
                required: ["heading", "content"]
            }
        },
        brutality_notes: { 
            type: Type.STRING,
            description: "A short, sharp explanation of why this contract is protective. Focus on the late payment and scope creep clauses."
        },
        contract_markdown: { 
            type: Type.STRING,
            description: "The full, ready-to-print contract in Markdown format."
        }
    },
    required: ["contract_title", "client_name", "project_name", "sections", "brutality_notes", "contract_markdown"]
};

export async function generateContract(
    userProfile: GlobalUserProfile,
    clientName: string,
    projectName: string,
    budget: string,
    deliverables: string[],
    deadline: string
): Promise<ContractOutput | null> {
    const systemInstruction = `
You are the "Contract Shield" (Module 05) for AI Success OS.
Your PURPOSE is to generate iron-clad, professional freelance contracts that protect the user from common industry pitfalls.

CORE PHILOSOPHY:
1. PROTECTION FIRST: Prioritize clauses for Scope Creep, Late Payments, and Intellectual Property transfer ONLY upon full payment.
2. BRUTALIST CLARITY: No unnecessary legalese. Use clear, forceful, and professional language.
3. ADAPTIVE: Use the user's GLOBAL PROFILE (skills and level) to tailor the deliverables section.

CONTRACT REQUIREMENTS:
- Include a 'Late Payment' clause with a specific percentage penalty.
- Include a 'Scope Creep' clause defining that any work outside the 'Deliverables' list requires a new Statement of Work.
- Include an 'IP Ownership' clause stating ownership remains with the Freelancer until the final balance is paid in full.
`;

    const prompt = `
Freelancer Profile:
${JSON.stringify(userProfile, null, 2)}

Engagement Details:
- Client: ${clientName}
- Project: ${projectName}
- Budget: ${budget}
- Deadline: ${deadline}
- Key Deliverables:
${deliverables.map(d => `  * ${d}`).join('\n')}
`;

    return await generateStructuredOutput<ContractOutput>(
        prompt, 
        systemInstruction, 
        contractSchema
    );
}
