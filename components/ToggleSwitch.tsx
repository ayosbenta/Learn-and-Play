// components/ToggleSwitch.tsx
import React, { useState } from 'react';

interface ToggleSwitchProps {
  label: string;
  initialState: boolean;
  onToggle: (state: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, initialState, onToggle }) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle(newState);
  };

  return (
    <div className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg shadow-sm">
      <span className="text-base text-gray-700 font-medium">{label}</span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          isOn ? 'bg-blue-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={isOn}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;