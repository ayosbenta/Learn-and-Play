// components/RewardItem.tsx
import React from 'react';

interface RewardItemProps {
  name: string;
  imageSrc: string;
  description: string;
}

const RewardItem: React.FC<RewardItemProps> = ({ name, imageSrc, description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center border border-gray-200 hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1">
      <img src={imageSrc} alt={name} className="w-24 h-24 object-contain mb-3" />
      <h4 className="text-lg font-bold text-gray-800 mb-1">{name}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default RewardItem;
