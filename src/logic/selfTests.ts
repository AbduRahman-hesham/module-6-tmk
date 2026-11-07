/**
 * Comprehensive Self-Test Suite for Startup Journey
 * Verifies all math and logic assertions A through I.
 */

import { IDEAS } from '../data/ideas';
import {
  bestPlan,
  monthlyProfit,
  planStars,
  projectStars,
  valuation,
  offers,
  offerRanks,
  exits,
  founderTitle,
} from './math';

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
}

export function runAllSelfTests(): {
  results: TestResult[];
  passedCount: number;
  totalCount: number;
  allPassed: boolean;
} {
  const results: TestResult[] = [];

  function assert(suite: string, name: string, expected: any, actual: any) {
    const expStr = typeof expected === 'object' ? JSON.stringify(expected) : String(expected);
    const actStr = typeof actual === 'object' ? JSON.stringify(actual) : String(actual);
    const passed = expStr === actStr;
    results.push({
      suite,
      name,
      passed,
      expected: expStr,
      actual: actStr,
    });
  }

  // --- Suite A: bestPlan ---
  {
    const pixelBest = bestPlan(IDEAS.pixel);
    assert('A. bestPlan', 'pixel best profit', 35, pixelBest.profit);
    assert('A. bestPlan', 'pixel best combo', { priceIdx: 1, costIdx: 1, teamIdx: 1 }, pixelBest.combo);

    const bikesBest = bestPlan(IDEAS.bikes);
    assert('A. bestPlan', 'bikes best profit', 50, bikesBest.profit);
    assert('A. bestPlan', 'bikes best combo', { priceIdx: 1, costIdx: 1, teamIdx: 1 }, bikesBest.combo);

    const pawsBest = bestPlan(IDEAS.paws);
    assert('A. bestPlan', 'paws best profit', 54, pawsBest.profit);
    assert('A. bestPlan', 'paws best combo', { priceIdx: 2, costIdx: 1, teamIdx: 0 }, pawsBest.combo);
  }

  // --- Suite B: monthlyProfit ---
  {
    // pixel
    assert('B. monthlyProfit', 'pixel {2,Basic,me}', 15, monthlyProfit(IDEAS.pixel, { priceIdx: 0, costIdx: 0, teamIdx: 0 }).profit);
    assert('B. monthlyProfit', 'pixel {4,Good,me}', 30, monthlyProfit(IDEAS.pixel, { priceIdx: 1, costIdx: 1, teamIdx: 0 }).profit);
    assert('B. monthlyProfit', 'pixel {6,Fancy,me}', 27, monthlyProfit(IDEAS.pixel, { priceIdx: 2, costIdx: 2, teamIdx: 0 }).profit);
    assert('B. monthlyProfit', 'pixel {2,Fancy,+1}', -30, monthlyProfit(IDEAS.pixel, { priceIdx: 0, costIdx: 2, teamIdx: 1 }).profit);
    assert('B. monthlyProfit', 'pixel {2,Good,me}', 0, monthlyProfit(IDEAS.pixel, { priceIdx: 0, costIdx: 1, teamIdx: 0 }).profit);

    // bikes
    assert('B. monthlyProfit', 'bikes {12,Good,me}', 30, monthlyProfit(IDEAS.bikes, { priceIdx: 1, costIdx: 1, teamIdx: 0 }).profit);
    assert('B. monthlyProfit', 'bikes {16,Good,me}', 40, monthlyProfit(IDEAS.bikes, { priceIdx: 2, costIdx: 1, teamIdx: 0 }).profit);
    assert('B. monthlyProfit', 'bikes {8,Good,+1}', 10, monthlyProfit(IDEAS.bikes, { priceIdx: 0, costIdx: 1, teamIdx: 1 }).profit);

    // paws
    assert('B. monthlyProfit', 'paws {14,Good,+1}', 48, monthlyProfit(IDEAS.paws, { priceIdx: 2, costIdx: 1, teamIdx: 1 }).profit);
    assert('B. monthlyProfit', 'paws {10,Good,+1}', 44, monthlyProfit(IDEAS.paws, { priceIdx: 1, costIdx: 1, teamIdx: 1 }).profit);
    assert('B. monthlyProfit', 'paws {6,Basic,me}', 18, monthlyProfit(IDEAS.paws, { priceIdx: 0, costIdx: 0, teamIdx: 0 }).profit);
  }

  // --- Suite C: planStars (pixel, best 35) ---
  {
    assert('C. planStars', '35 -> 3', 3, planStars(35, 35));
    assert('C. planStars', '30 -> 2', 2, planStars(30, 35));
    assert('C. planStars', '27 -> 2', 2, planStars(27, 35));
    assert('C. planStars', '24 -> 1', 1, planStars(24, 35));
    assert('C. planStars', '0 -> 0', 0, planStars(0, 35));
    assert('C. planStars', '-5 -> 0', 0, planStars(-5, 35));
  }

  // --- Suite D: projectStars ---
  {
    assert('D. projectStars', '(true, 0) = 3', 3, projectStars(true, 0));
    assert('D. projectStars', '(true, 2) = 2', 2, projectStars(true, 2));
    assert('D. projectStars', '(false, 1) = 2', 2, projectStars(false, 1));
    assert('D. projectStars', '(false, 3) = 1', 1, projectStars(false, 3));
  }

  // --- Suite E: valuation ---
  {
    const v1 = valuation({ profit: 35, projectStars: 3, clarity: 2, leftoverCash: 40 });
    assert('E. valuation', 'multiple (35 profit)', 6, v1.multiple);
    assert('E. valuation', 'V0 (35 profit)', 2560, v1.V0);

    const v2 = valuation({ profit: -10, projectStars: 1, clarity: 0, leftoverCash: 40 });
    assert('E. valuation', 'V0 (-10 profit)', 140, v2.V0);
  }

  // --- Suite F: offers pixel, V0 2560, bankStars 3 ---
  {
    const pixelOffers = offers(IDEAS.pixel, 2560, 3);
    const bigbucks = pixelOffers.find((o) => o.investorId === 'bigbucks')!;
    const friendly = pixelOffers.find((o) => o.investorId === 'friendly')!;
    const seed = pixelOffers.find((o) => o.investorId === 'seed')!;
    const none = pixelOffers.find((o) => o.investorId === 'none')!;

    // bigbucks {I 1020, pre 2060, e 33, own 67, fair 28, greedy, FV 8310}
    assert('F. offers pixel', 'bigbucks I', 1020, bigbucks.investment);
    assert('F. offers pixel', 'bigbucks pre', 2060, bigbucks.preMoney);
    assert('F. offers pixel', 'bigbucks e', 33, bigbucks.equityGiven);
    assert('F. offers pixel', 'bigbucks own', 67, bigbucks.founderSlice);
    assert('F. offers pixel', 'bigbucks fair', 28, bigbucks.fairEquity);
    assert('F. offers pixel', 'bigbucks label', 'greedy', bigbucks.label);
    assert('F. offers pixel', 'bigbucks FV', 8310, bigbucks.futureValuation);

    // friendly {I 640, pre 2940, e 18, own 82, fair 20, fair, FV 6400}
    assert('F. offers pixel', 'friendly I', 640, friendly.investment);
    assert('F. offers pixel', 'friendly pre', 2940, friendly.preMoney);
    assert('F. offers pixel', 'friendly e', 18, friendly.equityGiven);
    assert('F. offers pixel', 'friendly own', 82, friendly.founderSlice);
    assert('F. offers pixel', 'friendly fair', 20, friendly.fairEquity);
    assert('F. offers pixel', 'friendly label', 'fair', friendly.label);
    assert('F. offers pixel', 'friendly FV', 6400, friendly.futureValuation);

    // seed {I 310, pre 3530, e 8, own 92, fair 11, generous, FV 5050}
    assert('F. offers pixel', 'seed I', 310, seed.investment);
    assert('F. offers pixel', 'seed pre', 3530, seed.preMoney);
    assert('F. offers pixel', 'seed e', 8, seed.equityGiven);
    assert('F. offers pixel', 'seed own', 92, seed.founderSlice);
    assert('F. offers pixel', 'seed fair', 11, seed.fairEquity);
    assert('F. offers pixel', 'seed label', 'generous', seed.label);
    assert('F. offers pixel', 'seed FV', 5050, seed.futureValuation);

    // none {FV 4100, own 100}
    assert('F. offers pixel', 'none FV', 4100, none.futureValuation);
    assert('F. offers pixel', 'none own', 100, none.founderSlice);

    // Ranks: bigbucks 3★, friendly 2★, seed 1★, none 0★
    const ranks = offerRanks(pixelOffers);
    assert('F. offers pixel ranks', 'bigbucks rank', 3, ranks.bigbucks);
    assert('F. offers pixel ranks', 'friendly rank', 2, ranks.friendly);
    assert('F. offers pixel ranks', 'seed rank', 1, ranks.seed);
    assert('F. offers pixel ranks', 'none rank', 0, ranks.none);
  }

  // --- Suite G: offers bikes & paws ---
  {
    // offers bikes V0 3640, bankStars 3: friendly {I 910, e 18, own 82, FV 8580}
    const bikesOffers = offers(IDEAS.bikes, 3640, 3);
    const bikesFriendly = bikesOffers.find((o) => o.investorId === 'friendly')!;
    assert('G. offers bikes', 'friendly I', 910, bikesFriendly.investment);
    assert('G. offers bikes', 'friendly e', 18, bikesFriendly.equityGiven);
    assert('G. offers bikes', 'friendly own', 82, bikesFriendly.founderSlice);
    assert('G. offers bikes', 'friendly FV', 8580, bikesFriendly.futureValuation);

    // offers paws V0 3930, bankStars 3: friendly {I 980, e 18, own 82, FV 9970}
    const pawsOffers = offers(IDEAS.paws, 3930, 3);
    const pawsFriendly = pawsOffers.find((o) => o.investorId === 'friendly')!;
    assert('G. offers paws', 'friendly I', 980, pawsFriendly.investment);
    assert('G. offers paws', 'friendly e', 18, pawsFriendly.equityGiven);
    assert('G. offers paws', 'friendly own', 82, pawsFriendly.founderSlice);
    assert('G. offers paws', 'friendly FV', 9970, pawsFriendly.futureValuation);
  }

  // --- Suite H: exits ---
  {
    // pixel FV 6400 own 82 → sell 5250, keep 6300, raise 8060 (stars: raise 3, keep 2, sell 1)
    const pixelExit = exits(IDEAS.pixel, 6400, 82);
    assert('H. exits pixel', 'sell', 5250, pixelExit.sell);
    assert('H. exits pixel', 'keep', 6300, pixelExit.keep);
    assert('H. exits pixel', 'raise', 8060, pixelExit.raise);
    assert('H. exits pixel stars', 'raise stars', 3, pixelExit.stars.raise);
    assert('H. exits pixel stars', 'keep stars', 2, pixelExit.stars.keep);
    assert('H. exits pixel stars', 'sell stars', 1, pixelExit.stars.sell);

    // bikes FV 8580 own 82 → sell 7040, keep 5630, raise 6080 (sell 3, raise 2, keep 1)
    const bikesExit = exits(IDEAS.bikes, 8580, 82);
    assert('H. exits bikes', 'sell', 7040, bikesExit.sell);
    assert('H. exits bikes', 'keep', 5630, bikesExit.keep);
    assert('H. exits bikes', 'raise', 6080, bikesExit.raise);
    assert('H. exits bikes stars', 'sell stars', 3, bikesExit.stars.sell);
    assert('H. exits bikes stars', 'raise stars', 2, bikesExit.stars.raise);
    assert('H. exits bikes stars', 'keep stars', 1, bikesExit.stars.keep);

    // paws FV 9970 own 82 → sell 8180, keep 10630, raise 9810 (keep 3, raise 2, sell 1)
    const pawsExit = exits(IDEAS.paws, 9970, 82);
    assert('H. exits paws', 'sell', 8180, pawsExit.sell);
    assert('H. exits paws', 'keep', 10630, pawsExit.keep);
    assert('H. exits paws', 'raise', 9810, pawsExit.raise);
    assert('H. exits paws stars', 'keep stars', 3, pawsExit.stars.keep);
    assert('H. exits paws stars', 'raise stars', 2, pawsExit.stars.raise);
    assert('H. exits paws stars', 'sell stars', 1, pawsExit.stars.sell);
  }

  // --- Suite I: totalStars ---
  {
    const total = 3 + 3 + 3 + 2 + 3; // 14
    const result = founderTitle(total);
    assert('I. totalStars', 'title', 'Business Builder 🏆', result.title);
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    results,
    passedCount,
    totalCount: results.length,
    allPassed: passedCount === results.length,
  };
}
