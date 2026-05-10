import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

// Connect to Firebase Firestore
connectFirebase();

const app = express();

// Trust proxy for Cloud Run/Firebase Hosting to handle HTTPS cookies correctly
app.set('trust proxy', true);

// Security Headers & Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // Prove which responses are served by this Express app (useful when debugging GFE/URL-map 404s)
    res.setHeader('X-Aevura-App', 'express');
    // Basic CSP to allow Google Fonts and own API
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;");
    next();
});

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

console.log(">> SERVER.TS LOADED: v1.0.5 with Contract Shield <<");
// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diagnostic: Resolve static path using process.cwd() for better Docker compatibility
const staticPath = path.join(process.cwd(), 'public');
console.log(`[OS_INIT] Static directory resolved to: ${staticPath}`);
// #region agent log
fetch('http://127.0.0.1:7416/ingest/a788dbe8-6491-4535-b23e-f6f825c4d7fb',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bf159e'},body:JSON.stringify({sessionId:'bf159e',runId:'pre-fix',hypothesisId:'A',location:'src/server.ts:staticPath',message:'Static path + cwd at startup',data:{cwd:process.cwd(),staticPath,publicExists:fs.existsSync(staticPath),signinExists:fs.existsSync(path.join(staticPath,'signin.html'))},timestamp:Date.now()})}).catch(()=>{});
// #endregion

// Explicitly serve index.html for the root to bypass any potential static serving ambiguity
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// If Cloud Run (or a URL map) is mis-handling *.html paths, this redirect will fix it
// as long as the request actually reaches the container.
app.get('/signin.html', (req, res) => {
    res.redirect(308, '/signin');
});

// #region agent log
app.use((req, res, next) => {
    if (req.method === 'GET' && (req.path === '/signin.html' || req.path === '/signin' || req.path.endsWith('.html'))) {
        const resolved = path.join(staticPath, req.path.replace(/^\//, ''));
        fetch('http://127.0.0.1:7416/ingest/a788dbe8-6491-4535-b23e-f6f825c4d7fb',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bf159e'},body:JSON.stringify({sessionId:'bf159e',runId:'pre-fix',hypothesisId:'B',location:'src/server.ts:reqProbe',message:'Incoming page request + resolved static file',data:{method:req.method,url:req.url,path:req.path,staticPath,cwd:process.cwd(),resolved,exists:fs.existsSync(resolved)},timestamp:Date.now()})}).catch(()=>{});
    }
    next();
});
// #endregion

// Serve static HTML UI with extension support (allows /signin instead of /signin.html)
app.use(express.static(staticPath, {
    extensions: ['html', 'htm']
}));

// Favicon.ico Fallback (Fixes 404 in logs)
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(staticPath, 'favicon.svg'));
});


// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        version: '1.0.8',
        timestamp: new Date().toISOString(),
        staticPath: staticPath 
    });
});

// Debug: List files in public folder
app.get('/api/debug-files', (req, res) => {
    try {
        const files = fs.readdirSync(staticPath);
        res.json({ staticPath, files });
    } catch (e: any) {
        res.json({ error: e.message, staticPath });
    }
});

// Debug: confirm runtime project/credentials visibility (no secrets)
app.get('/api/debug-gcp', (req, res) => {
    res.json({
        project: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || null,
        hasGoogleApplicationCredentials: Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        nodeEnv: process.env.NODE_ENV || null,
        revision: process.env.K_REVISION || null,
        service: process.env.K_SERVICE || null,
        region: process.env.K_REGION || null
    });
});


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
    
    const isApi = req.url.startsWith('/api/');
    const isAsset = req.url.includes('.');

    // Only fallback to index.html for GET requests that look like page requests
    // Assets (with dots) and API calls should return a standard 404
    if (req.method === 'GET' && !isApi && !isAsset) {
        console.log(`[404_FALLBACK] Serving index.html for: ${req.url}`);
        res.sendFile(path.join(staticPath, 'index.html'));
        return;
    }

    // #region agent log
    if (req.method === 'GET' && (req.path === '/signin.html' || req.path === '/signin' || req.path.endsWith('.html'))) {
        const resolved = path.join(staticPath, req.path.replace(/^\//, ''));
        fetch('http://127.0.0.1:7416/ingest/a788dbe8-6491-4535-b23e-f6f825c4d7fb',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bf159e'},body:JSON.stringify({sessionId:'bf159e',runId:'pre-fix',hypothesisId:'D',location:'src/server.ts:404',message:'404 handler reached for page request',data:{method:req.method,url:req.url,path:req.path,staticPath,cwd:process.cwd(),resolved,exists:fs.existsSync(resolved),isApi,isAsset},timestamp:Date.now()})}).catch(()=>{});
    }
    // #endregion

    res.status(404).json({ 
        error: 'Route Not Found', 
        message: `The endpoint ${req.method} ${req.url} does not exist on this server.`
    });
});

app.use((err: any, req: any, res: any, next: any) => {
    console.error('[SERVER ERROR]', err);
    const msg = String(err?.message || '');
    const details = String(err?.details || '');
    if ((msg.includes('PERMISSION_DENIED') || details.includes('PERMISSION_DENIED')) && (msg.toLowerCase().includes('firestore') || details.toLowerCase().includes('firestore'))) {
        res.status(503).json({
            error: 'Firestore Permission Error',
            message: msg || details,
            project: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || null
        });
        return;
    }
    res.status(500).json({ 
        error: 'Internal Server Error', 
        message: err.message || 'An unexpected error occurred.' 
    });
});

const PORT = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0'; 
app.listen(PORT, HOST, () => {
    console.log(`🚀 Aevura OS running at:`);
    console.log(`   - Local:   http://localhost:${PORT}`);
    console.log(`   - Network: http://[YOUR_IP]:${PORT}`);
    console.log(`   - Region:  Europe-West1`);
});
