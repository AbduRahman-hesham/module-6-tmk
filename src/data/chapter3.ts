/**
 * Chapter 3 Data: Meet the Bank 🏦
 */

export interface BankService {
  id: 'value' | 'shares' | 'buyer' | 'savings';
  title: string;
  icon: string;
  desc: string;
  isInvestmentBank: boolean;
}

export const BANK_SERVICES: BankService[] = [
  {
    id: 'value',
    title: 'Value check',
    icon: '💎',
    desc: 'Tells what a company is worth',
    isInvestmentBank: true,
  },
  {
    id: 'shares',
    title: 'Sell shares',
    icon: '📈',
    desc: 'Helps many people buy pieces of a company (IPO)',
    isInvestmentBank: true,
  },
  {
    id: 'buyer',
    title: 'Find a buyer',
    icon: '🤝',
    desc: 'Helps sell a whole company',
    isInvestmentBank: true,
  },
  {
    id: 'savings',
    title: 'Keep savings',
    icon: '🐷',
    desc: 'A regular bank keeps savings safe',
    isInvestmentBank: false,
  },
];

export interface BankRound {
  round: number;
  clientEmoji: string;
  clientName: string;
  request: string;
  correctServiceId: 'value' | 'shares' | 'buyer' | 'savings';
  correctExplanation: string;
}

export const BANK_ROUNDS: BankRound[] = [
  {
    round: 1,
    clientEmoji: '👩‍💼',
    clientName: 'Founder Sarah',
    request: 'How much is my company worth?',
    correctServiceId: 'value',
    correctExplanation: 'Value check! The bank calculates your fair price tag.',
  },
  {
    round: 2,
    clientEmoji: '👨‍💼',
    clientName: 'Founder David',
    request: 'I want many people to own a piece of my company.',
    correctServiceId: 'shares',
    correctExplanation: 'Sell shares (IPO)! The bank lists your stock for the public.',
  },
  {
    round: 3,
    clientEmoji: '🧑‍💻',
    clientName: 'Founder Alex',
    request: 'A big company wants to buy mine. Help!',
    correctServiceId: 'buyer',
    correctExplanation: 'Find a buyer (M&A)! The bank negotiates the best purchase deal.',
  },
];
