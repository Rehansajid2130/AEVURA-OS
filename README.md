# AEVURA OS

> **An AI-Powered Industrial Operating System for Freelancers & Professionals**

Aevura OS is a brutalist, industrial-grade web platform that integrates multiple AI-powered modules into a single unified ecosystem. Built for the **Google AI Seekho** competition, it leverages the **Google Gemini API** to transform how professionals plan, execute, and grow their careers.

---

## 🔥 Live Demo

> _Deployment URL will be added after Google Cloud Run deployment._

---

## 📸 Screenshots

| Dashboard | Reality Simulator |
|---|---|
| Industrial dark-mode landing page with ecosystem grid | Interactive AI-powered client negotiation practice |

---

## 🧠 What is Aevura OS?

Aevura OS is not just a website — it's an **operating system for professional success**. It takes massive, undefined career goals and breaks them down into machine-generated, structurally sound micro-tasks using AI. Every module in the system is designed to solve a specific real-world professional problem.

### Core Philosophy
- **Brutally Efficient**: Zero fluff. Every pixel serves a purpose.
- **AI-First**: Every module is powered by the Google Gemini API.
- **Industrial Aesthetic**: Dark-mode brutalist design with "Safety Orange" accents.

---

## 🧩 System Modules

| Module | ID | Description |
|---|---|---|
| **Core Engine Laboratory** | MOD-00 | Analyzes goals and generates multi-tier AI roadmaps |
| **Freelancer Assistant** | MOD-01 | Generates data-backed client proposals and pricing strategies |
| **Real-World Simulation** | MOD-02 | Practice high-stakes client conversations against AI personas |
| **Case Study Architect** | MOD-03 | Transforms raw project notes into polished portfolio case studies |
| **Skill Gap Analyzer** | MOD-04 | Compares your skills against live job descriptions to find weaknesses |
| **Contract Shield** | MOD-05 | Generates iron-clad freelance agreements with edge-case protection |
| **Decision Engine** | MOD-07 | Eliminates choice paralysis with objective AI-powered recommendations |
| **Progress Tracker** | MOD-08 | Monitors roadmap completion and provides strategic insights |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES Modules) |
| **Backend** | Node.js, Express.js, TypeScript |
| **AI Engine** | Google Gemini API (`@google/genai`) |
| **Database** | Firebase Firestore |
| **Auth** | Cookie-based sessions with bcrypt password hashing |
| **Deployment** | Docker + Google Cloud Run |
| **Design System** | Custom brutalist industrial theme with JetBrains Mono & Space Grotesk fonts |

---

## 📂 Project Structure

```
aevura-os/
├── public/                    # Frontend (served as static files)
│   ├── landing.html           # Main dashboard
│   ├── modules.html           # Module index
│   ├── simulation.html        # Reality Simulator (MOD-02)
│   ├── case-study-architect.html
│   ├── skill-gap-analyzer.html
│   ├── contract-generator.html
│   ├── decision-engine.html
│   ├── progress.html
│   ├── about-me.html
│   ├── contact-us.html
│   ├── css/
│   │   ├── templatemo-axis-industrial.css   # Core design system
│   │   └── command-palette.css              # Ctrl+K HUD styles
│   └── js/
│       ├── os-ui.js           # Global UI controller (navbar, auth guard, toasts)
│       └── command-palette.js # Fuzzy-search command palette
├── src/
│   ├── server.ts              # Express.js backend entry point
│   ├── modules/               # AI module logic (Gemini API integrations)
│   │   ├── Module1.js         # Profiling questions generator
│   │   ├── Module2.js         # User profile builder
│   │   ├── Module3.js         # Goal analyzer
│   │   ├── Module4.js         # Roadmap generator
│   │   ├── Module5.js         # Task plan generator
│   │   ├── Module7.js         # Decision engine
│   │   ├── Module8.js         # Progress tracker metrics
│   │   ├── ModuleSignup.js    # Auth & user management
│   │   ├── Module_FA_*.js     # Freelancer Assistant sub-modules
│   │   └── ...
│   └── services/
│       └── firebase.js        # Firebase/Firestore connection
├── Dockerfile                 # Container config for Cloud Run
├── .dockerignore
├── .gitignore
├── .env                       # Environment variables (NOT committed)
├── package.json
├── PROJECT_GUIDANCE.md        # Detailed architecture documentation
├── MODULES_FUNCTIONALITY.md   # Module technical breakdown
└── WEBSITE_WALKTHROUGH.md     # End-to-end user journey
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- A **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))
- A **Firebase** project with Firestore enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/aevura-os.git
cd aevura-os

# 2. Install dependencies
npm install

# 3. Create your environment file
#    Create a .env file in the root directory with:
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# 4. Place your Firebase service account JSON
#    Download from Firebase Console > Project Settings > Service Accounts
#    Save as firebase-service-account.json in the root directory

# 5. Start the server
npm start
```

The application will be running at `http://localhost:8080`

---

## ☁️ Deploying to Google Cloud Run

### Option 1: Using the Google Cloud Console (Recommended)

1. Push your code to a **GitHub repository**
2. Go to [Google Cloud Console](https://console.cloud.google.com) → **Cloud Run**
3. Click **"Create Service"** → **"Set up with Cloud Build"**
4. Connect your GitHub account and select the repository
5. It will auto-detect the `Dockerfile`
6. In the **"Variables & Secrets"** section, add:
   - `GEMINI_API_KEY` = your API key
   - `GOOGLE_APPLICATION_CREDENTIALS` = path to service account
7. Click **Deploy**

### Option 2: Using the gcloud CLI

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy
gcloud run deploy aevura-os --source . --port 8080 --allow-unauthenticated
```

---

## 🎨 Design System

Aevura OS uses a custom **Brutalist Industrial** design language:

- **Background**: Deep charcoal (`#0a0a0a`, `#141414`)
- **Text**: High-contrast white (`#e0e0e0`)
- **Accent**: Safety Orange (`#FF3E00`)
- **Typography**: JetBrains Mono (monospace) + Space Grotesk (headings)
- **Interactions**: Box-shadow offsets on hover, no background flashing
- **Navigation**: Global sticky header with breadcrumb system + `Ctrl+K` command palette

---

## 🔑 Key Features

- ✅ **8 AI-powered modules** — each solving a distinct professional problem
- ✅ **Real-time AI chat simulation** — practice negotiations against adversarial AI personas
- ✅ **Command Palette (Ctrl+K)** — instant fuzzy-search navigation across the entire OS
- ✅ **Persistent data** — Firebase Firestore stores user profiles, roadmaps, and progress
- ✅ **Secure authentication** — bcrypt-hashed passwords with HTTP-only cookie sessions
- ✅ **Fully responsive** — industrial mobile menu with touch-optimized interactions
- ✅ **Contact form** — integrated with FormSubmit for real email delivery
- ✅ **Dark mode only** — no light theme distractions, pure focus

---

## 🛡️ Security

- Passwords are hashed using **bcrypt** before storage
- Sessions use **HTTP-only cookies** (not accessible via JavaScript)
- API keys are stored in environment variables, **never** in source code
- FormSubmit uses a **hashed token** instead of a naked email address
- `.gitignore` prevents `.env` and service account files from being committed

---

## 📄 License

This project was built for the **Google AI Seekho** competition.

---

## 👨‍💻 Author

Built with precision by the **Aevura OS Architect**.

> _"Execution is the only currency that matters in a world of infinite ideation."_
