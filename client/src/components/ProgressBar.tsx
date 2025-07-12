import React, { useState, useEffect } from 'react';
import { CheckCircle, Star } from 'lucide-react';

interface ProgressBarProps {
  proposal: any;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ proposal, className = '' }) => {
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Campos obrigatórios para calcular o progresso
  const calculateProgress = (proposal: any) => {
    const requiredFields = [
      'client',      // Nome do cliente
      'plan',        // Plano contratado
      'value',       // Valor
      'empresa',     // Nome da empresa
      'cnpj',        // CNPJ
      'vendedor',    // Vendedor responsável
      'email',       // Email de contato
      'phone',       // Telefone
      'date',        // Data de criação
      'status'       // Status da proposta
    ];

    let filledFields = 0;
    requiredFields.forEach(field => {
      if (proposal[field] && proposal[field].toString().trim() !== '') {
        filledFields++;
      }
    });

    // Considera documentos como campo adicional
    if (proposal.documents && proposal.documents > 0) {
      filledFields++;
    }

    const totalFields = requiredFields.length + 1; // +1 para documentos
    return Math.round((filledFields / totalFields) * 100);
  };

  useEffect(() => {
    const newProgress = calculateProgress(proposal);
    
    // Animação suave da barra
    const timer = setTimeout(() => {
      setProgress(newProgress);
      
      // Mostrar celebração quando atingir 100%
      if (newProgress === 100 && !showCelebration) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000); // Remove após 3 segundos
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [proposal, showCelebration]);

  const getProgressColor = () => {
    if (progress <= 30) return 'bg-red-500';
    if (progress <= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressTextColor = () => {
    if (progress <= 30) return 'text-red-600';
    if (progress <= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBackgroundColor = () => {
    if (progress <= 30) return 'bg-red-50';
    if (progress <= 70) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Barra de Progresso */}
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Progresso</span>
            <span className={`text-xs font-bold ${getProgressTextColor()}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-700 ease-out ${getProgressColor()}`}
              style={{ 
                width: `${progress}%`,
                transform: `translateX(${progress === 0 ? '-100%' : '0%'})`,
                transition: 'width 0.7s ease-out, transform 0.7s ease-out'
              }}
            />
          </div>
        </div>
        
        {/* Ícone de status */}
        {progress === 100 && (
          <div className="flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600 animate-pulse" />
          </div>
        )}
      </div>

      {/* Mensagem de Celebração */}
      {showCelebration && progress === 100 && (
        <div className={`absolute top-0 left-0 right-0 -mt-8 p-2 rounded-md ${getBackgroundColor()} border border-green-200 z-10 animate-bounce`}>
          <div className="flex items-center justify-center space-x-2">
            <Star className="w-4 h-4 text-green-600 animate-spin" />
            <span className="text-xs font-bold text-green-700">
              Proposta concluída com sucesso!
            </span>
            <Star className="w-4 h-4 text-green-600 animate-spin" />
          </div>
        </div>
      )}

      {/* Detalhes do progresso (tooltip) */}
      <div className="mt-1">
        <div className="text-xs text-gray-500">
          {progress < 100 ? (
            <span>
              {progress <= 30 ? 'Dados básicos necessários' : 
               progress <= 70 ? 'Quase completa' : 
               'Finalizando detalhes'}
            </span>
          ) : (
            <span className="text-green-600 font-medium">✓ Todos os campos preenchidos</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;