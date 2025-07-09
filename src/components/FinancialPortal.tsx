import React, { useState } from 'react';
import { LogOut, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Send, User, FileText, Edit, Save, X, Plus, Trash2, Download, ArrowLeft, Home, MessageCircle, Bot, Calculator, BarChart3 } from 'lucide-react';

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
  email?: string;
  phone?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FinancialPortal: React.FC<FinancialPortalProps> = ({ user, onLogout }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [editingProposal, setEditingProposal] = useState<string | null>(null);
  const [observations, setObservations] = useState('');
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do portal financeiro. Como posso ajudá-lo com validações e análises?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

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
      customFields: {},
      email: 'contato@empresaabc.com.br',
      phone: '11999999999',
      attachments: [
        { id: '1', name: 'cnpj_empresa_abc.pdf', type: 'pdf', size: '2.1 MB', url: '/docs/cnpj_empresa_abc.pdf' },
        { id: '2', name: 'rg_titular.jpg', type: 'image', size: '1.8 MB', url: '/docs/rg_titular.jpg' },
      ]
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
      customFields: { 'Desconto Especial': '10%', 'Motivo': 'Cliente fidelidade' },
      email: 'admin@techsolutions.com',
      phone: '11888888888',
      attachments: [
        { id: '3', name: 'contrato_social.pdf', type: 'pdf', size: '3.2 MB', url: '/docs/contrato_social.pdf' },
      ]
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
      customFields: {},
      email: 'contato@consultoriaxyz.com.br',
      phone: '11777777777',
      attachments: [
        { id: '4', name: 'carteirinha_atual.jpg', type: 'image', size: '1.2 MB', url: '/docs/carteirinha_atual.jpg' },
      ]
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
      customFields: { 'Observação Especial': 'Cliente VIP' },
      email: 'contato@inovacaodigital.com',
      phone: '11666666666',
      attachments: [
        { id: '5', name: 'analitico_plano.pdf', type: 'pdf', size: '1.5 MB', url: '/docs/analitico_plano.pdf' },
      ]
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
    showNotification('Proposta validada com sucesso!', 'success');
  };

  const sendToAutomation = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal?.status !== 'validated' && proposal?.status !== 'pending_validation') {
      showNotification('Proposta enviada para automação!', 'success');
    }

    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { 
            ...proposal, 
            status: 'sent_to_automation',
            observations: observations || 'Enviado para automação Make/Zapier',
            automationDate: new Date().toISOString().split('T')[0],
            financialNotes: (proposal.financialNotes || '') + ' | Enviado para automação'
          }
        : proposal
    ));
    setSelectedProposal(null);
    setObservations('');
    showNotification('Proposta enviada para automação com sucesso!', 'success');
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
      showNotification('Por favor, preencha o nome e valor do campo', 'error');
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
    showNotification('Campo personalizado adicionado!', 'success');
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
    showNotification('Campo removido!', 'success');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Bot response
    setTimeout(() => {
      const response = getBotResponse(newMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setNewMessage('');
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('validar') || lowerMessage.includes('aprovar')) {
      return 'Para validar uma proposta, clique no ícone de visualizar e depois em "Validar Proposta". Você pode adicionar observações antes de validar.';
    }
    if (lowerMessage.includes('automação') || lowerMessage.includes('enviar')) {
      return 'Propostas validadas podem ser enviadas para automação Make/Zapier. Use o botão "Enviar para Automação" nas propostas validadas.';
    }
    if (lowerMessage.includes('campo') || lowerMessage.includes('personalizado')) {
      return 'Você pode adicionar campos personalizados nas propostas para incluir informações específicas na planilha final.';
    }
    if (lowerMessage.includes('anexo') || lowerMessage.includes('documento')) {
      return 'Todos os anexos das propostas podem ser visualizados e baixados diretamente do sistema. Use o botão de download nos anexos.';
    }
    
    return 'Como financeiro, você pode validar propostas, enviar para automação, gerenciar campos personalizados e baixar documentos. O que você precisa fazer?';
  };

  const handleSendWhatsApp = (phone: string, clientName: string) => {
    const message = `Olá! Entrando em contato sobre a proposta de plano de saúde da ${clientName}.`;
    const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showNotification('WhatsApp aberto com sucesso!', 'success');
  };

  const handleSendEmail = (email: string, clientName: string) => {
    const subject = `Proposta de Plano de Saúde - ${clientName}`;
    const body = `Olá!

Entrando em contato sobre a proposta de plano de saúde.

Qualquer dúvida, estou à disposição.

Atenciosamente,
${user.name}
Financeiro - Abmix Seguros`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
    showNotification('Cliente de email aberto com sucesso!', 'success');
  };

  const handleDownloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Download iniciado: ${attachment.name}`, 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
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
              <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Validar Propostas</h3>
                <p className="text-sm text-gray-500">Aprovar pendentes</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Enviar Automação</h3>
                <p className="text-sm text-gray-500">Make/Zapier</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Análise Financeira</h3>
                <p className="text-sm text-gray-500">Relatórios</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Dashboard</h3>
                <p className="text-sm text-gray-500">Visão geral</p>
              </div>
            </div>
          </button>
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
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => setSelectedProposal(proposal.id)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                          title="Visualizar e editar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingProposal(proposal.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edição rápida"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleSendWhatsApp(proposal.phone || '', proposal.client)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="WhatsApp"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleSendEmail(proposal.email || '', proposal.client)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Email"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => sendToAutomation(proposal.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Enviar para automação"
                        >
                          <Send className="w-4 h-4" />
                        </button>
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

                      {/* Anexos */}
                      {proposal.attachments && proposal.attachments.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 border-b pb-2">Anexos ({proposal.attachments.length})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {proposal.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <FileText className="w-5 h-5 text-gray-500 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{attachment.name}</div>
                                    <div className="text-xs text-gray-500">{attachment.size}</div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDownloadAttachment(attachment)}
                                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Baixar
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
                        
                        <button
                          onClick={() => sendToAutomation(proposal.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                        >
                          <Send className="w-4 h-4 mr-2 inline" />
                          Enviar para Automação
                        </button>

                        <button
                          onClick={() => {
                            showNotification('Dados salvos com sucesso!', 'success');
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

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente Financeiro</h3>
                  <p className="text-xs text-purple-100">Online agora</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-purple-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FinancialPortal;