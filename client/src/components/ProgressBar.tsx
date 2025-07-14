import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface ProgressBarProps {
  proposal: any;
  className?: string;
  detailed?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ proposal, className = '', detailed = false }) => {
  const calculateProgress = () => {
    let progress = 20; // Base: proposta criada
    
    if (proposal.titulares?.length > 0 && proposal.titulares[0]?.nomeCompleto) {
      progress += 30; // Titulares preenchidos
    }
    
    if (proposal.clientAttachments?.length > 0) {
      progress += 30; // Documentos anexados
    }
    
    if (proposal.clientCompleted) {
      progress += 20; // Cliente completou
    }
    
    return Math.min(progress, 100);
  };

  const progress = calculateProgress();

  const getSteps = () => {
    const steps = [
      {
        name: 'Proposta Criada',
        completed: true,
        icon: CheckCircle
      },
      {
        name: 'Dados Pessoais',
        completed: proposal.titulares?.length > 0 && proposal.titulares[0]?.nomeCompleto,
        icon: proposal.titulares?.length > 0 && proposal.titulares[0]?.nomeCompleto ? CheckCircle : Clock
      },
      {
        name: 'Documentos',
        completed: proposal.clientAttachments?.length > 0,
        icon: proposal.clientAttachments?.length > 0 ? CheckCircle : Clock
      },
      {
        name: 'Finalizado',
        completed: proposal.clientCompleted,
        icon: proposal.clientCompleted ? CheckCircle : Clock
      }
    ];
    return steps;
  };

  if (detailed) {
    const steps = getSteps();
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso da Proposta</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center space-x-2">
                <Icon 
                  className={`w-4 h-4 ${
                    step.completed 
                      ? 'text-green-500' 
                      : 'text-gray-400'
                  }`}
                />
                <span className={`text-xs ${
                  step.completed 
                    ? 'text-green-700 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              progress < 30 ? 'bg-red-500' :
              progress < 60 ? 'bg-yellow-500' :
              progress < 90 ? 'bg-blue-500' :
              'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600 font-medium min-w-[35px]">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;