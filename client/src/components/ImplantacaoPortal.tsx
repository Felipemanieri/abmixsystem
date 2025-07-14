import React, { useState, useEffect } from 'react';
import { LogOut, Settings, TrendingUp, CheckCircle, AlertCircle, Eye, Send, Calendar, FileText, User, Bell, MessageCircle, MessageSquare, Bot, X, Send as SendIcon, Zap, Filter, Search, Download, Upload, Trash2, Edit, Plus, ArrowLeft, RefreshCw, Link, Copy, Mail, Share2, ExternalLink, Phone, ArrowUp, ArrowDown } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import NotificationCenter from './NotificationCenter';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import ProposalSelector from './ProposalSelector';
import ProposalEditor from './ProposalEditor';
import { showNotification } from '../utils/notifications';
import { useProposals, useRealTimeProposals } from '../hooks/useProposals';
import StatusManager, { ProposalStatus, STATUS_CONFIG } from '@shared/statusSystem';

interface ImplantacaoPortalProps {
  user: any;
  onLogout: () => void;
}

interface Proposal {
  id: string;
  client: string;
  vendor: string;
  plan: string;
  value: string;
  status: 'pending_validation' | 'validated' | 'sent_to_automation' | 'processing' | 'completed';
  submissionDate: string;
  documents: number;
  observations?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedCompletion: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'inactive';
  lastRun: string;
}

const ImplantacaoPortal: React.FC<ImplantacaoPortalProps> = ({ user, onLogout }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [observations, setObservations] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'proposals' | 'automation' | 'editor'>('proposals');
  const [showProposalSelector, setShowProposalSelector] = useState(false);
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusManager] = useState(() => StatusManager.getInstance());
  const [proposalStatuses, setProposalStatuses] = useState<Map<string, ProposalStatus>>(new Map());

  // Estados para filtros avançados do setor Implantação
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedValueRange, setSelectedValueRange] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Hook para propostas com sincronização em tempo real
  const { proposals: realProposals, isLoading: proposalsLoading } = useProposals();
  useRealTimeProposals();

  // Debug: Log das propostas
  console.log('Propostas no ImplantacaoPortal:', realProposals);
  console.log('Loading status:', proposalsLoading);

  // Função para atualizar status
  const handleStatusUpdate = async (proposalId: string, newStatus: ProposalStatus) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        statusManager.updateStatus(proposalId, newStatus);
        showNotification(`Status atualizado para ${STATUS_CONFIG[newStatus]?.label}`, 'success');
      } else {
        showNotification('Erro ao atualizar status', 'error');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showNotification('Erro ao atualizar status', 'error');
    }
  };

  // Função para atualizar prioridade
  const handlePriorityUpdate = async (proposalId: string, newPriority: 'low' | 'medium' | 'high') => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (response.ok) {
        showNotification(`Prioridade atualizada para ${newPriority === 'high' ? 'Alta' : newPriority === 'medium' ? 'Média' : 'Baixa'}`, 'success');
      } else {
        showNotification('Erro ao atualizar prioridade', 'error');
      }
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error);
      showNotification('Erro ao atualizar prioridade', 'error');
    }
  };

  // Notificações simuladas
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nova proposta para validação',
      message: 'A proposta VEND001-PROP123 foi enviada para validação',
      type: 'approval',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      read: false,
    },
    {
      id: '2',
      title: 'Automação concluída',
      message: 'A automação da proposta VEND003-PROP126 foi concluída com sucesso',
      type: 'approval',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 horas atrás
      read: false,
    },
    {
      id: '3',
      title: 'Erro na integração',
      message: 'A integração com o CRM falhou. Verifique as configurações.',
      type: 'alert',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 horas atrás
      read: true,
    },
  ]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do portal de implantação. Como posso ajudá-lo com validações, automações e integrações?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Inicializar status dos proposals e escutar mudanças
  useEffect(() => {
    const initializeStatuses = () => {
      const statusMap = new Map<string, ProposalStatus>();
      proposals.forEach(proposal => {
        statusMap.set(proposal.id, statusManager.getStatus(proposal.id));
      });
      setProposalStatuses(statusMap);
    };

    initializeStatuses();

    const handleStatusChange = (proposalId: string, newStatus: ProposalStatus) => {
      setProposalStatuses(prev => new Map(prev.set(proposalId, newStatus)));
      showNotification(`Status da proposta ${proposalId} alterado para: ${STATUS_CONFIG[newStatus].label}`, 'success');
    };

    statusManager.subscribe(handleStatusChange);

    return () => {
      statusManager.unsubscribe(handleStatusChange);
    };
  }, [statusManager]);

  const handleSelectProposal = (proposalId: string) => {
    console.log('Selecionando proposta:', proposalId);
    setEditingProposalId(proposalId);
    setActiveTab('editor');
    setShowProposalSelector(false); // Fechar o modal
    // Removida mensagem sobre Google Sheets - agora apenas abre o editor silenciosamente
  };

  const handleBackFromEditor = () => {
    setEditingProposalId(null);
    setActiveTab('proposals');
  };

  const handleSaveProposal = (data: any) => {
    showNotification('Proposta salva e sincronizada com Google Sheets!', 'success');
  };

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
      priority: 'high',
      estimatedCompletion: '2024-01-17',
    },
    {
      id: 'VEND002-PROP124',
      client: 'Tech Solutions SA',
      vendor: 'Bruna Garcia',
      plan: 'Plano Família Básico',
      value: 'R$ 650,00',
      status: 'pending_validation',
      submissionDate: '2024-01-14',
      documents: 6,
      priority: 'medium',
      estimatedCompletion: '2024-01-16',
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
      priority: 'low',
      estimatedCompletion: '2024-01-15',
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
      priority: 'high',
      estimatedCompletion: '2024-01-14',
    },
    {
      id: 'VEND004-PROP127',
      client: 'Startup Moderna',
      vendor: 'Diana Santos',
      plan: 'Plano Família Premium',
      value: 'R$ 980,00',
      status: 'processing',
      submissionDate: '2024-01-11',
      documents: 9,
      observations: 'Em processamento automático',
      priority: 'medium',
      estimatedCompletion: '2024-01-13',
    },
    {
      id: 'VEND005-PROP128',
      client: 'Consultoria Avançada',
      vendor: 'Eduardo Lima',
      plan: 'Plano Individual Plus',
      value: 'R$ 450,00',
      status: 'completed',
      submissionDate: '2024-01-10',
      documents: 6,
      observations: 'Implantação concluída com sucesso',
      priority: 'low',
      estimatedCompletion: '2024-01-12',
    },
  ]);

  const [automationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Validação Automática de Documentos',
      trigger: 'Documentos completos',
      action: 'Enviar para aprovação',
      status: 'active',
      lastRun: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'Notificação de Pendências',
      trigger: 'Proposta pendente > 3 dias',
      action: 'Enviar email para vendedor',
      status: 'active',
      lastRun: '2024-01-15 09:15'
    },
    {
      id: '3',
      name: 'Backup Automático',
      trigger: 'Diariamente às 02:00',
      action: 'Backup completo do sistema',
      status: 'active',
      lastRun: '2024-01-15 02:00'
    },
    {
      id: '4',
      name: 'Integração CRM',
      trigger: 'Proposta aprovada',
      action: 'Criar cliente no CRM',
      status: 'inactive',
      lastRun: '2024-01-14 16:45'
    }
  ]);

  const implantacaoStats = [
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
      name: 'Em Processamento',
      value: proposals.filter(p => p.status === 'processing').length.toString(),
      change: 'Automação ativa',
      changeType: 'positive',
      icon: Settings,
      color: 'blue',
    },
    {
      name: 'Concluídas',
      value: proposals.filter(p => p.status === 'completed').length.toString(),
      change: 'Finalizadas',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  const validateProposal = (proposalId: string) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, status: 'validated', observations }
        : proposal
    ));
    setSelectedProposal(null);
    setObservations('');
    showNotification('Proposta validada com sucesso!', 'success');
  };

  const sendToAutomation = (proposalId: string) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { 
            ...proposal, 
            status: 'sent_to_automation',
            observations: observations || 'Enviado para automação Make/Zapier'
          }
        : proposal
    ));
    setSelectedProposal(null);
    setObservations('');
    showNotification('Proposta enviada para automação!', 'success');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
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
      return 'Para validar uma proposta, clique no ícone de visualização e depois em "Validar Proposta". Certifique-se de revisar todos os documentos antes.';
    }
    if (lowerMessage.includes('automação') || lowerMessage.includes('make') || lowerMessage.includes('zapier')) {
      return 'Após validar uma proposta, você pode enviá-la para automação. Isso irá processar os dados no Make/Zapier para criação automática do contrato.';
    }
    if (lowerMessage.includes('documento') || lowerMessage.includes('anexo')) {
      return 'Verifique se todos os documentos obrigatórios foram enviados antes de validar. RG, CPF, CNPJ e comprovantes são essenciais.';
    }
    if (lowerMessage.includes('implantação') || lowerMessage.includes('sistema')) {
      return 'A implantação envolve validação de dados, integração com sistemas e automação de processos. Posso ajudar com qualquer etapa.';
    }
    if (lowerMessage.includes('integração') || lowerMessage.includes('api')) {
      return 'Temos integrações ativas com CRM, sistemas de pagamento e automações. Verifique a aba "Integrações" para mais detalhes.';
    }
    
    return 'Como especialista em implantação, posso ajudar com validações, automações, integrações e monitoramento. O que precisa fazer?';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_validation':
        return 'bg-orange-100 text-orange-800';
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'sent_to_automation':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
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
      case 'processing':
        return 'Em Processamento';
      case 'completed':
        return 'Concluído';
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

  // Usar propostas reais sempre que possível
  const proposalsToShow = realProposals || [];

  // Sistema de filtros avançados para o setor de Implantação
  const filteredProposals = proposalsToShow?.filter(proposal => {
    const matchesStatus = selectedStatus === 'all' || proposal.status === selectedStatus;
    const matchesVendor = selectedVendor === 'all' || (proposal.vendedor || '').toLowerCase().includes(selectedVendor.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || proposal.priority === selectedPriority;
    const matchesPlan = selectedPlan === 'all' || (proposal.plano || '').toLowerCase().includes(selectedPlan.toLowerCase());
    
    // Filtro por valor
    let matchesValue = true;
    if (selectedValueRange !== 'all') {
      const value = parseFloat((proposal.valor || '0').replace(/[^\d.,]/g, '').replace(',', '.'));
      switch (selectedValueRange) {
        case 'low': matchesValue = value < 500; break;
        case 'medium': matchesValue = value >= 500 && value < 1000; break;
        case 'high': matchesValue = value >= 1000; break;
      }
    }
    
    // Filtro por data
    let matchesDate = true;
    if (selectedDateRange !== 'all') {
      const proposalDate = new Date(proposal.createdAt);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - proposalDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (selectedDateRange) {
        case 'today': matchesDate = daysDiff === 0; break;
        case 'week': matchesDate = daysDiff <= 7; break;
        case 'month': matchesDate = daysDiff <= 30; break;
        case 'quarter': matchesDate = daysDiff <= 90; break;
      }
    }
    
    // Filtro por quantidade de documentos
    let matchesDocuments = true;
    if (selectedDocuments !== 'all') {
      const docCount = proposal.clientAttachments?.length || 0;
      switch (selectedDocuments) {
        case 'none': matchesDocuments = docCount === 0; break;
        case 'partial': matchesDocuments = docCount > 0 && docCount < 5; break;
        case 'complete': matchesDocuments = docCount >= 5; break;
      }
    }
    
    const matchesSearch = (proposal.cliente || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (proposal.abmId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (proposal.vendedor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (proposal.plano || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesVendor && matchesPriority && matchesPlan && 
           matchesValue && matchesDate && matchesDocuments && matchesSearch;
  }).sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'client':
        aValue = a.cliente || '';
        bValue = b.cliente || '';
        break;
      case 'value':
        aValue = parseFloat((a.valor || '0').replace(/[^\d.,]/g, '').replace(',', '.'));
        bValue = parseFloat((b.valor || '0').replace(/[^\d.,]/g, '').replace(',', '.'));
        break;
      case 'progress':
        aValue = a.progresso || 0;
        bValue = b.progresso || 0;
        break;
      default:
        aValue = a.abmId || '';
        bValue = b.abmId || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  }) || [];

  // Listas únicas para filtros
  const uniqueVendors = [...new Set(proposalsToShow.map(p => p.vendedor || 'Não informado'))];
  const uniquePlans = [...new Set(proposalsToShow.map(p => p.plano || 'Não informado'))];

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setSelectedStatus('all');
    setSelectedVendor('all');
    setSelectedPriority('all');
    setSelectedDateRange('all');
    setSelectedValueRange('all');
    setSelectedPlan('all');
    setSelectedDocuments('all');
    setSearchTerm('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const renderProposalsTab = () => (
    <div className="space-y-6">
      {/* Filtros Avançados para Implantação */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Propostas</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvancedFilters ? 'Filtros Básicos' : 'Filtros Avançados'}
            </button>
            <button
              onClick={clearAllFilters}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar propostas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Ordenar por Data</option>
            <option value="client">Ordenar por Cliente</option>
            <option value="value">Ordenar por Valor</option>
            <option value="progress">Ordenar por Progresso</option>
          </select>
        </div>

        {/* Filtros Avançados */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os Vendedores</option>
                {uniqueVendors.map(vendor => (
                  <option key={vendor} value={vendor}>{vendor}</option>
                ))}
              </select>

              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os Planos</option>
                {uniquePlans.map(plan => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>

              <select
                value={selectedValueRange}
                onChange={(e) => setSelectedValueRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas as Faixas de Valor</option>
                <option value="low">Até R$ 500</option>
                <option value="medium">R$ 500 - R$ 1.000</option>
                <option value="high">Acima de R$ 1.000</option>
              </select>

              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas as Datas</option>
                <option value="today">Hoje</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="quarter">Último Trimestre</option>
              </select>

              <select
                value={selectedDocuments}
                onChange={(e) => setSelectedDocuments(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os Documentos</option>
                <option value="none">Sem Documentos</option>
                <option value="partial">Documentos Parciais</option>
                <option value="complete">Documentos Completos</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? (
                  <>
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Crescente
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Decrescente
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Estatísticas dos Filtros */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Mostrando {filteredProposals.length} de {proposalsToShow.length} propostas
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Filtros ativos: {[
              selectedStatus !== 'all' && 'Status',
              selectedVendor !== 'all' && 'Vendedor',
              selectedPriority !== 'all' && 'Prioridade',
              selectedPlan !== 'all' && 'Plano',
              selectedValueRange !== 'all' && 'Valor',
              selectedDateRange !== 'all' && 'Data',
              selectedDocuments !== 'all' && 'Documentos',
              searchTerm && 'Busca'
            ].filter(Boolean).length}</span>
          </div>
        </div>
      </div>

      {/* Lista de Propostas */}
      <div className="space-y-4">
        {proposalsLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando propostas...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma proposta encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou limpar a busca.</p>
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                {/* Barra de progresso vertical na esquerda */}
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-24 bg-gray-200 rounded-full relative">
                      <div 
                        className="w-3 bg-gradient-to-t from-blue-500 to-green-500 rounded-full transition-all duration-500"
                        style={{ height: `${proposal.progresso}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{proposal.progresso}%</span>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <button 
                          onClick={() => window.open(`https://drive.google.com/drive/folders/${proposal.abmId}`, '_blank')}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                        >
                          {proposal.abmId}
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cliente</label>
                        <p className="text-sm text-gray-900">{proposal.cliente}</p>
                        <p className="text-xs text-gray-500">CNPJ: {proposal.contractData?.cnpj}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Vendedor</label>
                        <p className="text-sm text-gray-900">{proposal.vendedor}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Plano</label>
                        <p className="text-sm text-gray-900">{proposal.plano}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Valor</label>
                        <p className="text-sm text-gray-900">R$ {proposal.valor}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                        <select
                          value={proposal.priority || 'medium'}
                          onChange={(e) => handlePriorityUpdate(proposal.id, e.target.value as 'low' | 'medium' | 'high')}
                          className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${
                            proposal.priority === 'high' ? 'bg-red-100 text-red-800' :
                            proposal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data</label>
                        <p className="text-sm text-gray-900">
                          {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {/* Ações da Implantação */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <ActionButtons
                        onView={() => window.open(`https://drive.google.com/drive/folders/${proposal.abmId}`, '_blank')}
                        onEdit={() => handleSelectProposal(proposal.id)}
                        onAutomate={() => showNotification('Iniciando automação...', 'info')}
                        onExternalLink={() => window.open(`https://docs.google.com/spreadsheets/d/1NQYQFJ9TFMH5zJKQQWXW2S9F8JSTM9-SHEETS-${proposal.abmId}`, '_blank')}
                        onCopyLink={() => {
                          const link = `${window.location.origin}/cliente/proposta/${proposal.clientToken}`;
                          navigator.clipboard.writeText(link);
                          showNotification('Link copiado!', 'success');
                        }}
                        onWhatsApp={() => {
                          const link = `${window.location.origin}/cliente/proposta/${proposal.clientToken}`;
                          const message = `🏥 *Proposta de Plano de Saúde*\n\nEmpresa: ${proposal.cliente}\nPlano: ${proposal.plano}\nValor: R$ ${proposal.valor}\n\n🔗 Link: ${link}`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        onEmail={() => {
                          const link = `${window.location.origin}/cliente/proposta/${proposal.clientToken}`;
                          const subject = `Proposta de Plano - ${proposal.cliente}`;
                          const body = `Olá!\n\nSegue a proposta de plano de saúde:\n\nEmpresa: ${proposal.cliente}\nPlano: ${proposal.plano}\nValor: R$ ${proposal.valor}\n\nLink: ${link}`;
                          window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                        }}
                        onDownload={() => showNotification('Baixando documentos...', 'success')}
                        onDelete={() => {
                          if (confirm(`Tem certeza que deseja excluir a proposta ${proposal.abmId}?`)) {
                            showNotification('Proposta excluída com sucesso', 'success');
                          }
                        }}
                        onMessage={() => setShowInternalMessage(true)}
                        onApprove={() => showNotification('Proposta aprovada!', 'success')}
                        onReject={() => showNotification('Proposta rejeitada', 'error')}
                        onForward={() => showNotification('Proposta encaminhada', 'info')}
                        onShare={() => {
                          const link = `${window.location.origin}/cliente/proposta/${proposal.clientToken}`;
                          navigator.clipboard.writeText(link);
                          showNotification('Link de compartilhamento copiado!', 'success');
                        }}
                        onSend={() => showNotification('Notificação enviada ao cliente', 'success')}
                        userRole="implementation"
                        className="flex flex-wrap gap-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAutomationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Regras de Automação</h2>
          <button
            onClick={() => showNotification('Nova regra criada!', 'success')}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Regra
          </button>
        </div>
        
        <div className="space-y-4">
          {automationRules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Gatilho:</span> {rule.trigger}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Ação:</span> {rule.action}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Última execução: {rule.lastRun}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => showNotification('Regra editada!', 'info')}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showNotification('Regra removida!', 'error')}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
                    <div className="text-right">
                      <select
                        value={proposal.status}
                        onChange={(e) => handleStatusUpdate(proposal.id, e.target.value as ProposalStatus)}
                        className="text-sm font-medium rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 px-3 py-2 mb-2"
                        style={{
                          backgroundColor: (() => {
                            const currentStatus = proposalStatuses.get(proposal.id) || proposal.status;
                            const config = STATUS_CONFIG[currentStatus as ProposalStatus];
                            if (!config) return '#ffffff';
                            
                            if (config.bgColor.includes('sky')) return '#e0f2fe';
                            if (config.bgColor.includes('emerald')) return '#d1fae5';
                            if (config.bgColor.includes('amber')) return '#fef3c7';
                            if (config.bgColor.includes('blue-500')) return '#dbeafe';
                            if (config.bgColor.includes('green-500')) return '#dcfce7';
                            if (config.bgColor.includes('pink')) return '#fce7f3';
                            if (config.bgColor.includes('yellow')) return '#fef7cd';
                            if (config.bgColor.includes('orange')) return '#fed7aa';
                            if (config.bgColor.includes('red')) return '#fee2e2';
                            if (config.bgColor.includes('purple')) return '#f3e8ff';
                            if (config.bgColor.includes('cyan')) return '#cffafe';
                            return '#ffffff';
                          })(),
                          color: (() => {
                            const currentStatus = proposalStatuses.get(proposal.id) || proposal.status;
                            const config = STATUS_CONFIG[currentStatus as ProposalStatus];
                            if (!config) return '#374151';
                            
                            if (config.textColor.includes('sky')) return '#0369a1';
                            if (config.textColor.includes('emerald')) return '#047857';
                            if (config.textColor.includes('amber')) return '#92400e';
                            if (config.textColor.includes('blue-700')) return '#1e40af';
                            if (config.textColor.includes('green-700')) return '#166534';
                            if (config.textColor.includes('pink')) return '#be185d';
                            if (config.textColor.includes('yellow')) return '#a16207';
                            if (config.textColor.includes('orange')) return '#c2410c';
                            if (config.textColor.includes('red')) return '#dc2626';
                            if (config.textColor.includes('purple')) return '#7c3aed';
                            if (config.textColor.includes('cyan')) return '#0891b2';
                            return '#374151';
                          })()
                        }}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <option 
                            key={key} 
                            value={key}
                            style={{
                              backgroundColor: config.bgColor.includes('sky') ? '#e0f2fe' :
                                             config.bgColor.includes('emerald') ? '#d1fae5' :
                                             config.bgColor.includes('amber') ? '#fef3c7' :
                                             config.bgColor.includes('blue-500') ? '#dbeafe' :
                                             config.bgColor.includes('green-500') ? '#dcfce7' :
                                             config.bgColor.includes('pink') ? '#fce7f3' :
                                             config.bgColor.includes('yellow') ? '#fef7cd' :
                                             config.bgColor.includes('orange') ? '#fed7aa' :
                                             config.bgColor.includes('red') ? '#fee2e2' :
                                             config.bgColor.includes('purple') ? '#f3e8ff' :
                                             config.bgColor.includes('cyan') ? '#cffafe' : '#f9fafb',
                              color: config.textColor.includes('sky') ? '#0369a1' :
                                     config.textColor.includes('emerald') ? '#047857' :
                                     config.textColor.includes('amber') ? '#92400e' :
                                     config.textColor.includes('blue-700') ? '#1e40af' :
                                     config.textColor.includes('green-700') ? '#166534' :
                                     config.textColor.includes('pink') ? '#be185d' :
                                     config.textColor.includes('yellow') ? '#a16207' :
                                     config.textColor.includes('orange') ? '#c2410c' :
                                     config.textColor.includes('red') ? '#dc2626' :
                                     config.textColor.includes('purple') ? '#7c3aed' :
                                     config.textColor.includes('cyan') ? '#0891b2' : '#374151'
                            }}
                          >
                            {config.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {/* Ações Originais */}
                    <button
                      onClick={() => window.open(`https://drive.google.com/drive/folders/${proposal.abmId}`, '_blank')}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      title="Ver no Google Drive"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingProposalId(proposal.id)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                      title="Editar Proposta"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showNotification('Enviando para automação...', 'info')}
                      className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                      title="Enviar para Automação"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showNotification('Sincronizando com Google Sheets...', 'info')}
                      className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Sincronizar Google Sheets"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(`/cliente/proposta/${proposal.clientToken}`, '_blank')}
                      className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                      title="Link do Cliente"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showNotification('Enviando notificação...', 'info')}
                      className="p-2 text-pink-600 hover:text-pink-800 hover:bg-pink-50 rounded-md transition-colors"
                      title="Notificar Cliente"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    
                    {/* Novas Ações Adicionadas */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/cliente/proposta/${proposal.clientToken}`);
                        showNotification('Link copiado para área de transferência!', 'success');
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                      title="Copiar Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const message = `Olá! Sua proposta está disponível em: ${window.location.origin}/cliente/proposta/${proposal.clientToken}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                      title="Enviar via WhatsApp"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const subject = `Proposta de Plano de Saúde - ${proposal.cliente}`;
                        const body = `Olá!\n\nSua proposta de plano de saúde está pronta e pode ser acessada através do link:\n${window.location.origin}/cliente/proposta/${proposal.clientToken}\n\nQualquer dúvida, estamos à disposição.\n\nAtenciosamente,\nEquipe Abmix`;
                        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                      }}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      title="Enviar por Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showNotification('Download iniciado...', 'info')}
                      className="p-2 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 rounded-md transition-colors"
                      title="Download de Documentos"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showNotification('Proposta removida!', 'success')}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      title="Remover Proposta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(`/cliente/proposta/${proposal.clientToken}`, '_blank')}
                      className="p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors"
                      title="Link Externo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showNotification('Proposta aprovada!', 'success')}
                      className="p-2 text-lime-600 hover:text-lime-800 hover:bg-lime-50 rounded-md transition-colors"
                      title="Aprovar Proposta"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showNotification('Alerta enviado!', 'warning')}
                      className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-md transition-colors"
                      title="Alerta"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Proposta de Plano de Saúde',
                            text: `Proposta para ${proposal.cliente}`,
                            url: `${window.location.origin}/cliente/proposta/${proposal.clientToken}`
                          });
                        } else {
                          showNotification('Compartilhamento não disponível neste dispositivo', 'info');
                        }
                      }}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-md transition-colors"
                      title="Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowInternalMessage(true)}
                      className="p-2 text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded-md transition-colors"
                      title="Mensagem Interna"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAutomationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Regras de Automação</h2>
          <button
            onClick={() => showNotification('Nova regra criada!', 'success')}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Regra
          </button>
        </div>
        
        <div className="space-y-4">
          {automationRules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Gatilho:</span> {rule.trigger}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Ação:</span> {rule.action}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Última execução: {rule.lastRun}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => showNotification('Regra editada!', 'info')}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showNotification('Regra removida!', 'error')}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botão para ir para automação */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Automação Manual</h2>
          <button
            onClick={() => showNotification('Acessando sistema de automação...', 'info')}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Zap className="w-4 h-4 mr-2" />
            Ir para Automação
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Selecione uma proposta para verificar se está completa e enviar para automação manualmente.
        </p>
        
        <div className="space-y-4">
          {proposals.filter(p => p.status === 'validated').map((proposal) => (
            <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{proposal.client}</h3>
                  <p className="text-xs text-gray-500">{proposal.id}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => showNotification(`Verificando formulário de ${proposal.client}...`, 'info')}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                    title="Verificar formulário completo"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showNotification(`Editando proposta de ${proposal.client}...`, 'info')}
                    className="p-2 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-full transition-colors"
                    title="Editar proposta"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(`mailto:${proposal.vendor.toLowerCase().replace(/\s/g, '.')}@abmix.com.br?subject=Proposta ${proposal.id}`)}
                    className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-full transition-colors"
                    title="Enviar email para vendedor"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(`https://wa.me/55${proposal.vendor.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Sobre a proposta ${proposal.id} do cliente ${proposal.client}...`)}`)}
                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
                    title="Enviar WhatsApp para vendedor"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => sendToAutomation(proposal.id)}
                    className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-full transition-colors"
                    title="Enviar para automação"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">Completo</span>
              </div>
            </div>
          ))}
          
          {proposals.filter(p => p.status === 'validated').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma proposta validada disponível para automação
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <AbmixLogo size={40} className="mr-3" />
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Implantação</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <NotificationCenter 
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClose={() => setShowNotifications(false)}
                />
              )}
              
              <button
                onClick={() => setShowInternalMessage(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Implantação</h1>
          <p className="text-gray-600">Valide propostas, configure automações e gerencie integrações</p>
        </div>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {implantacaoStats.map((stat) => {
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Ações Rápidas</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowProposalSelector(true)}
                className="group relative inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-blue-700 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <Search className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Selecionar Proposta</span>
              </button>
              
              <button
                onClick={() => window.open('https://drive.google.com/drive/folders/proposals', '_blank')}
                className="group relative inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-green-700 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <FileText className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Google Drive</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'proposals', label: 'Propostas', icon: FileText },
                  { id: 'automation', label: 'Automação', icon: Zap }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'proposals' && renderProposalsTab()}
              {activeTab === 'automation' && renderAutomationTab()}
              {activeTab === 'editor' && editingProposalId && (
                <div className="h-full">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Editor de Proposta - {editingProposalId}
                    </h2>
                    <button
                      onClick={handleBackFromEditor}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar para Lista
                    </button>
                  </div>
                  <ProposalEditor
                    proposalId={editingProposalId}
                    onBack={handleBackFromEditor}
                    onSave={handleSaveProposal}
                    user={user}
                  />
                </div>
              )}
              {activeTab === 'editor' && !editingProposalId && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma proposta selecionada</h3>
                  <p className="text-gray-600">Use o botão "Selecionar Proposta" para escolher uma proposta para edição.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Validação da Proposta
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Cliente:</span>
                        <span className="ml-2">{proposal.client}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Vendedor:</span>
                        <span className="ml-2">{proposal.vendor}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Plano:</span>
                        <span className="ml-2">{proposal.plan}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Valor:</span>
                        <span className="ml-2">{proposal.value}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Prioridade:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(proposal.priority)}`}>
                          {getPriorityText(proposal.priority)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Previsão:</span>
                        <span className="ml-2">{new Date(proposal.estimatedCompletion).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações de Implantação
                      </label>
                      <textarea
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Adicione observações sobre a validação e implantação..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setSelectedProposal(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                      {proposal.status === 'pending_validation' && (
                        <button
                          onClick={() => validateProposal(proposal.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Validar Proposta
                        </button>
                      )}
                      {proposal.status === 'validated' && (
                        <button
                          onClick={() => sendToAutomation(proposal.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                        >
                          Enviar para Make/Zapier
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Proposal Selector Modal */}
      <ProposalSelector
        isOpen={showProposalSelector}
        onClose={() => setShowProposalSelector(false)}
        onSelectProposal={handleSelectProposal}
      />

      {/* Internal Message Modal */}
      {showInternalMessage && (
        <InternalMessage 
          isOpen={showInternalMessage}
          onClose={() => setShowInternalMessage(false)}
          currentUser={{
            name: user.name,
            role: 'implantacao'
          }}
        />
      )}

      {/* Chatbot */}
      <div className="chatbot-container">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente Implantação</h3>
                  <p className="text-xs text-teal-100">Online agora</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-teal-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-colors"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImplantacaoPortal;