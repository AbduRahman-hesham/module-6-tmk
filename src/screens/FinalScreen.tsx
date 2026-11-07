import React, { useMemo } from 'react';
import { useGame } from '../state/gameContext';
import { IDEAS, COST_LABELS, TEAM_LABELS } from '../data/ideas';
import { INVESTORS } from '../data/investors';
import { CHAPTERS } from '../data/chapters';
import { founderTitle, bestPlan, offers, exits, offerRanks } from '../logic/math';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CHARACTERS } from '../assets/characters';

export const FinalScreen: React.FC = () => {
  const { state, resetGame, setScreen } = useGame();

  const character = CHARACTERS.find((c) => c.id === state.character);
  const activeIdeaId = state.ideaId || 'pixel';
  const activeIdea = IDEAS[activeIdeaId];

  // Retrieve results from each chapter
  const ch1 = state.chapterResults[1];
  const ch2 = state.chapterResults[2];
  const ch3 = state.chapterResults[3];
  const ch4 = state.chapterResults[4];
  const ch5 = state.chapterResults[5];

  const projectStars = ch1?.stars ?? 3;
  const planStars = ch2?.stars ?? 3;
  const bankStars = ch3?.bankStars ?? 3;
  const vcStars = ch4?.stars ?? 2;
  const exitStars = ch5?.stars ?? 3;

  const totalStars = projectStars + planStars + bankStars + vcStars + exitStars;
  const titleInfo = founderTitle(totalStars);

  const isCelebratory =
    titleInfo.title.includes('Business Builder') || titleInfo.title.includes('Smart Founder');

  // 20 confetti pieces only if Business Builder or Smart Founder
  const confettiPieces = useMemo(() => {
    if (!isCelebratory) return [];
    const colors = ['#FFD23F', '#5CC8FF', '#4ADE80', '#FF6B6B', '#8B5CF6', '#FF9F1C'];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${(i * 17) % 94 + 3}%`,
      delay: `${((i * 130) % 800) / 1000}s`,
    }));
  }, [isCelebratory]);

  // "Your wealth": chosen exit's number
  const exitId = ch5?.exitId || 'raise';
  const wealth = ch5?.wealth ?? (state.meters.cash ?? 8060);
  const wealthLabel = exitId === 'sell' ? 'cash' : 'your slice is worth';

  // Investor details
  const chosenInvestorId = ch4?.investorId;
  const chosenInvestor = INVESTORS.find((inv) => inv.id === chosenInvestorId);
  const investorName =
    chosenInvestorId === 'none'
      ? 'No Investor (Bootstrapped)'
      : chosenInvestor?.name || 'Friendly Fund';
  const keptSlice = ch4?.own ?? (state.meters.slice ?? 82);

  // Best path hints
  const bestPlanData = useMemo(() => bestPlan(activeIdea), [activeIdea]);

  const bestInvestorName = useMemo(() => {
    const V0 = ch3?.V0 ?? 2560;
    const allOffers = offers(activeIdea, V0, bankStars);
    const ranks = offerRanks(allOffers);
    const topOffer = allOffers.find((o) => ranks[o.investorId] === 3);
    return topOffer ? topOffer.name : 'Friendly Fund';
  }, [activeIdea, ch3, bankStars]);

  const bestExitName = useMemo(() => {
    const FV = ch4?.FV ?? 6400;
    const own = ch4?.own ?? 82;
    const exitsData = exits(activeIdea, FV, own);
    const topExit = exitsData.options.find((o) => exitsData.stars[o.type] === 3);
    return topExit ? topExit.title : 'Raise Series A';
  }, [activeIdea, ch4]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handlePlayAgain = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    resetGame();
  };

  const handleTryAnother = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    resetGame();
    setScreen('chapter');
  };

  return (
    <div className="relative flex flex-col flex-1 justify-between py-4 px-4 overflow-x-hidden">
      {/* 20 CSS Confetti pieces (only for Business Builder or Smart Founder) */}
      {isCelebratory && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {confettiPieces.map((p) => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                backgroundColor: p.color,
                left: p.left,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="space-y-4 my-auto relative z-10">
        {/* Title & Founder Badge */}
        <div className="text-center space-y-1">
          <div className="text-5xl" aria-hidden="true">
            {totalStars >= 12 ? '🏆' : totalStars >= 8 ? '⭐' : '🌱'}
          </div>
          <h1 className="text-3xl font-black text-[#2B2D42]">
            {titleInfo.title}
          </h1>
          <div className="inline-block px-3 py-1 bg-[#FFD23F] rounded-full border-2 border-[#2B2D42] text-sm font-black text-[#2B2D42]">
            {totalStars} / 15 ⭐ Total Stars
          </div>
        </div>

        {/* Your Wealth Card */}
        <Card variant="white" className="p-4 text-center space-y-1 shadow-[0_4px_0_rgba(43,45,66,0.2)]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2B2D42]/60">
            Your Wealth ({wealthLabel})
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#166534] tabular-nums">
            ${wealth} coins
          </div>
          <p className="text-xs font-bold text-[#2B2D42]/70">
            {character ? character.name : 'Founder'} finished with a thriving company!
          </p>
        </Card>

        {/* Star table per chapter */}
        <div className="rounded-[18px] border-[3px] border-[#2B2D42] bg-white overflow-hidden shadow-[0_4px_0_rgba(43,45,66,0.15)]">
          <div className="bg-[#FFF7E6] px-3 py-2 border-b-2 border-[#2B2D42] text-xs font-black text-[#2B2D42] uppercase">
            Chapter Scorecard
          </div>
          <div className="divide-y divide-[#2B2D42]/10 text-xs font-bold">
            <div className="flex justify-between px-3 py-2">
              <span>Ch.1 🚀 Project Launch</span>
              <span className="text-[#FFD23F]">{'★'.repeat(projectStars)}</span>
            </div>
            <div className="flex justify-between px-3 py-2">
              <span>Ch.2 📝 Business Plan</span>
              <span className="text-[#FFD23F]">
                {planStars > 0 ? '★'.repeat(planStars) : '0★'}
              </span>
            </div>
            <div className="flex justify-between px-3 py-2">
              <span>Ch.3 🏦 Bank Valuation</span>
              <span className="text-[#FFD23F]">
                {bankStars > 0 ? '★'.repeat(bankStars) : '0★'}
              </span>
            </div>
            <div className="flex justify-between px-3 py-2">
              <span>Ch.4 💼 Venture Capital</span>
              <span className="text-[#FFD23F]">
                {vcStars > 0 ? '★'.repeat(vcStars) : '0★'}
              </span>
            </div>
            <div className="flex justify-between px-3 py-2">
              <span>Ch.5 🏁 Final Exit</span>
              <span className="text-[#FFD23F]">{'★'.repeat(exitStars)}</span>
            </div>
          </div>
        </div>

        {/* Your Journey Card */}
        <div className="rounded-[18px] border-[3px] border-[#2B2D42] bg-white p-3.5 space-y-2 text-xs font-bold shadow-[0_4px_0_rgba(43,45,66,0.15)]">
          <div className="text-xs font-black uppercase text-[#FF9F1C] pb-1 border-b border-[#2B2D42]/10">
            Your Journey Blueprint
          </div>
          <div className="flex justify-between">
            <span className="text-[#2B2D42]/60">Idea:</span>
            <span className="text-[#2B2D42]">{activeIdea.name} {activeIdea.icon}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#2B2D42]/60">Company Value (V0):</span>
            <span className="text-[#2B2D42]">${ch3?.V0 ?? 2560}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#2B2D42]/60">Investor Deal:</span>
            <span className="text-[#2B2D42]">{investorName} ({keptSlice}% slice)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#2B2D42]/60">Exit Decision:</span>
            <span className="text-[#166534] capitalize">{exitId}</span>
          </div>
        </div>

        {/* Best Path Hints Card */}
        <div className="rounded-[18px] border-2 border-[#2B2D42] bg-[#EDE9FE] p-3 text-xs font-bold text-[#5B21B6] space-y-1.5 shadow-[0_3px_0_rgba(43,45,66,0.15)]">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#8B5CF6]">
            💡 Best Path Hints for {activeIdea.name}
          </div>
          <p>
            • <strong>Best Plan:</strong> Price ${activeIdea.prices[bestPlanData.combo.priceIdx]} ·{' '}
            {COST_LABELS[bestPlanData.combo.costIdx]} ·{' '}
            {TEAM_LABELS[bestPlanData.combo.teamIdx]} = ${bestPlanData.profit} / month
          </p>
          <p>
            • <strong>Best Investor:</strong> {bestInvestorName} (Rank 1 ⭐)
          </p>
          <p>
            • <strong>Best Exit:</strong> {bestExitName} (Rank 1 ⭐)
          </p>
        </div>

        {/* Notebook Summary with 5 lessons */}
        <div className="rounded-[18px] border-2 border-[#2B2D42] bg-white p-3.5 space-y-2 text-xs shadow-[0_3px_0_rgba(43,45,66,0.15)]">
          <div className="font-black text-[#2B2D42] flex items-center justify-between pb-1 border-b border-[#2B2D42]/10">
            <span className="flex items-center gap-1.5">
              <span>📒</span> All 5 Lessons Learned
            </span>
            <span className="text-[10px] text-[#4ADE80] font-black">5/5 Completed</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="text-[#2B2D42] flex items-start gap-1.5">
                <span className="text-[#FF9F1C] font-black shrink-0">{num}.</span>
                <span className="font-semibold text-[#2B2D42]/90 leading-tight">
                  "{CHAPTERS[num].lesson}"
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons: Play again & Try another idea */}
      <div className="w-full pt-4 space-y-2 relative z-10">
        <Button variant="primary" size="large" disabled={isSubmitting} onClick={handlePlayAgain}>
          Play again 🔄
        </Button>
        <Button
          variant="secondary"
          size="normal"
          disabled={isSubmitting}
          onClick={handleTryAnother}
        >
          Try another idea 💡
        </Button>
      </div>
    </div>
  );
};
