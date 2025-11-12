// components/SnakeGame.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from './Card';
import Button from './Button';
import { CORRECT_SOUND_URL, WRONG_SOUND_URL, GAME_SUCCESS_SOUND_URL, GAME_FAIL_SOUND_URL } from '../constants';
import { GameCompletionCallback, ToddlerGameType } from '../types';

interface SnakeGameProps {
  onGameComplete: GameCompletionCallback;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20; // pixels
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Up
const GAME_SPEED = 200; // ms

interface Coordinate {
  x: number;
  y: number;
}

const generateFood = (snake: Coordinate[]): Coordinate => {
  let food: Coordinate;
  while (true) {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      return food;
    }
  }
};

const SnakeGame: React.FC<SnakeGameProps> = ({ onGameComplete }) => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>(generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Coordinate>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameIntervalRef = useRef<number | null>(null);
  const nextDirectionRef = useRef<Coordinate>(INITIAL_DIRECTION); // To prevent rapid direction changes

  const playSound = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Error playing sound:", e));
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  }, []);

  const handleGameEnd = useCallback(() => {
    setGameOver(true);
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
    playSound(GAME_FAIL_SOUND_URL); // Play a general game over sound
    onGameComplete(score, 1, ToddlerGameType.SNAKE); // Score is snake length, total is 1 round
  }, [onGameComplete, score, playSound]);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      if (gameOver) return prevSnake;

      const head = prevSnake[0];
      const newDirection = nextDirectionRef.current;
      const newHead = { x: head.x + newDirection.x, y: head.y + newDirection.y };

      // Check for wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameEnd();
        return prevSnake;
      }

      // Check for self-collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameEnd();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(newSnake));
        setScore(prevScore => prevScore + 1);
        playSound(CORRECT_SOUND_URL); // Sound for eating food
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }
      return newSnake;
    });
  }, [gameOver, food, handleGameEnd, playSound]);

  useEffect(() => {
    if (!gameOver) {
      gameIntervalRef.current = window.setInterval(moveSnake, GAME_SPEED);
    }
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [moveSnake, gameOver]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    const currentDir = nextDirectionRef.current;
    switch (e.key) {
      case 'ArrowUp':
        if (currentDir.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (currentDir.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (currentDir.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (currentDir.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
        break;
    }
    setDirection(nextDirectionRef.current); // Update actual direction state
  }, [gameOver]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const onBackToGames = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
    onGameComplete(score, 1, ToddlerGameType.SNAKE); // Pass current score
  };

  return (
    <Card className="p-4 md:p-6 flex flex-col items-center max-w-lg mx-auto">
      <h3 className="text-3xl font-extrabold text-blue-700 mb-4">Snake Game! 🐍</h3>
      <p className="text-xl font-semibold text-green-600 mb-4">Score: {score}</p>
      <div
        className="relative bg-gray-800 border-4 border-purple-500 rounded-lg overflow-hidden"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
        role="grid"
        aria-label="Snake Game Board"
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm ${index === 0 ? 'bg-green-500' : 'bg-green-400'}`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
            role="gridcell"
            aria-label={`Snake segment at ${segment.x}, ${segment.y}`}
          ></div>
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
          role="gridcell"
          aria-label={`Food at ${food.x}, ${food.y}`}
        ></div>
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white text-center p-4">
            <p className="text-4xl font-extrabold mb-4 animate-pulse">Game Over!</p>
            <p className="text-2xl mb-6">Your final score: <span className="text-yellow-400 font-bold">{score}</span></p>
            <Button onClick={resetGame} variant="primary" size="md" className="mb-4">
              Play Again
            </Button>
            <Button onClick={onBackToGames} variant="outline" size="sm" className="text-white border-white">
              Back to Games
            </Button>
          </div>
        )}
      </div>
      {!gameOver && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button onClick={() => nextDirectionRef.current = { x: 0, y: -1 }} className="p-2 w-12 h-12" variant="ghost" aria-label="Move Up">
            ⬆️
          </Button>
          <div className="flex gap-4">
            <Button onClick={() => nextDirectionRef.current = { x: -1, y: 0 }} className="p-2 w-12 h-12" variant="ghost" aria-label="Move Left">
              ⬅️
            </Button>
            <Button onClick={() => nextDirectionRef.current = { x: 1, y: 0 }} className="p-2 w-12 h-12" variant="ghost" aria-label="Move Right">
              ➡️
            </Button>
          </div>
          <Button onClick={() => nextDirectionRef.current = { x: 0, y: 1 }} className="p-2 w-12 h-12" variant="ghost" aria-label="Move Down">
            ⬇️
          </Button>
        </div>
      )}
      {!gameOver && (
        <Button onClick={onBackToGames} variant="outline" size="sm" className="mt-6 text-gray-600 border-gray-300">
          Back to Games
        </Button>
      )}
    </Card>
  );
};

export default SnakeGame;