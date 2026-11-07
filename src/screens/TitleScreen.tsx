import React, { useState } from 'react';
import { useGame } from '../state/gameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const TitleScreen: React.FC = () => {
  const { state, setScreen, toggleDebug } = useGame();
  const [tapCount, setTapCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLogoTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    if (nextCount >= 5) {
      toggleDebug();
      setTapCount(0);
    }
  };

  const handlePlay = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setScreen('character_select');
  };

  return (
    <div className="flex flex-col flex-1 justify-between py-6 px-4">
      <div className="flex flex-col items-center text-center my-auto space-y-6">
        {/* Animated Rocket Badge / Logo */}
        <div
          onClick={handleLogoTap}
          className="w-28 h-28 rounded-full bg-[#5CC8FF] border-[4px] border-[#2B2D42] shadow-[0_6px_0_rgba(43,45,66,0.25)] flex items-center justify-center text-5xl cursor-pointer select-none transition-transform active:scale-95"
          title="Startup Journey Rocket"
        >
          🚀
        </div>

        {/* Title & Taglines */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-[#2B2D42] tracking-tight leading-none">
            Startup Journey
          </h1>
          <p className="text-lg sm:text-xl font-bold text-[#FF9F1C]">
            Build a company. Keep the biggest slice! 🥧
          </p>
        </div>

        {/* Info card */}
        <Card variant="white" className="max-w-[340px] text-center py-4">
          <p className="text-sm font-semibold text-[#2B2D42]/70">
            5 chapters · about 10 minutes ⏱️
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-2xl">
            <span>🎮</span>
            <span>📝</span>
            <span>🏦</span>
            <span>💼</span>
            <span>🏁</span>
          </div>
        </Card>

        {/* Debug self-tests link if debug is enabled */}
        {state.debugMode && (
          <button
            onClick={() => setScreen('self_test')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5CF6]/10 border-2 border-[#8B5CF6] text-[#8B5CF6] rounded-full text-xs font-bold hover:bg-[#8B5CF6]/20 cursor-pointer"
          >
            <span>🧪</span>
            <span>Open Math Self-Tests</span>
          </button>
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="w-full pt-4">
        <Button
          variant="primary"
          size="large"
          disabled={isNavigating}
          onClick={handlePlay}
        >
          Play 🚀
        </Button>
      </div>
    </div>
  );
};
