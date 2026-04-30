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
            if (fs.existsSync(serviceAccountPath)) {
                console.log('✅ Found firebase-service-account.json. Initializing Firebase...');
                const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
                initializeApp({
                    credential: cert(serviceAccount)
                });
            } else {
                console.warn('⚠️ No firebase-service-account.json found. If this is a live deployment, make sure GOOGLE_APPLICATION_CREDENTIALS is set.');
                // Initialize using default application credentials
                initializeApp();
            }
            db = getFirestore();
            db.settings({ ignoreUndefinedProperties: true }); 
            console.log("✅ Firebase Firestore Connected Successfully");
        } catch (error) {
            console.error('❌ Firebase Connection Error:', error);
            process.exit(1);
        }
    }
}

export function getDB() {
    if (!db) {
        throw new Error("Firebase Firestore has not been initialized. Call connectFirebase() first.");
    }
    return db;
}
