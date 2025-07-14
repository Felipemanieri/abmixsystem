import React, { useState } from 'react';
import { X, Search, Filter, User, Calendar, FileText, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { ProposalStatus } from '../../../shared/statusSystem';

interface ProposalSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProposal: (proposalId: string) => void;
}

interface ProposalItem {
  id: string;
  abmId: string;
  client: string;
  vendor: string;
  plan: string;
  value: string;
  status: ProposalStatus;
  submissionDate: string;
  documents: number;
  priority: 'low' | 'medium' | 'high';
  progress: number;
}

const ProposalSelector: React.FC<ProposalSelectorProps> = ({ isOpen, onClose, onSelectProposal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');

  const mockProposals: ProposalItem[] = [
    {
      id: 'VEND001-PROP123',
      abmId: 'ABM001',
      client: 'Tech Solutions Ltda',
      vendor: 'Carlos Vendedor',
      plan: 'Plano Empresarial Premium',
      value: 'R$ 1.250,00',
      status: 'analise',
      submissionDate: '2024-01-15',
      documents: 8,
      priority: 'high',
      progress: 85
    },
    {
      id: 'VEND002-PROP124',
      abmId: 'ABM002',
      client: 'Inovação Digital Corp',
      vendor: 'Ana Vendedora',
      plan: 'Plano Família Premium',
      value: 'R$ 890,00',
      status: 'pendencia',
      submissionDate: '2024-01-14',
      documents: 6,
      priority: 'medium',
      progress: 60
    },
    {
      id: 'VEND003-PROP125',
      abmId: 'ABM003',
      client: 'Construtora Alpha',
      vendor: 'Roberto Silva',
      plan: 'Plano Individual Plus',
      value: 'R$ 450,00',
      status: 'implantado',
      submissionDate: '2024-01-13',
      documents: 12,
      priority: 'low',
      progress: 100
    },
    {
      id: 'VEND004-PROP126',
      abmId: 'ABM004',
      client: 'Startup Moderna',
      vendor: 'Diana Santos',
      plan: 'Plano Empresarial Standard',
      value: 'R$ 780,00',
      status: 'assinatura_proposta',
      submissionDate: '2024-01-12',
      documents: 9,
      priority: 'high',
      progress: 75
    },
    {
      id: 'VEND005-PROP127',
      abmId: 'ABM005',
      client: 'Consultoria Avançada',
      vendor: 'Eduardo Lima',
      plan: 'Plano Família Standard',
      value: 'R$ 650,00',
      status: 'aguar_pagamento',
      submissionDate: '2024-01-11',
      documents: 7,
      priority: 'medium',
      progress: 90
    },
    {
      id: 'VEND006-PROP128',
      abmId: 'ABM006',
      client: 'Mercado Central S/A',
      vendor: 'Fernanda Costa',
      plan: 'Plano Empresarial Premium',
      value: 'R$ 1.400,00',
      status: 'observacao',
      submissionDate: '2024-01-10',
      documents: 5,
      priority: 'high',
      progress: 45
    }
  ];

  const vendors = Array.from(new Set(mockProposals.map(p => p.vendor)));

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = 
      proposal.abmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || proposal.priority === priorityFilter;
    const matchesVendor = vendorFilter === 'all' || proposal.vendor === vendorFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesVendor;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-4xl">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Selecionar Proposta</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por ID, cliente ou vendedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="observacao">OBSERVAÇÃO</option>
                  <option value="analise">ANALISE</option>
                  <option value="assinatura_ds">ASSINATURA DS</option>
                  <option value="expirado">EXPIRADO</option>
                  <option value="implantado">IMPLANTADO</option>
                  <option value="aguar_pagamento">AGUAR PAGAMENTO</option>
                  <option value="assinatura_proposta">ASSINATURA PROPOSTA</option>
                  <option value="aguar_selecao_vigencia">AGUAR SELEÇÃO DE VIGENCIA</option>
                  <option value="pendencia">PENDÊNCIA</option>
                  <option value="declinado">DECLINADO</option>
                  <option value="aguar_vigencia">AGUAR VIGÊNCIA</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas as Prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>

                {/* Vendor Filter */}
                <select
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os Vendedores</option>
                  {vendors.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4">
                <div className="text-sm text-gray-600 mb-4">
                  {filteredProposals.length} proposta(s) encontrada(s)
                </div>

                <div className="space-y-4">
                  {filteredProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        onSelectProposal(proposal.id);
                        onClose();
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg font-semibold text-blue-600">
                              {proposal.abmId}
                            </span>
                            <StatusBadge status={proposal.status} />
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(proposal.priority)}`}>
                              {getPriorityText(proposal.priority)}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">{proposal.client}</h3>
                          <p className="text-sm text-gray-600">{proposal.plan}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">{proposal.value}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(proposal.submissionDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {proposal.vendor}
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {proposal.documents} docs
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-600">
                            Progresso: {proposal.progress}%
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${proposal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            ID: {proposal.id}
                          </div>
                          <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                            <Eye className="w-4 h-4 mr-1" />
                            Abrir para Edição
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProposals.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma proposta encontrada</h3>
                    <p className="text-gray-600">Tente ajustar os filtros de busca</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalSelector;