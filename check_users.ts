import { connectFirebase, getDB } from './src/services/firebase.js';

async function listUsers() {
    connectFirebase();
    const db = getDB();
    const snapshot = await db.collection('users').get();
    console.log(`Found ${snapshot.size} users:`);
    snapshot.forEach(doc => {
        console.log(`- ${doc.id}: ${JSON.stringify(doc.data().email)}`);
    });
    process.exit(0);
}

listUsers().catch(console.error);
