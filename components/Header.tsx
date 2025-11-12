// components/Header.tsx
import React from 'react';
import { MASCOT_NAME, MASCOT_IMAGE_URL } from '../constants';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="relative bg-white shadow-md p-4 md:p-6 flex items-center justify-between z-10 rounded-b-3xl">
      <div className="flex items-center">
        <img
          src={MASCOT_IMAGE_URL}
          alt={`${MASCOT_NAME} Mascot`}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-blue-400 object-cover mr-4 animate-bounce-slow"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700">Learn & Play World</h1>
          <p className="text-sm md:text-base text-gray-600">Hi, <span className="font-semibold text-purple-600">{userName}</span>! Ready to learn and play?</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

// Simple keyframe animation for the bounce effect
// Note: In a real Tailwind setup, this might be in a CSS file or extend the config.
// For CDN, we can just apply a direct class that uses a simple animation.
// Since we don't use .css files, this is a theoretical class.
// For this example, I'll rely on a simple class without complex keyframes via CDN.
// If I were to implement this using custom CSS, it would look like:
// @keyframes bounce-slow {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
// }
// .animate-bounce-slow {
//   animation: bounce-slow 3s infinite ease-in-out;
// }
