# Aevura OS - Project Documentation

This document tracks the current state, architecture, and feature implementations of Aevura OS.

## 🚀 Core Ecosystem Status: ACTIVE
Current Modules Implemented: **Module 01 (Freelancer Assistant)** & **Module 02 (Simulation Mode)**.

---

## 1. Foundation & Authentication
### Global User Profile (GUP)
The "Heart" of the system. All modules share a single `GlobalUserProfile` interface.
- **Implementation**: Data is collected once during a 3-step signup and used to provide context for all AI services.
- **Persistence**: Switched from File-Based Storage to **Persistent Database (Firebase Firestore)**.
- **Session Stability**: Implemented `cookie-parser` and "Session Re-hydration." Even after server restarts, the system recognizes the user via a session cookie and reloads their data from Firebase.

### Security Features
- **Auth Flow**: Full Signup/Signin implementation.
- **Password Management**: Added "Forgot Password" functionality with a 2-step plain-hash verification (for prototype stage).

---

## 2. Module 01: Freelancer Assistant
A suite of tools designed to automate and optimize the business side of freelancing.

### Interactive Gig Suggestion Engine
- **Logic**: Users input specific skills (e.g., "React, Python").
- **Consultant Feedback**: The AI cross-references the input with the User Profile. If there's a mismatch (e.g., a Graphic Designer asking for Backend work), the AI provides a "Coaching Guidance" note before suggesting gigs.

### Collaborative Profile Optimizer
- **Logic**: Not a simple generator. It takes the user's *Current Title*, *Current Bio*, and *Target Skills*.
- **Output**: Produces a professional-length, structured bio (Problem -> Solution -> Result) and specific profile tips.

### Proposal Generator
- **Logic**: Generates tailored proposals based on the Job Description and the User's level (Newcomer/Mid/Expert).

---

## 3. Module 02: Real-World Simulation Mode (Beta)
An adversarial environment for practicing client communication.

### Client Scenarios
1. **The Scope Creeper**: Requests free extra work.
2. **The Late Payer**: Makes excuses for payment delays.
3. **The Perfectionist**: Vague specs but highly critical.

### Personalized Modes
- **Implementation**: Users can create custom client personalities via a global Modal. They define the "Personality Name" and "Behavior Description."
- **Persistence**: Custom modes and full Chat Histories are saved to the user's permanent profile in Firebase.

### Evaluation System
- **Real-time Scoring**: Provides a 1-10 performance score after each session.
- **Critique & Tips**: Analyzes professionalism and boundary-setting.

---

## 4. Technical Progress & Error Log

### ESM Module Resolution
- **Error**: `Cannot find module ...` errors during deployment.
- **Fix**: Added `"type": "module"` to `package.json` and ensured all local imports use the `.js` extension.

### Data Loss on Refresh
- **Error**: Refreshing the page wiped the "Logged In" status and any unsaved custom data.
- **Fix**:
    1. Moved user storage to a JSON file.
    2. Implemented `updateUserProfile` logic to sync state changes (like chat history) immediately.
    3. Added session cookies to auto-login the user on page load.

### UI / UX Refinements
- **Industrial Aesthetic**: Unified dark theme with orange (`#ff3e00`) accents.
- **Scrollbar Fix**: Hidden visual scrollbars in the chat window using CSS (`scrollbar-width: none`) to maintain a clean, premium desktop-app feel while keeping scroll functionality intact.
- **Modal-First Input**: Replaced cramped sidebar forms with centered Modals for accessibility.

---

## 5. Next Steps
- [ ] **Module 03: Case Study Architect** (Automated case-study generation).
- [ ] **Module 04: Skill Gap Analyzer Dashboard** (Visual progression tracking).
- [x] **Infrastructure**: Migration from `users.json` to a persistent database (Firebase).
- [ ] **Module 08: Progress Tracker** (Logic complete, needs UI/API integration).
