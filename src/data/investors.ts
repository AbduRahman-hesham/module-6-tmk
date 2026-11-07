/**
 * Investors Data
 * Venture capital firms and growth boost mappings for Chapter 4 & 5.
 */

import { IdeaId } from './ideas';

export type InvestorId = 'bigbucks' | 'friendly' | 'seed' | 'none';

export interface Investor {
  id: InvestorId;
  name: string;
  icon: string;
  tagline: string;
  moneyFraction: number;
  valueMultiple: number;
  growthHelpStars: Record<IdeaId, number>;
}

export const INVESTORS: Investor[] = [
  {
    id: 'bigbucks',
    name: 'Big Bucks Capital',
    icon: '🦈',
    tagline: 'Lots of cash, but asks for a bigger slice.',
    moneyFraction: 0.40,
    valueMultiple: 0.70,
    growthHelpStars: {
      pixel: 3,
      bikes: 1,
      paws: 1,
    },
  },
  {
    id: 'friendly',
    name: 'Friendly Fund',
    icon: '🤝',
    tagline: 'Fair terms and great advice for local businesses.',
    moneyFraction: 0.25,
    valueMultiple: 1.00,
    growthHelpStars: {
      pixel: 2,
      bikes: 3,
      paws: 3,
    },
  },
  {
    id: 'seed',
    name: 'Seed Starter',
    icon: '🌱',
    tagline: 'Small check, very founder-friendly price tag.',
    moneyFraction: 0.12,
    valueMultiple: 1.20,
    growthHelpStars: {
      pixel: 1,
      bikes: 1,
      paws: 1,
    },
  },
];

export const STAR_TO_BOOST: Record<number, number> = {
  1: 1.10,
  2: 1.25,
  3: 1.45,
};

export const NO_INVESTOR_BOOST = 1.0;
