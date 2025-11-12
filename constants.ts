// constants.ts
import React from 'react';
import { AppSection, NavItem, CharacterOutfit } from './types';

// Mascot Details
export const MASCOT_NAME = 'Luno the Lion';
export const MASCOT_IMAGE_URL = 'https://www.svgrepo.com/show/305886/lion-face.svg'; // A better lion placeholder

// Icons for navigation (using simple SVG for now)
// Fix: Rewrite icon definitions to use React.createElement to avoid JSX parsing errors in a .ts file.
const HomeIcon: React.FC = () =>
  React.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      className: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '2',
      d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    }),
  );

const GameControllerIcon: React.FC = () =>
  React.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      className: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '2',
      d: 'M11.05 4.05L6 9.091V19h12V9.091l-5.05-5.041zM7 14h2M15 14h2M11 11h2v2h-2v-2z',
    }),
  );

const BookOpenIcon: React.FC = () =>
  React.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      className: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '2',
      d: 'M12 6.253v13m0-13C10.832 5.477 9.207 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.793 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.793 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.207 18 16.5 18s-3.332.477-4.5 1.253',
    }),
  );

const TrophyIcon: React.FC = () =>
  React.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      className: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '2',
      d: 'M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v12m0 0l-2-2m2 2l2-2',
    }),
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '2',
      d: 'M15 11a3 3 0 11-6 0v-1a3 3 0 116 0v1z',
    }),
  );

const UsersIcon: React.FC = () =>
  React.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      className: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '2',
      d: 'M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M5 20h2a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm12-7H5m12 0a.75.75 0 00-.75-.75h-.5a.75.75 0 00-.75.75v.5a.75.75 0 00.75.75h.5a.75.75 0 00.75-.75v-.5zM5.75 13a.75.75 0 00-.75-.75h-.5a.75.75 0 00-.75.75v.5a.75.75 0 00.75.75h.5a.75.75 0 00.75-.75v-.5z',
    }),
  );

export const NAV_ITEMS: NavItem[] = [
  // Fix: Correctly instantiate React.FC components as ReactNode elements.
  { id: AppSection.HOME, label: 'Home', icon: React.createElement(HomeIcon) },
  { id: AppSection.GAME_ZONE, label: 'Play Games', icon: React.createElement(GameControllerIcon) },
  { id: AppSection.LEARNING_HUB, label: 'Learn', icon: React.createElement(BookOpenIcon) },
  { id: AppSection.REWARDS, label: 'Rewards', icon: React.createElement(TrophyIcon) },
  { id: AppSection.PARENTS, label: 'Parents', icon: React.createElement(UsersIcon) },
];

// Game Categories
export const GAME_CATEGORIES = [
  { id: 'math', name: 'Math Mission', icon: '🧠', description: 'Counting, shapes, patterns' },
  { id: 'words', name: 'Word Wonders', icon: '📖', description: 'Spelling, vocabulary, reading' },
  { id: 'science', name: 'Science Quest', icon: '🔬', description: 'Plants, animals, space' },
  { id: 'world', name: 'Explore the World', icon: '🌍', description: 'Geography, cultures, environment' },
];

// Lesson Topics
export const LESSON_TOPICS = [
  { id: 'math-basic', title: 'Basic Math Fun', description: 'Learn numbers, addition, and subtraction.' },
  { id: 'reading-abc', title: 'Alphabet Adventures', description: 'Discover letters and phonics.' },
  { id: 'science-animals', title: 'Amazing Animals', description: 'Explore different animals and their habitats.' },
  { id: 'world-countries', title: 'World Countries', description: 'Learn about countries and continents.' },
];

// Initial Character Outfits
export const INITIAL_CHARACTER_OUTFITS: CharacterOutfit[] = [
  { id: 'default-luno', name: 'Default Luno', image: MASCOT_IMAGE_URL, cost: 0 },
  { id: 'luno-explorer', name: 'Explorer Luno', image: 'https://cdn-icons-png.flaticon.com/512/2922/2922572.png', cost: 100 }, // Placeholder
  { id: 'luno-scientist', name: 'Scientist Luno', image: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png', cost: 200 }, // Placeholder
  { id: 'luno-superhero', name: 'Superhero Luno', image: 'https://cdn-icons-png.flaticon.com/512/3069/3069197.png', cost: 300 }, // Placeholder
];

// Toddler Game specific constants
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Yellow', hex: '#FACC15' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Orange', hex: '#F97316' },
];
export const NUMBERS_IMAGES = [
  '⭐', // 1 star
  '⭐⭐', // 2 stars
  '⭐⭐⭐', // 3 stars
  '⭐⭐⭐⭐', // 4 stars
  '⭐⭐⭐⭐⭐', // 5 stars
];

// Sound effect URLs (placeholders - replace with actual hosted audio files)
export const CORRECT_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-2.mp3'; // Example: positive chime
export const WRONG_SOUND_URL = 'https://www.soundjay.com/misc/sounds/fail-buzzer-01.mp3'; // Example: buzz sound
export const GAME_SUCCESS_SOUND_URL = 'https://www.soundjay.com/misc/sounds/success-sound-2.mp3'; // Example: celebratory sound
export const GAME_FAIL_SOUND_URL = 'https://www.soundjay.com/misc/sounds/error.mp3'; // Example: gentle "try again" sound
