import React from 'react';
import { CircleDot, Activity } from 'lucide-react';

interface AbmixLogoProps {
  className?: string;
  size?: number;
}

const AbmixLogo: React.FC<AbmixLogoProps> = ({ className = "", size = 40 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-2">
        <div className="absolute inset-0 bg-teal-500 rounded-full opacity-20"></div>
        <CircleDot 
          size={size} 
          className="text-teal-600" 
          strokeWidth={2.5}
        />
        <Activity 
          size={size * 0.6} 
          className="text-teal-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
          strokeWidth={3}
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-gray-800 text-xl leading-tight">Abmix</span>
        <span className="text-gray-500 text-xs leading-tight">Consultoria em Benefícios</span>
      </div>
    </div>
  );
};

export default AbmixLogo;