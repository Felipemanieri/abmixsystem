import React from 'react';

interface AbmixLogoProps {
  className?: string;
  size?: number;
}

const AbmixLogo: React.FC<AbmixLogoProps> = ({ className = "", size = 40 }) => {
  // Calcular tamanhos baseados no tamanho principal
  const fontSize = Math.max(Math.floor(size / 2.5), 14);
  const subFontSize = Math.max(Math.floor(size / 5), 10);
  const circleSize = size * 0.9;
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo circular */}
      <div className="relative mr-3" style={{ width: circleSize, height: circleSize }}>
        <svg width={circleSize} height={circleSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Seção teal superior esquerda */}
          <path d="M50 0C22.4 0 0 22.4 0 50h50V0Z" fill="#0AB3B8" />
          
          {/* Seção teal inferior direita */}
          <path d="M50 100C77.6 100 100 77.6 100 50H50V100Z" fill="#0AB3B8" />
          
          {/* Seção cinza superior direita */}
          <path d="M50 0C77.6 0 100 22.4 100 50H50V0Z" fill="#9CA3AF" />
          
          {/* Seta branca */}
          <path d="M50 15C30.67 15 15 30.67 15 50H50V15Z" fill="white" />
          <path d="M50 85C69.33 85 85 69.33 85 50H50V85Z" fill="white" />
          <path d="M50 15C69.33 15 85 30.67 85 50H50V15Z" fill="white" />
        </svg>
      </div>
      
      {/* Texto */}
      <div className="flex flex-col">
        <span 
          className="font-bold leading-none" 
          style={{ 
            fontSize: `${fontSize}px`, 
            letterSpacing: '0.5px'
          }}
        >
          <span style={{ color: '#0AB3B8' }}>Ab</span><span style={{ color: '#9CA3AF' }}>mix</span>
        </span>
        <span 
          className="leading-tight" 
          style={{ 
            fontSize: `${subFontSize}px`, 
            color: '#9CA3AF',
            letterSpacing: '0.2px'
          }}
        >
          Consultoria em Benefícios
        </span>
      </div>
    </div>
  );
};

export default AbmixLogo;