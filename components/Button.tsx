// components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  let baseStyles = 'flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantStyles = '';
  let sizeStyles = '';
  let iconSpacing = icon ? 'gap-2' : '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-lg hover:shadow-xl';
      break;
    case 'secondary':
      variantStyles = 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500 shadow-lg hover:shadow-xl';
      break;
    case 'outline':
      variantStyles = 'bg-white text-gray-700 border-2 border-blue-400 hover:border-blue-500 hover:text-blue-600 focus:ring-blue-400';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300';
      break;
  }

  switch (size) {
    case 'sm':
      sizeStyles = 'px-4 py-2 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-6 py-3 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-8 py-4 text-lg';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${iconSpacing} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
