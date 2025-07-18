import React from 'react';

interface SimpleProgressBarProps {
  percentage: number;
  className?: string;
  showLabel?: boolean;
}

const SimpleProgressBar: React.FC<SimpleProgressBarProps> = ({ 
  percentage, 
  className = '', 
  showLabel = true 
}) => {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              safePercentage < 30 ? 'bg-red-500' :
              safePercentage < 60 ? 'bg-yellow-500' :
              safePercentage < 90 ? 'bg-blue-500' :
              'bg-green-500'
            }`}
            style={{ width: `${safePercentage}%` }}
          ></div>
        </div>
        {showLabel && (
          <span className="text-xs text-gray-600 font-medium min-w-[35px]">
            {safePercentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default SimpleProgressBar;