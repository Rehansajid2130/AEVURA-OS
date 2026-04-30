import { resetPassword } from './src/modules/ModuleSignup.js';
import { connectFirebase } from './src/services/firebase.js';

async function updatePassword() {
    connectFirebase();
    const email = "test@aevura.os";
    const newPassword = "password123";
    
    console.log(`Updating password for ${email} to ${newPassword}...`);
    const success = await resetPassword(email, newPassword);
    
    if (success) {
        console.log("✅ Password updated successfully!");
    } else {
        console.log("❌ Failed to update password.");
    }
    process.exit(0);
}

updatePassword().catch(console.error);
