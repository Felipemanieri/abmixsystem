// Sistema de cálculo de progresso baseado no preenchimento de campos obrigatórios

export interface PersonData {
  id: string;
  nomeCompleto: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  parentesco?: string;
  nomeMae: string;
  sexo: 'masculino' | 'feminino' | '';
  estadoCivil: string;
  peso: string;
  altura: string;
  emailPessoal: string;
  telefonePessoal: string;
  emailEmpresa: string;
  telefoneEmpresa: string;
  cep: string;
  enderecoCompleto: string;
  dadosReembolso: string;
}

export interface ProposalData {
  titulares: PersonData[];
  dependentes: PersonData[];
  clientAttachments?: any[];
  clientCompleted?: boolean;
}

// Campos obrigatórios para titular
const REQUIRED_TITULAR_FIELDS = [
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
  'enderecoCompleto',
  'dadosReembolso'
];

// Campos obrigatórios para dependente (inclui parentesco)
const REQUIRED_DEPENDENTE_FIELDS = [
  'nomeCompleto',
  'cpf',
  'rg',
  'dataNascimento', 
  'parentesco',
  'nomeMae',
  'sexo',
  'estadoCivil',
  'emailPessoal',
  'telefonePessoal',
  'cep',
  'enderecoCompleto',
  'dadosReembolso'
];

/**
 * Calcula a porcentagem de campos preenchidos para uma pessoa
 */
export function calculatePersonProgress(person: PersonData, isTitular: boolean = true): number {
  const requiredFields = isTitular ? REQUIRED_TITULAR_FIELDS : REQUIRED_DEPENDENTE_FIELDS;
  
  let filledFields = 0;
  
  for (const field of requiredFields) {
    const value = person[field as keyof PersonData];
    if (value && value.toString().trim() !== '') {
      filledFields++;
    }
  }
  
  return Math.round((filledFields / requiredFields.length) * 100);
}

/**
 * Calcula o progresso total da proposta
 */
export function calculateProposalProgress(proposalData: ProposalData): number {
  // Se a proposta foi completada pelo cliente, é 100%
  if (proposalData.clientCompleted) {
    return 100;
  }

  // Deve ter pelo menos 1 titular
  if (!proposalData.titulares || proposalData.titulares.length === 0) {
    return 0;
  }

  let totalProgress = 0;
  let totalPeople = 0;

  // Calcula progresso dos titulares
  for (const titular of proposalData.titulares) {
    totalProgress += calculatePersonProgress(titular, true);
    totalPeople++;
  }

  // Calcula progresso dos dependentes
  if (proposalData.dependentes && proposalData.dependentes.length > 0) {
    for (const dependente of proposalData.dependentes) {
      totalProgress += calculatePersonProgress(dependente, false);
      totalPeople++;
    }
  }

  // Retorna a média ponderada
  if (totalPeople === 0) return 0;
  
  const averageProgress = Math.round(totalProgress / totalPeople);
  
  // Se todos os campos estão preenchidos mas ainda não foi enviado, fica em 95%
  if (averageProgress >= 100 && !proposalData.clientCompleted) {
    return 95;
  }
  
  return averageProgress;
}

/**
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
export function areAllRequiredFieldsFilled(proposalData: ProposalData): boolean {
  // Deve ter pelo menos 1 titular
  if (!proposalData.titulares || proposalData.titulares.length === 0) {
    return false;
  }

  // Verifica titulares
  for (const titular of proposalData.titulares) {
    if (calculatePersonProgress(titular, true) < 100) {
      return false;
    }
  }

  // Verifica dependentes (se existirem)
  if (proposalData.dependentes && proposalData.dependentes.length > 0) {
    for (const dependente of proposalData.dependentes) {
      if (calculatePersonProgress(dependente, false) < 100) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Obtém detalhes sobre o progresso para debug
 */
export function getProgressDetails(proposalData: ProposalData) {
  const details = {
    overallProgress: calculateProposalProgress(proposalData),
    isCompleted: proposalData.clientCompleted || false,
    allFieldsFilled: areAllRequiredFieldsFilled(proposalData),
    titulares: proposalData.titulares?.map((titular, index) => ({
      index: index + 1,
      name: titular.nomeCompleto || `Titular ${index + 1}`,
      progress: calculatePersonProgress(titular, true)
    })) || [],
    dependentes: proposalData.dependentes?.map((dependente, index) => ({
      index: index + 1,
      name: dependente.nomeCompleto || `Dependente ${index + 1}`,
      progress: calculatePersonProgress(dependente, false)
    })) || []
  };

  return details;
}

/**
 * Obtém a cor da barra de progresso baseada na porcentagem
 */
export function getProgressColor(progress: number): string {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-orange-500';
  return 'bg-red-500';
}

/**
 * Obtém o texto descritivo do progresso
 */
export function getProgressText(progress: number, isCompleted: boolean): string {
  if (isCompleted) return 'Concluído';
  if (progress >= 95) return 'Pronto para envio';
  if (progress >= 75) return 'Quase completo';
  if (progress >= 50) return 'Em andamento';
  if (progress >= 25) return 'Iniciado';
  return 'Aguardando preenchimento';
}