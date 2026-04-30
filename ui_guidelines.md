# Aevura OS - User Interface & Design System

## 1. Core Philosophy (Axis Industrial)
We have abandoned standard "Tabbed" UI paradigms in favor of an engineered, **Brutalist / Industrial** aesthetic derived from the "Axis Industrial" template. The design relies heavily on raw mathematical structure, heavy typography, hard solid borders, and instant shadows. This prevents the UI from feeling like a generic app and establishes it as a powerful, robust "Operating System".

## 2. Typography & Tokens
- **Display Font**: `Space Grotesk` (Uppercase, tight letter-spacing, bold. Used for Headings and data indicators).
- **Body & Code Font**: `JetBrains Mono` (Monospaced style. Used for technical data, dynamic tags, buttons, and system output).
- **Primary Colors**:
  - Ink (`#000000`)
  - Base White (`#FFFFFF`)
  - Safety Orange (`#FF3E00`)

## 3. Structural Constraints
- **Borders**: Elements use a stark 4px solid black border (`border: 4px solid black`).
- **Shadows**: Interactive elements use a harsh, unblurred 8px offset shadow (`8px 8px 0px black`).
- **Hover Physics**: When hovered, cards and buttons lift up and shadows deepen to `12px 12px 0px`, simulating mechanical switches. Transitions should be near-instant (No slow fades/blurs).

## 4. Application Architecture & Components

### A. The Core Engine Dashboard (Modules 1-5)
The central goal generator is displayed using a **Bento Grid** layout. It structurally parses the massive API output into designated rigid cards instead of a long overwhelming text block:
- **MOD-01 & 02 (Profile)**: Displayed as a wide bento box with data sparklines.
- **MOD-03 (Analysis)**: Dark mode bento box displaying the aggressive life-coach feedback.
- **MOD-04 (Adaptive Matrix)**: Visual representation of the 3-Tier Roadmap.
- **MOD-05 (Iterative Micro-Tasks)**: Orange "Safety" bento box emphasizing 5-7 restrictive actionable steps.

### B. The Ecosystem (Expansion Modules)
Aevura OS extends far beyond goal planning and features distinct sub-engines hosted prominently below the central dashboard using the **Stack Card** component layout:
1. **Freelancer Assistant**: Automates client proposals, structures freelance business pricing, and optimizes workflows using data.
2. **Real-World Simulation Mode**: Tests user abilities against AI-modeled high-pressure client scenarios and technical interviews.
3. **Case Study Architect**: Architect high-impact case studies automatically from fed code snippets and project notes.
4. **Skill Gap Analyzer**: Automatically scans current live market job descriptions against the user's exact profile to identify missing variables.
