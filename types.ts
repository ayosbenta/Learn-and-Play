// types.ts
import type { ReactNode } from 'react';

export enum AppSection {
  HOME = 'home',
  GAME_ZONE = 'game-zone',
  LEARNING_HUB = 'learning-hub',
  REWARDS = 'rewards',
  PARENTS = 'parents',
}

export enum ToddlerGameType {
  ABC = 'abc',
  NUMBERS = 'numbers',
  COLORS = 'colors',
}

export interface UserProgress {
  name: string;
  xp: number;
  badges: string[];
  recentActivities: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; // The correct option
}

export interface NavItem {
  id: AppSection;
  label: string;
  icon: ReactNode;
}

export interface CharacterOutfit {
  id: string;
  name: string;
  image: string;
  cost: number;
}

export interface GameCompletionCallback {
  (score: number, total: number, gameType?: ToddlerGameType | 'quiz'): void;
}