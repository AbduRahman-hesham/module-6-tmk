/**
 * Chapter 4 Data: Meet the Investors 💼
 */

import { IdeaId } from './ideas';

export const CHAPTER4_INTRO = {
  title: 'Meet the Venture Capitalists 💼',
  desc: 'A VC gives money and gets a slice of your company. More money = a bigger slice for them.',
  formula: 'Fair slice ≈ money ÷ (value + money)',
};

export const INVESTOR_WINNER_EXPLANATIONS: Record<IdeaId, string> = {
  pixel: 'More growth help beat the big slice: Big Bucks gave top growth help (3★) for game apps.',
  bikes: 'Friendly Fund gave great growth help (3★) with a fair slice, beating greedy funds.',
  paws: 'Friendly Fund offered a balanced valuation and the highest pet care growth boost (3★).',
};
