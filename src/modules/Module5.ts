import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';

export interface TaskItem {
    title: string;
    priority: string;
    order: number;
}

export interface Module5Output {
    tasks: TaskItem[];
}

const module5Schema: Schema = {
    type: Type.OBJECT,
    properties: {
        tasks: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    order: { type: Type.INTEGER }
                },
                required: ["title", "priority", "order"]
            }
        }
    },
    required: ["tasks"]
};

export async function generateTaskPlan(roadmap: any[]): Promise<Module5Output | null> {
    const systemInstruction = `
You are the Task Planner (Module 5) for AI Success OS.
Your PURPOSE is to convert the beginning of a roadmap into immediate, actionable execution steps (tasks).
INSTRUCTIONS:
You will receive the fun roadmap array from Module 4. 
Instead of overwhelming the user by planning everything out, ONLY generate the first 5 to 7 immediate micro-tasks they need to do to complete Level 1.
Keep the titles very brief and punchy (e.g., "Install Node.js").
Assign a priority (High, Medium, Low) and strict chronological order logic.
`;

    const prompt = `
Roadmap:
${JSON.stringify(roadmap, null, 2)}
`;

    return await generateStructuredOutput<Module5Output>(
        prompt, 
        systemInstruction, 
        module5Schema
    );
}
