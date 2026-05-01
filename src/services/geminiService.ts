import { GoogleGenAI, Type } from '@google/genai';
import type { Schema } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "your_api_key_here") {
    console.warn("WARNING: GEMINI_API_KEY is not set correctly in the .env file.");
}

// Instantiate the SDK
const ai = new GoogleGenAI({ apiKey: apiKey || 'placeholder' });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Use /tmp for Cloud Run compatibility (root is read-only)
const CACHE_FILE = '/tmp/query_cache.json';

function getCacheKey(prompt: string, systemInstruction: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(prompt + systemInstruction);
    return hash.digest('hex');
}

function generateMockFallback(instruction: string): any {
    const instr = instruction.toLowerCase();
    
    // Check Expansion Modules / Specific Tools First
    if (instr.includes("case study architect")) {
        return {
            title: "Mock: High-Performance Dashboard",
            role: "Lead Frontend Engineer",
            summary: "Reengineered a legacy data dashboard to support 100k+ concurrent users with sub-50ms latency.",
            challenge: "The existing system was monolithic and struggled with data spikes, causing frequent UI lag.",
            solution: "Implemented a custom WebSocket layer and a React-based virtualized grid to handle real-time updates efficiently.",
            results: "Increased user retention by 40% and reduced server load by 25%.",
            tech_stack: ["React", "TypeScript", "WebSockets"],
            case_study_markdown: "# Case Study: High-Performance Dashboard\n\n## Problem\nLegacy monolithic systems were lagging.\n\n## Solution\nCustom WebSockets and virtualization.\n\n## Results\n40% more retention."
        };
    }
    if (instr.includes("adversarial client simulator")) {
        return {
            client_message: "Mock: That looks good, but can we just add one more page for the same price? It should be super simple for you!",
            is_session_end: false
        };
    }

    if (instr.includes("skill gap analyzer")) {
        return {
            match_score: 65,
            missing_skills: ["System Design", "Kubernetes"],
            missing_tools: ["Terraform", "Prometheus"],
            missing_experience_depth: "The candidate has strong frontend skills but lacks experience in large-scale infrastructure orchestration required for this role.",
            action_plan: [
                { task: "Complete a Kubernetes fundamental certification.", priority: "High" },
                { task: "Build a multi-container deployment using Docker Compose.", priority: "Medium" }
            ],
            analysis: "You're a strong candidate for the product side, but the infra requirements are a hard wall right now. Focus on orchestration or you'll be rejected instantly."
        };
    }

    if (instr.includes("contract shield") || instr.includes("contract generator")) {
        return {
            contract_title: "Independent Contractor Agreement (Mock)",
            client_name: "Mock Client Ltd.",
            project_name: "Mock Digital Transformation",
            sections: [
                { heading: "Scope of Work", content: "The contractor will provide digital transformation services as outlined in the proposal." },
                { heading: "Payment Terms", content: "Payment is due within 7 days of invoice. Late payments incur a 5% weekly penalty." },
                { heading: "Intellectual Property", content: "Ownership transfers only upon receipt of full and final payment." }
            ],
            brutality_notes: "Mock Safety: This agreement ensures you get paid before they own your code.",
            contract_markdown: "# Contract: Mock Digital Transformation\n\n## Terms\n* Late payment penalty: 5%\n* IP Transfer: Upon final payment."
        };
    }

    // Check Core Modules in Reverse Order (to avoid matching previous step references)
    if (instr.includes("module 8") || instr.includes("progress tracker")) {
        return {
            progress_percentage: 25, completed_tasks: 1, remaining_tasks: 3,
            insight: "You're off to a great start! Completing that first task is often the hardest part."
        };
    }
    if (instr.includes("module 7") || instr.includes("decision engine")) {
        return {
            recommendation: "Mock Recommendation: You should definitely focus on Figma first.",
            reasoning: "Figma is the industry standard and has better collaboration features."
        };
    }
    if (instr.includes("profile optimizer")) {
        return {
            title: "Mock: Elite Technical Consultant & Developer",
            description: "Mock Description: I engineer high-performance solutions that drive business growth. With a strong background in modern frameworks, I don't just deliver code—I deliver results. My approach focuses on solving your core problems efficiently, ensuring scalable architecture and exceptional user experiences. Let's build something robust.",
            tips: [
                "Mock Tip 1: State your most impressive metric in the first line.",
                "Mock Tip 2: Remove passive language—use strong action verbs.",
                "Mock Tip 3: Add a clear Call-To-Action at the bottom of your bio."
            ]
        };
    }
    
    if (instr.includes("module 6") || instr.includes("proposal generator") || instr.includes("freelance assistant")) {
        return {
            proposal: "Hi there! I saw your job posting and I'm very interested. I have the skills you need...",
            gig_suggestions: [
                { title: "Landing Page Development", difficulty: "Medium", earning_potential: "High", reason: "High demand right now" },
                { title: "Bug Fixing Service", difficulty: "Easy", earning_potential: "Medium", reason: "Good for building a reputation" }
            ],
            tone: "Professional & Eager", strategy: "Focus on value and quick results"
        };
    }
    if (instr.includes("module 5") || instr.includes("task planner")) {
        return {
            tasks: [
                { title: "Mock: Create Next.js App", priority: "High", order: 1 },
                { title: "Mock: Style the Roadmap Tab", priority: "Medium", order: 2 },
                { title: "Mock: Drink some coffee", priority: "Low", order: 3 }
            ]
        };
    }
    if (instr.includes("module 4") || instr.includes("roadmap generator")) {
        return {
            roadmap: [
                { level: 1, title: "Level 1: The Mock Setup", description: "Get the UI looking gorgeous." },
                { level: 2, title: "Level 2: The Framework", description: "Migrate to Next.js." },
                { level: 3, title: "Level 3: The Real API", description: "Wait a day and reconnect Google Gemini." }
            ]
        };
    }
    if (instr.includes("module 3") || instr.includes("goal analyzer")) {
        return {
            goal_type: "Skill Setup", difficulty: "Moderate", estimated_time: "8 weeks", required_skills: ["Focus"],
            analysis: "Hey there! I am your Mock API Backup. You look like you're ready to crush this fake UI test!"
        };
    }
    if (instr.includes("module 2") || instr.includes("user profile builder")) {
        return {
            skill: "Mock Engine Dev", level: "Beginner", tools: ["VS Code"], goal: "Mock Goal",
            timeline: "3 Months", experience: "Minimal", strengths: ["Adaptable"], weaknesses: ["None"],
            preferences: { learning_style: "Visual", work_type: "Part-Time" }
        };
    }
    if (instr.includes("module 1") || instr.includes("profiling question generator")) {
        return {
            questions: [
                { question_text: "Mock: Building UI - What is your main tech stack?", options: ["JavaScript", "Python", "None"] },
                { question_text: "Mock: How much time per week can you dedicate?", options: ["5 hours", "10 hours", "Full-time"] },
                { question_text: "Mock: Are you a visual learner?", options: ["Yes", "No", "Not sure"] }
            ]
        };
    }

    console.warn(`[MOCK ERROR] No specific fallback found for instruction: "${instruction}"`);
    return { mockStatus: "Unrecognized Module fallback." };
}

/**
 * Centralized service to generate strictly typed JSON responses from the Gemini API.
 */
export async function generateStructuredOutput<T>(
    prompt: string, 
    systemInstruction: string, 
    responseSchema: Schema,
    retries = 3
): Promise<T | null> {
    const cacheKey = getCacheKey(prompt, systemInstruction);
    if (fs.existsSync(CACHE_FILE)) {
        try {
            const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
            if (cache[cacheKey]) {
                console.log(`[CACHE HIT] Perfect match found! Serving instantly and saving API Quota...`);
                return cache[cacheKey] as T;
            }
        } catch(e) {}
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash', // Stable production model
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                    temperature: 0.2, // Keeps outputs logical and aligned to the schema
                }
            });

            if (response.text) {
                const parsed = JSON.parse(response.text) as T;
                let cache: any = {};
                if (fs.existsSync(CACHE_FILE)) {
                    try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')); } catch(e) {}
                }
                cache[cacheKey] = parsed;
                fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
                return parsed;
            }
            
            console.error("Gemini returned empty text.");
            throw new Error("Gemini returned empty text.");
        } catch (error: any) {
            let errorMsg = error.message || "Unknown Gemini API Error";
            if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("Quota")) {
                if (attempt < retries) {
                    console.warn(`[Attempt ${attempt}/${retries}] Rate limit hit. Waiting 15 seconds before retry...`);
                    await delay(15000);
                    continue; // Retry
                }
                errorMsg = "Google Gemini Rate Limit Exceeded multiple times. Please try again later.";
            } else if (attempt < retries) {
                console.warn(`[Attempt ${attempt}/${retries}] AI Generation Error: ${errorMsg}. Retrying...`);
                await delay(2000);
                continue;
            }
            
            console.warn(`⚠ API Exhaused. Generating seamless MOCK DATA for [${systemInstruction.substring(0, 50)}...] ⚠`);
            return generateMockFallback(systemInstruction) as T;
        }
    }
    return null;
}
