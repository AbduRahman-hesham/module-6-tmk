/**
 * Chapter 2 Data: Write Your Plan 📝
 */

import { IdeaId } from './ideas';

export interface PlanProblemOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface PlanCustomerOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export const CHAPTER2_PROBLEMS: Record<IdeaId, PlanProblemOption[]> = {
  pixel: [
    {
      text: 'Kids get bored on long trips',
      isCorrect: true,
      explanation: 'Great problem! Kids need fun entertainment while traveling.',
    },
    {
      text: 'Games are too colorful',
      isCorrect: false,
      explanation: 'Not a real problem. Pick one people need solved.',
    },
    {
      text: 'Phones are too small',
      isCorrect: false,
      explanation: 'Not a real problem. Pick one people need solved.',
    },
  ],
  bikes: [
    {
      text: "Bikes break and kids can't fix them",
      isCorrect: true,
      explanation: 'Real problem! Families need skilled help fixing bikes quickly.',
    },
    {
      text: 'Bikes are too shiny',
      isCorrect: false,
      explanation: 'Not a real problem. Pick one people need solved.',
    },
    {
      text: 'Roads are too flat',
      isCorrect: false,
      explanation: 'Not a real problem. Pick one people need solved.',
    },
  ],
  paws: [
    {
      text: "Busy families can't walk their pets",
      isCorrect: true,
      explanation: 'Real problem! Working owners need caring helpers for their pets.',
    },
    {
      text: 'Dogs like cats',
      isCorrect: false,
      explanation: 'Not a real problem. Pick one people need solved.',
    },
    {
      text: 'Parks are too green',
      isCorrect: false,
      explanation: 'Not a real problem. Pick one people need solved.',
    },
  ],
};

export const CHAPTER2_CUSTOMERS: Record<IdeaId, PlanCustomerOption[]> = {
  pixel: [
    {
      text: 'Kids 8–12 who love games',
      isCorrect: true,
      explanation: 'Spot on! This target audience plays and shares games.',
    },
    {
      text: 'Everyone on Earth',
      isCorrect: false,
      explanation: 'Too broad or the wrong group.',
    },
    {
      text: 'Grown-ups who hate games',
      isCorrect: false,
      explanation: 'Too broad or the wrong group.',
    },
  ],
  bikes: [
    {
      text: 'Families near my shop',
      isCorrect: true,
      explanation: 'Spot on! Local neighbors with bikes are your best customers.',
    },
    {
      text: 'People with no bikes',
      isCorrect: false,
      explanation: 'Too broad or the wrong group.',
    },
    {
      text: 'Everyone in the world',
      isCorrect: false,
      explanation: 'Too broad or the wrong group.',
    },
  ],
  paws: [
    {
      text: 'Pet owners nearby',
      isCorrect: true,
      explanation: 'Spot on! Neighborhood pet owners who need walking services.',
    },
    {
      text: 'People allergic to pets',
      isCorrect: false,
      explanation: 'Too broad or the wrong group.',
    },
    {
      text: 'Everyone in the world',
      isCorrect: false,
      explanation: 'Too broad or the wrong group.',
    },
  ],
};
