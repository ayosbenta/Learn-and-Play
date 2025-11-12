// components/ABCGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import Button from './Button';
import { ALPHABET, CORRECT_SOUND_URL, WRONG_SOUND_URL, GAME_SUCCESS_SOUND_URL, GAME_FAIL_SOUND_URL } from '../constants';
import { GameCompletionCallback, ToddlerGameType } from '../types';

interface ABCGameProps {
  onGameComplete: GameCompletionCallback;
  numRounds?: number;
}

const ABCGame: React.FC<ABCGameProps> = ({ onGameComplete, numRounds = 5 }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [targetLetter, setTargetLetter] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);

  const playSound = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Error playing sound:", e));
  }, []);

  const generateRound = useCallback(() => {
    const allLetters = ALPHABET.split('');
    const newTargetLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
    setTargetLetter(newTargetLetter);

    const newOptions: Set<string> = new Set();
    newOptions.add(newTargetLetter);
    while (newOptions.size < 4) {
      const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
      newOptions.add(randomLetter);
    }
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5)); // Shuffle options
    setSelectedOption(null);
    setIsRoundOver(false);
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleOptionClick = (option: string) => {
    if (isRoundOver) return;

    setSelectedOption(option);
    setIsRoundOver(true);
    if (option === targetLetter) {
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
    onGameComplete(finalCorrectCount, finalTotalRounds, ToddlerGameType.ABC);
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
    finishGame(correctCount, currentRound + 1); // Exit early, pass current progress
  };

  if (!targetLetter || options.length === 0) {
    return (
      <Card className="p-8 text-center text-xl text-blue-600 animate-pulse">
        Loading ABC Fun...
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 flex flex-col items-center text-center max-w-2xl mx-auto">
      <h3 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-6">
        Find the letter: <span className="text-purple-600">{targetLetter}</span>
      </h3>
      <div className="mb-8 text-6xl md:text-8xl font-bold text-blue-500 animate-scale-in">
        {targetLetter}
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = isRoundOver && option === targetLetter;
          const isWrongSelected = isSelected && isRoundOver && option !== targetLetter;

          let optionClasses = 'p-4 rounded-xl text-4xl font-bold transition-all duration-300';
          if (!isRoundOver) {
            optionClasses += ' bg-blue-100 text-blue-800 hover:bg-blue-200';
          } else if (isCorrectOption) {
            optionClasses += ' bg-green-200 text-green-800 border-2 border-green-500 shadow-md animate-bounce-once';
          } else if (isWrongSelected) {
            optionClasses += ' bg-red-200 text-red-800 border-2 border-red-500 shadow-md';
          } else {
            optionClasses += ' bg-gray-100 text-gray-500 opacity-70 cursor-not-allowed';
          }

          return (
            <Button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={optionClasses}
              disabled={isRoundOver}
            >
              {option}
            </Button>
          );
        })}
      </div>

      <p className="text-lg font-semibold text-gray-700 mb-4">Round {currentRound + 1} / {numRounds} | Correct: {correctCount}</p>
      
      {isRoundOver && (
        <div className="mt-4 flex gap-4">
          <Button onClick={handleNextRound} variant="secondary" size="md">
            {currentRound === numRounds - 1 ? 'Finish Game' : 'Next Letter'}
          </Button>
        </div>
      )}
      <Button onClick={handleBackToGames} variant="outline" size="sm" className="mt-4 text-gray-600 border-gray-300">
        Back to Games
      </Button>
    </Card>
  );
};

export default ABCGame;