# Aevura OS - Project Architecture & File Guidance

## 1. Overview
Aevura OS is an industrial-grade, AI-powered operating system designed to serve as a comprehensive toolkit for freelancers and professionals. The project utilizes a decoupled architecture with a vanilla HTML/CSS/JS frontend communicating with a Node.js/Express backend powered by the Gemini AI Engine.

## 2. Directory Structure

### `/public` (Frontend Application)
This directory contains the core visual interface of Aevura OS.
*   **`.html` Files:** Each file represents a distinct module or page in the OS.
    *   `landing.html`: The main dashboard featuring the ecosystem grid and system telemetry.
    *   `modules.html`: A comprehensive index of all available system modules.
    *   `about-me.html`: Profile page for the system architect.
    *   `contact-us.html`: Secure transmission form utilizing formsubmit.co.
    *   *(Module Pages)*: `index.html` (Core Engine), `freelancer-assistant.html`, `simulation.html`, `case-study-architect.html`, `skill-gap-analyzer.html`, `contract-generator.html`, `decision-engine.html`, `progress.html`.
*   **`/css`**: Contains brutalist stylesheets.
    *   `command-palette.css`: Styles for the global `Ctrl+K` command HUD.
    *   `templatemo-axis-industrial.css`: Core design system variables, dark mode styles, and structural layouts.
*   **`/js`**: Core frontend logic.
    *   `os-ui.js`: The global UI controller. It injects the sticky navbar, handles mobile menu logic, manages the global toast notification system, and enforces the "Auth Guard" to ensure only logged-in users can access the OS.
    *   `command-palette.js`: Logic for the fuzzy-search HUD.

### `/src` (Backend Architecture)
*   **`server.ts`**: The main Express.js application entry point. It handles:
    *   Routing for the `/api/*` endpoints.
    *   Authentication and session management.
    *   Integration with the Google Gemini API to power the AI modules.
    *   Database connection logic (Mongoose/MongoDB).

### Root Configuration
*   **`.env`**: Stores secret environment variables (e.g., `GEMINI_API_KEY`, `MONGODB_URI`).
*   **`package.json`**: Defines Node.js dependencies (Express, Mongoose, etc.) and run scripts (`npm run start`).

## 3. Core Design Philosophy
The system relies on a **Brutalist Industrial** aesthetic. 
*   **CSS Variables:** Managed in `os-ui.js` and `templatemo-axis-industrial.css`. Colors rely heavily on stark contrasts: deep darks (`#0a0a0a`, `#141414`), stark whites, and a high-visibility "Safety Orange" (`#FF3E00`) accent.
*   **Modularity:** Instead of a complex SPA framework, the project embraces multi-page simplicity with global JS controllers (`os-ui.js`) injecting shared state, keeping load times incredibly fast and code highly readable.
