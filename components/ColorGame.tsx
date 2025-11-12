// components/ColorGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import Button from './Button';
import { COLORS, CORRECT_SOUND_URL, WRONG_SOUND_URL, GAME_SUCCESS_SOUND_URL, GAME_FAIL_SOUND_URL } from '../constants';
import { GameCompletionCallback, ToddlerGameType } from '../types';

interface ColorGameProps {
  onGameComplete: GameCompletionCallback;
  numRounds?: number;
}

const ColorGame: React.FC<ColorGameProps> = ({ onGameComplete, numRounds = 5 }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [targetColor, setTargetColor] = useState<{ name: string; hex: string } | null>(null);
  const [options, setOptions] = useState<{ name: string; hex: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);

  const playSound = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Error playing sound:", e));
  }, []);

  const generateRound = useCallback(() => {
    const allColors = COLORS;
    const newTargetColor = allColors[Math.floor(Math.random() * allColors.length)];
    setTargetColor(newTargetColor);

    const newOptions: Set<{ name: string; hex: string }> = new Set();
    newOptions.add(newTargetColor);
    while (newOptions.size < 4) {
      const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
      if (!Array.from(newOptions).some(c => c.name === randomColor.name)) {
        newOptions.add(randomColor);
      }
    }
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5)); // Shuffle options
    setSelectedOption(null);
    setIsRoundOver(false);
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleOptionClick = (optionName: string) => {
    if (isRoundOver) return;

    setSelectedOption(optionName);
    setIsRoundOver(true);
    if (optionName === targetColor?.name) {
      setCorrectCount(prev => prev + 1);
      playSound(CORRECT_SOUND_URL);
    } else {
      playSound(WRONG_SOUND_URL);
    }
  };

  const finishGame = useCallback((finalCorrectCount: number, finalTotalRounds: number) => {
    const successThreshold = 0.7; // 70% correct to count as a "success"
    if (finalCorrectCount / finalTotalRounds >= successThreshold) {
      playSound(GAME_SUCCESS_SOUND_URL);
    } else {
      playSound(GAME_FAIL_SOUND_URL);
    }
    onGameComplete(finalCorrectCount, finalTotalRounds, ToddlerGameType.COLORS);
  }, [onGameComplete, playSound]);

  const handleNextRound = () => {
    if (currentRound < numRounds - 1) {
      setCurrentRound(prev => prev + 1);
      generateRound();
    } else {
      finishGame(correctCount, numRounds);
    }
  };

  const handleBackToGames = () => {
    finishGame(correctCount, currentRound + 1);
  };

  if (!targetColor || options.length === 0) {
    return (
      <Card className="p-8 text-center text-xl text-blue-600 animate-pulse">
        Loading Color Match...
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 flex flex-col items-center text-center max-w-2xl mx-auto">
      <h3 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-6">
        What color is this? <span className="text-purple-600">{targetColor.name}</span>
      </h3>
      <div
        className="mb-8 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-300 flex items-center justify-center animate-scale-in"
        style={{ backgroundColor: targetColor.hex }}
        aria-label={`Target color: ${targetColor.name}`}
      ></div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8">
        {options.map((option, index) => {
          const isSelected = selectedOption === option.name;
          const isCorrectOption = isRoundOver && option.name === targetColor.name;
          const isWrongSelected = isSelected && isRoundOver && option.name !== targetColor.name;

          let optionClasses = 'p-4 rounded-xl text-4xl font-bold transition-all duration-300';
          let buttonStyles: React.CSSProperties = { backgroundColor: option.hex };

          if (!isRoundOver) {
            optionClasses += ' text-white shadow-md hover:brightness-110';
          } else if (isCorrectOption) {
            optionClasses += ' border-4 border-green-500 shadow-lg animate-bounce-once';
          } else if (isWrongSelected) {
            optionClasses += ' border-4 border-red-500 shadow-lg';
          } else {
            optionClasses += ' opacity-70 cursor-not-allowed text-gray-800'; // Make text visible on different colors
          }

          return (
            <Button
              key={index}
              onClick={() => handleOptionClick(option.name)}
              className={optionClasses}
              disabled={isRoundOver}
              style={buttonStyles}
            >
              {option.name}
            </Button>
          );
        })}
      </div>

      <p className="text-lg font-semibold text-gray-700 mb-4">Round {currentRound + 1} / {numRounds} | Correct: {correctCount}</p>
      
      {isRoundOver && (
        <div className="mt-4 flex gap-4">
          <Button onClick={handleNextRound} variant="secondary" size="md">
            {currentRound === numRounds - 1 ? 'Finish Game' : 'Next Color'}
          </Button>
        </div>
      )}
      <Button onClick={handleBackToGames} variant="outline" size="sm" className="mt-4 text-gray-600 border-gray-300">
        Back to Games
      </Button>
    </Card>
  );
};

export default ColorGame;