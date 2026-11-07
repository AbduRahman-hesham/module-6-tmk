import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../../state/gameContext';
import { CHAPTERS } from '../../data/chapters';
import { IDEAS } from '../../data/ideas';
import { IDEA_OUTLOOKS } from '../../data/chapter5';
import { exits, r10, ExitType } from '../../logic/math';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

export const Chapter5Screen: React.FC = () => {
  const { state, completeChapter } = useGame();
  const currentChapter = CHAPTERS[5];

  const activeIdeaId = state.ideaId || 'pixel';
  const activeIdea = IDEAS[activeIdeaId];
  const outlook = IDEA_OUTLOOKS[activeIdeaId];

  // Retrieve FV and own from chapter 4 result (or fallbacks)
  const ch4Result = state.chapterResults[4];
  const FV = ch4Result?.FV ?? (state.meters.value ?? 6400);
  const own = ch4Result?.own ?? (state.meters.slice ?? 82);

  // Steps:
  // 0: Word Card
  // 1: One Year Later & Outlook (count-up to FV)
  // 2: 3 Options Cards (Keep & Raise hide numbers)
  // 3: Outcome Reveal Table
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0);

  // Value count-up animation state (max 400ms)
  const [displayedValue, setDisplayedValue] = useState<number>(Math.round(FV * 0.8));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentStep === 1) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setDisplayedValue(FV);
        return;
      }

      const start = Math.round(FV * 0.8);
      const end = FV;
      const duration = 400; // ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const current = Math.round(start + (end - start) * progress);
        setDisplayedValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [currentStep, FV]);

  // Exits calculated via pure logic
  const exitsData = useMemo(() => {
    return exits(activeIdea, FV, own);
  }, [activeIdea, FV, own]);

  const [selectedExitType, setSelectedExitType] = useState<ExitType | null>(null);

  const selectedOption = useMemo(() => {
    return exitsData.options.find((o) => o.type === selectedExitType) || null;
  }, [exitsData, selectedExitType]);

  const handleConfirmExit = () => {
    if (!selectedOption || isSubmitting) return;
    setIsSubmitting(true);
    setCurrentStep(3);
    setTimeout(() => setIsSubmitting(false), 300);
  };

  const handleFinishJourney = () => {
    if (!selectedOption || isSubmitting) return;
    setIsSubmitting(true);

    // Calculate meter updates according to exit choice
    let finalSlice = own;
    let finalCash = state.meters.cash ?? 5560;

    if (selectedOption.type === 'sell') {
      finalSlice = 0;
      finalCash = selectedOption.payout;
    } else if (selectedOption.type === 'raise') {
      finalSlice = Math.round(own * 0.8);
    }

    completeChapter(
      5,
      {
        exitId: selectedOption.type,
        wealth: selectedOption.payout,
        stars: exitsData.stars[selectedOption.type],
      },
      {
        value: FV,
        slice: finalSlice,
        cash: finalCash,
      },
      currentChapter.lesson
    );
  };

  const raiseAmount = r10(0.2 * FV);
  const raiseSlice = Math.round(own * 0.8);

  return (
    <div className="flex flex-col flex-1 justify-between py-4 px-4">
      {/* ================= STEP 0: WORD OF CHAPTER ================= */}
      {currentStep === 0 && (
        <div className="flex flex-col flex-1 justify-between">
          <div className="my-auto space-y-4 text-center">
            <span className="inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#2B2D42] bg-[#FF9F1C] text-white">
              Chapter 5 🏁 Step 0
            </span>
            <div className="text-5xl" aria-hidden="true">
              {currentChapter.word.emoji}
            </div>

            <Card variant="white" className="p-6 text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
                Word of the Chapter
              </span>
              <h2 className="text-3xl font-black text-[#2B2D42]">
                {currentChapter.word.term}
              </h2>
              <p className="text-xl font-bold text-[#2B2D42]/80">
                "{currentChapter.word.definition}"
              </p>
            </Card>

            <div className="p-3 bg-[#FFF7E6] rounded-[16px] border-2 border-[#2B2D42]/30 text-sm font-semibold text-[#2B2D42]/70">
              Every founder eventually decides: sell the company, raise more money, or keep running it!
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="large" onClick={() => setCurrentStep(1)}>
              Fast Forward 1 Year ⏩
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 1: ONE YEAR LATER & OUTLOOK ================= */}
      {currentStep === 1 && (
        <div className="flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-4 text-center">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF9F1C]">
              One Year Later ⏩
            </span>

            {/* Value count-up card */}
            <Card variant="white" className="p-5 text-center space-y-1">
              <span className="text-xs font-bold text-[#2B2D42]/60 uppercase">
                Company Valuation
              </span>
              <div className="text-4xl font-black tabular-nums text-[#8B5CF6]">
                ${displayedValue}
              </div>
              <span className="text-xs font-bold text-[#166534]">
                Your slice: {own}% 🥧
              </span>
            </Card>

            {/* Outlook card by idea */}
            <div className="rounded-[20px] border-[3px] border-[#2B2D42] bg-[#FFF7E6] p-4 text-center space-y-2 shadow-[0_3px_0_rgba(43,45,66,0.15)]">
              <span className="text-4xl">{outlook.icon}</span>
              <h3 className="text-xl font-black text-[#2B2D42]">
                {outlook.headline}
              </h3>
              <p className="text-base font-bold text-[#2B2D42]/80 leading-snug">
                "{outlook.description}"
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="large" onClick={() => setCurrentStep(2)}>
              Choose Your Move 🏁
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: 3 OPTIONS (SELL / RAISE / KEEP) ================= */}
      {currentStep === 2 && (
        <div className="flex flex-col flex-1 justify-between space-y-3">
          <div className="space-y-3">
            <div className="text-center space-y-0.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF9F1C]">
                Final Strategic Decision
              </span>
              <h2 className="text-2xl font-black text-[#2B2D42]">
                Sell, Raise or Keep? 🏁
              </h2>
              <p className="text-xs font-semibold text-[#2B2D42]/70">
                Consider your company's outlook before choosing.
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Sell */}
              <div
                onClick={() => setSelectedExitType('sell')}
                className={`rounded-[18px] p-3.5 cursor-pointer transition-all active:scale-[0.98] ${
                  selectedExitType === 'sell'
                    ? 'border-[3px] border-[#FF9F1C] bg-[#FFF8EE] ring-2 ring-[#FF9F1C] shadow-[0_3px_0_#FF9F1C]'
                    : 'border-[3px] border-[#2B2D42] bg-white shadow-[0_3px_0_rgba(43,45,66,0.15)] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🏢</span>
                  <h3 className="text-base font-black text-[#2B2D42]">
                    Sell the Company
                  </h3>
                </div>
                <p className="text-xs font-bold text-[#2B2D42]/80 leading-snug">
                  A big company buys it. You get <strong className="text-[#166534]">${exitsData.sell} coins</strong> now.
                </p>
              </div>

              {/* Option 2: Raise */}
              <div
                onClick={() => setSelectedExitType('raise')}
                className={`rounded-[18px] p-3.5 cursor-pointer transition-all active:scale-[0.98] ${
                  selectedExitType === 'raise'
                    ? 'border-[3px] border-[#FF9F1C] bg-[#FFF8EE] ring-2 ring-[#FF9F1C] shadow-[0_3px_0_#FF9F1C]'
                    : 'border-[3px] border-[#2B2D42] bg-white shadow-[0_3px_0_rgba(43,45,66,0.15)] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">💰</span>
                  <h3 className="text-base font-black text-[#2B2D42]">
                    Raise More Money
                  </h3>
                </div>
                <p className="text-xs font-bold text-[#2B2D42]/80 leading-snug">
                  New investors buy 20% of the company for ${raiseAmount} coins. Your slice becomes {raiseSlice}%.
                </p>
              </div>

              {/* Option 3: Keep */}
              <div
                onClick={() => setSelectedExitType('keep')}
                className={`rounded-[18px] p-3.5 cursor-pointer transition-all active:scale-[0.98] ${
                  selectedExitType === 'keep'
                    ? 'border-[3px] border-[#FF9F1C] bg-[#FFF8EE] ring-2 ring-[#FF9F1C] shadow-[0_3px_0_#FF9F1C]'
                    : 'border-[3px] border-[#2B2D42] bg-white shadow-[0_3px_0_rgba(43,45,66,0.15)] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🏠</span>
                  <h3 className="text-base font-black text-[#2B2D42]">
                    Keep Going
                  </h3>
                </div>
                <p className="text-xs font-bold text-[#2B2D42]/80 leading-snug">
                  Keep your slice ({own}%) and run the company one more year.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="large"
              disabled={!selectedExitType || isSubmitting}
              onClick={handleConfirmExit}
            >
              Choose 🚀
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: REVEAL ================= */}
      {currentStep === 3 && selectedOption && (
        <div className="flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF9F1C]">
                Final Exit Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B2D42]">
                Your Founder Payoff 🏁
              </h2>
            </div>

            {/* Outcome table */}
            <div className="rounded-[18px] border-[3px] border-[#2B2D42] bg-white overflow-hidden shadow-[0_4px_0_rgba(43,45,66,0.2)]">
              <div className="grid grid-cols-3 bg-[#FFEDD5] px-3 py-2 border-b-2 border-[#2B2D42] text-[10px] font-black text-[#9A3412] uppercase">
                <span>Option</span>
                <span className="text-right">Outcome</span>
                <span className="text-right">Rank ⭐</span>
              </div>

              <div className="divide-y divide-[#2B2D42]/10 text-xs">
                {exitsData.options.map((opt) => {
                  const isPlayerPick = opt.type === selectedOption.type;
                  const stars = exitsData.stars[opt.type];
                  const label = opt.type === 'sell' ? 'cash now' : 'your slice is worth';

                  return (
                    <div
                      key={opt.type}
                      className={`grid grid-cols-3 px-3 py-2.5 items-center ${
                        isPlayerPick ? 'bg-[#DCFCE7] font-black' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{opt.icon}</span>
                        <span className="truncate">
                          {opt.title} {isPlayerPick && '(You)'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#166534]">${opt.payout}</span>
                        <span className="text-[10px] text-[#2B2D42]/60 block leading-none">
                          {label}
                        </span>
                      </div>
                      <div className="text-right text-[#FFD23F] font-black">
                        {'★'.repeat(stars)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reason best one won */}
            <div className="p-3 bg-[#FFF7E6] rounded-[16px] border-2 border-[#2B2D42] text-xs font-bold text-[#2B2D42]">
              <span className="text-[10px] uppercase font-black text-[#FF9F1C] block">
                Why this happened:
              </span>
              <p className="mt-0.5">
                {outlook.bestReason}
              </p>
            </div>

            {/* Lesson earned card */}
            <div className="rounded-[16px] border-2 border-[#2B2D42] bg-[#DCFCE7] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                Added to Notebook 📒
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#166534] mt-0.5">
                "{currentChapter.lesson}"
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="primary"
              size="large"
              disabled={isSubmitting}
              onClick={handleFinishJourney}
            >
              See Final Results 🏆
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
