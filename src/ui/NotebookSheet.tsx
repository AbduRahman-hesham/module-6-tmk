import React from 'react';
import { CHAPTERS } from '../data/chapters';

interface NotebookSheetProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: string[];
}

export const NotebookSheet: React.FC<NotebookSheetProps> = ({ isOpen, onClose, lessons }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px] transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-[#FFF7E6] rounded-t-[28px] border-t-[3px] border-x-[3px] border-[#2B2D42] shadow-[0_-6px_0_rgba(43,45,66,0.25)] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-[#2B2D42]/30 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-3 border-b-2 border-[#2B2D42]/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">📒</span>
            <h2 className="text-xl font-bold text-[#2B2D42]">Founder Notebook</h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white border-2 border-[#2B2D42] flex items-center justify-center font-bold text-lg text-[#2B2D42] hover:bg-slate-100 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2B2D42]"
            aria-label="Close Notebook"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {lessons.length === 0 ? (
            <div className="py-8 text-center text-[#2B2D42]/70">
              <div className="text-4xl mb-2">📖</div>
              <p className="font-semibold text-lg text-[#2B2D42]">Your notebook is empty</p>
              <p className="text-sm text-[#2B2D42]/60 mt-1">Finish a chapter to add a lesson!</p>
            </div>
          ) : (
            lessons.map((lessonText, index) => {
              const chapterNum = index + 1;
              const chapterInfo = CHAPTERS[chapterNum];
              return (
                <div
                  key={index}
                  className="rounded-[16px] bg-white border-2 border-[#2B2D42] p-3 shadow-[0_3px_0_rgba(43,45,66,0.15)] flex items-start gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-[12px] border-2 border-[#2B2D42] flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: chapterInfo?.accentColor || '#FFD23F' }}
                  >
                    {chapterInfo?.icon || '💡'}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2B2D42]/60">
                      Lesson {chapterNum} · {chapterInfo?.shortTitle}
                    </span>
                    <p className="text-[#2B2D42] font-semibold text-base mt-0.5 leading-snug">
                      "{lessonText}"
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-3 border-t-2 border-[#2B2D42]/10">
          <button
            onClick={onClose}
            className="sticker-button w-full min-h-[48px] bg-[#FFD23F] text-[#2B2D42] font-bold text-base flex items-center justify-center"
          >
            Back to Game 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
