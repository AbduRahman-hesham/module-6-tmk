/**
 * Chapter 1 Data: Launch Your Project 🚀
 */

import { IdeaId } from './ideas';

export interface IdeaSelectionCard {
  id: IdeaId;
  name: string;
  tagline: string;
  icon: string;
  desc: string;
}

export const IDEA_CARDS: Record<IdeaId, IdeaSelectionCard> = {
  pixel: {
    id: 'pixel',
    name: 'Pixel Pals',
    tagline: 'A fun game app for kids.',
    icon: '🎮',
    desc: 'Build virtual pixel pets that kids love to play with.',
  },
  bikes: {
    id: 'bikes',
    name: 'Fix-It Bikes',
    tagline: 'Fast bike repairs for families.',
    icon: '🚲',
    desc: 'Tune gears, fix flat tires, and keep neighbors rolling.',
  },
  paws: {
    id: 'paws',
    name: 'Happy Paws',
    tagline: 'Walking and caring for pets.',
    icon: '🐶',
    desc: 'Walk energetic dogs and care for pets while owners are away.',
  },
};

export interface GoalOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export const CHAPTER1_GOALS: Record<IdeaId, GoalOption[]> = {
  pixel: [
    {
      text: 'Get 100 players in 3 months',
      isCorrect: true,
      explanation: 'Clear and measurable! It has a number and a deadline.',
    },
    {
      text: 'Be the best game ever!',
      isCorrect: false,
      explanation: 'A good goal has a number and a deadline.',
    },
    {
      text: 'Get rich someday',
      isCorrect: false,
      explanation: 'A good goal has a number and a deadline.',
    },
  ],
  bikes: [
    {
      text: 'Fix 20 bikes in 3 months',
      isCorrect: true,
      explanation: 'Clear and measurable! It has a number and a deadline.',
    },
    {
      text: 'Be the best bike fixer ever!',
      isCorrect: false,
      explanation: 'A good goal has a number and a deadline.',
    },
    {
      text: 'Get rich someday',
      isCorrect: false,
      explanation: 'A good goal has a number and a deadline.',
    },
  ],
  paws: [
    {
      text: 'Care for 15 pets in 3 months',
      isCorrect: true,
      explanation: 'Clear and measurable! It has a number and a deadline.',
    },
    {
      text: 'Be the best pet helper ever!',
      isCorrect: false,
      explanation: 'A good goal has a number and a deadline.',
    },
    {
      text: 'Get rich someday',
      isCorrect: false,
      explanation: 'A good goal has a number and a deadline.',
    },
  ],
};

export interface ProjectStepCard {
  id: 'idea' | 'plan' | 'build' | 'launch';
  order: 1 | 2 | 3 | 4;
  title: string;
  icon: string;
}

export const ORDERED_STEPS: ProjectStepCard[] = [
  { id: 'idea', order: 1, title: 'Idea', icon: '💡' },
  { id: 'plan', order: 2, title: 'Plan', icon: '📝' },
  { id: 'build', order: 3, title: 'Build', icon: '🛠️' },
  { id: 'launch', order: 4, title: 'Launch', icon: '🚀' },
];

export interface BudgetItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  isNeed: boolean; // Marked N in data only, never labeled in UI
}

export const CHAPTER1_BUDGET_ITEMS: Record<IdeaId, BudgetItem[]> = {
  pixel: [
    { id: 'laptop', name: 'Laptop', icon: '💻', cost: 30, isNeed: true },
    { id: 'art_tools', name: 'Art tools', icon: '🎨', cost: 20, isNeed: true },
    { id: 'app_fee', name: 'App store fee', icon: '🏪', cost: 10, isNeed: true },
    { id: 'chair', name: 'Gaming chair', icon: '🪑', cost: 30, isNeed: false },
    { id: 'billboard', name: 'Giant billboard', icon: '📣', cost: 50, isNeed: false },
    { id: 'pizza', name: 'Team pizza party', icon: '🍕', cost: 20, isNeed: false },
  ],
  bikes: [
    { id: 'toolkit', name: 'Tool kit', icon: '🔧', cost: 25, isNeed: true },
    { id: 'parts', name: 'Spare parts', icon: '🔩', cost: 20, isNeed: true },
    { id: 'sign', name: 'Shop sign', icon: '🪧', cost: 15, isNeed: true },
    { id: 'garage', name: 'Big garage', icon: '🏠', cost: 60, isNeed: false },
    { id: 'tv_ad', name: 'TV ad', icon: '📺', cost: 50, isNeed: false },
    { id: 'party', name: 'Opening party', icon: '🎂', cost: 20, isNeed: false },
  ],
  paws: [
    { id: 'leashes', name: 'Leashes & bags', icon: '🦮', cost: 15, isNeed: true },
    { id: 'treats', name: 'Pet treats', icon: '🍖', cost: 20, isNeed: true },
    { id: 'booking', name: 'Booking app', icon: '📱', cost: 25, isNeed: true },
    { id: 'van', name: 'Pet van', icon: '🚐', cost: 70, isNeed: false },
    { id: 'tv_ad', name: 'TV ad', icon: '📺', cost: 50, isNeed: false },
    { id: 'party', name: 'Party', icon: '🎈', cost: 20, isNeed: false },
  ],
};
