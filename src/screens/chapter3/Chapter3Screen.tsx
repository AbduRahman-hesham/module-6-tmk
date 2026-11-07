import React, { useState, useMemo } from 'react';
import { useGame } from '../../state/gameContext';
import { CHAPTERS } from '../../data/chapters';
import { BANK_SERVICES, BANK_ROUNDS } from '../../data/chapter3';
import { valuation } from '../../logic/math';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

export const Chapter3Screen: React.FC = () => {
  const { state, completeChapter } = useGame();
  const currentChapter = CHAPTERS[3];

  // Steps:
  // 0: Word Card
  // 1: Bank Intro (2x2 grid)
  // 2: 3 Client Rounds
  // 3: Valuation Report
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0);

  // --- Step 2 State: 3 Rounds ---
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [roundFirstTries, setRoundFirstTries] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
  });
  const [hasAttemptedInRound, setHasAttemptedInRound] = useState<boolean>(false);
  const [greyedServices, setGreyedServices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [shakingServiceId, setShakingServiceId] = useState<string | null>(null);
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);

  const currentRound = BANK_ROUNDS[currentRoundIdx];

  // Bank stars: number of rounds answered correctly on first try (0-3)
  const bankStars = useMemo(() => {
    let count = 0;
    if (roundFirstTries[0]) count++;
    if (roundFirstTries[1]) count++;
    if (roundFirstTries[2]) count++;
    return count;
  }, [roundFirstTries]);

  // Compute Valuation from Chapter 1 and Chapter 2 results
  const ch1Result = state.chapterResults[1];
  const ch2Result = state.chapterResults[2];

  const profit = ch2Result?.profit ?? 35;
  const projectStarsEarned = ch1Result?.stars ?? 3;
  const problemFirstTry = ch2Result?.problemFirstTry ?? true;
  const customersFirstTry = ch2Result?.customersFirstTry ?? true;
  const clarityScore = (problemFirstTry ? 1 : 0) + (customersFirstTry ? 1 : 0);
  const leftoverCash = ch1Result?.leftoverCash ?? (state.meters.cash ?? 40);

  const valBreakdown = useMemo(() => {
    return valuation({
      profit,
      projectStars: projectStarsEarned,
      clarity: clarityScore,
      leftoverCash,
    });
  }, [profit, projectStarsEarned, clarityScore, leftoverCash]);

  // Handlers for Round
  const handleServiceTap = (serviceId: string) => {
    if (roundCompleted || greyedServices.includes(serviceId)) return;

    if (!hasAttemptedInRound) {
      setHasAttemptedInRound(true);
      if (serviceId !== currentRound.correctServiceId) {
        setRoundFirstTries((prev) => ({ ...prev, [currentRoundIdx]: false }));
      }
    }

    if (serviceId === currentRound.correctServiceId) {
      setRoundCompleted(true);
      setFeedback({
        isCorrect: true,
        text: currentRound.correctExplanation,
      });
    } else {
      setShakingServiceId(serviceId);
      setTimeout(() => setShakingServiceId(null), 300);
      setGreyedServices((prev) => [...prev, serviceId]);

      const reason =
        serviceId === 'savings'
          ? 'That keeps savings. This needs a big deal bank!'
          : 'Close! That service does something else.';

      setFeedback({
        isCorrect: false,
        text: reason,
      });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleNextRound = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (currentRoundIdx < 2) {
      setCurrentRoundIdx((prev) => prev + 1);
      setHasAttemptedInRound(false);
      setGreyedServices([]);
      setFeedback(null);
      setRoundCompleted(false);
      setTimeout(() => setIsSubmitting(false), 200);
    } else {
      setCurrentStep(3);
      setTimeout(() => setIsSubmitting(false), 200);
    }
  };

  const handleFinishChapter = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    completeChapter(
      3,
      {
        bankStars,
        V0: valBreakdown.V0,
        breakdown: valBreakdown,
      },
      {
        value: valBreakdown.V0,
      },
      currentChapter.lesson
    );
  };

  return (
    <div className="flex flex-col flex-1 justify-between py-4 px-4">
      {/* ================= STEP 0: WORD OF CHAPTER ================= */}
      {currentStep === 0 && (
        <div className="flex flex-col flex-1 justify-between">
          <div className="my-auto space-y-4 text-center">
            <span className="inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#2B2D42] bg-[#4ADE80]">
              Chapter 3 🏦 Step 0
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
              An investment bank puts a price tag on companies so founders can do big deals!
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="large" onClick={() => setCurrentStep(1)}>
              Meet the Bank 🏦
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 1: INTRO CARD (2x2 GRID) ================= */}
      {currentStep === 1 && (
        <div className="flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#4ADE80]">
                Step 1 of 3 · Big Deal Banking
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B2D42]">
                What Does an Investment Bank Do? 🏦
              </h2>
            </div>

            <Card variant="white" className="p-4 text-center">
              <p className="text-base font-bold text-[#2B2D42] leading-snug">
                An investment bank 🏦 is not a piggy bank 🐷. It helps companies with{' '}
                <span className="text-[#8B5CF6]">BIG money deals</span>.
              </p>
            </Card>

            {/* 2x2 Services Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {BANK_SERVICES.map((s) => (
                <div
                  key={s.id}
                  className="sticker-card p-3 flex flex-col justify-between text-left min-h-[96px] bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-sm font-black text-[#2B2D42] leading-tight">
                      {s.title}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#2B2D42]/70 mt-1 leading-snug">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="large" onClick={() => setCurrentStep(2)}>
              Test Your Skills (3 Rounds) 🎯
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: 3 ROUNDS ================= */}
      {currentStep === 2 && (
        <div className="flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {[0, 1, 2].map((rIdx) => (
                  <div
                    key={rIdx}
                    className={`h-2 rounded-full border border-[#2B2D42] transition-all ${
                      rIdx === currentRoundIdx
                        ? 'w-7 bg-[#4ADE80]'
                        : rIdx < currentRoundIdx
                        ? 'w-2 bg-[#2B2D42]'
                        : 'w-2 bg-white'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-[#4ADE80]">
                Round {currentRoundIdx + 1} of 3
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2B2D42]">
                Match the Client to the Service 🤝
              </h2>
            </div>

            {/* Client request bubble */}
            <div className="rounded-[20px] border-[3px] border-[#2B2D42] bg-[#FFF7E6] p-4 flex items-center gap-3 shadow-[0_3px_0_rgba(43,45,66,0.15)]">
              <span className="text-4xl shrink-0">{currentRound.clientEmoji}</span>
              <div>
                <span className="text-xs font-bold text-[#FF9F1C] uppercase block">
                  {currentRound.clientName} asks:
                </span>
                <p className="text-base font-black text-[#2B2D42] leading-snug mt-0.5">
                  "{currentRound.request}"
                </p>
              </div>
            </div>

            {/* 2x2 Services to choose */}
            <div className="grid grid-cols-2 gap-2.5">
              {BANK_SERVICES.map((s) => {
                const isGreyed = greyedServices.includes(s.id);
                const isSelected = roundCompleted && s.id === currentRound.correctServiceId;
                const isShaking = shakingServiceId === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => handleServiceTap(s.id)}
                    className={`sticker-card p-3 flex flex-col justify-between text-left cursor-pointer transition-all active:scale-95 min-h-[96px] ${
                      isShaking ? 'shake-wrong border-[#FF6B6B]' : ''
                    } ${
                      isSelected
                        ? 'bg-[#DCFCE7] border-[#166534] ring-2 ring-[#4ADE80]'
                        : isGreyed
                        ? 'bg-slate-100 opacity-40 border-slate-300 text-slate-400'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{s.icon}</span>
                      {isSelected && <span className="text-sm font-black text-[#166534]">✔</span>}
                    </div>
                    <div>
                      <span className="text-sm font-black text-[#2B2D42] block leading-tight">
                        {s.title}
                      </span>
                      <span className="text-[11px] font-semibold text-[#2B2D42]/70 leading-tight block mt-0.5">
                        {s.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instant feedback card */}
            {feedback && (
              <div
                className={`p-3 rounded-[16px] border-2 border-[#2B2D42] text-xs font-bold flex items-center gap-2 ${
                  feedback.isCorrect
                    ? 'bg-[#4ADE80] text-[#166534]'
                    : 'bg-[#FF6B6B] text-white shake-wrong'
                }`}
              >
                <span className="text-lg">{feedback.isCorrect ? '✔' : '✖'}</span>
                <span>{feedback.text}</span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button
              variant="primary"
              size="large"
              disabled={!roundCompleted || isSubmitting}
              onClick={handleNextRound}
            >
              {currentRoundIdx < 2 ? 'Next Client →' : 'See Valuation Report 💎'}
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: VALUATION REPORT ================= */}
      {currentStep === 3 && (
        <div className="flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#4ADE80]">
                Official Valuation Report
              </span>
              <h2 className="text-3xl font-black text-[#2B2D42]">
                Your Company Price Tag 💎
              </h2>
            </div>

            {/* Bank Stars Badge */}
            <Card variant="white" className="p-3.5 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B2D42]/60">
                Bank Deal Skills
              </span>
              <div className="text-3xl text-[#FFD23F] flex items-center justify-center gap-1">
                {'★'.repeat(bankStars)}
                {'☆'.repeat(3 - bankStars)}
              </div>
              <p className="text-xs font-bold text-[#2B2D42]">
                {bankStars === 3
                  ? '3/3 First-Try Matches! Bank expert.'
                  : `${bankStars}/3 First-Try Matches! Solid understanding.`}
              </p>
            </Card>

            {/* Valuation Equation Card */}
            <div className="rounded-[20px] border-[3px] border-[#2B2D42] bg-white p-4 space-y-3 shadow-[0_4px_0_rgba(43,45,66,0.2)]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
                Valuation Formula
              </div>

              {/* Equation row */}
              <div className="p-3 bg-[#EDE9FE] rounded-[16px] border-2 border-[#8B5CF6] text-xs font-black text-[#5B21B6] leading-relaxed">
                📈 Year profit [${valBreakdown.yearly}] × 🔢 Multiple [{valBreakdown.multiple}] + 💰 Cash [${valBreakdown.leftoverCash}] ={' '}
                <span className="text-base text-[#2B2D42] block mt-1">
                  💎 Value = ${valBreakdown.V0}
                </span>
              </div>

              {/* Explanation of Multiple */}
              <div className="text-xs font-semibold text-[#2B2D42]/80 space-y-1">
                <p>
                  Multiple = 1 + {projectStarsEarned} project ⭐ + {clarityScore} plan clarity ={' '}
                  <span className="font-black text-[#2B2D42]">{valBreakdown.multiple}</span>
                </p>
                {valBreakdown.baseValuation < 100 && (
                  <p className="text-[#FF9F1C] font-bold">
                    Minimum value 100 applies.
                  </p>
                )}
              </div>
            </div>

            {/* Pitch polish card */}
            <div className="rounded-[18px] border-2 border-[#2B2D42] bg-[#DCFCE7] p-3 text-center">
              <span className="text-xs font-bold text-[#166534] block">
                Pitch polish: +{5 * bankStars}% — investors will value you higher.
              </span>
            </div>

            {/* Lesson earned card */}
            <div className="rounded-[16px] border-2 border-[#2B2D42] bg-[#FFF7E6] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2D42]/60">
                Added to Notebook 📒
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#2B2D42] mt-0.5">
                "{currentChapter.lesson}"
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="large" disabled={isSubmitting} onClick={handleFinishChapter}>
              Next chapter: Meet the Investors 💼
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
