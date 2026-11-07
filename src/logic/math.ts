/**
 * Pure Math & Logic Functions for Startup Journey
 * Deterministic, no Math.random. All numbers are integers or explicitly typed.
 */

import { Idea, QUALITY_MULTIPLIERS } from '../data/ideas';
import { INVESTORS, InvestorId, STAR_TO_BOOST, NO_INVESTOR_BOOST } from '../data/investors';

/** Round to nearest 10 */
export function r10(x: number): number {
  return Math.round(x / 10) * 10;
}

export interface PlanCombo {
  priceIdx: number;
  costIdx: number;
  teamIdx: number;
}

export interface MonthlyProfitBreakdown {
  customers: number;
  capacity: number;
  served: number;
  margin: number;
  teamCost: number;
  profit: number;
}

/**
 * 1. Calculate monthly customer count
 * customers(idea, priceIdx, costIdx) = Math.round(customersAtPrice[priceIdx] × quality[costIdx])
 */
export function customers(idea: Idea, priceIdx: number, costIdx: number): number {
  const quality = QUALITY_MULTIPLIERS[costIdx] ?? 1.0;
  return Math.round(idea.customersAtPrice[priceIdx] * quality);
}

/**
 * 2. Calculate monthly profit and breakdown
 * monthlyProfit(idea, {priceIdx, costIdx, teamIdx}) = min(customers, teamCapacity[teamIdx]) × (prices[priceIdx] − unitCost[costIdx]) − teamCost[teamIdx]
 */
export function monthlyProfit(idea: Idea, combo: PlanCombo): MonthlyProfitBreakdown {
  const cust = customers(idea, combo.priceIdx, combo.costIdx);
  const cap = idea.teamCapacity[combo.teamIdx];
  const served = Math.min(cust, cap);
  const margin = idea.prices[combo.priceIdx] - idea.unitCost[combo.costIdx];
  const tCost = idea.teamCost[combo.teamIdx];
  const prof = served * margin - tCost;

  return {
    customers: cust,
    capacity: cap,
    served,
    margin,
    teamCost: tCost,
    profit: prof,
  };
}

/**
 * 3. Find the best plan out of all 27 combinations
 * bestPlan(idea): brute-force the 27 combos → {combo, profit}.
 */
export function bestPlan(idea: Idea): { combo: PlanCombo; profit: number } {
  let maxProfit = -Infinity;
  let bestCombo: PlanCombo = { priceIdx: 0, costIdx: 0, teamIdx: 0 };

  for (let priceIdx = 0; priceIdx < 3; priceIdx++) {
    for (let costIdx = 0; costIdx < 3; costIdx++) {
      for (let teamIdx = 0; teamIdx < 3; teamIdx++) {
        const combo: PlanCombo = { priceIdx, costIdx, teamIdx };
        const result = monthlyProfit(idea, combo);
        if (result.profit > maxProfit) {
          maxProfit = result.profit;
          bestCombo = combo;
        }
      }
    }
  }

  return { combo: bestCombo, profit: maxProfit };
}

/**
 * 4. Plan stars rating (0–3)
 * profit ≤ 0 → 0; profit/best ≥ 0.9 → 3; ≥ 0.7 → 2; else 1.
 */
export function planStars(profit: number, bestProfit: number): number {
  if (profit <= 0) return 0;
  const ratio = profit / bestProfit;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  return 1;
}

/**
 * 5. Project stars rating (1–3)
 * projectStars(goalFirstTry, stepMistakes) = 1 + (goalFirstTry ? 1 : 0) + (stepMistakes ≤ 1 ? 1 : 0).
 */
export function projectStars(goalFirstTry: boolean, stepMistakes: number): number {
  return 1 + (goalFirstTry ? 1 : 0) + (stepMistakes <= 1 ? 1 : 0);
}

/**
 * 6. Business plan problem & customer clarity score (0–2)
 * clarity(problemFirstTry, customersFirstTry) = number of trues (0–2).
 */
export function clarity(problemFirstTry: boolean, customersFirstTry: boolean): number {
  return (problemFirstTry ? 1 : 0) + (customersFirstTry ? 1 : 0);
}

export interface ValuationBreakdown {
  yearly: number;
  multiple: number;
  baseValuation: number;
  leftoverCash: number;
  V0: number;
}

/**
 * 7. Company pre-money valuation (V0)
 * yearly = max(0, 12 × profit); multiple = 1 + projectStars + clarity;
 * V0 = r10(max(100, yearly × multiple) + leftoverCash).
 */
export function valuation(params: {
  profit: number;
  projectStars: number;
  clarity: number;
  leftoverCash: number;
}): ValuationBreakdown {
  const yearly = Math.max(0, 12 * params.profit);
  const multiple = 1 + params.projectStars + params.clarity;
  const baseValuation = yearly * multiple;
  const V0 = r10(Math.max(100, baseValuation) + params.leftoverCash);

  return {
    yearly,
    multiple,
    baseValuation,
    leftoverCash: params.leftoverCash,
    V0,
  };
}

export type OfferLabel = 'greedy' | 'fair' | 'generous';

export interface InvestorOffer {
  investorId: InvestorId;
  name: string;
  icon: string;
  investment: number; // I
  preMoney: number; // pre
  equityGiven: number; // e (%)
  founderSlice: number; // own (%)
  fairEquity: number; // fair (%)
  label: OfferLabel;
  growthBoost: number;
  futureValuation: number; // FV
  payout: number; // unrounded ranking score
}

/**
 * 8. Calculate investment offers for all investors plus "No investor"
 */
export function offers(idea: Idea, V0: number, bankStars: number): InvestorOffer[] {
  const polish = 1 + 0.05 * bankStars;
  const result: InvestorOffer[] = [];

  for (const inv of INVESTORS) {
    const I = r10(inv.moneyFraction * V0);
    const pre = r10(inv.valueMultiple * polish * V0);
    const e = Math.round((100 * I) / (pre + I));
    const own = 100 - e;
    const fair = Math.round((100 * I) / (V0 + I));

    let label: OfferLabel = 'fair';
    if (e > fair + 2) {
      label = 'greedy';
    } else if (e < fair - 2) {
      label = 'generous';
    }

    const helpStars = inv.growthHelpStars[idea.id] ?? 1;
    const boost = STAR_TO_BOOST[helpStars] ?? 1.0;
    const FV = r10((V0 + I) * idea.baseGrowth * boost);
    const payout = (FV * own) / 100;

    result.push({
      investorId: inv.id,
      name: inv.name,
      icon: inv.icon,
      investment: I,
      preMoney: pre,
      equityGiven: e,
      founderSlice: own,
      fairEquity: fair,
      label,
      growthBoost: boost,
      futureValuation: FV,
      payout,
    });
  }

  // "No investor" option
  const FV_none = r10((V0 + 0) * idea.baseGrowth * NO_INVESTOR_BOOST);
  result.push({
    investorId: 'none',
    name: 'No Investor',
    icon: '👤',
    investment: 0,
    preMoney: V0,
    equityGiven: 0,
    founderSlice: 100,
    fairEquity: 0,
    label: 'fair',
    growthBoost: 1.0,
    futureValuation: FV_none,
    payout: (FV_none * 100) / 100,
  });

  return result;
}

/**
 * 9. Offer ranks (sort by payout desc → stars 3, 2, 1, 0, ties keep order)
 */
export function offerRanks(offerList: InvestorOffer[]): Record<InvestorId, number> {
  const sorted = [...offerList].sort((a, b) => b.payout - a.payout);
  const ranks: Record<InvestorId, number> = {
    bigbucks: 0,
    friendly: 0,
    seed: 0,
    none: 0,
  };

  const starValues = [3, 2, 1, 0];
  sorted.forEach((offer, idx) => {
    ranks[offer.investorId] = starValues[idx] ?? 0;
  });

  return ranks;
}

export type ExitType = 'sell' | 'keep' | 'raise';

export interface ExitOption {
  type: ExitType;
  title: string;
  icon: string;
  description: string;
  payout: number;
  stars: number;
}

export interface ExitsResult {
  sell: number;
  keep: number;
  raise: number;
  stars: {
    sell: number;
    keep: number;
    raise: number;
  };
  options: ExitOption[];
}

/**
 * 10. Exits calculation
 * base = FV × own / 100
 * sell = r10(base)
 * keep = r10(base × keepGrowth)
 * raise = r10(base × 0.8 × 1.2 × raiseGrowth)
 * Stars by rank: best 3, middle 2, worst 1.
 */
export function exits(idea: Idea, FV: number, own: number): ExitsResult {
  const base = (FV * own) / 100;
  const sell = r10(base);
  const keep = r10(base * idea.outlook.keep);
  const raise = r10(base * 0.8 * 1.2 * idea.outlook.raise);

  const values: { type: ExitType; amount: number; title: string; icon: string; desc: string }[] = [
    {
      type: 'sell',
      amount: sell,
      title: 'Sell Company',
      icon: '💰',
      desc: 'Sell all your shares today for immediate cash.',
    },
    {
      type: 'keep',
      amount: keep,
      title: 'Keep Running',
      icon: '🚀',
      desc: 'Stay CEO and keep growing your business.',
    },
    {
      type: 'raise',
      amount: raise,
      title: 'Raise Series A',
      icon: '📈',
      desc: 'Sell 20% to big funds and supercharge growth.',
    },
  ];

  // Sort descending by amount to assign 3, 2, 1 stars
  const sorted = [...values].sort((a, b) => b.amount - a.amount);
  const starMap: Record<ExitType, number> = {
    sell: 1,
    keep: 1,
    raise: 1,
  };

  starMap[sorted[0].type] = 3;
  starMap[sorted[1].type] = 2;
  starMap[sorted[2].type] = 1;

  const options: ExitOption[] = values.map((v) => ({
    type: v.type,
    title: v.title,
    icon: v.icon,
    description: v.desc,
    payout: v.amount,
    stars: starMap[v.type],
  }));

  return {
    sell,
    keep,
    raise,
    stars: starMap,
    options,
  };
}

/**
 * 11. Total stars and founder title
 * totalStars = project (1–3) + plan (0–3) + bank (0–3) + VC (0–3) + exit (1–3), max 15.
 * Title: ≥ 12 "Business Builder 🏆" · 8–11 "Smart Founder ⭐" · ≤ 7 "Rookie Founder 🌱".
 */
export function founderTitle(totalStars: number): {
  stars: number;
  title: string;
  badge: string;
} {
  const safeTotal = Math.min(15, Math.max(0, totalStars));
  if (safeTotal >= 12) {
    return { stars: safeTotal, title: 'Business Builder 🏆', badge: '🏆' };
  }
  if (safeTotal >= 8) {
    return { stars: safeTotal, title: 'Smart Founder ⭐', badge: '⭐' };
  }
  return { stars: safeTotal, title: 'Rookie Founder 🌱', badge: '🌱' };
}
