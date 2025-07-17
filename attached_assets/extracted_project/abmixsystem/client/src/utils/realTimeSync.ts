// Sistema de sincronização em tempo real para propagação instantânea de dados
import { queryClient } from '@/lib/queryClient';

class RealTimeSync {
  private static instance: RealTimeSync;
  
  public static getInstance(): RealTimeSync {
    if (!RealTimeSync.instance) {
      RealTimeSync.instance = new RealTimeSync();
    }
    return RealTimeSync.instance;
  }
  
  // Força atualização imediata de todas as consultas de propostas
  public forceUpdateAllProposals(): void {
    console.log('🔄 Forcing immediate update of all proposals');
    
    // Invalidar todas as consultas de propostas
    queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
    
    // Invalidar consultas específicas de vendedores
    queryClient.invalidateQueries({ 
      predicate: (query) => {
        return query.queryKey[0] === '/api/proposals/vendor';
      }
    });
    
    // Invalidar consultas de propostas individuais
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey[0] === '/api/proposals/client';
      }
    });
    
    // Forçar refetch imediato
    queryClient.refetchQueries({ queryKey: ['/api/proposals'] });
    
    console.log('✅ All proposal queries invalidated and refetched');
  }
  
  // Força atualização quando vendedor específico cria proposta
  public notifyProposalCreated(vendorId: number): void {
    console.log(`🆕 New proposal created by vendor ${vendorId}`);
    
    // Atualizar imediatamente todas as consultas
    this.forceUpdateAllProposals();
    
    // Atualizar especificamente as propostas do vendedor
    queryClient.invalidateQueries({ queryKey: ['/api/proposals/vendor', vendorId] });
    queryClient.refetchQueries({ queryKey: ['/api/proposals/vendor', vendorId] });
    
    console.log(`✅ Vendor ${vendorId} proposals updated immediately`);
  }
  
  // Força atualização quando status de proposta muda
  public notifyProposalUpdated(proposalId: string): void {
    console.log(`📝 Proposal ${proposalId} updated`);
    this.forceUpdateAllProposals();
  }
  
  // Alias para forceUpdateAllProposals - usado pelos portais
  public forceRefresh(): void {
    this.forceUpdateAllProposals();
  }
  
  // Configurar polling moderado para evitar sobrecarga
  public enableAggressivePolling(): void {
    console.log('⚡ Enabling moderate polling for performance');
    
    setInterval(() => {
      // Invalidar queries sem fazer refetch completo
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] }, { refetchType: 'none' });
    }, 60000); // A cada 60 segundos - muito mais eficiente
  }
}

export const realTimeSync = RealTimeSync.getInstance();

// Hook personalizado para notificações de mudança
export function useRealTimeNotifications() {
  const notifyCreated = (vendorId: number) => {
    realTimeSync.notifyProposalCreated(vendorId);
  };
  
  const notifyUpdated = (proposalId: string) => {
    realTimeSync.notifyProposalUpdated(proposalId);
  };
  
  const forceUpdate = () => {
    realTimeSync.forceUpdateAllProposals();
  };
  
  return {
    notifyCreated,
    notifyUpdated,
    forceUpdate
  };
}