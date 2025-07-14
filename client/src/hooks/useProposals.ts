import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export interface ProposalData {
  id: string;
  abmId: string;
  vendorId: number;
  clientToken: string;
  contractData: {
    nomeEmpresa: string;
    cnpj: string;
    planoContratado: string;
    valor: string;
    inicioVigencia: string;
    odontoConjugado: boolean;
    compulsorio: boolean;
    periodoMinimo: string;
    livreAdesao: boolean;
    aproveitamentoCongenere: boolean;
    periodoVigencia: {
      inicio: string;
      fim: string;
    };
  };
  titulares: any[];
  dependentes: any[];
  internalData: any;
  vendorAttachments: any[];
  clientAttachments: any[];
  clientCompleted: boolean;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  // Campos calculados
  cliente: string;
  plano: string;
  valor: string;
  vendedor?: string;
  progresso: number;
}

export function useProposals() {
  const queryClient = useQueryClient();
  
  const { data: proposals = [], isLoading, error } = useQuery({
    queryKey: ['/api/proposals'],
    queryFn: async () => {
      const response = await fetch('/api/proposals');
      if (!response.ok) {
        throw new Error('Erro ao carregar propostas');
      }
      return response.json();
    },
    select: (data: any[]) => {
      console.log('Dados recebidos da API:', data);
      return data.map((proposal): ProposalData => ({
        ...proposal,
        cliente: proposal.contractData?.nomeEmpresa || 'N/A',
        plano: proposal.contractData?.planoContratado || 'N/A',
        valor: proposal.contractData?.valor || '0',
        progresso: calculateProgress(proposal),
        priority: proposal.priority || 'medium' // Garantir que priority existe
      }));
    },
    refetchInterval: 1000, // Atualizar a cada 1 segundo para tempo real
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['/api/vendors'],
  });

  // Adicionar nome do vendedor às propostas
  const proposalsWithVendor = proposals.map(proposal => ({
    ...proposal,
    vendedor: vendors.find((v: any) => v.id === proposal.vendorId)?.name || 'N/A'
  }));

  return {
    proposals: proposalsWithVendor,
    isLoading,
    error,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['/api/proposals'] })
  };
}

export function useVendorProposals(vendorId: number) {
  const queryClient = useQueryClient();
  
  const { data: proposals = [], isLoading, error } = useQuery({
    queryKey: ['/api/proposals/vendor', vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/proposals/vendor/${vendorId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar propostas do vendedor');
      }
      return response.json();
    },
    select: (data: any[]) => {
      console.log(`Propostas do vendedor ${vendorId}:`, data);
      return data.map((proposal): ProposalData => ({
        ...proposal,
        cliente: proposal.contractData?.nomeEmpresa || 'N/A',
        plano: proposal.contractData?.planoContratado || 'N/A',
        valor: proposal.contractData?.valor || '0',
        progresso: calculateProgress(proposal),
        priority: proposal.priority || 'medium'
      }));
    },
    refetchInterval: 1000, // Atualizar a cada 1 segundo para tempo real
    enabled: vendorId > 0, // Só fazer a consulta se o vendorId for válido
  });

  return {
    proposals,
    isLoading,
    error,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['/api/proposals/vendor', vendorId] })
  };
}

function calculateProgress(proposal: any): number {
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
}

// Hook para atualização em tempo real via polling
export function useRealTimeProposals(vendorId?: number) {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      // Invalidar consultas gerais
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      
      // Se for um vendedor específico, invalidar também suas propostas
      if (vendorId) {
        queryClient.invalidateQueries({ queryKey: ['/api/proposals/vendor', vendorId] });
      }
      
      setLastUpdate(Date.now());
    }, 1000); // Atualizar a cada 1 segundo para tempo real

    return () => clearInterval(interval);
  }, [queryClient, vendorId]);

  return { lastUpdate };
}