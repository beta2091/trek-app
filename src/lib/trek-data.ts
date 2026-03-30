// ── Footprint Framework ──────────────────────────────────────────────
// Based on Ken Younce's Get REAL Workbook II

export type Footprint = "faith" | "family" | "fitness" | "finance" | "fulfillment";

export type AnswerValue = 4 | 2 | 0;

export interface FootprintInfo {
  key: Footprint;
  label: string;
  fullName: string;
  description: string;
  color: string;
  icon: string;
}

export const FOOTPRINTS: FootprintInfo[] = [
  {
    key: "faith",
    label: "F1",
    fullName: "Faith",
    description: "Inner peace, spiritual practice, and values alignment.",
    color: "#a855f7",
    icon: "🙏",
  },
  {
    key: "family",
    label: "F2",
    fullName: "Family",
    description: "Communication, support, bonding, and presence with those closest to you.",
    color: "#ef4444",
    icon: "❤️",
  },
  {
    key: "fitness",
    label: "F3",
    fullName: "Fitness",
    description: "Physical health, energy, exercise, diet, and sleep.",
    color: "#22c55e",
    icon: "💪",
  },
  {
    key: "finance",
    label: "F4",
    fullName: "Finance",
    description: "Budgeting, saving, investing, and financial goals.",
    color: "#3b82f6",
    icon: "💰",
  },
  {
    key: "fulfillment",
    label: "F5",
    fullName: "Fulfillment",
    description: "Purpose, meaning, growth, and contentment.",
    color: "#f59e0b",
    icon: "✨",
  },
];

// ── Assessment Questions (25 total, 5 per Footprint) ─────────────────

export interface Question {
  id: string;
  text: string;
  footprint: Footprint;
}

export const QUESTIONS: Question[] = [
  // Faith
  { id: "faith1", text: "Do I intentionally spend time in prayer, reflection, or spiritual practice each week?", footprint: "faith" },
  { id: "faith2", text: "Do my decisions align with my stated beliefs?", footprint: "faith" },
  { id: "faith3", text: "Am I adequately representing the person God created me to be through my daily thoughts and actions?", footprint: "faith" },
  { id: "faith4", text: "Do I regularly openly express gratitude for what I have been given?", footprint: "faith" },
  { id: "faith5", text: "Am I growing spiritually compared to a year ago?", footprint: "faith" },

  // Family
  { id: "family1", text: "Do I give my best energy — not leftovers — to my family most days?", footprint: "family" },
  { id: "family2", text: "Do I regularly communicate appreciation to the people closest to me?", footprint: "family" },
  { id: "family3", text: "Do my family relationships feel mostly peaceful rather than tense?", footprint: "family" },
  { id: "family4", text: "Am I fully present (not distracted) when I am with my family?", footprint: "family" },
  { id: "family5", text: "If my family evaluated my leadership, would they say I show up consistently?", footprint: "family" },

  // Fitness
  { id: "fitness1", text: "Do I intentionally move my body at least 4 days per week?", footprint: "fitness" },
  { id: "fitness2", text: "Do I have the energy I need for my daily responsibilities?", footprint: "fitness" },
  { id: "fitness3", text: "Am I fueling my body more with whole foods than processed foods?", footprint: "fitness" },
  { id: "fitness4", text: "Can I perform basic movements (squat, hinge, push, pull) without pain?", footprint: "fitness" },
  { id: "fitness5", text: "Am I stronger or healthier today than I was 6 months ago?", footprint: "fitness" },

  // Finance
  { id: "finance1", text: "Do I know exactly how much money comes in and goes out each month?", footprint: "finance" },
  { id: "finance2", text: "Am I consistently saving or investing something every month?", footprint: "finance" },
  { id: "finance3", text: "Could I handle a $1,000 unexpected expense without panic?", footprint: "finance" },
  { id: "finance4", text: "Am I intentionally working toward clear financial goals?", footprint: "finance" },
  { id: "finance5", text: "Does my spending generally align with my values?", footprint: "finance" },

  // Fulfillment
  { id: "fulfill1", text: "Do I wake up most days with a sense of purpose?", footprint: "fulfillment" },
  { id: "fulfill2", text: "Does my work feel meaningful beyond just earning money?", footprint: "fulfillment" },
  { id: "fulfill3", text: "Am I making progress toward goals that matter deeply to me?", footprint: "fulfillment" },
  { id: "fulfill4", text: "Do I make time for things that genuinely energize me?", footprint: "fulfillment" },
  { id: "fulfill5", text: "If nothing changed for the next 5 years, would I be satisfied?", footprint: "fulfillment" },
];

export const ANSWER_OPTIONS: { label: string; value: AnswerValue }[] = [
  { label: "Yes", value: 4 },
  { label: "Sometimes", value: 2 },
  { label: "No", value: 0 },
];

// ── Scoring ──────────────────────────────────────────────────────────

export interface FootprintScores {
  faith: number;
  family: number;
  fitness: number;
  finance: number;
  fulfillment: number;
  total: number;
  percentage: number;
}

export function calculateScores(
  responses: Record<string, number>
): FootprintScores {
  const sums: Record<Footprint, number> = {
    faith: 0,
    family: 0,
    fitness: 0,
    finance: 0,
    fulfillment: 0,
  };

  for (const q of QUESTIONS) {
    const val = responses[q.id];
    if (val !== undefined) {
      sums[q.footprint] += val;
    }
  }

  const total = sums.faith + sums.family + sums.fitness + sums.finance + sums.fulfillment;

  return {
    ...sums,
    total,
    percentage: Math.round((total / 100) * 100),
  };
}

export function getBestFootprint(scores: FootprintScores): Footprint {
  const fps: Footprint[] = ["faith", "family", "fitness", "finance", "fulfillment"];
  return fps.reduce((best, fp) => (scores[fp] > scores[best] ? fp : best));
}

export function getWorstFootprints(scores: FootprintScores, count: number = 2): Footprint[] {
  const fps: Footprint[] = ["faith", "family", "fitness", "finance", "fulfillment"];
  return fps.sort((a, b) => scores[a] - scores[b]).slice(0, count);
}

// ── Action Step Menus ────────────────────────────────────────────────

export const ACTION_STEPS: Record<Footprint, string[]> = {
  faith: [
    "Prayer/Meditation Time Daily",
    "Book/Audible/Podcast Daily",
    "Daily Morning Gratitudes",
    "Spiritual Mentor",
    "Volunteer/Serve in Spiritual Community",
    "Practice Forgiveness",
    "Daily Journal",
    "Nightly Reflection time",
    "Perform Random Act of Kindness",
    "Share Faith/Witness Daily",
  ],
  family: [
    "Show Daily Appreciations",
    "Schedule Daily Quality Time",
    "Perform Random Check-ins",
    "Schedule Weekly Face to Face Meetings",
    "Eliminate Distractions (Be Present!)",
    "Eat one meal a day with Family/Friends",
    "Discuss Wins Daily (Cookies)",
    "Create/Collaborate on shared goals/projects",
    "Apologize for previous mishandled situations",
  ],
  fitness: [
    "Quick Wake-up Routine (1-3 minutes)",
    "Scheduled Cardio Sessions",
    "Incorporate Strength Training",
    "Incorporate a Stretch Routine",
    "Stairs ONLY for entire TREK",
    "Mini-Routines scheduled thru the day",
    "Stand/Walk on all phone calls",
    "Have a Designated Workout Partner",
    "Schedule 2 Outdoor activities per week",
    "Set and maintain a Sleep Schedule",
    "Meditation / BOX breathing",
  ],
  finance: [
    "Create and maintain a budget",
    "Take Lunch",
    "Increase Income",
    "Create Emergency Fund",
    "REYG Savings Goals - Monthly Payment",
    "Identify/Eliminate 1 Poor buying habit",
    "Meet with a Financial Mentor",
    "Create Annual Financial Plan (by day 28)",
    "Review Subscriptions",
    "Shop Insurance",
    "Make weekly menu - 1 Trip Grocery Store",
  ],
  fulfillment: [
    "Daily Gratitudes",
    "ID and pursue joyful activities",
    "Connect with Loved ones",
    "Set and Pursue Meaningful Goals",
    "Find/Participate in Volunteer Opportunities",
    "Inventory your Circle - eliminate negativity",
    "Be where your feet are",
    "Perform daily Acts of Kindness",
    "Learn/engage in a new hobby",
  ],
};

// ── TREK Worksheet types ─────────────────────────────────────────────

export interface TrekWorksheet {
  trekkerName: string;
  trekPartnerName: string;
  startDate: string;
  endDate: string;
  timeTrade: {
    oldHabit: string;
    newHabit: string;
  };
  reach: {
    footprint: Footprint;
    actionSteps: [string, string];
  };
  execute: {
    footprint1: Footprint;
    actionSteps1: [string, string];
    footprint2: Footprint;
    actionSteps2: [string, string];
  };
  kill: {
    demon: string;
    strategy: string;
  };
}

// ── Post-TREK Review types ───────────────────────────────────────────

export interface PostTrekReview {
  grades: {
    strongestFootprint: number;
    timeTrade: number;
    weakestFootprint1: number;
    weakestFootprint2: number;
    demon: number;
    asTrekPartner: number;
  };
  circleOfInfluence: string;
  knockoffs: string;
  discoveries: string;
  permanentChanges: string;
}

export const REVIEW_GRADE_AREAS = [
  { key: "strongestFootprint" as const, label: "Strongest Footprint (Reach)" },
  { key: "timeTrade" as const, label: "Time Trade" },
  { key: "weakestFootprint1" as const, label: "Weakest Footprint #1 (Execute)" },
  { key: "weakestFootprint2" as const, label: "Weakest Footprint #2 (Execute)" },
  { key: "demon" as const, label: "Demon (Kill)" },
  { key: "asTrekPartner" as const, label: "You as a Trek Partner" },
];

export const REVIEW_PROMPTS = [
  { key: "circleOfInfluence", prompt: "List 5 ways you affected your circle of influence during the TREK." },
  { key: "knockoffs", prompt: "What factors knocked you off parts of your TREK?" },
  { key: "discoveries", prompt: "What did you discover or confirm about yourself?" },
  { key: "permanentChanges", prompt: "What permanent changes will you carry with you?" },
];
