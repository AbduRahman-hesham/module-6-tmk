/**
 * Chapters Configuration
 * Accents, titles, words of chapter, and lessons.
 */

export interface ChapterInfo {
  number: 1 | 2 | 3 | 4 | 5;
  title: string;
  shortTitle: string;
  icon: string;
  accentColor: string; // Hex color for header tint and dots
  accentBg: string; // Tailwind background class or style
  word: {
    term: string;
    definition: string;
    emoji: string;
  };
  lesson: string;
}

export const CHAPTERS: Record<number, ChapterInfo> = {
  1: {
    number: 1,
    title: 'Launch Your Project',
    shortTitle: 'Business Project',
    icon: '🚀',
    accentColor: '#5CC8FF', // sky
    accentBg: 'bg-[#5CC8FF]',
    word: {
      term: 'Budget',
      definition: 'Coins you can spend.',
      emoji: '💰',
    },
    lesson: 'A project needs a goal, ordered steps and a budget.',
  },
  2: {
    number: 2,
    title: 'Write Your Plan',
    shortTitle: 'Business Plan',
    icon: '📝',
    accentColor: '#FFD23F', // sun
    accentBg: 'bg-[#FFD23F]',
    word: {
      term: 'Profit',
      definition: 'Money in minus money out.',
      emoji: '📈',
    },
    lesson: 'A plan shows problem, customers, price, costs and team.',
  },
  3: {
    number: 3,
    title: 'Meet the Bank',
    shortTitle: 'Investment Banks',
    icon: '🏦',
    accentColor: '#4ADE80', // mint
    accentBg: 'bg-[#4ADE80]',
    word: {
      term: 'Valuation',
      definition: "Your company's price tag.",
      emoji: '💎',
    },
    lesson: 'Investment banks help with big deals: value, shares, buyers.',
  },
  4: {
    number: 4,
    title: 'Meet the Investors',
    shortTitle: 'Venture Capital',
    icon: '💼',
    accentColor: '#8B5CF6', // grape
    accentBg: 'bg-[#8B5CF6]',
    word: {
      term: 'Equity',
      definition: 'Your slice of the company.',
      emoji: '🥧',
    },
    lesson: 'VCs give money for a slice. More money = smaller slice for you.',
  },
  5: {
    number: 5,
    title: 'Sell, Raise or Keep',
    shortTitle: 'Selling & Raising',
    icon: '🏁',
    accentColor: '#FF9F1C', // orange
    accentBg: 'bg-[#FF9F1C]',
    word: {
      term: 'Exit',
      definition: 'How you cash out.',
      emoji: '🚪',
    },
    lesson: "Sell, raise or keep? It depends on the company's future.",
  },
};
