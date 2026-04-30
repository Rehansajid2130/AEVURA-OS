# AI Success OS - Backend Logic & Architecture

## Core Philosophy
The backend focuses entirely on functionality, strict data processing, and maintaining state. All integrations with the AI will utilize the **Gemini API** and enforce structured JSON responses.

## System Architecture

1. **API Layer (Next.js API Routes / Node.js Express)**
   Receives user payload, identifies the current state, and routes to the correct module.

2. **Module Controllers**
   We have 8 distinct modules, operating chronologically from understanding the user to generating tasks. These modules do not handle the LLM connection directly; instead, they format prompts and send them to the Gemini Service.
   
3. **Gemini Service (The Logic Hub)**
   A centralized `geminiService.ts` file manages all interaction with the Gemini API. 
   - Uses `@google/genai` to communicate.
   - Enforces JSON output using system instructions and schema definitions.
   - Handles retries and error parsing if the model breaks JSON format.
   
4. **State Management (Database layer)**
   A minimal mock database (JSON file or memory structure initially, scalable later to MongoDB) stores the `USER PROFILE`.
   - **Crucial Rule:** The `USER PROFILE` is pulled and injected into the prompt context for Modules 3 through 8.

## The 8 Modules & Data Flow

### Step 1: Profiling
- **Module 1 (Question Generator):** Receives the basic user goal. Outputs array of questions.
- **Client Side:** Simulates asking questions and collecting replies.
- **Module 2 (User Profile Builder):** Receives replies. Outputs the formal `USER PROFILE JSON` structure. State is saved!

### Step 2: Planning
- **Module 3 (Goal Analyzer):** Reads Goal + User Profile. Outputs difficulty, required skills.
- **Module 4 (Learning Roadmap Generator):** Uses Goal Analyzer data + User Profile. Outputs chronological roadmap table.
- **Module 5 (Task Planner):** Iterates roadmap into actionable ticket tasks.

### Step 3: Execution Tools
- **Module 6 (Freelance Assistant):** Uses User Profile to generate proposals/gigs based on user's current level.
- **Module 7 (Decision Engine):** Feeds A/B options + User Profile to the Gemini Service to get a recommended path.
- **Module 8 (Progress Tracker):** Logic layer tracking task completion vs roadmap plan to produce progress metrics.

## Development Strategy
We will begin by scaffolding a project and building **API endpoints for each module**, tested via tools like `curl` or Postman to ensure string-to-JSON data flows perfectly before ever touching UI.
