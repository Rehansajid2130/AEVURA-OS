import type { GlobalUserProfile } from '../types/index.js';
import { getDB } from '../services/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';
import bcrypt from 'bcrypt';

/**
 * Module: Signup Profile Builder
 * Pure data mapper — no AI call, no rate limit exposure.
 */
export function processSignupAnswers(answers: Record<string, any>): GlobalUserProfile {
    return {
        name: answers.name?.trim() || "Anonymous",
        email: answers.email?.trim() || "",
        location: answers.location?.trim() || "Unknown",

        is_freelancer: answers.is_freelancer === "yes"
            ? true
            : answers.is_freelancer === "part-time"
            ? "part-time"
            : false,

        freelance_skills: answers.freelance_skills
            ? answers.freelance_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [],

        learning_intent: answers.learning_intent === "improve" ? "improve" : "new-skill",
        target_skill: answers.target_skill?.trim() || "Not specified",
        current_level: ["Beginner", "Intermediate", "Expert"].includes(answers.current_level)
            ? answers.current_level
            : "Beginner",

        tools: answers.tools
            ? answers.tools.split(',').map((t: string) => t.trim()).filter(Boolean)
            : [],

        primary_goal: ["income", "skill", "both"].includes(answers.primary_goal)
            ? answers.primary_goal
            : "both",

        // These will be populated by Gemini (Module 2) on first run — defaults for now
        strengths: [],
        weaknesses: [],
        preferences: {
            learning_style: "Not yet determined",
            work_type: answers.primary_goal === "income" ? "Freelance" : "Learning"
        },
        simHistory: [],
        simScenario: "",
        simCustomDesc: "",
        customScenarios: {}
    };
}

export async function registerUser(profile: GlobalUserProfile, password: string): Promise<boolean> {
    const db = getDB();
    const docRef = db.collection('users').doc(profile.email.toLowerCase());
    const doc = await docRef.get();
    if (doc.exists) return false; // email already exists
    
    // Industrial-grade hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    await docRef.set({
        ...profile,
        email: profile.email.trim().toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return true;
}

export async function loginUser(email: string, password: string): Promise<GlobalUserProfile | null> {
    const db = getDB();
    const doc = await db.collection('users').doc(email.trim().toLowerCase()).get();
    if (!doc.exists) return null;
    
    const data = doc.data() as any;
    if (!data || !data.passwordHash) {
        console.warn(`[AUTH] User ${email} found but has no passwordHash field.`);
        return null;
    }
    
    try {
        const isMatch = await bcrypt.compare(password, data.passwordHash);
        if (!isMatch) return null;
        
        // Remove sensitive fields before returning the profile
        const { passwordHash, ...profile } = data;
        return profile as GlobalUserProfile;
    } catch (error: any) {
        console.error(`[AUTH_ERROR] Bcrypt comparison failed for ${email}:`, error.message);
        // If bcrypt fails (e.g. invalid hash format), treat as failed login rather than crashing
        return null;
    }
}

export async function getUserByEmail(email: string): Promise<GlobalUserProfile | null> {
    const db = getDB();
    const doc = await db.collection('users').doc(email.trim().toLowerCase()).get();
    if (!doc.exists) return null;
    return doc.data() as GlobalUserProfile;
}

export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
    const db = getDB();
    const docRef = db.collection('users').doc(email.trim().toLowerCase());
    const doc = await docRef.get();
    if (!doc.exists) return false;
    
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    await docRef.update({ 
        passwordHash: newPasswordHash,
        updatedAt: new Date().toISOString()
    });
    return true;
}

export async function updateUserProfile(email: string, profile: GlobalUserProfile): Promise<boolean> {
    if (!email) return false;
    const db = getDB();
    const docRef = db.collection('users').doc(email.trim().toLowerCase());
    
    // Using set with merge: true is more robust than update() 
    // as it handles missing fields and prevents "undefined" errors better
    await docRef.set({ 
        ...profile,
        updatedAt: new Date().toISOString() 
    }, { merge: true });
    
    console.log(`[DB] Profile updated for: ${email}`);
    return true;
}
export async function deleteCustomScenario(email: string, scenarioId: string): Promise<boolean> {
    if (!email || !scenarioId) return false;
    const db = getDB();
    const docRef = db.collection('users').doc(email.trim().toLowerCase());
    
    const doc = await docRef.get();
    if (!doc.exists) return false;
    
    const data = doc.data() as GlobalUserProfile;
    if (data.customScenarios && data.customScenarios[scenarioId]) {
        delete data.customScenarios[scenarioId];
        
        // Overwrite the entire field to ensure deletion is reflected
        await docRef.update({
            customScenarios: data.customScenarios,
            updatedAt: new Date().toISOString()
        });
        console.log(`[DB] Custom scenario ${scenarioId} permanently removed for: ${email}`);
    }
    
    return true;
}
