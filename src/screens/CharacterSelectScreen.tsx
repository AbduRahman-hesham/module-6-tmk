import React, { useState } from 'react';
import { useGame, CharacterId } from '../state/gameContext';
import { CHARACTERS } from '../assets/characters';
import { Button } from '../ui/Button';

export const CharacterSelectScreen: React.FC = () => {
  const { state, setCharacter, setScreen } = useGame();
  const [selected, setSelected] = useState<CharacterId | null>(state.character);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const [isNavigating, setIsNavigating] = useState(false);

  const handleSelect = (id: CharacterId) => {
    setSelected(id);
    setCharacter(id);
  };

  const handleContinue = () => {
    if (!selected || isNavigating) return;
    setIsNavigating(true);
    setScreen('briefing');
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col flex-1 justify-between py-4 px-4">
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            Step 1 of 5
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B2D42]">
            Choose Your Founder 🌟
          </h2>
          <p className="text-sm font-semibold text-[#2B2D42]/70">
            Who will lead this startup journey?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {CHARACTERS.map((char) => {
            const isSelected = selected === char.id;
            const hasError = imageErrors[char.id];

            return (
              <div
                key={char.id}
                onClick={() => handleSelect(char.id)}
                className={`sticker-card p-3 flex flex-col items-center text-center cursor-pointer transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? 'ring-4 ring-[#FFD23F] bg-white translate-y-[-2px]'
                    : 'bg-white/90 hover:bg-white opacity-90'
                }`}
              >
                {/* Avatar circle */}
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-[#2B2D42] overflow-hidden flex items-center justify-center mb-3 shadow-[0_3px_0_rgba(43,45,66,0.15)] ${
                    char.id === 'boy' ? 'bg-[#5CC8FF]' : 'bg-[#FF9F1C]'
                  }`}
                >
                  {!hasError ? (
                    <img
                      src={char.image}
                      alt={char.name}
                      onError={() => handleImageError(char.id)}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  ) : (
                    <span className="text-5xl select-none">{char.emoji}</span>
                  )}
                </div>

                <div className="w-full space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-black text-[#2B2D42]">
                      {char.name}
                    </span>
                    <span className="text-sm">{char.emoji}</span>
                  </div>

                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF7E6] border border-[#2B2D42]/30 text-[#2B2D42]">
                    {char.badge}
                  </span>

                  <p className="text-xs text-[#2B2D42]/70 leading-snug line-clamp-2 pt-1">
                    {char.tagline}
                  </p>
                </div>

                {/* Selection indicator checkmark */}
                <div className="mt-3">
                  <div
                    className={`w-7 h-7 rounded-full border-2 border-[#2B2D42] flex items-center justify-center font-black text-sm transition-colors ${
                      isSelected
                        ? 'bg-[#4ADE80] text-[#2B2D42]'
                        : 'bg-slate-100 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="w-full pt-4 space-y-2">
        <Button
          variant="primary"
          size="large"
          disabled={!selected || isNavigating}
          onClick={handleContinue}
        >
          {selected ? 'Continue 🚀' : 'Pick a Founder'}
        </Button>
      </div>
    </div>
  );
};
