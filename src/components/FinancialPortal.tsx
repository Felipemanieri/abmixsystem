import React, { useState } from 'react';
import { LogOut, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Send, User, FileText, Edit, Save, X, Plus, Trash2 } from 'lucide-react';

interface FinancialPortalProps {
  user: any;
  onLogout: () => void;
}

interface Proposal {
  id: string;
  client: string;
  vendor: string;
  plan: string;
  value: string;
  status: 'pending_validation' | 'validated' | 'sent_to_automation' | 'client_filling' | 'docs_pending' | 'completed';
  submissionDate: string;
  documents: number;
  observations?: string;
  financialNotes?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedValue?: string;
  commission?: string;
  paymentMethod?: string;
  installments?: string;
  discount?: string;
  additionalFees?: string;
  approvalDate?: string;
  rejectionReason?: string;
  automationDate?: string;
  customFields?: { [key: string]: string };
}

const FinancialPortal: React.FC<FinancialPortalProps> = ({ user, onLogout }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [editingProposal, setEditingProposal] = useState<string | null>(null);
  const [observations, setObservations] = useState('');
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 'VEND001-PROP123',
      client: 'Empresa ABC Ltda',
      vendor: 'Ana Caroline',
      plan: 'Plano Empresarial Premium',
      value: 'R$ 1.250,00',
      status: 'pending_validation',
      submissionDate: '2024-01-15',
      documents: 8,
      financialNotes: '',
      priority: 'high',
      estimatedValue: 'R$ 1.250,00',
      commission: 'R$ 125,00',
      paymentMethod: 'Cartão de Crédito',
      installments: '12x',
      discount: '0%',
      additionalFees: 'R$ 0,00',
      customFields: {}
    },
    {
      id: 'VEND002-PROP124',
      client: 'Tech Solutions SA',
      vendor: 'Bruna Garcia',
      plan: 'Plano Família Básico',
      value: 'R$ 650,00',
      status: 'client_filling',
      submissionDate: '2024-01-14',
      documents: 6,
      financialNotes: 'Cliente solicitou desconto',
      priority: 'medium',
      estimatedValue: 'R$ 585,00',
      commission: 'R$ 58,50',
      paymentMethod: 'Boleto',
      installments: '6x',
      discount: '10%',
      additionalFees: 'R$ 15,00',
      customFields: { 'Desconto Especial': '10%', 'Motivo': 'Cliente fidelidade' }
    },
    {
      id: 'VEND001-PROP125',
      client: 'Consultoria XYZ',
      vendor: 'Ana Caroline',
      plan: 'Plano Individual',
      value: 'R$ 320,00',
      status: 'validated',
      submissionDate: '2024-01-13',
      documents: 5,
      observations: 'Documentação completa e validada',
      financialNotes: 'Aprovado sem restrições',
      priority: 'low',
      estimatedValue: 'R$ 320,00',
      commission: 'R$ 32,00',
      paymentMethod: 'PIX',
      installments: '1x',
      discount: '0%',
      additionalFees: 'R$ 0,00',
      approvalDate: '2024-01-15',
      customFields: {}
    },
    {
      id: 'VEND003-PROP126',
      client: 'Inovação Digital',
      vendor: 'Carlos Silva',
      plan: 'Plano Empresarial',
      value: 'R$ 890,00',
      status: 'sent_to_automation',
      submissionDate: '2024-01-12',
      documents: 7,
      observations: 'Enviado para automação Make/Zapier',
      financialNotes: 'Processado com sucesso',
      priority: 'medium',
      estimatedValue: 'R$ 890,00',
      commission: 'R$ 89,00',
      paymentMethod: 'Cartão de Débito',
      installments: '3x',
      discount: '0%',
      additionalFees: 'R$ 25,00',
      approvalDate: '2024-01-14',
      automationDate: '2024-01-15',
      customFields: { 'Observação Especial': 'Cliente VIP' }
    },
  ]);

  const stats = [
    {
      name: 'Total de Propostas',
      value: proposals.length.toString(),
      change: 'Todas as propostas',
      changeType: 'neutral',
      icon: FileText,
      color: 'blue',
    },
    {
      name: 'Aguardando Validação',
      value: proposals.filter(p => p.status === 'pending_validation').length.toString(),
      change: 'Para revisar',
      changeType: 'warning',
      icon: AlertCircle,
      color: 'orange',
    },
    {
      name: 'Validadas',
      value: proposals.filter(p => p.status === 'validated').length.toString(),
      change: 'Prontas para envio',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green',
    },
    {
      name: 'Enviadas p/ Automação',
      value: proposals.filter(p => p.status === 'sent_to_automation').length.toString(),
      change: 'Processadas',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  const validateProposal = (proposalId: string) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { 
            ...proposal, 
            status: 'validated', 
            observations,
            approvalDate: new Date().toISOString().split('T')[0],
            financialNotes: proposal.financialNotes || 'Validado pelo financeiro'
          }
        : proposal
    ));
    setSelectedProposal(null);
    setObservations('');
    alert('Proposta validada com sucesso!');
  };

  const sendToAutomation = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal?.status !== 'validated') {
      alert('Apenas propostas validadas podem ser enviadas para automação!');
      return;
    }

    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { 
            ...proposal, 
            status: 'sent_to_automation',
            observations: observations || 'Enviado para automação Make/Zapier',
            automationDate: new Date().toISOString().split('T')[0],
            financialNotes: proposal.financialNotes + ' | Enviado para automação'
          }
        : proposal
    ));
    setSelectedProposal(null);
    setObservations('');
    alert('Proposta enviada para automação com sucesso!');
  };

  const updateProposal = (proposalId: string, field: keyof Proposal, value: any) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, [field]: value }
        : proposal
    ));
  };

  const addCustomField = (proposalId: string) => {
    if (!newFieldName.trim() || !newFieldValue.trim()) {
      alert('Por favor, preencha o nome e valor do campo');
      return;
    }

    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { 
            ...proposal, 
            customFields: { 
              ...proposal.customFields, 
              [newFieldName]: newFieldValue 
            }
          }
        : proposal
    ));
    
    setNewFieldName('');
    setNewFieldValue('');
  };

  const removeCustomField = (proposalId: string, fieldName: string) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { 
            ...proposal, 
            customFields: Object.fromEntries(
              Object.entries(proposal.customFields || {}).filter(([key]) => key !== fieldName)
            )
          }
        : proposal
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_validation':
        return 'bg-orange-100 text-orange-800';
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'sent_to_automation':
        return 'bg-purple-100 text-purple-800';
      case 'client_filling':
        return 'bg-blue-100 text-blue-800';
      case 'docs_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_validation':
        return 'Aguardando Validação';
      case 'validated':
        return 'Validado';
      case 'sent_to_automation':
        return 'Enviado p/ Automação';
      case 'client_filling':
        return 'Cliente Preenchendo';
      case 'docs_pending':
        return 'Documentos Pendentes';
      case 'completed':
        return 'Finalizada';
      default:
        return 'Desconhecido';
    }
  };

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

  const filteredProposals = proposals.filter(proposal => {
    if (selectedStatus === 'all') return true;
    return proposal.status === selectedStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/Logo Abmix.jpg" 
                  alt="Abmix" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Financeiro</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-2xl font-bold mb-2">Área Financeira - Acesso Total</h1>
          <p className="text-purple-100">Acesso completo a todas as propostas independente do status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'warning' ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Todas as Propostas - Acesso Total</h2>
              <p className="text-sm text-gray-600">Visualize e edite qualquer proposta independente do status</p>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todas as Propostas</option>
              <option value="pending_validation">Aguardando Validação</option>
              <option value="validated">Validadas</option>
              <option value="sent_to_automation">Enviadas p/ Automação</option>
              <option value="client_filling">Cliente Preenchendo</option>
              <option value="docs_pending">Documentos Pendentes</option>
              <option value="completed">Finalizadas</option>
            </select>
          </div>
        </div>

        {/* Proposals Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano / Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{proposal.client}</div>
                        <div className="text-sm text-gray-500">{proposal.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-gray-900">{proposal.vendor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proposal.plan}</div>
                      <div className="text-sm font-medium text-green-600">{proposal.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                        {getStatusText(proposal.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(proposal.priority || 'low')}`}>
                        {proposal.priority?.toUpperCase() || 'BAIXA'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(proposal.submissionDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedProposal(proposal.id)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                          title="Visualizar e editar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingProposal(proposal.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Edição rápida"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {(proposal.status === 'validated' || proposal.status === 'pending_validation') && (
                          <button 
                            onClick={() => sendToAutomation(proposal.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Enviar para automação"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proposal Detail Modal */}
        {selectedProposal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes Financeiros da Proposta
                  </h3>
                  <button 
                    onClick={() => setSelectedProposal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {(() => {
                  const proposal = proposals.find(p => p.id === selectedProposal);
                  if (!proposal) return null;
                  
                  return (
                    <div className="space-y-6">
                      {/* Informações Básicas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 border-b pb-2">Informações Básicas</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium text-gray-700">ID:</span> <span className="ml-2">{proposal.id}</span></div>
                            <div><span className="font-medium text-gray-700">Cliente:</span> <span className="ml-2">{proposal.client}</span></div>
                            <div><span className="font-medium text-gray-700">Vendedor:</span> <span className="ml-2">{proposal.vendor}</span></div>
                            <div><span className="font-medium text-gray-700">Plano:</span> <span className="ml-2">{proposal.plan}</span></div>
                            <div><span className="font-medium text-gray-700">Status:</span> 
                              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                                {getStatusText(proposal.status)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 border-b pb-2">Informações Financeiras</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <label className="font-medium text-gray-700">Valor Original:</label>
                              <input
                                type="text"
                                value={proposal.value}
                                onChange={(e) => updateProposal(proposal.id, 'value', e.target.value)}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="font-medium text-gray-700">Valor Estimado:</label>
                              <input
                                type="text"
                                value={proposal.estimatedValue || ''}
                                onChange={(e) => updateProposal(proposal.id, 'estimatedValue', e.target.value)}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="font-medium text-gray-700">Comissão:</label>
                              <input
                                type="text"
                                value={proposal.commission || ''}
                                onChange={(e) => updateProposal(proposal.id, 'commission', e.target.value)}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="font-medium text-gray-700">Desconto:</label>
                              <input
                                type="text"
                                value={proposal.discount || ''}
                                onChange={(e) => updateProposal(proposal.id, 'discount', e.target.value)}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="font-medium text-gray-700">Prioridade:</label>
                              <select
                                value={proposal.priority || 'low'}
                                onChange={(e) => updateProposal(proposal.id, 'priority', e.target.value)}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detalhes de Pagamento */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Detalhes de Pagamento</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                            <select
                              value={proposal.paymentMethod || ''}
                              onChange={(e) => updateProposal(proposal.id, 'paymentMethod', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="">Selecione</option>
                              <option value="PIX">PIX</option>
                              <option value="Cartão de Crédito">Cartão de Crédito</option>
                              <option value="Cartão de Débito">Cartão de Débito</option>
                              <option value="Boleto">Boleto</option>
                              <option value="Transferência">Transferência</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
                            <input
                              type="text"
                              value={proposal.installments || ''}
                              onChange={(e) => updateProposal(proposal.id, 'installments', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              placeholder="Ex: 12x"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Taxas Adicionais</label>
                            <input
                              type="text"
                              value={proposal.additionalFees || ''}
                              onChange={(e) => updateProposal(proposal.id, 'additionalFees', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              placeholder="R$ 0,00"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Observações Financeiras */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Observações Financeiras</h4>
                        <textarea
                          value={proposal.financialNotes || ''}
                          onChange={(e) => updateProposal(proposal.id, 'financialNotes', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Adicione observações financeiras específicas..."
                        />
                      </div>

                      {/* Campos Personalizados */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Campos Personalizados para Planilha</h4>
                        
                        {/* Campos existentes */}
                        {proposal.customFields && Object.entries(proposal.customFields).length > 0 && (
                          <div className="space-y-2">
                            {Object.entries(proposal.customFields).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700 w-32">{key}:</span>
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => updateProposal(proposal.id, 'customFields', {
                                    ...proposal.customFields,
                                    [key]: e.target.value
                                  })}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <button
                                  onClick={() => removeCustomField(proposal.id, key)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Adicionar novo campo */}
                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                          <input
                            type="text"
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                            placeholder="Nome do campo"
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={newFieldValue}
                            onChange={(e) => setNewFieldValue(e.target.value)}
                            placeholder="Valor"
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => addCustomField(proposal.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Observações Gerais */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 border-b pb-2">Observações para Validação</h4>
                        <textarea
                          value={observations}
                          onChange={(e) => setObservations(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Adicione observações sobre a validação..."
                        />
                      </div>

                      {/* Ações */}
                      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setSelectedProposal(null)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Fechar
                        </button>
                        
                        {proposal.status === 'pending_validation' && (
                          <button
                            onClick={() => validateProposal(proposal.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2 inline" />
                            Validar Proposta
                          </button>
                        )}
                        
                        {(proposal.status === 'validated' || proposal.status === 'pending_validation') && (
                          <button
                            onClick={() => sendToAutomation(proposal.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                          >
                            <Send className="w-4 h-4 mr-2 inline" />
                            Enviar para Automação
                          </button>
                        )}

                        <button
                          onClick={() => {
                            alert('Dados salvos com sucesso!');
                            setSelectedProposal(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          <Save className="w-4 h-4 mr-2 inline" />
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FinancialPortal;