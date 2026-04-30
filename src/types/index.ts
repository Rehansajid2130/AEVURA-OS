export interface Preferences {
  learning_style: string;
  work_type: string;
}

export interface UserProfile {
  skill: string;
  level: string;
  tools: string[];
  goal: string;
  timeline: string;
  experience: string;
  strengths: string[];
  weaknesses: string[];
  preferences: Preferences;
}

/**
 * GlobalUserProfile — collected once at signup.
 * This is the master profile shared across ALL ecosystem modules:
 * Freelancer Assistant, Skill Gap Analyzer, Case Study Architect, Simulation Mode.
 */
export interface GlobalUserProfile {
  // Block 1: Identity
  name: string;
  email: string;
  location: string;

  // Block 2: Freelance Status
  is_freelancer: boolean | "part-time";
  freelance_skills: string[];       // what they currently sell

  // Block 3: Learning Intent
  learning_intent: "improve" | "new-skill";
  target_skill: string;             // the skill they're here to develop
  current_level: "Beginner" | "Intermediate" | "Expert";
  tools: string[];                  // tools/software they currently use

  // Block 4: Goal
  primary_goal: "income" | "skill" | "both";

  // Gemini-enriched fields (populated by Module 2 on first use)
  strengths: string[];
  weaknesses: string[];
  preferences: Preferences;

  // Simulation persistence
  simHistory: { role: "client" | "user", content: string }[];
  simScenario: string;
  simCustomDesc: string;
  customScenarios: Record<string, { name: string, desc: string }>;

  // Pipeline temporary state
  currentGoal?: string;
  m1Output?: any;
  tempProfile?: any;

  // Progress Tracking (Module 8)
  roadmap?: any;
  tasks?: any[];
  completedTasks?: string[];
}
