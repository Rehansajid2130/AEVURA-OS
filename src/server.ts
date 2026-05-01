import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import { generateProfilingQuestions } from './modules/Module1.js';
import { buildUserProfile } from './modules/Module2.js';
import { analyzeGoal } from './modules/Module3.js';
import { generateRoadmap } from './modules/Module4.js';
import { generateTaskPlan } from './modules/Module5.js';
import { processSignupAnswers, registerUser, loginUser, getUserByEmail, resetPassword, updateUserProfile, deleteCustomScenario } from './modules/ModuleSignup.js';
import { generateProposal } from './modules/Module_FA_Proposal.js';
import { optimizeProfile } from './modules/Module_FA_ProfileOptimizer.js';
import { suggestGigs } from './modules/Module_FA_Gigs.js';
import { processSimulationTurn } from './modules/Module_FA_Simulation.js';
import { generatePortfolioCaseStudy } from './modules/Module_FA_CaseStudyArchitect.js';
import { analyzeSkillGap } from './modules/Module_FA_SkillGapAnalyzer.js';
import { generateContract } from './modules/Module_FA_ContractGenerator.js';
import { decideOption } from './modules/Module7.js';
import { calculateInstantMetrics, generateStrategicInsight } from './modules/Module8.js';
import { connectFirebase } from './services/firebase.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

console.log(">> SERVER.TS LOADED: v1.0.5 with Contract Shield <<");
// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static HTML UI
app.use(express.static(path.join(__dirname, '../public')));

// Helper to get authenticated profile from DB
async function getAuthProfile(req: express.Request): Promise<any | null> {
    const sessionEmail = req.cookies.sessionEmail;
    if (!sessionEmail) return null;
    return await getUserByEmail(sessionEmail);
}

// ─── AUTH ROUTES ────────────────────────────────────────────────────────────

app.post('/api/signup', async (req, res) => {
    const { answers, password } = req.body;
    if (!answers || !password || !answers.email) {
        res.status(200).json({ error: 'Missing required fields.' });
        return;
    }
    const profile = processSignupAnswers(answers);
    const registered = await registerUser(profile, password);
    if (!registered) {
        res.status(200).json({ error: 'Account already exists.' });
        return;
    }
    
    // Set cookie for persistence (expires in 7 days)
    res.cookie('sessionEmail', profile.email, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.json({ success: true, profile });
});

app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(200).json({ error: 'Email and password required.' });
        return;
    }
    const profile = await loginUser(email, password);
    if (!profile) {
        res.status(200).json({ error: 'Invalid credentials.' });
        return;
    }
    
    // Set cookie
    res.cookie('sessionEmail', profile.email, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.json({ success: true, profile });
});

app.get('/api/me', async (req, res) => {
    const profile = await getAuthProfile(req);
    if (!profile) {
        res.status(200).json({ error: 'Not logged in.' });
        return;
    }
    res.json({ profile });
});

app.post('/api/signout', (req, res) => {
    res.clearCookie('sessionEmail');
    res.json({ success: true });
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(200).json({ error: 'Email is required.' });
        return;
    }
    const profile = await getUserByEmail(email);
    if (!profile) {
        res.status(200).json({ error: 'No account found with that email.' });
        return;
    }
    // In a real app, send email with token here.
    res.json({ success: true, message: 'Account verified. You can now reset your password.' });
});

app.post('/api/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        res.status(200).json({ error: 'Email and new password are required.' });
        return;
    }
    const success = await resetPassword(email, newPassword);
    if (!success) {
        res.status(200).json({ error: 'Failed to reset password. User not found.' });
        return;
    }
    res.json({ success: true, message: 'Password updated successfully!' });
});

// ─── EXISTING PIPELINE ROUTES ────────────────────────────────────────────────

app.post('/api/start', async (req, res) => {
    const { goal } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });

    try {
        const result = await generateProfilingQuestions(goal);
        profile.currentGoal = goal;
        profile.m1Output = result;
        await updateUserProfile(profile.email, profile);
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

app.post('/api/build-profile', async (req, res) => {
    const { answers } = req.body; 
    const profile = await getAuthProfile(req);
    if (!profile || !profile.currentGoal) return res.status(200).json({ error: 'Session expired or invalid.' });

    try {
        const tempProfile = await buildUserProfile(profile.currentGoal, answers);
        profile.tempProfile = tempProfile;
        await updateUserProfile(profile.email, profile);
        res.json(tempProfile);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

app.post('/api/analyze-and-plan', async (req, res) => {
    const profile = await getAuthProfile(req);
    if (!profile || !profile.currentGoal || !profile.tempProfile) {
        return res.status(200).json({ error: 'Session expired or incomplete.' });
    }

    try {
        const goalAnalysis = await analyzeGoal(profile.currentGoal, profile.tempProfile);
        
        console.log("Pacing AI pipeline to protect Rate Limiter...");
        await delay(3000); 
        
        const roadmapData = await generateRoadmap(profile.tempProfile, goalAnalysis);
        
        console.log("Pacing AI pipeline to protect Rate Limiter...");
        await delay(3000); 

        let taskPlan = null;
        if (roadmapData && roadmapData.roadmap) {
             taskPlan = await generateTaskPlan(roadmapData.roadmap);
        }

        // Persist to database for Progress Tracker
        console.log(`[PIPELINE] Saving plan to Firestore for: ${profile.email}`);
        profile.roadmap = roadmapData?.roadmap || null;
        profile.tasks = taskPlan?.tasks || [];
        profile.completedTasks = []; // Reset on new plan
        
        const saveSuccess = await updateUserProfile(profile.email, profile);
        console.log(`[PIPELINE] Save Status: ${saveSuccess ? 'SUCCESS' : 'FAILED'}`);

        res.json({ goalAnalysis, roadmapData, taskPlan });
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

// ─── FREELANCER ASSISTANT ROUTES ─────────────────────────────────────────────
app.post('/api/freelance/proposal', async (req, res) => {
    const { jobDescription } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });
    try {
        const result = await generateProposal(profile, jobDescription);
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

app.post('/api/freelance/profile-optimize', async (req, res) => {
    const { currentTitle, currentBio, targetSkills } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });
    try {
        const result = await optimizeProfile(profile, currentTitle, currentBio, targetSkills);
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

app.post('/api/freelance/gigs', async (req, res) => {
    const { targetQualities } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });
    try {
        const result = await suggestGigs(profile, targetQualities || "");
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

// ─── SIMULATION MODE ROUTES ─────────────────────────────────────────────────
app.post('/api/sim/custom-save', async (req, res) => {
    const { id, name, desc } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });

    if (!profile.customScenarios) profile.customScenarios = {};
    profile.customScenarios[id] = { name, desc };
    await updateUserProfile(profile.email, profile);
    res.json({ success: true });
});

app.post('/api/sim/custom-delete', async (req, res) => {
    const { id } = req.body;
    console.log(`[OS_ACTION] INITIATING_PURGE: ${id}`);
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });

    try {
        await deleteCustomScenario(profile.email, id);
        console.log(`[OS_ACTION] PURGE_COMPLETE: ${id}`);
        res.json({ success: true });
    } catch (e: any) {
        console.error(`[OS_ERROR] PURGE_FAILED: ${id}`, e);
        res.status(200).json({ error: e.message || "Failed" });
    }
});

app.post('/api/sim/start', async (req, res) => {
    const { scenario, customDescription } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });

    profile.simScenario = scenario;
    profile.simCustomDesc = customDescription || "";
    profile.simHistory = [
        { role: "client", content: `(System: Simulation Started - Scenario: ${scenario})` }
    ];
    await updateUserProfile(profile.email, profile);
    res.json({ success: true });
});

app.post('/api/sim/turn', async (req, res) => {
    const { message } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile || !profile.simScenario) return res.status(200).json({ error: 'No active simulation session.' });
    
    profile.simHistory.push({ role: "user", content: message });
    
    try {
        const result = await processSimulationTurn(
            profile,
            profile.simScenario,
            profile.simHistory,
            profile.simCustomDesc
        );
        
        if (result && result.client_message) {
            profile.simHistory.push({ role: "client", content: result.client_message });
        }
        
        await updateUserProfile(profile.email, profile);
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

// ─── CASE STUDY ARCHITECT ROUTES ───────────────────────────────────────────
app.post('/api/portfolio/generate', async (req, res) => {
    const { projectNotes, codeSnippets } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });
    try {
        const result = await generatePortfolioCaseStudy(profile, projectNotes, codeSnippets || "");
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

// ─── CONTRACT GENERATOR ROUTES ──────────────────────────────────────────────
app.post('/api/contract/generate', async (req, res) => {
    const { clientName, projectName, budget, deliverables, deadline } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });
    try {
        const result = await generateContract(profile, clientName, projectName, budget, deliverables || [], deadline);
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

app.post('/api/skill-gap/analyze', async (req, res) => {
    const { jobDescription } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });
    try {
        const result = await analyzeSkillGap(profile, jobDescription);
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

app.post('/api/decision-engine/decide', async (req, res) => {
    const { question } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });
    try {
        const result = await decideOption(question, profile);
        res.json(result);
    } catch(e: any) {
        console.error(e);
        res.status(200).json({error: e.message || "Failed"});
    }
});

// ─── PROGRESS TRACKER ROUTES ─────────────────────────────────────────────────

app.get('/api/progress', async (req, res) => {
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });

    if (!profile.tasks || profile.tasks.length === 0) {
        return res.status(200).json({ error: 'NO_ACTIVE_PLAN_DETECTED' });
    }

    // 1. Calculate metrics INSTANTLY in TS
    const metrics = calculateInstantMetrics(profile.tasks, profile.completedTasks || []);
    
    // 2. Return immediately
    res.json({ 
        metrics, 
        tasks: profile.tasks, 
        completedTasks: profile.completedTasks || [] 
    });
});

app.get('/api/progress/insight', async (req, res) => {
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const insight = await generateStrategicInsight(profile.tasks || [], profile.completedTasks || []);
        res.json({ insight });
    } catch (e) {
        res.json({ insight: "Execution trajectory stabilized." });
    }
});

app.post('/api/progress/toggle', async (req, res) => {
    const { taskTitle } = req.body;
    const profile = await getAuthProfile(req);
    if (!profile) return res.status(200).json({ error: 'Not logged in.' });

    if (!profile.completedTasks) profile.completedTasks = [];
    
    const index = profile.completedTasks.indexOf(taskTitle);
    if (index > -1) {
        profile.completedTasks.splice(index, 1); // Uncheck
    } else {
        profile.completedTasks.push(taskTitle); // Check
    }

    await updateUserProfile(profile.email, profile);
    res.json({ success: true, completedTasks: profile.completedTasks });
});


// ─── ERROR HANDLING ─────────────────────────────────────────────────────────
app.use((req, res) => {
    console.error(`[404] Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: 'Route Not Found', 
        message: `The endpoint ${req.method} ${req.url} does not exist on this server.`,
        available_endpoints: [
            '/api/signup', '/api/signin', '/api/me',
            '/api/sim/custom-save', '/api/sim/custom-delete', '/api/sim/start', '/api/sim/turn',
            '/api/freelance/proposal', '/api/freelance/profile-optimize',
            '/api/skill-gap/analyze', '/api/portfolio/generate', '/api/contract/generate'
        ]
    });
});

app.use((err: any, req: any, res: any, next: any) => {
    console.error('[SERVER ERROR]', err);
    res.status(500).json({ 
        error: 'Internal Server Error', 
        message: err.message || 'An unexpected error occurred.' 
    });
});

const PORT = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0'; 
app.listen(PORT, HOST, () => {
    connectFirebase();
    console.log(`🚀 Aevura OS running at:`);
    console.log(`   - Local:   http://localhost:${PORT}`);
    console.log(`   - Network: http://[YOUR_IP]:${PORT}`);
});
