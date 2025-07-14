import React from 'react';

interface AbmixLogoProps {
  className?: string;
  size?: number;
}

export default function AbmixLogo({ className = '', size = 40 }: AbmixLogoProps) {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="8" fill="#0891B2" />
        <text 
          x="20" 
          y="28" 
          textAnchor="middle" 
          fontSize="16" 
          fontWeight="bold" 
          fill="white"
        >
          A
        </text>
      </svg>
    </div>
  );
}