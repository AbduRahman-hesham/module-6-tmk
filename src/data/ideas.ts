/**
 * Business Ideas Data
 * All numbers and parameters for Chapter 1 & 2 logic.
 */

export type IdeaId = 'pixel' | 'bikes' | 'paws';

export interface Idea {
  id: IdeaId;
  name: string;
  tagline: string;
  icon: string;
  prices: [number, number, number];
  customersAtPrice: [number, number, number];
  unitCost: [number, number, number]; // [Basic, Good, Fancy]
  teamCapacity: [number, number, number]; // [0, 1, 2]
  teamCost: [number, number, number]; // [0, 1, 2]
  baseGrowth: number;
  outlook: {
    keep: number;
    raise: number;
  };
  stars: {
    growth: number;
    effort: number;
    risk: number;
  };
}

export const START_CASH = 100;

export const QUALITY_MULTIPLIERS = [0.5, 1.0, 1.5] as const; // Basic, Good, Fancy

export const COST_LABELS = ['Cheap stuff', 'Good stuff', 'Fancy stuff'] as const;

export const TEAM_LABELS = ['Just me', '+1 helper', '+2 helpers'] as const;

export const IDEAS: Record<IdeaId, Idea> = {
  pixel: {
    id: 'pixel',
    name: 'Pixel Pals',
    tagline: 'A fun pixel pet mobile game 🎮',
    icon: '🎮',
    prices: [2, 4, 6],
    customersAtPrice: [30, 20, 6],
    unitCost: [1, 2, 3],
    teamCapacity: [15, 25, 40],
    teamCost: [0, 5, 10],
    baseGrowth: 1.6,
    outlook: {
      keep: 1.2,
      raise: 1.6,
    },
    stars: {
      growth: 3,
      effort: 2,
      risk: 3,
    },
  },
  bikes: {
    id: 'bikes',
    name: 'Fix-It Bikes',
    tagline: 'Neighborhood bike repairs & tune-ups 🚲',
    icon: '🚲',
    prices: [8, 12, 16],
    customersAtPrice: [16, 10, 4],
    unitCost: [4, 6, 9],
    teamCapacity: [5, 10, 15],
    teamCost: [0, 10, 20],
    baseGrowth: 1.3,
    outlook: {
      keep: 0.8,
      raise: 0.9,
    },
    stars: {
      growth: 2,
      effort: 3,
      risk: 1,
    },
  },
  paws: {
    id: 'paws',
    name: 'Happy Paws',
    tagline: 'Friendly pet care & dog walking 🐶',
    icon: '🐶',
    prices: [6, 10, 14],
    customersAtPrice: [16, 10, 6],
    unitCost: [3, 5, 9],
    teamCapacity: [6, 12, 18],
    teamCost: [0, 6, 12],
    baseGrowth: 1.4,
    outlook: {
      keep: 1.3,
      raise: 1.25,
    },
    stars: {
      growth: 2,
      effort: 2,
      risk: 1,
    },
  },
};

export const IDEAS_LIST = Object.values(IDEAS);
