/**
 * Aevura OS - Demo Manager
 * Pre-populates input fields for professional demonstration.
 * Trigger: URL parameter ?demo=true or Ctrl+Shift+D
 */

const demoData = {
    'freelancer-assistant.html': {
        'gig-qualities': "Python, Flask, Docker, Terraform, AWS",
        'job-desc': "Looking for a Senior Cloud Architect to migrate our legacy Python application to a containerized AWS environment. Must have deep expertise in Terraform for Infrastructure as Code and experience with secure Flask API design.",
        'opt-current-title': "Backend Developer",
        'opt-current-bio': "I develop Python backends using Flask and manage basic Docker containers. I am looking to move into full-scale Cloud Architecture.",
        'opt-target-skills': "Senior Cloud Infrastructure Architect | AWS & Terraform Specialist"
    },
    'simulation.html': {
        'cust-name': "The Panicked CTO",
        'cust-desc': "Our production server is failing under load. We need to migrate to an auto-scaling AWS cluster immediately using the Terraform scripts you promised. He is stressed and demands zero downtime.",
        'userInput': "I've already validated the Terraform plan in the staging environment. We can initiate the Blue/Green deployment now to ensure zero downtime during the transition."
    },
    'case-study-architect.html': {
        'projectNotes': "Architected a multi-region AWS infrastructure for a high-traffic fintech API. Used Terraform to manage 200+ resources across 3 environments. Implemented a Flask-based microservices architecture running on Docker EKS clusters with automated CI/CD pipelines.",
        'codeSnippets': "resource \"aws_instance\" \"web\" {\n  ami           = data.aws_ami.ubuntu.id\n  instance_type = \"t3.medium\"\n  vpc_security_group_ids = [aws_security_group.allow_web.id]\n  \n  tags = {\n    Name = \"Aevura-Core-Node\"\n    Environment = \"Production\"\n  }\n}"
    },
    'skill-gap-analyzer.html': {
        'jobDescription': "PRINCIPAL CLOUD ENGINEER (AWS)\n\nRequirements:\n- 7+ years of experience in Cloud Architecture and DevOps.\n- Advanced proficiency in Terraform and CloudFormation.\n- Expert knowledge of Python/Flask and containerization (Docker/K8s).\n- Proven track record of managing multi-region global infrastructures.\n- Experience with AWS Lambda and Serverless frameworks."
    },
    'contract-generator.html': {
        'clientName': "Cyberdyne Systems GmbH",
        'projectName': "Global Cloud Infrastructure Migration",
        'budget': "$45,000 USD",
        'deadline': "December 20, 2026",
        'deliverables': "1. Terraform Module Library\n2. Docker Container Registry Setup\n3. Multi-AZ AWS Architecture\n4. Flask API Security Audit\n5. Disaster Recovery Documentation"
    },
    'decision-engine.html': {
        'decisionInput': "I am currently an Intermediate Cloud Architect. I have the choice to specialize either in AWS Deep Security or Multi-Cloud Kubernetes management. Which path offers better freelance longevity and higher billable rates for a specialist with my Python/Docker background?"
    },
    'contact-us.html': {
        'name': "Demo Specialist",
        'email': "full-demo@aevura.os",
        'subject': "Consultancy Expansion Inquiry",
        'message': "I am interested in leveraging Aevura OS to automate the client acquisition side of my Cloud Architecture consultancy. Do you offer enterprise-grade support for independent specialists?"
    },
    'signup.html': {
        'name': "Demo Specialist",
        'email': "full-demo@aevura.os",
        'password': "password123",
        'location': "Berlin, DE",
        'freelanceSkills': "Python, Flask, Docker",
        'tools': "Terraform, AWS CLI, PyCharm",
        'targetSkill': "Advanced Cloud Architecture"
    },
    'signin.html': {
        'email': "full-demo@aevura.os",
        'password': "password123"
    },
    'index.html': {
        'goalInput': "I want to master Advanced Cloud Architecture and automate global-scale deployments using Terraform and AWS. My mission is to build the most resilient and scalable backend infrastructures in the market."
    }
};

// --- MOCK API ENGINE (FOR SHOWCASE) ---
const mockResponses = {
    '/api/freelance/gigs': {
        gig_suggestions: [
            {
                title: "Terraform Infrastructure as Code Specialist",
                difficulty: "HARD",
                earning_potential: "$8,500 - $12,000",
                reason: "Cyberdyne Systems needs a specialist to build a secure, multi-region AWS infrastructure using modular Terraform. Your profile's deep IaC background makes you a 98% match for this high-ticket engagement."
            },
            {
                title: "Senior Python/Flask Backend Migration",
                difficulty: "MEDIUM",
                earning_potential: "$6,000 - $9,500",
                reason: "Nebula Stream is migrating legacy services to EKS. They need someone who understands both Flask API optimization and Docker orchestration. You can easily command a premium here by leveraging your 'Berlin-based' specialist status."
            },
            {
                title: "AWS Security Audit & IAM Lockdown",
                difficulty: "MEDIUM",
                earning_potential: "$4,000 / week",
                reason: "A high-growth Fintech startup requires a security-first audit of their IAM roles. Given your 'Advanced Cloud Architecture' focus, this is a low-effort, high-margin task."
            }
        ],
        guidance: "Market demand for Cloud Architecture is peaking. Focus on 'Security' and 'Scalability' in your applications to maximize conversion."
    },
    '/api/freelance/profile-optimize': {
        title: "Senior Cloud Infrastructure Architect | AWS & Terraform Specialist",
        description: "I architect high-performance, automated cloud environments for enterprise-scale Python applications. Specializing in zero-downtime migrations, Infrastructure as Code with Terraform, and hardened security protocols for containerized Flask microservices. Based in Berlin, I help global teams scale with system stability and iron-clad architecture logic.",
        tips: [
            "Use 'Infrastructure as Code' instead of just 'DevOps' to attract higher-tier enterprise clients.",
            "Highlight your AWS CLI and Terraform proficiency in the first paragraph.",
            "Mention your focus on 'System Stability' to differentiate from speed-focused juniors."
        ]
    },
    '/api/freelance/proposal': {
        strategy: "Technical Authority",
        tone: "Professional & Uncompromising",
        proposal: "Subject: Strategic AWS Migration & Terraform Automation\n\nDear Hiring Manager,\n\nI noticed your requirement for a secure, containerized migration of your Flask services. Given my background in architecting multi-region AWS environments for Fintech clients using Terraform, I am confident I can execute this with zero production downtime.\n\nMy approach would involve:\n1. Auditing current security group logic to eliminate potential attack vectors.\n2. Modularizing the entire infrastructure via Terraform 1.5+ for maximum reusability.\n3. Implementing a Blue/Green deployment strategy via AWS CodeDeploy to ensure seamless switchover.\n\nI've handled similar migrations for Berlin-based tech firms with strict uptime requirements. Looking forward to discussing the technical specifics."
    },
    '/api/sim/turn': {
        client_message: "I appreciate the confidence, but we've had 'staging successes' turn into production disasters before. How exactly will the Blue/Green switchover handle our persistent database connections? If we lose data during the sync, the CEO will have my head.",
        analysis: "The client is exhibiting high risk-aversion. Focus on 'Database Consistency' and 'Rollback Procedures' to build trust."
    },
    '/api/portfolio/generate': {
        title: "Global Fintech Infrastructure Shield",
        role: "Lead Cloud Architect",
        tech_stack: ["AWS", "Terraform", "Python", "Docker", "Redis"],
        challenge: "The client faced 15% packet loss and high latency during peak trading hours due to an unoptimized single-region setup. Manual deployments were causing inconsistent environments.",
        solution: "Architected a multi-region active-active AWS environment using Terraform. Optimized the Flask API layer to handle 10x traffic spikes through intelligent caching and horizontal pod autoscaling.",
        results: "Latency reduced by 65%. Zero downtime achieved over 12 months. Infrastructure cost reduced by 22% through spot instance utilization and automated resource cleanup.",
        summary: "This project showcases a mastery of high-availability architecture and modern IaC practices, moving the needle from 'IT Expense' to 'Strategic Advantage'.",
        case_study_markdown: "# Case Study: Fintech Infrastructure Shield\n\n## The Problem\nSingle region weakness...\n\n## The Solution\nMulti-region Terraform automation...\n\n## Results\n- 65% Latency Reduction\n- 100% Uptime"
    },
    '/api/skill-gap/analyze': {
        match_score: 82,
        analysis: "Your core skills in Python and AWS are elite. However, your target as a 'Senior AI Architect' requires bridging the gap into Vector Databases and RAG architectures. You have the structural foundation, but lack specific AI-orchestration tools.",
        missing_skills: ["Vector Databases (Pinecone/Milvus)", "Retrieval-Augmented Generation (RAG)", "LLM Fine-tuning"],
        missing_tools: ["LangChain", "Pinecone", "Vertex AI"],
        missing_experience_depth: "Your profile shows extensive 'Stability' and 'Architecture' work, but lacks documented 'AI Agent' orchestration in production environments.",
        action_plan: [
            { task: "Implement a Pinecone vector store for your Flask portfolio.", priority: "High" },
            { task: "Learn LangChain for LLM orchestration.", priority: "High" },
            { task: "Deploy a sample RAG application on AWS EKS.", priority: "Medium" }
        ]
    },
    '/api/contract/generate': {
        contract_title: "Cloud Infrastructure Master Services Agreement",
        client_name: "Cyberdyne Systems GmbH",
        project_name: "Global Cloud Migration",
        sections: [
            { heading: "I. Scope of Work", content: "Contractor will deliver fully modularized Terraform scripts for AWS Multi-AZ deployment and a containerized Flask microservices architecture." },
            { heading: "II. Payment Terms", content: "Total budget of $45,000 USD. 30% upfront, 40% on UAT approval, 30% on production launch." },
            { heading: "III. Liability & IP", content: "All Terraform modules created are the intellectual property of the Client upon final payment. Contractor provides a 90-day stability guarantee." }
        ],
        brutality_notes: "This agreement includes a 1.5% compounding late fee and strict kill-fee clauses for mid-project termination."
    },
    '/api/start': {
        questions: [
            { question_text: "What is your primary technical stack for this cloud project?", options: ["AWS / Terraform", "Azure / ARM", "GCP / Pulumi"] },
            { question_text: "What is the expected daily traffic volume?", options: ["10k - 100k requests", "1M - 10M requests", "Global / Enterprise Scale"] },
            { question_text: "What is your primary security concern?", options: ["Data Encryption", "IAM Lockdown", "DDoS Mitigation"] }
        ]
    },
    '/api/build-profile': {
        profile_summary: "Demo Specialist: Cloud Architect specializing in AWS/Terraform/Python."
    },
    '/api/analyze-and-plan': {
        goalAnalysis: {
            analysis: "Mastering Cloud Architecture requires a structural shift from simple deployment to distributed system orchestration. Your current Python expertise provides a strong foundation for advanced IaC.",
            difficulty: "HARD",
            estimated_time: "4-6 Months",
            goal_type: "MASTER_ACQUISITION"
        },
        roadmapData: {
            roadmap: [
                { level: 1, title: "Foundation: Cloud Native Core", description: "Establish basic VPC, Subnet, and Security Group configurations." },
                { level: 2, title: "Scale: Elasticity Matrix", description: "Implement Auto-Scaling Groups and Load Balancers." },
                { level: 3, title: "Security: Iron-Clad Identity", description: "Configure IAM Roles, Policies, and KMS encryption." },
                { level: 4, title: "Mastery: Global Distribution", description: "Deploy Multi-Region active-active architecture." }
            ]
        },
        taskPlan: {
            tasks: [
                { title: "Initialize Terraform Provider", priority: "High", order: 1 },
                { title: "Configure VPC CIDR Block", priority: "High", order: 2 },
                { title: "Deploy Public Subnets", priority: "Medium", order: 3 },
                { title: "Setup Internet Gateway", priority: "Medium", order: 4 }
            ]
        }
    },
    '/api/decision-engine/decide': {
        recommendation: "Prioritize 'Multi-Cloud Kubernetes' over 'AWS Deep Security'.",
        options: ["AWS Deep Security Specialist", "Multi-Cloud Kubernetes Management", "Serverless Architecture Lead"],
        comparison: "While AWS Deep Security offers high immediate stability, Multi-Cloud Kubernetes (K8s) specialization provides 40% higher billable rates for high-end industrial freelancers. Given your Berlin location and Docker background, K8s offers more longevity in the European market.",
        reasoning: "Your existing Docker/Flask proficiency reduces the learning curve for Kubernetes. K8s is the current industry standard for the global scale you aim to master."
    },
    '/api/progress': {
        metrics: {
            progress_percentage: 33,
            completed_tasks: 2,
            remaining_tasks: 4,
            insight: "Operational momentum stable. Execute next deployment sequence."
        },
        tasks: [
            { title: "Initialize Terraform Provider", priority: "High", order: 1 },
            { title: "Configure VPC CIDR Block", priority: "High", order: 2 },
            { title: "Deploy Public Subnets", priority: "Medium", order: 3 },
            { title: "Setup Internet Gateway", priority: "Medium", order: 4 },
            { title: "Define Route Tables", priority: "Low", order: 5 },
            { title: "Apply Security Group Ingress", priority: "High", order: 6 }
        ],
        completedTasks: ["Initialize Terraform Provider", "Configure VPC CIDR Block"]
    },
    '/api/progress/insight': {
        insight: "Execution trajectory stabilized. Focus on Subnet isolation to reach 50% milestone."
    }
};

// Global Fetch Interceptor
// Global Fetch Interceptor
const originalFetch = window.fetch;
window.fetch = async function (url, options) {
    const isDemo = window.location.search.includes('demo=true') || sessionStorage.getItem('demo_mode') === 'true';
    
    if (isDemo) {
        const route = Object.keys(mockResponses).find(r => url.includes(r));
        
        if (route) {
            console.log(`%c[DEMO_MOCK] Intercepting ${url}`, 'color: #ff3e00; font-weight: bold;');
            await new Promise(r => setTimeout(r, 800));

            // 1. Handle Simulation Start (Reset)
            if (route === '/api/sim/start') {
                sessionStorage.setItem('demo_sim_turns', '0');
                return {
                    ok: true,
                    status: 200,
                    json: async () => mockResponses[route],
                    headers: new Headers({ 'content-type': 'application/json' })
                };
            }

            // 2. Handle Simulation Turn (Stateful)
            if (route === '/api/sim/turn') {
                let turns = parseInt(sessionStorage.getItem('demo_sim_turns') || '0');
                turns++;
                sessionStorage.setItem('demo_sim_turns', turns.toString());

                if (turns >= 2) {
                    return {
                        ok: true,
                        status: 200,
                        json: async () => ({
                            client_message: "That makes perfect sense. I feel much more comfortable with the migration plan now. Let's proceed with the Blue/Green deployment as discussed. Your technical authority is exactly what we needed.",
                            is_session_end: true,
                            feedback: {
                                score: 9.5,
                                critique: "Excellent technical reassurance and risk mitigation strategy. You handled the client's panic with precise architectural logic and a clear roadmap.",
                                tips: ["Great use of 'Blue/Green' terminology.", "Rollback plan was clearly defined.", "Established technical authority early."]
                            }
                        }),
                        headers: new Headers({ 'content-type': 'application/json' })
                    };
                }
            }

            // 3. Handle Default Mock Response
            return {
                ok: true,
                status: 200,
                json: async () => mockResponses[route],
                headers: new Headers({ 'content-type': 'application/json' })
            };
        }
    }
    return originalFetch.apply(this, [url, options]);
};

/// Zero-Touch Auto-Run Engine
const filledIds = new Set();

function autoFillHandler() {
    const isDemo = window.location.search.includes('demo=true') || sessionStorage.getItem('demo_mode') === 'true';
    if (!isDemo) return;

    // Detect page name more robustly
    let path = window.location.pathname;
    if (path === '/' || path.endsWith('/')) path += 'index.html';
    const filename = path.split('/').pop();
    
    // Try to find data for this filename
    const data = demoData[filename];

    if (data) {
        Object.keys(data).forEach(id => {
            if (filledIds.has(id)) return;
            const el = document.getElementById(id);
            if (el) {
                console.log(`[DEMO_AUTOFILL] Filling ${id}`);
                el.value = data[id];
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                filledIds.add(id);
            }
        });
    }

    // Special handling for dynamic fields in Core Engine Lab (index.html)
    if (filename === 'index.html') {
        const dynamicFields = {
            'answer_0': "Advanced Cloud Architecture and Terraform-based automation.",
            'answer_1': "Python, Flask, Docker, and AWS.",
            'answer_2': "Enterprise tech companies and high-growth AI startups."
        };
        Object.keys(dynamicFields).forEach(id => {
            if (filledIds.has(id)) return;
            const el = document.getElementById(id);
            if (el) {
                console.log(`[DEMO_AUTOFILL] Filling dynamic field ${id}`);
                el.value = dynamicFields[id];
                el.dispatchEvent(new Event('input', { bubbles: true }));
                filledIds.add(id);
                
                // Auto-click the "custom" radio buttons for these answers
                const qNum = id.split('_')[1];
                const radio = document.querySelector(`input[name="q_${qNum}"][value="custom"]`);
                if (radio) {
                    console.log(`[DEMO_AUTOFILL] Clicking custom radio for q_${qNum}`);
                    radio.click();
                }
            }
        });
    }
}

// Initial Run & Persistence Logic
const isDemoMode = window.location.search.includes('demo=true') || sessionStorage.getItem('demo_mode') === 'true';

if (isDemoMode) {
    sessionStorage.setItem('demo_mode', 'true');

    const initWatcher = () => {
        console.log("%c[DEMO_MODE] Zero-Touch System Initialized", "color: #00ff66; font-weight: bold;");
        
        // Immediate fill
        autoFillHandler();
        
        // Watch for DOM changes
        const observer = new MutationObserver(() => autoFillHandler());
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Fallback Interval (for things MutationObserver might miss)
        setInterval(autoFillHandler, 1000);
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initWatcher();
    } else {
        window.addEventListener('DOMContentLoaded', initWatcher);
    }
}
