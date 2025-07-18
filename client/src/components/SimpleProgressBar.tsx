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
        <div className="flex-1 bg-gray-200 dark:bg-gray-600 dark:bg-gray-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              safePercentage < 30 ? 'bg-red-50 dark:bg-red-9000' :
              safePercentage < 60 ? 'bg-yellow-50 dark:bg-yellow-9000' :
              safePercentage < 90 ? 'bg-blue-50 dark:bg-blue-9000' :
              'bg-green-50 dark:bg-green-9000'
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