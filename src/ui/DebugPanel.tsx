import React, { useState } from 'react';
import { useGame, GameState } from '../state/gameContext';
import { CHAPTERS } from '../data/chapters';

export const DebugPanel: React.FC = () => {
  const { state, setScreen, toggleDebug, loadSimulation } = useGame();
  const [collapsed, setCollapsed] = useState(true);

  if (!state.debugMode) return null;

  const allLessons = [1, 2, 3, 4, 5].map((num) => CHAPTERS[num].lesson);

  const simulateBest = (ideaId: 'pixel' | 'bikes' | 'paws') => {
    if (ideaId === 'pixel') {
      loadSimulation({
        character: state.character || 'boy',
        ideaId: 'pixel',
        chapter: 5,
        chapterResults: {
          1: { ideaId: 'pixel', goalFirstTry: true, stepMistakes: 0, spent: 60, leftoverCash: 40, stars: 3 },
          2: { problemFirstTry: true, customersFirstTry: true, priceIdx: 1, costIdx: 1, teamIdx: 1, profit: 35, bestProfit: 35, stars: 3 },
          3: { bankStars: 3, V0: 2560, breakdown: { yearly: 420, multiple: 6, baseValuation: 2520, leftoverCash: 40, V0: 2560 } },
          4: { investorId: 'bigbucks', I: 1020, e: 33, own: 67, FV: 8310, stars: 3 },
          5: { exitId: 'raise', wealth: 8550, stars: 3 },
        },
        meters: { cash: 1060, value: 8310, slice: 54 },
        notebook: allLessons,
        screen: 'final',
      });
    } else if (ideaId === 'bikes') {
      loadSimulation({
        character: state.character || 'girl',
        ideaId: 'bikes',
        chapter: 5,
        chapterResults: {
          1: { ideaId: 'bikes', goalFirstTry: true, stepMistakes: 0, spent: 60, leftoverCash: 40, stars: 3 },
          2: { problemFirstTry: true, customersFirstTry: true, priceIdx: 1, costIdx: 1, teamIdx: 1, profit: 50, bestProfit: 50, stars: 3 },
          3: { bankStars: 3, V0: 3640, breakdown: { yearly: 600, multiple: 6, baseValuation: 3600, leftoverCash: 40, V0: 3640 } },
          4: { investorId: 'friendly', I: 910, e: 18, own: 82, FV: 8580, stars: 3 },
          5: { exitId: 'sell', wealth: 7040, stars: 3 },
        },
        meters: { cash: 7040, value: 8580, slice: 0 },
        notebook: allLessons,
        screen: 'final',
      });
    } else {
      loadSimulation({
        character: state.character || 'boy',
        ideaId: 'paws',
        chapter: 5,
        chapterResults: {
          1: { ideaId: 'paws', goalFirstTry: true, stepMistakes: 0, spent: 60, leftoverCash: 40, stars: 3 },
          2: { problemFirstTry: true, customersFirstTry: true, priceIdx: 2, costIdx: 1, teamIdx: 0, profit: 54, bestProfit: 54, stars: 3 },
          3: { bankStars: 3, V0: 3930, breakdown: { yearly: 648, multiple: 6, baseValuation: 3888, leftoverCash: 40, V0: 3930 } },
          4: { investorId: 'friendly', I: 980, e: 18, own: 82, FV: 9970, stars: 3 },
          5: { exitId: 'keep', wealth: 10630, stars: 3 },
        },
        meters: { cash: 1020, value: 9970, slice: 82 },
        notebook: allLessons,
        screen: 'final',
      });
    }
  };

  const simulateWorst = (ideaId: 'pixel' | 'bikes' | 'paws') => {
    loadSimulation({
      character: state.character || 'boy',
      ideaId,
      chapter: 5,
      chapterResults: {
        1: { ideaId, goalFirstTry: false, stepMistakes: 3, spent: 100, leftoverCash: 0, stars: 1 },
        2: { problemFirstTry: false, customersFirstTry: false, priceIdx: 0, costIdx: 0, teamIdx: 0, profit: 15, bestProfit: 35, stars: 1 },
        3: { bankStars: 0, V0: 180, breakdown: { yearly: 180, multiple: 2, baseValuation: 360, leftoverCash: 0, V0: 360 } },
        4: { investorId: 'none', I: 0, e: 0, own: 100, FV: 580, stars: 0 },
        5: { exitId: 'sell', wealth: 580, stars: 1 },
      },
      meters: { cash: 580, value: 580, slice: 0 },
      notebook: allLessons,
      screen: 'final',
    });
  };

  return (
    <aside
      aria-label="Debug console"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#2B2D42] text-white border-t-2 border-[#FFD23F] font-mono text-xs shadow-2xl transition-all"
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1F202E]">
        <div className="flex items-center gap-2">
          <span className="text-sm">🧪</span>
          <span className="font-bold text-[#FFD23F]">DEBUG CONSOLE</span>
          <span className="text-white/60">
            ({state.screen} | Ch.{state.chapter})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('self_test')}
            className="px-2 py-0.5 bg-[#FFD23F] text-[#2B2D42] rounded font-bold hover:bg-yellow-400 cursor-pointer"
          >
            Run Tests 🧪
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="px-2 py-0.5 bg-white/20 rounded hover:bg-white/30 cursor-pointer"
          >
            {collapsed ? '▲ Expand' : '▼ Collapse'}
          </button>
          <button
            onClick={toggleDebug}
            className="px-2 py-0.5 bg-red-500/80 rounded hover:bg-red-600 text-white font-bold cursor-pointer"
            title="Turn Debug Off"
          >
            ✕
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 max-h-72 overflow-y-auto space-y-2.5 bg-[#2B2D42]/95 border-t border-white/10">
          {/* Simulation controls */}
          <div className="space-y-1">
            <span className="text-white/70 font-bold block text-[10px] uppercase">
              Fast Simulations:
            </span>
            <div className="flex flex-wrap gap-1 text-[11px]">
              <button
                onClick={() => simulateBest('pixel')}
                className="px-2 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-500 cursor-pointer"
              >
                ★ Best Pixel (15★)
              </button>
              <button
                onClick={() => simulateBest('bikes')}
                className="px-2 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-500 cursor-pointer"
              >
                ★ Best Bikes (15★)
              </button>
              <button
                onClick={() => simulateBest('paws')}
                className="px-2 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-500 cursor-pointer"
              >
                ★ Best Paws (15★)
              </button>
              <button
                onClick={() => simulateWorst('pixel')}
                className="px-2 py-1 bg-rose-600 text-white rounded font-bold hover:bg-rose-500 cursor-pointer"
              >
                🌱 Worst Path (3★)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 text-[11px]">
            <span className="text-white/60">Quick jump:</span>
            <button
              onClick={() => setScreen('title')}
              className="px-1.5 py-0.5 bg-white/10 rounded hover:bg-white/20 cursor-pointer"
            >
              Title
            </button>
            <button
              onClick={() => setScreen('character_select')}
              className="px-1.5 py-0.5 bg-white/10 rounded hover:bg-white/20 cursor-pointer"
            >
              Char Select
            </button>
            <button
              onClick={() => setScreen('briefing')}
              className="px-1.5 py-0.5 bg-white/10 rounded hover:bg-white/20 cursor-pointer"
            >
              Briefing
            </button>
            <button
              onClick={() => setScreen('chapter')}
              className="px-1.5 py-0.5 bg-white/10 rounded hover:bg-white/20 cursor-pointer"
            >
              Chapter
            </button>
            <button
              onClick={() => setScreen('final')}
              className="px-1.5 py-0.5 bg-white/10 rounded hover:bg-white/20 cursor-pointer"
            >
              Final
            </button>
          </div>

          <pre className="text-[11px] leading-tight text-emerald-400 whitespace-pre-wrap select-all bg-black/40 p-2 rounded">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      )}
    </aside>
  );
};
