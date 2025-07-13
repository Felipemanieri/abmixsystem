// Sistema centralizado de status para propostas
export type ProposalStatus = 
  | 'observacao'               // OBSERVAÇÃO (azul claro)
  | 'analise'                  // ANALISE (verde claro)
  | 'assinatura_ds'            // ASSINATURA DS (amarelo escuro)
  | 'expirado'                 // EXPIRADO (azul forte)
  | 'implantado'               // IMPLANTADO (verde forte)
  | 'aguar_pagamento'          // AGUAR PAGAMENTO (rosa)
  | 'assinatura_proposta'      // ASSINATURA PROPOSTA (amarelo claro)
  | 'aguar_selecao_vigencia'   // AGUAR SELEÇÃO DE VIGENCIA (laranja)
  | 'pendencia'                // PENDÊNCIA (vermelho)
  | 'declinado'                // DECLINADO (roxo)
  | 'aguar_vigencia'           // AGUAR VIGÊNCIA (azul claro)

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export const STATUS_CONFIG: Record<ProposalStatus, StatusConfig> = {
  observacao: {
    label: 'OBSERVAÇÃO',
    color: 'border-sky-400',
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-700',
    description: 'Proposta com observações pendentes'
  },
  analise: {
    label: 'ANALISE',
    color: 'border-emerald-400',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    description: 'Proposta em análise técnica'
  },
  assinatura_ds: {
    label: 'ASSINATURA DS',
    color: 'border-amber-600',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    description: 'Aguardando assinatura digital'
  },
  expirado: {
    label: 'EXPIRADO',
    color: 'border-blue-700',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    description: 'Proposta expirada'
  },
  implantado: {
    label: 'IMPLANTADO',
    color: 'border-green-600',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    description: 'Processo completamente implantado'
  },
  aguar_pagamento: {
    label: 'AGUAR PAGAMENTO',
    color: 'border-pink-500',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700',
    description: 'Aguardando confirmação de pagamento'
  },
  assinatura_proposta: {
    label: 'ASSINATURA PROPOSTA',
    color: 'border-yellow-400',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    description: 'Aguardando assinatura da proposta'
  },
  aguar_selecao_vigencia: {
    label: 'AGUAR SELEÇÃO DE VIGENCIA',
    color: 'border-orange-500',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    description: 'Aguardando seleção de vigência'
  },
  pendencia: {
    label: 'PENDÊNCIA',
    color: 'border-red-500',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    description: 'Proposta com pendências'
  },
  declinado: {
    label: 'DECLINADO',
    color: 'border-purple-600',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    description: 'Proposta declinada'
  },
  aguar_vigencia: {
    label: 'AGUAR VIGÊNCIA',
    color: 'border-cyan-400',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-700',
    description: 'Aguardando definição de vigência'
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
    this.statusData.set('VEND001-PROP123', 'observacao');
    this.statusData.set('VEND002-PROP124', 'analise');
    this.statusData.set('VEND001-PROP125', 'assinatura_ds');
    this.statusData.set('VEND003-PROP126', 'expirado');
    this.statusData.set('VEND002-PROP127', 'implantado');
    this.statusData.set('VEND001-PROP128', 'aguar_pagamento');
    this.statusData.set('VEND003-PROP129', 'assinatura_proposta');
    this.statusData.set('VEND004-PROP130', 'aguar_selecao_vigencia');
    this.statusData.set('VEND002-PROP131', 'pendencia');
    this.statusData.set('VEND001-PROP132', 'declinado');
  }

  public getStatus(proposalId: string): ProposalStatus {
    return this.statusData.get(proposalId) || 'observacao';
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