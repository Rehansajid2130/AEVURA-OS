import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { generateStructuredOutput } from '../services/geminiService.js';
import type { TaskItem } from './Module5.js';

export interface Module8Output {
    progress_percentage: number;
    completed_tasks: number;
    remaining_tasks: number;
    insight: string;
}

const insightSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        insight: { type: Type.STRING }
    },
    required: ["insight"]
};

/**
 * Instantly calculates metrics without AI calls.
 */
export function calculateInstantMetrics(tasks: TaskItem[], completedTaskTitles: string[]) {
    const total = tasks.length;
    const completed_tasks = tasks.filter(t => completedTaskTitles.includes(t.title)).length;
    const remaining_tasks = total - completed_tasks;
    const progress_percentage = total > 0 ? Math.round((completed_tasks / total) * 100) : 0;
    
    return {
        progress_percentage,
        completed_tasks,
        remaining_tasks,
        insight: "STRATEGIC_ANALYSIS_IN_PROGRESS..."
    };
}

/**
 * Fetches AI-generated insight. This is the slow part.
 */
export async function generateStrategicInsight(tasks: TaskItem[], completedTaskTitles: string[]): Promise<string> {
    const total = tasks.length;
    const completed_tasks = tasks.filter(t => completedTaskTitles.includes(t.title)).length;
    const progress_percentage = total > 0 ? Math.round((completed_tasks / total) * 100) : 0;

    const systemInstruction = `
You are the Strategic Advisor for Aevura OS. 
Analyze the user's progress (${completed_tasks}/${total} tasks) and provide a 1-sentence industrial insight. 
Focus on what's next. Keep it under 15 words.
`;

    const prompt = `
Metrics: ${progress_percentage}% done.
Next Priority: ${tasks.find(t => !completedTaskTitles.includes(t.title))?.title || "Sequence Complete"}
`;

    try {
        const aiResult = await generateStructuredOutput<{ insight: string }>(
            prompt, 
            systemInstruction, 
            insightSchema
        );
        return aiResult?.insight || "Execution velocity stable. Maintain trajectory.";
    } catch (e) {
        return "Operational momentum maintained. Proceed to next objective.";
    }
}

// Legacy support (optional, can be removed)
export async function trackProgress(tasks: TaskItem[], completedTaskTitles: string[]): Promise<Module8Output> {
    const metrics = calculateInstantMetrics(tasks, completedTaskTitles);
    const insight = await generateStrategicInsight(tasks, completedTaskTitles);
    return { ...metrics, insight };
}
