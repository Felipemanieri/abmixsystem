import React, { useState, useEffect } from 'react';
import { CheckCircle, Trophy } from 'lucide-react';

interface ProposalProgressTrackerProps {
  contractData?: any;
  titulares?: any[];
  dependentes?: any[];
  attachments?: File[];
  className?: string;
  onProgressChange?: (progress: number) => void;
}

const ProposalProgressTracker: React.FC<ProposalProgressTrackerProps> = ({
  contractData,
  titulares = [],
  dependentes = [],
  attachments = [],
  className = '',
  onProgressChange
}) => {
  const [progress, setProgress] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  // Campos obrigatórios do contrato
  const requiredContractFields = [
    'nomeEmpresa',
    'cnpj',
    'planoContratado',
    'valor',
    'inicioVigencia'
  ];

  // Campos obrigatórios para pessoa (titular/dependente)
  const requiredPersonFields = [
    'nomeCompleto',
    'cpf',
    'rg',
    'dataNascimento',
    'nomeMae',
    'sexo',
    'estadoCivil',
    'emailPessoal',
    'telefonePessoal',
    'cep',
    'enderecoCompleto'
  ];

  const calculateProgress = () => {
    let totalRequiredFields = 0;
    let filledFields = 0;

    // Verificar campos do contrato
    totalRequiredFields += requiredContractFields.length;
    if (contractData) {
      filledFields += requiredContractFields.filter(field => 
        contractData[field] && contractData[field].toString().trim() !== ''
      ).length;
    }

    // Verificar pelo menos 1 titular
    if (titulares.length > 0) {
      totalRequiredFields += requiredPersonFields.length;
      const firstTitular = titulares[0];
      if (firstTitular) {
        filledFields += requiredPersonFields.filter(field => 
          firstTitular[field] && firstTitular[field].toString().trim() !== ''
        ).length;
      }
    } else {
      totalRequiredFields += requiredPersonFields.length;
    }

    // Verificar outros titulares (opcional)
    for (let i = 1; i < titulares.length; i++) {
      totalRequiredFields += requiredPersonFields.length;
      const titular = titulares[i];
      if (titular) {
        filledFields += requiredPersonFields.filter(field => 
          titular[field] && titular[field].toString().trim() !== ''
        ).length;
      }
    }

    // Verificar dependentes (opcional)
    dependentes.forEach(dependente => {
      if (dependente) {
        const dependenteFields = [...requiredPersonFields, 'parentesco'];
        totalRequiredFields += dependenteFields.length;
        filledFields += dependenteFields.filter(field => 
          dependente[field] && dependente[field].toString().trim() !== ''
        ).length;
      }
    });

    // Calcular porcentagem
    const calculatedProgress = totalRequiredFields > 0 
      ? Math.round((filledFields / totalRequiredFields) * 100) 
      : 0;

    return Math.min(calculatedProgress, 100);
  };

  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
    
    if (onProgressChange) {
      onProgressChange(newProgress);
    }

    // Mostrar parabéns quando atingir 100%
    if (newProgress === 100 && progress < 100) {
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 4000);
    }
  }, [contractData, titulares, dependentes, attachments]);

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

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Progresso do Preenchimento</h3>
        <span className={`text-sm font-semibold ${getProgressTextColor()}`}>
          {progress}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
        
        {/* Animação de brilho */}
        <div 
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"
          style={{ 
            transform: `translateX(${(progress / 100) * 100 - 20}%)`,
            transition: 'transform 1s ease-out'
          }}
        />
      </div>

      {/* Status textual */}
      <div className="mt-2 text-xs text-gray-600">
        {progress === 0 && 'Começe preenchendo os dados do contrato'}
        {progress > 0 && progress <= 30 && 'Continue preenchendo os dados obrigatórios'}
        {progress > 30 && progress <= 70 && 'Você está progredindo bem!'}
        {progress > 70 && progress < 100 && 'Quase concluído! Preencha os campos restantes'}
        {progress === 100 && 'Todos os dados obrigatórios preenchidos!'}
      </div>

      {/* Modal de Parabéns */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 text-center animate-bounceIn">
            <div className="mb-4">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Parabéns!</h2>
            <p className="text-gray-600 mb-4">
              Proposta preenchida com sucesso! Todos os dados obrigatórios foram completados.
            </p>
            <div className="flex items-center justify-center text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5 mr-2" />
              100% Concluído
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalProgressTracker;