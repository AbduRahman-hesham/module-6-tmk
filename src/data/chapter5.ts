/**
 * Chapter 5 Data: Sell, Raise or Keep 🏁
 */

import { IdeaId } from './ideas';

export interface IdeaOutlook {
  icon: string;
  headline: string;
  description: string;
  bestReason: string;
}

export const IDEA_OUTLOOKS: Record<IdeaId, IdeaOutlook> = {
  pixel: {
    icon: '📈',
    headline: 'Huge Viral Surge!',
    description: 'Everyone wants your app! You need money for servers.',
    bestReason: 'Strong growth needs money: raising wins.',
  },
  bikes: {
    icon: '📉',
    headline: 'Tough Competition',
    description: 'A big bike shop opened nearby.',
    bestReason: "Weak outlook: sell while it's worth the most.",
  },
  paws: {
    icon: '📊',
    headline: 'Loyal Neighbors',
    description: 'Customers are steady. Nothing new.',
    bestReason: 'Steady business: keeping wins.',
  },
};
