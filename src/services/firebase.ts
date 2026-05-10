import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Look for a local service account file, or use environment variables
const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');

let db: FirebaseFirestore.Firestore;

export function connectFirebase() {
    if (getApps().length === 0) {
        try {
            const envProject = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || 'unknown';
            const hasGac = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
            
            console.log('[FIREBASE_DIAGNOSTIC]', { 
                envProject, 
                hasGac, 
                cwd: process.cwd(),
                serviceAccountExists: fs.existsSync(serviceAccountPath)
            });

            if (fs.existsSync(serviceAccountPath)) {
                console.log('✅ Found firebase-service-account.json. Initializing Firebase...');
                const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
                const app = initializeApp({
                    credential: cert(serviceAccount)
                });
                console.log('[FIREBASE_INIT] source=local_json', { 
                    appProjectId: app.options?.projectId || null,
                    serviceAccountProject: serviceAccount.project_id 
                });
            } else {
                console.warn('⚠️ No firebase-service-account.json found. Falling back to Application Default Credentials.');
                // Initialize using default application credentials
                const app = initializeApp();
                console.log('[FIREBASE_INIT] source=adc', { 
                    appProjectId: app.options?.projectId || 'auto-detect' 
                });
            }
            db = getFirestore();
            db.settings({ ignoreUndefinedProperties: true }); 
            console.log("✅ Firebase Firestore Connected Successfully");
        } catch (error: any) {
            console.error('❌ Firebase Connection Error Details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            // Don't exit immediately, let the routes handle the missing DB if possible
        }
    }
}

export function getDB() {
    if (!db) {
        throw new Error("Firebase Firestore has not been initialized. Call connectFirebase() first.");
    }
    return db;
}
