// components/Navbar.tsx
import React from 'react';
import { AppSection, NavItem } from '../types';
import { NAV_ITEMS } from '../constants';

interface NavbarProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-xl rounded-t-3xl p-3 md:p-4 z-20">
      <ul className="flex justify-around items-center max-w-screen-lg mx-auto">
        {NAV_ITEMS.map((item: NavItem) => (
          <li key={item.id} className="flex-1 text-center">
            <button
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300
                          ${currentSection === item.id
                            ? 'bg-blue-500 text-white shadow-lg scale-110'
                            : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'}
                          md:text-lg text-sm font-semibold`}
            >
              <span className="mb-1">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
