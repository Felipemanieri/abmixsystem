// Sistema centralizado de status para propostas
export type ProposalStatus = 
  | 'pending_validation'     // Aguardando Validação (amarelo)
  | 'validated'             // Validado (azul) 
  | 'sent_to_automation'    // Enviado para Automação (roxo)
  | 'processing'            // Em Processamento (laranja)
  | 'completed'             // Concluído (verde)
  | 'rejected'              // Rejeitado (vermelho)
  | 'on_hold'               // Em Espera (cinza)

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export const STATUS_CONFIG: Record<ProposalStatus, StatusConfig> = {
  pending_validation: {
    label: 'Aguardando Validação',
    color: 'border-yellow-500',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    description: 'Proposta aguardando validação inicial'
  },
  validated: {
    label: 'Validado',
    color: 'border-blue-500',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    description: 'Proposta validada e aprovada'
  },
  sent_to_automation: {
    label: 'Enviado para Automação',
    color: 'border-purple-500',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    description: 'Em processo de automação'
  },
  processing: {
    label: 'Em Processamento',
    color: 'border-orange-500',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    description: 'Sendo processado pela equipe'
  },
  completed: {
    label: 'Concluído',
    color: 'border-green-500',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    description: 'Processo totalmente concluído'
  },
  rejected: {
    label: 'Rejeitado',
    color: 'border-red-500',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    description: 'Proposta rejeitada ou cancelada'
  },
  on_hold: {
    label: 'Em Espera',
    color: 'border-gray-500',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    description: 'Processo pausado temporariamente'
  }
};

// Simulação de storage em memória para sincronização entre portais
class StatusManager {
  private static instance: StatusManager;
  private statusData: Map<string, ProposalStatus> = new Map();
  private listeners: Array<(proposalId: string, newStatus: ProposalStatus) => void> = [];

  public static getInstance(): StatusManager {
    if (!StatusManager.instance) {
      StatusManager.instance = new StatusManager();
    }
    return StatusManager.instance;
  }

  // Inicializar com dados mock
  constructor() {
    this.statusData.set('VEND001-PROP123', 'pending_validation');
    this.statusData.set('VEND002-PROP124', 'pending_validation');
    this.statusData.set('VEND001-PROP125', 'validated');
    this.statusData.set('VEND003-PROP126', 'sent_to_automation');
    this.statusData.set('VEND002-PROP127', 'processing');
    this.statusData.set('VEND001-PROP128', 'completed');
  }

  public getStatus(proposalId: string): ProposalStatus {
    return this.statusData.get(proposalId) || 'pending_validation';
  }

  public updateStatus(proposalId: string, newStatus: ProposalStatus): void {
    this.statusData.set(proposalId, newStatus);
    this.notifyListeners(proposalId, newStatus);
  }

  public subscribe(callback: (proposalId: string, newStatus: ProposalStatus) => void): void {
    this.listeners.push(callback);
  }

  public unsubscribe(callback: (proposalId: string, newStatus: ProposalStatus) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(proposalId: string, newStatus: ProposalStatus): void {
    this.listeners.forEach(listener => listener(proposalId, newStatus));
  }
}

export default StatusManager;