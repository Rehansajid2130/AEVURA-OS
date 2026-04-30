import { connectFirebase } from '../src/services/firebase.js';
import { registerUser, updateUserProfile } from '../src/modules/ModuleSignup.js';
import type { GlobalUserProfile } from '../src/types/index.js';

async function seedProgressUser() {
    console.log("🌱 Seeding Demo User with Progress Data...");
    connectFirebase();

    const email = "full-demo@aevura.os";
    const password = "password123";

    const demoUser: GlobalUserProfile = {
        name: "Demo Specialist",
        email: email,
        location: "Berlin, DE",
        is_freelancer: true,
        freelance_skills: ["Python", "Flask", "Docker"],
        learning_intent: "improve",
        target_skill: "Advanced Cloud Architecture",
        current_level: "Intermediate",
        tools: ["Terraform", "AWS CLI", "PyCharm"],
        primary_goal: "both",
        strengths: ["Architecture logic", "System stability"],
        weaknesses: ["Cost optimization"],
        preferences: {
            learning_style: "Hands-on / Laboratory",
            work_type: "Freelance"
        },
        simHistory: [],
        simScenario: "",
        simCustomDesc: "",
        customScenarios: {},
        
        // --- PROGRESS DATA (MODULE 08) ---
        roadmap: [
            { level: 1, title: "Foundation: Cloud Native Core", description: "Establish basic VPC, Subnet, and Security Group configurations." },
            { level: 2, title: "Scale: Elasticity Matrix", description: "Implement Auto-Scaling Groups and Load Balancers." },
            { level: 3, title: "Security: Iron-Clad Identity", description: "Configure IAM Roles, Policies, and KMS encryption." },
            { level: 4, title: "Mastery: Global Distribution", description: "Deploy Multi-Region active-active architecture." }
        ],
        tasks: [
            { title: "Initialize Terraform Provider", priority: "High", order: 1 },
            { title: "Configure VPC CIDR Block", priority: "High", order: 2 },
            { title: "Deploy Public Subnets", priority: "Medium", order: 3 },
            { title: "Setup Internet Gateway", priority: "Medium", order: 4 },
            { title: "Define Route Tables", priority: "Low", order: 5 },
            { title: "Apply Security Group Ingress", priority: "High", order: 6 }
        ],
        completedTasks: [
            "Initialize Terraform Provider",
            "Configure VPC CIDR Block"
        ]
    };

    // 1. Try to register
    const success = await registerUser(demoUser, password);
    
    if (!success) {
        // 2. If already exists, overwrite with fresh demo data
        console.log(`⚠️ User ${email} already exists. Overwriting with fresh demo data...`);
        await updateUserProfile(email, demoUser);
    }

    console.log(`✅ Demo User Ready:`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`📈 Initial Progress: 33% (2/6 tasks resolved)`);

    setTimeout(() => process.exit(0), 1000);
}

seedProgressUser().catch(console.error);
