export interface Question {
  id: string;
  text: string;
  dimension: TrekDimension;
}

export type TrekDimension = "tribe" | "resilience" | "energy" | "knowledge";

export interface DimensionInfo {
  key: TrekDimension;
  label: string;
  fullName: string;
  description: string;
  color: string;
  icon: string;
}

export const DIMENSIONS: DimensionInfo[] = [
  {
    key: "tribe",
    label: "T",
    fullName: "Tribe",
    description: "Your community, relationships, and the people who walk beside you.",
    color: "#f59e0b",
    icon: "🔥",
  },
  {
    key: "resilience",
    label: "R",
    fullName: "Resilience",
    description: "Your physical and mental strength — how you handle what life throws at you.",
    color: "#ef4444",
    icon: "🏔️",
  },
  {
    key: "energy",
    label: "E",
    fullName: "Energy",
    description: "Your drive, purpose, and daily vitality — the fuel that moves you forward.",
    color: "#3b82f6",
    icon: "⚡",
  },
  {
    key: "knowledge",
    label: "K",
    fullName: "Knowledge",
    description: "Your growth, learning, and wisdom — how you invest in becoming more.",
    color: "#10b981",
    icon: "🧭",
  },
];

export const QUESTIONS: Question[] = [
  // Tribe (T) - Community & Relationships
  {
    id: "t1",
    text: "I have people in my life I can be completely honest with.",
    dimension: "tribe",
  },
  {
    id: "t2",
    text: "I actively invest time in my most important relationships.",
    dimension: "tribe",
  },
  {
    id: "t3",
    text: "I feel like I belong to a community that challenges me to grow.",
    dimension: "tribe",
  },
  {
    id: "t4",
    text: "The people closest to me would say I show up for them consistently.",
    dimension: "tribe",
  },
  {
    id: "t5",
    text: "I surround myself with people who elevate me, not drain me.",
    dimension: "tribe",
  },

  // Resilience (R) - Physical & Mental Strength
  {
    id: "r1",
    text: "I take care of my body like it matters — because it does.",
    dimension: "resilience",
  },
  {
    id: "r2",
    text: "When life gets hard, I face it head-on rather than numbing out.",
    dimension: "resilience",
  },
  {
    id: "r3",
    text: "I have practices that keep my mind strong and clear.",
    dimension: "resilience",
  },
  {
    id: "r4",
    text: "I can handle discomfort without falling apart.",
    dimension: "resilience",
  },
  {
    id: "r5",
    text: "I sleep well, move my body, and fuel it properly most days.",
    dimension: "resilience",
  },

  // Energy (E) - Purpose & Vitality
  {
    id: "e1",
    text: "I wake up most mornings with a sense of purpose.",
    dimension: "energy",
  },
  {
    id: "e2",
    text: "My daily work feels meaningful, not just like going through the motions.",
    dimension: "energy",
  },
  {
    id: "e3",
    text: "I manage my energy well — I know when to push and when to rest.",
    dimension: "energy",
  },
  {
    id: "e4",
    text: "I feel excited about where my life is heading.",
    dimension: "energy",
  },
  {
    id: "e5",
    text: "I spend more time creating than consuming.",
    dimension: "energy",
  },

  // Knowledge (K) - Growth & Wisdom
  {
    id: "k1",
    text: "I am actively learning something that matters to me right now.",
    dimension: "knowledge",
  },
  {
    id: "k2",
    text: "I reflect on my experiences and extract lessons from them.",
    dimension: "knowledge",
  },
  {
    id: "k3",
    text: "I seek out perspectives different from my own.",
    dimension: "knowledge",
  },
  {
    id: "k4",
    text: "I have a clear picture of the man I'm becoming.",
    dimension: "knowledge",
  },
  {
    id: "k5",
    text: "I invest in personal growth — books, mentors, experiences, courses.",
    dimension: "knowledge",
  },
];

export interface TrekScores {
  tribe: number;
  resilience: number;
  energy: number;
  knowledge: number;
  overall: number;
}

export function calculateScores(
  responses: Record<string, number>
): TrekScores {
  const dimensionScores: Record<TrekDimension, number[]> = {
    tribe: [],
    resilience: [],
    energy: [],
    knowledge: [],
  };

  for (const q of QUESTIONS) {
    const val = responses[q.id];
    if (val !== undefined) {
      dimensionScores[q.dimension].push(val);
    }
  }

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const tribe = avg(dimensionScores.tribe);
  const resilience = avg(dimensionScores.resilience);
  const energy = avg(dimensionScores.energy);
  const knowledge = avg(dimensionScores.knowledge);
  const overall = (tribe + resilience + energy + knowledge) / 4;

  return { tribe, resilience, energy, knowledge, overall };
}

export interface Recommendation {
  dimension: TrekDimension;
  title: string;
  body: string;
}

export function getRecommendations(scores: TrekScores): Recommendation[] {
  const dims: { key: TrekDimension; score: number }[] = [
    { key: "tribe", score: scores.tribe },
    { key: "resilience", score: scores.resilience },
    { key: "energy", score: scores.energy },
    { key: "knowledge", score: scores.knowledge },
  ];

  dims.sort((a, b) => a.score - b.score);

  const recs: Record<TrekDimension, Recommendation> = {
    tribe: {
      dimension: "tribe",
      title: "Strengthen Your Tribe",
      body: "Start with one honest conversation this week. Reach out to someone you respect and go deeper than surface level. Build the circle that builds you.",
    },
    resilience: {
      dimension: "resilience",
      title: "Build Your Resilience",
      body: "Pick one physical challenge this week — a cold shower, an extra mile, a harder workout. Train your body and your mind will follow. Discomfort is the price of growth.",
    },
    energy: {
      dimension: "energy",
      title: "Reclaim Your Energy",
      body: "Audit how you spend your first and last hour of each day. Replace one passive habit with something that fuels you. Your energy is the currency of your life — spend it on what matters.",
    },
    knowledge: {
      dimension: "knowledge",
      title: "Invest in Your Knowledge",
      body: "Commit to 20 minutes a day of intentional learning. Read, listen, study — but don't just consume. Reflect. Write down what you learn. Wisdom comes from applied knowledge.",
    },
  };

  return dims.slice(0, 3).map((d) => recs[d.key]);
}
