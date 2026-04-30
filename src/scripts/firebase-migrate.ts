import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectFirebase, getDB } from '../services/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../../users.json');

async function migrate() {
    console.log('🚀 Starting Data Migration to Firebase...');

    if (!fs.existsSync(USERS_FILE)) {
        console.log('❌ No users.json found. Skipping.');
        return;
    }

    try {
        connectFirebase();
        const db = getDB();
        
        const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        const users = Object.entries(data);

        console.log(`📦 Found ${users.length} users to migrate.`);

        for (const [email, record] of users as any[]) {
            const docRef = db.collection('users').doc(email.toLowerCase());
            const existing = await docRef.get();
            
            if (existing.exists) {
                console.log(`⏩ Skipping ${email} (already exists)`);
                continue;
            }

            await docRef.set({
                ...record.profile,
                email: email.toLowerCase(),
                passwordHash: record.passwordHash,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            console.log(`✅ Migrated: ${email}`);
        }

        console.log('🎉 Migration Complete!');
    } catch (error) {
        console.error('❌ Migration Failed:', error);
    }
}

migrate();
