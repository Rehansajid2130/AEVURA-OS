import { generateProfilingQuestions } from './modules/Module1.js';
import { buildUserProfile } from './modules/Module2.js';
import { analyzeGoal } from './modules/Module3.js';
import { generateRoadmap } from './modules/Module4.js';
import { generateTaskPlan } from './modules/Module5.js';
import { generateFreelanceMaterials } from './modules/Module6.js';
import { decideOption } from './modules/Module7.js';
import { trackProgress } from './modules/Module8.js';
import { generatePortfolioCaseStudy } from './modules/Module_FA_CaseStudyArchitect.js';

async function runPipeline() {
    console.log("\n🚀 --- STARTING AI SUCCESS OS PIPELINE TEST --- 🚀\n");

    const baseGoal = "I want to start freelancing in UI/UX design";
    console.log(`[USER GOAL]: ${baseGoal}\n`);

    console.log("=== MODULE 1: PROFILING QUESTIONS ===");
    const m1Output = await generateProfilingQuestions(baseGoal);
    if (!m1Output) return console.error("Failed Module 1");
    console.log(JSON.stringify(m1Output, null, 2));

    console.log("\n=== MODULE 2: USER PROFILE BUILDER ===");
    // Simulate user answering the questions automatically
    const mockAnswers: Record<string, string> = {};
    m1Output.questions.forEach((qObj) => {
        const q = qObj.question_text;
        if (q.toLowerCase().includes("experience")) mockAnswers[q] = "Beginner, zero real clients";
        else if (q.toLowerCase().includes("time")) mockAnswers[q] = "About 2 hours a day";
        else if (q.toLowerCase().includes("tool")) mockAnswers[q] = "I opened Figma once";
        else mockAnswers[q] = "Not sure, I just want to make money fast";
    });
    console.log("Simulating User Answers:", JSON.stringify(mockAnswers, null, 2));
    
    const userProfile = await buildUserProfile(baseGoal, mockAnswers);
    if (!userProfile) return console.error("Failed Module 2");
    console.log(JSON.stringify(userProfile, null, 2));

    console.log("\n=== MODULE 3: GOAL ANALYZER ===");
    const goalAnalysis = await analyzeGoal(baseGoal, userProfile);
    if (!goalAnalysis) return console.error("Failed Module 3");
    console.log(JSON.stringify(goalAnalysis, null, 2));

    console.log("\n=== MODULE 4: ROADMAP GENERATOR ===");
    const roadmapData = await generateRoadmap(userProfile, goalAnalysis);
    if (!roadmapData) return console.error("Failed Module 4");
    console.log(`Generated ${roadmapData.roadmap.length} roadmap items.`);

    console.log("\n=== MODULE 5: TASK PLANNER ===");
    const taskPlan = await generateTaskPlan(roadmapData.roadmap);
    if (!taskPlan) return console.error("Failed Module 5");
    console.log(`Generated ${taskPlan.tasks.length} execution tasks. First task: ${taskPlan.tasks[0]?.title}`);

    console.log("\n=== MODULE 6: FREELANCE ASSISTANT ===");
    const jobDesc = "Need a local bakery mobile app redesigned in Figma.";
    const freelanceMaterials = await generateFreelanceMaterials(userProfile, jobDesc);
    if (!freelanceMaterials) return console.error("Failed Module 6");
    console.log("Proposal Length:", freelanceMaterials.proposal.length);
    console.log("Gigs Suggested:", freelanceMaterials.gig_suggestions.length);

    console.log("\n=== MODULE 7: DECISION ENGINE ===");
    const question = "Should I learn Figma or Adobe XD first?";
    const decision = await decideOption(question, userProfile);
    if (!decision) return console.error("Failed Module 7");
    console.log("Recommendation Context:");
    console.log(decision.recommendation);
    console.log(`Reasoning: ${decision.reasoning}`);

    console.log("\n=== MODULE 8: PROGRESS TRACKER ===");
    // Mock user completing the first task
    const completedTasks = (taskPlan && taskPlan.tasks && taskPlan.tasks.length > 0) ? [taskPlan.tasks[0].title] : [];
    const progress = await trackProgress(taskPlan.tasks, completedTasks);
    if (!progress) return console.error("Failed Module 8");
    console.log("Progress %:", progress.progress_percentage);
    console.log("Insight:", progress.insight);

    console.log("\n=== MODULE 03: CASE STUDY ARCHITECT ===");
    const projectContext = "Built a custom e-commerce checkout flow for a local florist.";
    const rawInputs = "Used React, Stripe API. Added a real-time inventory check. Handled edge case where flowers go out of stock during checkout.";
    const caseStudy = await generatePortfolioCaseStudy(userProfile as any, projectContext, rawInputs);
    if (!caseStudy) return console.error("Failed Case Study Architect");
    console.log("Generated Project:", caseStudy.title);
    console.log("Summary:", caseStudy.summary);
    console.log("Tech Stack:", caseStudy.tech_stack.join(", "));

    console.log("\n🎉 --- PIPELINE COMPLETED SUCCESSFULLY --- 🎉\n");
}

runPipeline().catch(console.error);
