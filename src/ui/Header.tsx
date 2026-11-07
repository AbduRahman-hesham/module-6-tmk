import React, { useState } from 'react';
import { useGame } from '../state/gameContext';
import { CHAPTERS } from '../data/chapters';
import { Meter } from './Meter';
import { NotebookSheet } from './NotebookSheet';

export const Header: React.FC = () => {
  const { state } = useGame();
  const [notebookOpen, setNotebookOpen] = useState(false);

  const currentChapterInfo = CHAPTERS[state.chapter];
  const isPlayingChapter = state.screen === 'chapter';

  // Chapter tint styling
  const headerBgColor = isPlayingChapter ? currentChapterInfo.accentColor : '#FFF7E6';

  return (
    <>
      <header
        className="sticky top-0 z-30 w-full border-b-[3px] border-[#2B2D42] shadow-[0_3px_0_rgba(43,45,66,0.15)] transition-colors duration-200"
        style={{ backgroundColor: headerBgColor }}
      >
        <div className="max-w-[480px] mx-auto px-3 py-2 flex flex-col gap-2">
          {/* Top row: Chapter label / Title + Progress dots + Notebook button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xl shrink-0" aria-hidden="true">
                {isPlayingChapter ? currentChapterInfo.icon : '🚀'}
              </span>
              <span className="font-extrabold text-sm sm:text-base text-[#2B2D42] truncate leading-tight">
                {isPlayingChapter
                  ? `Ch.${state.chapter}: ${currentChapterInfo.shortTitle}`
                  : state.screen === 'final'
                  ? 'Victory 🏁'
                  : 'Startup Journey'}
              </span>
            </div>

            {/* 5 Progress dots */}
            <div className="flex items-center gap-1 shrink-0" aria-label="5 Chapter Progress Dots">
              {[1, 2, 3, 4, 5].map((ch) => {
                const isCompleted = state.chapterResults[ch] !== undefined;
                const isCurrent = isPlayingChapter && state.chapter === ch;
                const chAccent = CHAPTERS[ch].accentColor;

                let dotClasses = 'w-3 h-3 rounded-full border-2 border-[#2B2D42] transition-all';
                let dotStyle: React.CSSProperties = {};

                if (isCompleted) {
                  dotStyle = { backgroundColor: '#4ADE80' }; // mint filled
                } else if (isCurrent) {
                  dotClasses += ' ring-2 ring-[#2B2D42] scale-110';
                  dotStyle = { backgroundColor: chAccent };
                } else {
                  dotClasses += ' bg-white/70 opacity-60';
                }

                return (
                  <div
                    key={ch}
                    className={dotClasses}
                    style={dotStyle}
                    title={`Chapter ${ch}: ${CHAPTERS[ch].shortTitle}`}
                  />
                );
              })}
            </div>

            {/* 📒 Notebook Button */}
            <button
              onClick={() => setNotebookOpen(true)}
              className="sticker-button shrink-0 min-h-[48px] px-3 py-1.5 bg-white flex items-center gap-1.5 text-xs font-bold text-[#2B2D42] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2B2D42]"
              title="Open Notebook"
              aria-label="Open Notebook"
            >
              <span className="text-base" aria-hidden="true">📒</span>
              <span>Notes</span>
              {state.notebook.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FFD23F] border border-[#2B2D42] flex items-center justify-center text-[10px] font-black">
                  {state.notebook.length}
                </span>
              )}
            </button>
          </div>

          {/* Bottom row: 3 Meters */}
          <div className="grid grid-cols-3 gap-2">
            <Meter type="cash" value={state.meters.cash} />
            <Meter type="value" value={state.meters.value} />
            <Meter type="slice" value={state.meters.slice} />
          </div>
        </div>
      </header>

      <NotebookSheet
        isOpen={notebookOpen}
        onClose={() => setNotebookOpen(false)}
        lessons={state.notebook}
      />
    </>
  );
};
