/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './state/gameContext';
import { Header } from './ui/Header';
import { DebugPanel } from './ui/DebugPanel';
import { TitleScreen } from './screens/TitleScreen';
import { CharacterSelectScreen } from './screens/CharacterSelectScreen';
import { BriefingScreen } from './screens/BriefingScreen';
import { ChapterScreen } from './screens/ChapterScreen';
import { FinalScreen } from './screens/FinalScreen';
import { SelfTestScreen } from './screens/SelfTestScreen';

function GameContent() {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.screen) {
      case 'title':
        return <TitleScreen />;
      case 'character_select':
        return <CharacterSelectScreen />;
      case 'briefing':
        return <BriefingScreen />;
      case 'chapter':
        return <ChapterScreen />;
      case 'final':
        return <FinalScreen />;
      case 'self_test':
        return <SelfTestScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <div className="h-[100dvh] w-full flex justify-center bg-[#FFF7E6] text-[#2B2D42] overflow-hidden">
      {/* 360x640 mobile-first wrapper with max-w-[480px] */}
      <div className="w-full max-w-[480px] h-[100dvh] flex flex-col relative bg-[#FFF7E6] shadow-xl border-x-0 sm:border-x-[3px] sm:border-[#2B2D42]/20 overflow-hidden">
        {/* Sticky Header with Chapter name, 5 progress dots, 3 meters, Notebook button */}
        {state.screen !== 'self_test' && <Header />}

        {/* Main scrollable body */}
        <main className="flex-1 flex flex-col overflow-y-auto overscroll-contain">
          {renderScreen()}
        </main>

        {/* Collapsible Debug Panel (when debugMode is active) */}
        <DebugPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
