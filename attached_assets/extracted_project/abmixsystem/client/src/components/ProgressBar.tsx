import React from 'react';
import { calculateProposalProgress, getProgressColor, getProgressText, getProgressDetails } from '@shared/progressCalculator';

interface ProgressBarProps {
  proposal: any;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  proposal, 
  showDetails = false, 
  size = 'md',
  orientation = 'horizontal',
  className = '' 
}) => {
  // Calcula o progresso baseado nos dados da proposta
  const proposalData = {
    titulares: proposal.titulares || [],
    dependentes: proposal.dependentes || [],
    clientAttachments: proposal.clientAttachments || [],
    clientCompleted: proposal.clientCompleted || false
  };

  const progress = calculateProposalProgress(proposalData);
  const progressColor = getProgressColor(progress);
  const progressText = getProgressText(progress, proposalData.clientCompleted);
  const details = showDetails ? getProgressDetails(proposalData) : null;

  // Configurações de tamanho
  const sizeConfig = {
    sm: orientation === 'horizontal' ? 'h-2' : 'w-2 h-16',
    md: orientation === 'horizontal' ? 'h-3' : 'w-3 h-20', 
    lg: orientation === 'horizontal' ? 'h-4' : 'w-4 h-24'
  };

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <div className={`bg-gray-200 rounded-full ${sizeConfig[size]} relative overflow-hidden`}>
          <div 
            className={`${progressColor} transition-all duration-300 ease-in-out rounded-full absolute bottom-0 left-0 right-0`}
            style={{ height: `${progress}%` }}
          />
        </div>
        <div className={`${textSize[size]} font-medium text-center text-gray-700`}>
          {progress}%
        </div>
        {showDetails && (
          <div className={`${textSize[size]} text-center text-gray-500`}>
            {progressText}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className={`${textSize[size]} font-medium text-gray-700`}>
          {progress}%
        </span>
        <span className={`${textSize[size]} text-gray-500`}>
          {progressText}
        </span>
      </div>
      
      <div className={`bg-gray-200 rounded-full ${sizeConfig[size]} overflow-hidden`}>
        <div 
          className={`${progressColor} transition-all duration-500 ease-in-out rounded-full h-full`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {showDetails && details && (
        <div className="mt-3 space-y-2">
          <div className={`${textSize[size]} text-gray-600`}>
            <strong>Detalhes do Progresso:</strong>
          </div>
          
          {details.titulares.length > 0 && (
            <div className="space-y-1">
              <div className={`${textSize[size]} font-medium text-gray-700`}>Titulares:</div>
              {details.titulares.map((titular, index) => (
                <div key={index} className={`${textSize[size]} text-gray-600 ml-2`}>
                  • {titular.name || `Titular ${titular.index}`}: {titular.progress}%
                </div>
              ))}
            </div>
          )}

          {details.dependentes.length > 0 && (
            <div className="space-y-1">
              <div className={`${textSize[size]} font-medium text-gray-700`}>Dependentes:</div>
              {details.dependentes.map((dependente, index) => (
                <div key={index} className={`${textSize[size]} text-gray-600 ml-2`}>
                  • {dependente.name || `Dependente ${dependente.index}`}: {dependente.progress}%
                </div>
              ))}
            </div>
          )}

          {details.isCompleted && (
            <div className={`${textSize[size]} text-green-600 font-medium`}>
              ✓ Proposta enviada pelo cliente
            </div>
          )}

          {details.allFieldsFilled && !details.isCompleted && (
            <div className={`${textSize[size]} text-blue-600 font-medium`}>
              ✓ Todos os campos preenchidos - Aguardando envio
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;