import { ProposalStatus } from '../../../shared/statusSystem';

export interface ProposalData {
  id: string;
  clientToken: string;
  clientName: string;
  vendor: string;
  vendorId: number;
  plan: string;
  value: string;
  status: ProposalStatus;
  progress: number; // 0-100 baseado no preenchimento do cliente
  date: string;
  actions?: string[];
  contractData?: {
    nomeEmpresa: string;
    cnpj: string;
    planoContratado: string;
    valor: string;
    inicioVigencia: string;
  };
  titulares?: any[];
  dependentes?: any[];
  clientCompleted?: boolean;
}

class ProposalManager {
  private static instance: ProposalManager;
  private proposals: Map<string, ProposalData> = new Map();
  private listeners: Array<(proposals: ProposalData[]) => void> = [];

  public static getInstance(): ProposalManager {
    if (!ProposalManager.instance) {
      ProposalManager.instance = new ProposalManager();
    }
    return ProposalManager.instance;
  }

  // Gerar ID no formato ABM001, ABM002, etc.
  public generateId(): string {
    const count = this.proposals.size + 1;
    return `ABM${count.toString().padStart(3, '0')}`;
  }

  // Adicionar ou atualizar proposta
  public upsertProposal(proposal: ProposalData): void {
    this.proposals.set(proposal.id, proposal);
    this.notifyListeners();
  }

  // Obter proposta por ID
  public getProposal(id: string): ProposalData | undefined {
    return this.proposals.get(id);
  }

  // Obter todas as propostas
  public getAllProposals(): ProposalData[] {
    return Array.from(this.proposals.values());
  }

  // Obter propostas por vendedor
  public getProposalsByVendor(vendorId: number): ProposalData[] {
    return Array.from(this.proposals.values()).filter(p => p.vendorId === vendorId);
  }

  // Atualizar status da proposta
  public updateStatus(id: string, status: ProposalStatus): void {
    const proposal = this.proposals.get(id);
    if (proposal) {
      proposal.status = status;
      this.proposals.set(id, proposal);
      this.notifyListeners();
    }
  }

  // Atualizar progresso da proposta
  public updateProgress(id: string, progress: number): void {
    const proposal = this.proposals.get(id);
    if (proposal) {
      proposal.progress = progress;
      this.proposals.set(id, proposal);
      this.notifyListeners();
    }
  }

  // Marcar proposta como completada pelo cliente
  public markClientCompleted(clientToken: string): void {
    const proposal = Array.from(this.proposals.values()).find(p => p.clientToken === clientToken);
    if (proposal) {
      proposal.clientCompleted = true;
      proposal.progress = 100;
      this.proposals.set(proposal.id, proposal);
      this.notifyListeners();
    }
  }

  // Sincronizar com API quando proposta é criada
  public async syncFromAPI(proposalData: any): Promise<string> {
    const proposalId = this.generateId();
    
    // Calcular progresso baseado no preenchimento
    const progress = this.calculateProgress(proposalData);
    
    const proposal: ProposalData = {
      id: proposalId,
      clientToken: proposalData.clientToken,
      clientName: proposalData.contractData?.nomeEmpresa || 'Cliente',
      vendor: proposalData.vendorName || 'Vendedor',
      vendorId: proposalData.vendorId,
      plan: proposalData.contractData?.planoContratado || 'Plano',
      value: proposalData.contractData?.valor || '0',
      status: 'observacao' as ProposalStatus,
      progress: progress,
      date: new Date().toLocaleDateString('pt-BR'),
      contractData: proposalData.contractData,
      titulares: proposalData.titulares || [],
      dependentes: proposalData.dependentes || [],
      clientCompleted: proposalData.clientCompleted || false
    };

    this.upsertProposal(proposal);
    return proposalId;
  }

  // Calcular progresso baseado no preenchimento dos dados
  private calculateProgress(proposalData: any): number {
    if (!proposalData) return 0;
    
    let totalFields = 0;
    let filledFields = 0;

    // Contar campos do contrato
    if (proposalData.contractData) {
      const contractFields = ['nomeEmpresa', 'cnpj', 'planoContratado', 'valor', 'inicioVigencia'];
      totalFields += contractFields.length;
      filledFields += contractFields.filter(field => proposalData.contractData[field]).length;
    }

    // Contar campos dos titulares
    if (proposalData.titulares && proposalData.titulares.length > 0) {
      proposalData.titulares.forEach(titular => {
        const titularFields = ['nomeCompleto', 'cpf', 'rg', 'dataNascimento', 'emailPessoal'];
        totalFields += titularFields.length;
        filledFields += titularFields.filter(field => titular[field]).length;
      });
    }

    // Contar campos dos dependentes
    if (proposalData.dependentes && proposalData.dependentes.length > 0) {
      proposalData.dependentes.forEach(dependente => {
        const dependenteFields = ['nomeCompleto', 'cpf', 'dataNascimento', 'parentesco'];
        totalFields += dependenteFields.length;
        filledFields += dependenteFields.filter(field => dependente[field]).length;
      });
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  }

  // Subscribir para mudanças
  public subscribe(callback: (proposals: ProposalData[]) => void): void {
    this.listeners.push(callback);
  }

  // Unsubscribe
  public unsubscribe(callback: (proposals: ProposalData[]) => void): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notificar listeners
  private notifyListeners(): void {
    const proposals = this.getAllProposals();
    this.listeners.forEach(callback => callback(proposals));
  }
}

export default ProposalManager;