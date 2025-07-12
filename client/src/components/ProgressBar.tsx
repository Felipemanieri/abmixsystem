import React, { useState, useEffect } from 'react';
import { CheckCircle, Star } from 'lucide-react';

interface ProgressBarProps {
  proposal: any;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ proposal, className = '' }) => {
  const [progress, setProgress] = useState(0);

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
    setProgress(newProgress);
  }, [proposal]);

  const getProgressColor = () => {
    if (progress <= 30) return 'bg-gradient-to-r from-red-400 to-red-500';
    if (progress <= 70) return 'bg-gradient-to-r from-amber-400 to-amber-500';
    return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
  };

  const getProgressTextColor = () => {
    if (progress <= 30) return 'text-red-500';
    if (progress <= 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">Progresso</span>
        <span className={`text-xs font-semibold ${getProgressTextColor()}`}>
          {progress}%
        </span>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ease-in-out ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-1">
        <div className="text-xs text-gray-500">
          {progress < 100 ? (
            <span>
              {progress <= 30 ? 'Dados básicos necessários' : 
               progress <= 70 ? 'Progresso em andamento' : 
               'Finalização pendente'}
            </span>
          ) : (
            <span className="text-emerald-600">Todos os campos preenchidos</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;