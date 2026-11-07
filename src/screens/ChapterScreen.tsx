import React from 'react';
import { useGame } from '../state/gameContext';
import { Chapter1Screen } from './chapter1/Chapter1Screen';
import { Chapter2Screen } from './chapter2/Chapter2Screen';
import { Chapter3Screen } from './chapter3/Chapter3Screen';
import { Chapter4Screen } from './chapter4/Chapter4Screen';
import { Chapter5Screen } from './chapter5/Chapter5Screen';

export const ChapterScreen: React.FC = () => {
  const { state } = useGame();

  switch (state.chapter) {
    case 1:
      return <Chapter1Screen />;
    case 2:
      return <Chapter2Screen />;
    case 3:
      return <Chapter3Screen />;
    case 4:
      return <Chapter4Screen />;
    case 5:
      return <Chapter5Screen />;
    default:
      return <Chapter1Screen />;
  }
};
