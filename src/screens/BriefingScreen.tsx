import React, { useState } from 'react';
import { useGame } from '../state/gameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const BriefingScreen: React.FC = () => {
  const { setScreen } = useGame();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const startChapterOne = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setScreen('chapter');
  };

  return (
    <div className="flex flex-col flex-1 justify-between py-4 px-4">
      {/* Top bar with indicator and Skip */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`h-2.5 rounded-full border border-[#2B2D42] transition-all ${
                idx === step
                  ? 'w-7 bg-[#FFD23F]'
                  : idx < step
                  ? 'w-2.5 bg-[#4ADE80]'
                  : 'w-2.5 bg-white'
              }`}
            />
          ))}
        </div>

        <button
          onClick={startChapterOne}
          disabled={isNavigating}
          className="min-h-[48px] px-3 flex items-center text-xs font-bold text-[#2B2D42]/70 hover:text-[#2B2D42] underline cursor-pointer disabled:opacity-50"
          aria-label="Skip introduction"
        >
          Skip intro ⏭️
        </button>
      </div>

      {/* Slide Content */}
      <div className="my-auto py-2">
        {step === 0 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <span className="text-5xl" aria-hidden="true">🎯</span>
              <h2 className="text-3xl font-black text-[#2B2D42] mt-2">
                Your Mission
              </h2>
            </div>

            <Card variant="white" className="p-5 text-center space-y-3">
              <p className="text-xl font-bold text-[#2B2D42] leading-snug">
                Turn a small idea into a valuable company, and keep a big slice of it! 🥧
              </p>
              <div className="p-3 bg-[#FFF7E6] rounded-[14px] border-2 border-[#2B2D42]/20 text-sm font-semibold text-[#2B2D42]/80">
                You will make smart choices to grow cash and value.
              </div>
            </Card>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <span className="text-5xl" aria-hidden="true">📊</span>
              <h2 className="text-3xl font-black text-[#2B2D42] mt-2">
                Your 3 Meters
              </h2>
              <p className="text-sm font-semibold text-[#2B2D42]/70">
                Watch these numbers at the top of your screen!
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-[16px] border-2 border-[#2B2D42] bg-[#DCFCE7] p-3 flex items-center gap-3 shadow-[0_3px_0_rgba(43,45,66,0.15)]">
                <span className="text-3xl">💰</span>
                <div>
                  <h3 className="font-black text-[#166534] text-base leading-tight">Cash</h3>
                  <p className="text-xs font-bold text-[#166534]/80">Money your company has.</p>
                </div>
              </div>

              <div className="rounded-[16px] border-2 border-[#2B2D42] bg-[#EDE9FE] p-3 flex items-center gap-3 shadow-[0_3px_0_rgba(43,45,66,0.15)]">
                <span className="text-3xl">💎</span>
                <div>
                  <h3 className="font-black text-[#5B21B6] text-base leading-tight">Value</h3>
                  <p className="text-xs font-bold text-[#5B21B6]/80">What your company is worth.</p>
                </div>
              </div>

              <div className="rounded-[16px] border-2 border-[#2B2D42] bg-[#FFEDD5] p-3 flex items-center gap-3 shadow-[0_3px_0_rgba(43,45,66,0.15)]">
                <span className="text-3xl">🥧</span>
                <div>
                  <h3 className="font-black text-[#9A3412] text-base leading-tight">Your Slice</h3>
                  <p className="text-xs font-bold text-[#9A3412]/80">How much of the company is yours.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="text-center">
              <span className="text-4xl" aria-hidden="true">🗺️</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B2D42] mt-1">
                Your 5 Steps
              </h2>
              <p className="text-xs font-semibold text-[#2B2D42]/70">
                Complete all 5 chapters to win!
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { num: 1, icon: '🚀', title: 'Launch Your Project', color: '#5CC8FF' },
                { num: 2, icon: '📝', title: 'Write Your Plan', color: '#FFD23F' },
                { num: 3, icon: '🏦', title: 'Meet the Bank', color: '#4ADE80' },
                { num: 4, icon: '💼', title: 'Meet the Investors', color: '#8B5CF6' },
                { num: 5, icon: '🏁', title: 'Sell, Raise or Keep', color: '#FF9F1C' },
              ].map((item) => (
                <div
                  key={item.num}
                  className="rounded-[14px] border-2 border-[#2B2D42] bg-white p-2.5 flex items-center gap-3 shadow-[0_2px_0_rgba(43,45,66,0.15)]"
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-[#2B2D42] flex items-center justify-center font-black text-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.num}
                  </div>
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <span className="font-bold text-sm text-[#2B2D42] truncate">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="w-full pt-3 flex items-center gap-2">
        {step > 0 && (
          <Button
            variant="secondary"
            size="normal"
            fullWidth={false}
            className="w-24 shrink-0"
            onClick={() => setStep((s) => (s - 1) as 0 | 1)}
          >
            ← Back
          </Button>
        )}

        {step < 2 ? (
          <Button
            variant="primary"
            size="normal"
            onClick={() => setStep((s) => (s + 1) as 1 | 2)}
          >
            Next →
          </Button>
        ) : (
          <Button
            variant="primary"
            size="normal"
            disabled={isNavigating}
            onClick={startChapterOne}
          >
            Let's start! 🚀
          </Button>
        )}
      </div>
    </div>
  );
};
