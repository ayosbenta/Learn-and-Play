// components/QuizGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';
import Button from './Button';
import Card from './Card';

interface QuizGameProps {
  category: string;
  difficulty: string;
  onQuizComplete?: (score: number, total: number, gameType?: 'quiz') => void;
  onBackToGames: () => void; // New prop for back button
}

const QuizGame: React.FC<QuizGameProps> = ({ category, difficulty, onQuizComplete, onBackToGames }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = useCallback(async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    setError(null);
    try {
      const q = await generateQuizQuestion(category, difficulty);
      if (q) {
        setCurrentQuestion(q);
      } else {
        setError("Could not generate a quiz question. Please try again.");
      }
    } catch (err) {
      setError("Failed to load quiz question. Network error or API issue.");
      console.error("Error in QuizGame:", err);
    } finally {
      setIsLoading(false);
    }
  }, [category, difficulty]);

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch initial question on mount

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null || !currentQuestion) return;

    setSelectedOption(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (questionCount >= 4) { // Let's do 5 questions per quiz
      setQuizFinished(true);
      if (onQuizComplete) {
        onQuizComplete(score, questionCount + 1, 'quiz');
      }
      return;
    }
    setQuestionCount(prev => prev + 1);
    fetchQuestion();
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setQuestionCount(0);
    setQuizFinished(false);
    fetchQuestion();
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center text-xl text-blue-600 animate-pulse">
        Generating fun quiz question...
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <div className="flex flex-col gap-4 items-center">
          <Button onClick={fetchQuestion} variant="secondary">Try Again</Button>
          <Button onClick={onBackToGames} variant="outline" size="sm" className="text-gray-600 border-gray-300">
            Back to Games
          </Button>
        </div>
      </Card>
    );
  }

  if (quizFinished) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-3xl font-extrabold text-green-600 mb-4">Quiz Complete! 🎉</h3>
        <p className="text-xl text-gray-800 mb-6">You scored {score} out of {questionCount + 1} questions!</p>
        <div className="flex flex-col gap-4 items-center">
          <Button onClick={handleRestartQuiz} variant="primary">Play Again</Button>
          <Button onClick={onBackToGames} variant="outline" size="sm" className="text-gray-600 border-gray-300">
            Back to Games
          </Button>
        </div>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="p-8 text-center text-xl text-red-500">
        No quiz question available.
        <Button onClick={onBackToGames} variant="outline" size="sm" className="mt-4 text-gray-600 border-gray-300">
          Back to Games
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 flex flex-col items-center text-center max-w-2xl mx-auto">
      <p className="text-lg md:text-xl font-semibold text-purple-600 mb-4">Question {questionCount + 1} / 5</p>
      <h3 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-6 leading-relaxed">
        {currentQuestion.question}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-8">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = selectedOption !== null && option === currentQuestion.answer;
          const isWrongSelected = isSelected && !isCorrect;

          let optionClasses = 'p-4 rounded-xl border-2 cursor-pointer transition-all duration-300';
          if (selectedOption === null) {
            optionClasses += ' bg-blue-100 border-blue-300 hover:bg-blue-200';
          } else if (isCorrectOption) {
            optionClasses += ' bg-green-200 border-green-500 text-green-800 font-bold shadow-md';
          } else if (isWrongSelected) {
            optionClasses += ' bg-red-200 border-red-500 text-red-800 font-bold shadow-md';
          } else {
            optionClasses += ' bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed';
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={optionClasses}
              disabled={selectedOption !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="mt-4 text-center">
          <p className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'} mb-4 animate-scale-in`}>
            {isCorrect ? 'Correct! 🎉' : `Oops! The answer was: ${currentQuestion.answer}`}
          </p>
          <div className="flex flex-col gap-4 items-center">
            <Button onClick={handleNextQuestion} variant="secondary">
              Next Question
            </Button>
            <Button onClick={onBackToGames} variant="outline" size="sm" className="text-gray-600 border-gray-300">
              Back to Games
            </Button>
          </div>
        </div>
      )}
      {selectedOption === null && (
        <Button onClick={onBackToGames} variant="outline" size="sm" className="mt-4 text-gray-600 border-gray-300">
          Back to Games
        </Button>
      )}
    </Card>
  );
};

export default QuizGame;