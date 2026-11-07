import React, { useState, useMemo } from 'react';
import { useGame } from '../../state/gameContext';
import { IDEAS, COST_LABELS, TEAM_LABELS } from '../../data/ideas';
import { CHAPTER2_PROBLEMS, CHAPTER2_CUSTOMERS } from '../../data/chapter2';
import { CHAPTERS } from '../../data/chapters';
import { monthlyProfit, bestPlan, planStars } from '../../logic/math';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

export const Chapter2Screen: React.FC = () => {
  const { state, completeChapter } = useGame();
  const currentChapter = CHAPTERS[2];

  const activeIdeaId = state.ideaId || 'pixel';
  const activeIdea = IDEAS[activeIdeaId];

  // Screen steps:
  // 0: Word Card
  // 1: Plan Board & Calculator
  // 2: Plan Summary & Result
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2>(0);

  // --- Step 1 State: Plan Board (5 boxes) ---
  // Active open box: 1, 2, 3, 4, 5 (or 0 when all done and viewing calculator)
  const [openBox, setOpenBox] = useState<1 | 2 | 3 | 4 | 5 | null>(1);

  // Box 1: Problem
  const [problemSelected, setProblemSelected] = useState<boolean>(false);
  const [problemFirstTry, setProblemFirstTry] = useState<boolean>(true);
  const [hasAttemptedProblem, setHasAttemptedProblem] = useState<boolean>(false);
  const [greyedProblems, setGreyedProblems] = useState<number[]>([]);
  const [problemFeedback, setProblemFeedback] = useState<string | null>(null);
  const [shakeProblemIndex, setShakeProblemIndex] = useState<number | null>(null);

  // Box 2: Customers
  const [customersSelected, setCustomersSelected] = useState<boolean>(false);
  const [customersFirstTry, setCustomersFirstTry] = useState<boolean>(true);
  const [hasAttemptedCustomers, setHasAttemptedCustomers] = useState<boolean>(false);
  const [greyedCustomers, setGreyedCustomers] = useState<number[]>([]);
  const [customersFeedback, setCustomersFeedback] = useState<string | null>(null);
  const [shakeCustomersIndex, setShakeCustomersIndex] = useState<number | null>(null);

  // Box 3: Price (0, 1, 2)
  const [priceIdx, setPriceIdx] = useState<number | null>(null);

  // Box 4: Costs (0: Cheap, 1: Good, 2: Fancy)
  const [costIdx, setCostIdx] = useState<number | null>(null);

  // Box 5: Team (0: Just me, 1: +1 helper, 2: +2 helpers)
  const [teamIdx, setTeamIdx] = useState<number | null>(null);

  // Compute profit breakdown when boxes 3, 4, 5 are chosen
  const hasNumbers = priceIdx !== null && costIdx !== null && teamIdx !== null;
  const profitBreakdown = useMemo(() => {
    if (!hasNumbers) return null;
    return monthlyProfit(activeIdea, {
      priceIdx: priceIdx!,
      costIdx: costIdx!,
      teamIdx: teamIdx!,
    });
  }, [activeIdea, hasNumbers, priceIdx, costIdx, teamIdx]);

  const bestPlanData = useMemo(() => {
    return bestPlan(activeIdea);
  }, [activeIdea]);

  const allBoxesDone =
    problemSelected &&
    customersSelected &&
    priceIdx !== null &&
    costIdx !== null &&
    teamIdx !== null;

  const isProfitable = profitBreakdown ? profitBreakdown.profit > 0 : false;

  // Handlers for Problem selection
  const handleProblemTap = (index: number) => {
    if (problemSelected || greyedProblems.includes(index)) return;

    const option = CHAPTER2_PROBLEMS[activeIdeaId][index];
    if (!hasAttemptedProblem) {
      setHasAttemptedProblem(true);
      if (!option.isCorrect) {
        setProblemFirstTry(false);
      }
    }

    if (option.isCorrect) {
      setProblemSelected(true);
      setProblemFeedback(null);
      // Auto advance to next box
      setOpenBox(2);
    } else {
      setShakeProblemIndex(index);
      setTimeout(() => setShakeProblemIndex(null), 300);
      setGreyedProblems((prev) => [...prev, index]);
      setProblemFeedback('Not a real problem. Pick one people need solved.');
    }
  };

  // Handlers for Customer selection
  const handleCustomerTap = (index: number) => {
    if (customersSelected || greyedCustomers.includes(index)) return;

    const option = CHAPTER2_CUSTOMERS[activeIdeaId][index];
    if (!hasAttemptedCustomers) {
      setHasAttemptedCustomers(true);
      if (!option.isCorrect) {
        setCustomersFirstTry(false);
      }
    }

    if (option.isCorrect) {
      setCustomersSelected(true);
      setCustomersFeedback(null);
      // Auto advance to box 3
      setOpenBox(3);
    } else {
      setShakeCustomersIndex(index);
      setTimeout(() => setShakeCustomersIndex(null), 300);
      setGreyedCustomers((prev) => [...prev, index]);
      setCustomersFeedback('Too broad or the wrong group.');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePriceSelect = (idx: number) => {
    setPriceIdx(idx);
    if (costIdx === null) setOpenBox(4);
  };

  const handleCostSelect = (idx: number) => {
    setCostIdx(idx);
    if (teamIdx === null) setOpenBox(5);
  };

  const handleTeamSelect = (idx: number) => {
    setTeamIdx(idx);
    setOpenBox(null);
  };

  const handleLockPlan = () => {
    if (!allBoxesDone || !isProfitable || isSubmitting) return;
    setIsSubmitting(true);
    setCurrentStep(2);
    setTimeout(() => setIsSubmitting(false), 200);
  };

  const planStarsEarned = useMemo(() => {
    if (!profitBreakdown) return 0;
    return planStars(profitBreakdown.profit, bestPlanData.profit);
  }, [profitBreakdown, bestPlanData]);

  const handleFinishChapter = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    completeChapter(
      2,
      {
        problemFirstTry,
        customersFirstTry,
        priceIdx: priceIdx!,
        costIdx: costIdx!,
        teamIdx: teamIdx!,
        profit: profitBreakdown!.profit,
        bestProfit: bestPlanData.profit,
        stars: planStarsEarned,
      },
      {}, // Meters unchanged according to prompt
      currentChapter.lesson
    );
  };

  const qualityStars = ['⭐', '⭐⭐', '⭐⭐⭐'];

  return (
    <div className="flex flex-col flex-1 justify-between py-4 px-4">
      {/* ================= STEP 0: WORD OF CHAPTER ================= */}
      {currentStep === 0 && (
        <div className="flex flex-col flex-1 justify-between">
          <div className="my-auto space-y-4 text-center">
            <span
              className="inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#2B2D42] bg-[#FFD23F]"
            >
              Chapter 2 📝 Step 0
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
              A business survives when it makes a profit: money in minus money out!
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="large" onClick={() => setCurrentStep(1)}>
              Write the Plan 📝
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 1: PLAN BOARD & PROFIT CALCULATOR ================= */}
      {currentStep === 1 && (
        <div className="flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-center space-y-0.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF9F1C]">
                Chapter 2 · Plan Stepper
              </span>
              <h2 className="text-2xl font-black text-[#2B2D42]">
                Build Your Business Plan 📝
              </h2>
              <p className="text-xs font-semibold text-[#2B2D42]/70">
                Tap each box to customize your strategy!
              </p>
            </div>

            {/* Stepper Boxes */}
            <div className="space-y-2.5">
              {/* Box 1: Problem */}
              <div className="rounded-[18px] border-2 border-[#2B2D42] bg-white overflow-hidden shadow-[0_3px_0_rgba(43,45,66,0.15)]">
                {openBox !== 1 ? (
                  <div
                    onClick={() => setOpenBox(1)}
                    className="p-3 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧩</span>
                      <div>
                        <span className="text-xs font-bold uppercase text-[#2B2D42]/60 block leading-tight">
                          1. Problem
                        </span>
                        <span className="text-sm font-black text-[#2B2D42]">
                          {problemSelected
                            ? CHAPTER2_PROBLEMS[activeIdeaId].find((p) => p.isCorrect)?.text
                            : 'Choose problem'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#FF9F1C]">
                      {problemSelected ? 'Edit ✎' : 'Open ▼'}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FFFDF7] space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-1 border-b border-[#2B2D42]/10">
                      <span className="font-black text-sm text-[#2B2D42] flex items-center gap-1.5">
                        <span>🧩</span> Box 1: What problem do you solve?
                      </span>
                    </div>

                    <div className="space-y-2">
                      {CHAPTER2_PROBLEMS[activeIdeaId].map((option, idx) => {
                        const isGreyed = greyedProblems.includes(idx);
                        const isSelected = problemSelected && option.isCorrect;
                        const isShaking = shakeProblemIndex === idx;

                        return (
                          <div
                            key={idx}
                            onClick={() => handleProblemTap(idx)}
                            className={`p-2.5 rounded-[14px] border-2 border-[#2B2D42] cursor-pointer text-xs font-bold transition-all ${
                              isShaking ? 'shake-wrong border-[#FF6B6B]' : ''
                            } ${
                              isSelected
                                ? 'bg-[#DCFCE7] border-[#166534] text-[#166534]'
                                : isGreyed
                                ? 'bg-slate-100 opacity-40 border-slate-300 text-slate-400'
                                : 'bg-white hover:bg-yellow-50 text-[#2B2D42]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.text}</span>
                              {isSelected && <span>✔</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {problemFeedback && (
                      <p className="text-xs font-bold text-[#FF6B6B] text-center shake-wrong">
                        {problemFeedback}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Box 2: Customers */}
              <div className="rounded-[18px] border-2 border-[#2B2D42] bg-white overflow-hidden shadow-[0_3px_0_rgba(43,45,66,0.15)]">
                {openBox !== 2 ? (
                  <div
                    onClick={() => setOpenBox(2)}
                    className="p-3 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👥</span>
                      <div>
                        <span className="text-xs font-bold uppercase text-[#2B2D42]/60 block leading-tight">
                          2. Customers
                        </span>
                        <span className="text-sm font-black text-[#2B2D42]">
                          {customersSelected
                            ? CHAPTER2_CUSTOMERS[activeIdeaId].find((c) => c.isCorrect)?.text
                            : 'Choose customers'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#FF9F1C]">
                      {customersSelected ? 'Edit ✎' : 'Open ▼'}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FFFDF7] space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-1 border-b border-[#2B2D42]/10">
                      <span className="font-black text-sm text-[#2B2D42] flex items-center gap-1.5">
                        <span>👥</span> Box 2: Who needs it most?
                      </span>
                    </div>

                    <div className="space-y-2">
                      {CHAPTER2_CUSTOMERS[activeIdeaId].map((option, idx) => {
                        const isGreyed = greyedCustomers.includes(idx);
                        const isSelected = customersSelected && option.isCorrect;
                        const isShaking = shakeCustomersIndex === idx;

                        return (
                          <div
                            key={idx}
                            onClick={() => handleCustomerTap(idx)}
                            className={`p-2.5 rounded-[14px] border-2 border-[#2B2D42] cursor-pointer text-xs font-bold transition-all ${
                              isShaking ? 'shake-wrong border-[#FF6B6B]' : ''
                            } ${
                              isSelected
                                ? 'bg-[#DCFCE7] border-[#166534] text-[#166534]'
                                : isGreyed
                                ? 'bg-slate-100 opacity-40 border-slate-300 text-slate-400'
                                : 'bg-white hover:bg-yellow-50 text-[#2B2D42]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.text}</span>
                              {isSelected && <span>✔</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {customersFeedback && (
                      <p className="text-xs font-bold text-[#FF6B6B] text-center shake-wrong">
                        {customersFeedback}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Box 3: Price */}
              <div className="rounded-[18px] border-2 border-[#2B2D42] bg-white overflow-hidden shadow-[0_3px_0_rgba(43,45,66,0.15)]">
                {openBox !== 3 ? (
                  <div
                    onClick={() => setOpenBox(3)}
                    className="p-3 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💵</span>
                      <div>
                        <span className="text-xs font-bold uppercase text-[#2B2D42]/60 block leading-tight">
                          3. Price
                        </span>
                        <span className="text-sm font-black text-[#2B2D42]">
                          {priceIdx !== null ? `$${activeIdea.prices[priceIdx]}` : 'Choose price'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#FF9F1C]">
                      {priceIdx !== null ? 'Change ✎' : 'Open ▼'}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FFFDF7] space-y-2 animate-in fade-in duration-150">
                    <div>
                      <span className="font-black text-sm text-[#2B2D42] flex items-center gap-1.5">
                        <span>💵</span> Box 3: Price per customer
                      </span>
                      <p className="text-[11px] font-bold text-[#2B2D42]/70">
                        Low price brings more customers.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {activeIdea.prices.map((p, idx) => {
                        const isSelected = priceIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handlePriceSelect(idx)}
                            className={`p-2.5 rounded-[14px] border-2 border-[#2B2D42] text-center font-black cursor-pointer transition-all active:scale-95 ${
                              isSelected
                                ? 'bg-[#FFD23F] ring-2 ring-[#2B2D42] shadow-[0_2px_0_#2B2D42]'
                                : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-base text-[#2B2D42]">${p}</span>
                            <span className="text-[10px] text-[#2B2D42]/60 block font-normal">
                              {idx === 0 ? 'Low' : idx === 1 ? 'Medium' : 'High'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Box 4: Costs */}
              <div className="rounded-[18px] border-2 border-[#2B2D42] bg-white overflow-hidden shadow-[0_3px_0_rgba(43,45,66,0.15)]">
                {openBox !== 4 ? (
                  <div
                    onClick={() => setOpenBox(4)}
                    className="p-3 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧰</span>
                      <div>
                        <span className="text-xs font-bold uppercase text-[#2B2D42]/60 block leading-tight">
                          4. Quality & Costs
                        </span>
                        <span className="text-sm font-black text-[#2B2D42]">
                          {costIdx !== null
                            ? `${COST_LABELS[costIdx]} ($${activeIdea.unitCost[costIdx]})`
                            : 'Choose quality'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#FF9F1C]">
                      {costIdx !== null ? 'Change ✎' : 'Open ▼'}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FFFDF7] space-y-2 animate-in fade-in duration-150">
                    <div>
                      <span className="font-black text-sm text-[#2B2D42] flex items-center gap-1.5">
                        <span>🧰</span> Box 4: Costs & Quality
                      </span>
                      <p className="text-[11px] font-bold text-[#2B2D42]/70">
                        Better quality brings more customers, but costs more.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {COST_LABELS.map((label, idx) => {
                        const isSelected = costIdx === idx;
                        const cost = activeIdea.unitCost[idx];
                        return (
                          <button
                            key={idx}
                            onClick={() => handleCostSelect(idx)}
                            className={`p-2 rounded-[14px] border-2 border-[#2B2D42] text-center font-bold cursor-pointer transition-all active:scale-95 ${
                              isSelected
                                ? 'bg-[#5CC8FF] ring-2 ring-[#2B2D42] shadow-[0_2px_0_#2B2D42]'
                                : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xs text-[#2B2D42] block font-black leading-tight">
                              {label}
                            </span>
                            <span className="text-xs text-[#2B2D42] font-black">${cost}</span>
                            <span className="text-[10px] block text-[#FF9F1C]">
                              {qualityStars[idx]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Box 5: Team */}
              <div className="rounded-[18px] border-2 border-[#2B2D42] bg-white overflow-hidden shadow-[0_3px_0_rgba(43,45,66,0.15)]">
                {openBox !== 5 ? (
                  <div
                    onClick={() => setOpenBox(5)}
                    className="p-3 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👷</span>
                      <div>
                        <span className="text-xs font-bold uppercase text-[#2B2D42]/60 block leading-tight">
                          5. Team Size
                        </span>
                        <span className="text-sm font-black text-[#2B2D42]">
                          {teamIdx !== null
                            ? `${TEAM_LABELS[teamIdx]} (cap ${activeIdea.teamCapacity[teamIdx]})`
                            : 'Choose team'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#FF9F1C]">
                      {teamIdx !== null ? 'Change ✎' : 'Open ▼'}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FFFDF7] space-y-2 animate-in fade-in duration-150">
                    <div>
                      <span className="font-black text-sm text-[#2B2D42] flex items-center gap-1.5">
                        <span>👷</span> Box 5: Team helpers
                      </span>
                      <p className="text-[11px] font-bold text-[#2B2D42]/70">
                        More helpers serve more customers, but cost coins monthly.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {TEAM_LABELS.map((label, idx) => {
                        const isSelected = teamIdx === idx;
                        const cap = activeIdea.teamCapacity[idx];
                        const cost = activeIdea.teamCost[idx];
                        return (
                          <button
                            key={idx}
                            onClick={() => handleTeamSelect(idx)}
                            className={`p-2 rounded-[14px] border-2 border-[#2B2D42] text-center font-bold cursor-pointer transition-all active:scale-95 ${
                              isSelected
                                ? 'bg-[#4ADE80] ring-2 ring-[#2B2D42] shadow-[0_2px_0_#2B2D42]'
                                : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xs text-[#2B2D42] block font-black leading-tight">
                              {label}
                            </span>
                            <span className="text-[10px] text-[#2B2D42]/70 block">
                              up to {cap} cust
                            </span>
                            <span className="text-[10px] text-[#166534] font-black block">
                              ${cost}/mo
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profit Calculator Card */}
            <div
              className={`p-3.5 rounded-[20px] border-[3px] border-[#2B2D42] shadow-[0_3px_0_rgba(43,45,66,0.2)] transition-all ${
                profitBreakdown
                  ? profitBreakdown.profit > 0
                    ? 'bg-[#DCFCE7] border-[#166534]'
                    : 'bg-[#FEE2E2] border-[#991B1B]'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#2B2D42]/10">
                <span className="text-xs font-black uppercase tracking-wider text-[#2B2D42]/70">
                  Monthly Profit Calculator
                </span>
                <span className="text-lg">📊</span>
              </div>

              {profitBreakdown ? (
                <div className="pt-2 space-y-1.5">
                  <div className="text-xs font-bold text-[#2B2D42] leading-tight">
                    👥 {profitBreakdown.served} served × 💵 ${profitBreakdown.margin} margin − 👷 ${profitBreakdown.teamCost} team ={' '}
                    <span
                      className={`text-base font-black ${
                        profitBreakdown.profit > 0 ? 'text-[#166534]' : 'text-[#991B1B]'
                      }`}
                    >
                      💰 ${profitBreakdown.profit} / month
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#2B2D42]/80">
                    Per year: ${profitBreakdown.profit * 12}
                  </div>

                  {profitBreakdown.customers > profitBreakdown.capacity && (
                    <div className="text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-md border border-[#F59E0B]">
                      ⚠️ Too many customers! Some leave ({profitBreakdown.customers} wanted to buy, capacity is {profitBreakdown.capacity}).
                    </div>
                  )}

                  {profitBreakdown.profit <= 0 && (
                    <div className="text-xs font-black text-[#991B1B] pt-0.5">
                      ✖ This plan loses money. Change something!
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-2 text-center text-xs font-bold text-[#2B2D42]/60">
                  Select Price, Costs, and Team above to calculate profit!
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Action */}
          <div className="pt-2">
            <Button
              variant="primary"
              size="large"
              disabled={!allBoxesDone || !isProfitable || isSubmitting}
              onClick={handleLockPlan}
            >
              {!allBoxesDone
                ? 'Finish 5 boxes above'
                : !isProfitable
                ? 'Fix losing plan'
                : 'Lock my plan 🔒'}
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: PLAN SUMMARY & REVEAL ================= */}
      {currentStep === 2 && profitBreakdown && (
        <div className="flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#FFD23F]">
                Chapter 2 Complete
              </span>
              <h2 className="text-3xl font-black text-[#2B2D42]">
                Plan Locked! 📋
              </h2>
            </div>

            {/* Plan Stars Card */}
            <Card variant="white" className="p-4 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B2D42]/60">
                Plan Rating
              </span>
              <div className="text-3xl text-[#FFD23F] flex items-center justify-center gap-1">
                {'★'.repeat(planStarsEarned)}
                {'☆'.repeat(3 - planStarsEarned)}
              </div>
              <p className="text-sm font-bold text-[#2B2D42]">
                {planStarsEarned === 3
                  ? 'Master Plan! Maximum profit potential.'
                  : planStarsEarned === 2
                  ? 'Smart Plan! Very healthy margins.'
                  : 'Modest Plan! Good, but can be optimized.'}
              </p>
            </Card>

            {/* One-Page Plan Card */}
            <div className="rounded-[20px] border-[3px] border-[#2B2D42] bg-white p-4 space-y-2 text-xs font-bold shadow-[0_4px_0_rgba(43,45,66,0.2)]">
              <div className="text-sm font-black text-[#2B2D42] pb-1 border-b border-[#2B2D42]/10 flex items-center justify-between">
                <span>{activeIdea.name} Blueprint</span>
                <span>{activeIdea.icon}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2B2D42]/60">Problem:</span>
                <span className="text-[#2B2D42] text-right max-w-[240px] truncate">
                  {CHAPTER2_PROBLEMS[activeIdeaId].find((p) => p.isCorrect)?.text}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2B2D42]/60">Customers:</span>
                <span className="text-[#2B2D42] text-right max-w-[240px] truncate">
                  {CHAPTER2_CUSTOMERS[activeIdeaId].find((c) => c.isCorrect)?.text}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2B2D42]/60">Price:</span>
                <span className="text-[#2B2D42]">${activeIdea.prices[priceIdx!]}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2B2D42]/60">Costs:</span>
                <span className="text-[#2B2D42]">
                  {COST_LABELS[costIdx!]} (${activeIdea.unitCost[costIdx!]})
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#2B2D42]/60">Team:</span>
                <span className="text-[#2B2D42]">
                  {TEAM_LABELS[teamIdx!]} (cap {activeIdea.teamCapacity[teamIdx!]})
                </span>
              </div>

              <div className="pt-2 border-t border-[#2B2D42]/10 flex justify-between text-sm font-black">
                <span>Profit per month:</span>
                <span className="text-[#166534]">${profitBreakdown.profit}</span>
              </div>

              <div className="flex justify-between text-xs text-[#2B2D42]/70">
                <span>Profit per year:</span>
                <span>${profitBreakdown.profit * 12}</span>
              </div>
            </div>

            {/* Reveal best possible plan comparison */}
            <div className="p-3 bg-[#FFF7E6] rounded-[16px] border-2 border-[#2B2D42] text-xs font-bold text-[#2B2D42]">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#FF9F1C] block">
                Founder Benchmark
              </span>
              <p className="mt-0.5">
                Best possible plan: Price ${activeIdea.prices[bestPlanData.combo.priceIdx]} ·{' '}
                {COST_LABELS[bestPlanData.combo.costIdx]} ·{' '}
                {TEAM_LABELS[bestPlanData.combo.teamIdx]} = ${bestPlanData.profit} a month (you: ${profitBreakdown.profit}).
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
            <Button variant="primary" size="large" disabled={isSubmitting} onClick={handleFinishChapter}>
              Next chapter: Meet the Bank 🏦
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
