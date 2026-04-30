import { loginUser } from './src/modules/ModuleSignup.js';
import { connectFirebase } from './src/services/firebase.js';

async function testLogin() {
    connectFirebase();
    const email = "test@aevura.os";
    const password = "password123";
    
    console.log(`Testing login for ${email}...`);
    const profile = await loginUser(email, password);
    
    if (profile) {
        console.log("✅ Login successful! Profile:", profile.name);
    } else {
        console.log("❌ Login failed: Invalid credentials.");
    }
    process.exit(0);
}

testLogin().catch(console.error);
