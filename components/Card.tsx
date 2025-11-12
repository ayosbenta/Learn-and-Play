// components/Card.tsx
import React from 'react';

// Fix: Extend CardProps with React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 border-b-4 border-blue-200 transition-all duration-300 transform hover:scale-[1.01] ${className}`}
      {...props} // Pass through any additional props like onClick
    >
      {children}
    </div>
  );
};

export default Card;