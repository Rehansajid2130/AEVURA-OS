import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { GlobalUserProfile } from '../types/index.js';

export interface SimulationTurn {
    role: "client" | "user";
    content: string;
}

export interface SimulationResponse {
    client_message: string;
    is_session_end: boolean;
    feedback?: {
        score: number; // 1-10
        critique: string;
        tips: string[];
    };
}

const simulationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        client_message: { type: Type.STRING },
        is_session_end: { type: Type.BOOLEAN },
        feedback: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                critique: { type: Type.STRING },
                tips: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        }
    },
    required: ["client_message", "is_session_end"]
};

export async function processSimulationTurn(
    userProfile: GlobalUserProfile,
    scenarioType: string,
    history: SimulationTurn[],
    customDescription: string = ""
): Promise<SimulationResponse | null> {
    const systemInstruction = `
You are the "Adversarial Client Simulator" for Aevura OS.
Scenario Selected: ${scenarioType}

PERSONALITIES:
- scope-creep: "The Feature-Adding Client" - Friendly but relentlessly asks for more features for free.
- late-payment: "The Excuse Maker" - Has every reason why the invoice hasn't been paid yet.
- perfectionist: "The Vague Critic" - Doesn't give clear specs but nitpicks everything you deliver.
${customDescription ? `- CUSTOM PERSONALITY: "${customDescription}"` : ''}

INSTRUCTIONS:
1. Act as the client in this scenario based on the history.
2. If this is a custom personality, strictly follow the custom description provided above.
3. Respond as the client character in 'client_message'.
4. Evaluate the User's level (${userProfile.current_level}).
5. If the user successfully handles the situation (e.g. sets a boundary, secures payment), set 'is_session_end' to true and provide 'feedback'.
6. If the session continues, provide a realistic client response.
7. Feedback should score (1-10) their professionalism and boundary-setting.
`;

    const prompt = `
User Profile (Context):
${JSON.stringify(userProfile)}

Chat History:
${JSON.stringify(history)}
`;

    return await generateStructuredOutput<SimulationResponse>(
        prompt, 
        systemInstruction, 
        simulationSchema
    );
}
