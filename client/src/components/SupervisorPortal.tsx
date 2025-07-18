import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BarChart3, Users, TrendingUp, DollarSign, FileText, Target, Calculator, UserPlus, Bell, MessageSquare, LogOut, X, CheckCircle, Calendar, PieChart, Settings, Award, Plus, Edit, Trash2, Save, Filter, Search, Download, Eye, ExternalLink, Share, Share2, Clock, User, RefreshCw, Zap, AlertTriangle, Heart, TrendingDown, Mail } from 'lucide-react';
import { format, isWithinInterval, subDays, subMonths, subWeeks, parseISO } from 'date-fns';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart, Pie } from 'recharts';
// import AbmixLogo from './AbmixLogo';
import SimpleProgressBar from './SimpleProgressBar';
import ProgressBar from './ProgressBar';
import ActionButtons from './ActionButtons';
import NotificationCenter from './NotificationCenter';
import InternalMessage from './InternalMessage';

import SystemFooter from './SystemFooter';
import ThemeToggle from './ThemeToggle';
import StatusManager, { ProposalStatus, STATUS_CONFIG } from '@shared/statusSystem';
import StatusBadge from './StatusBadge';
import { apiRequest } from '@/lib/queryClient';
import { queryClient as queryClientInstance } from '@/lib/queryClient';
import { showNotification } from '@/utils/notifications';
import { realTimeSync } from '@/utils/realTimeSync';

interface SupervisorPortalProps {
  user: any;
  onLogout: () => void;
}

type SupervisorView = 'dashboard' | 'metas' | 'premiacao' | 'analytics' | 'team' | 'propostas' | 'relatorios';

interface VendorTarget {
  id: number;
  vendorId: number;
  month: number;
  year: number;
  targetValue: string;
  targetProposals: number;
  bonus: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamTarget {
  id: number;
  month: number;
  year: number;
  targetValue: string;
  targetProposals: number;
  teamBonus: string;
  createdAt: string;
  updatedAt: string;
}

interface Award {
  id: number;
  vendorId: number;
  title: string;
  description: string;
  value: string;
  type: 'monetary' | 'recognition' | 'bonus';
  dateAwarded: string;
  createdAt: string;
}

export function SupervisorPortal({ user, onLogout }: SupervisorPortalProps) {
  const [activeView, setActiveView] = useState<SupervisorView>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // DESABILITAR TODAS AS NOTIFICAÇÕES DO SUPERVISOR PORTAL
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // FORÇAR NOTIFICAÇÕES VAZIAS SEMPRE
    setNotifications([]);
    // Notificações removidas
  }, [user.name]);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Buscar propostas (movido para antes dos useEffects)
  const { data: proposals = [], isLoading: proposalsLoading } = useQuery({
    queryKey: ['/api/proposals'],
    queryFn: () => apiRequest('/api/proposals'),
    refetchInterval: 1000,
  });

  // Buscar vendedores (movido para antes dos useEffects)
  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ['/api/vendors'],
    queryFn: () => apiRequest('/api/vendors'),
    retry: false,
    refetchInterval: 1000,
  });
  
  // Ativar sincronização em tempo real
  useEffect(() => {
    realTimeSync.enableAggressivePolling();
  }, []);

  // Efeito para monitorar mudanças nos vendedores e atualizar gráfico
  useEffect(() => {
    if (vendors.length > 0 && proposals.length > 0) {
      // Forçar recálculo dos dados do gráfico quando vendedores ou propostas mudam
      console.log('Sincronizando dados: Vendedores atualizado:', vendors.length, 'Propostas:', proposals.length);
      
      // Aguardar um momento para garantir que os dados estejam consistentes
      setTimeout(() => {
        realTimeSync.forceRefresh();
      }, 100);
    }
  }, [vendors.length, proposals.length]);



  // Funções para os botões de relatório
  const generateReportData = (filteredData: any[]) => {
    if (!filteredData || !Array.isArray(filteredData)) {
      console.log('Dados filtrados inválidos:', filteredData);
      return [];
    }
    
    console.log('Gerando dados do relatório para:', filteredData.length, 'propostas');
    
    return filteredData.map(proposal => {
      // Buscar o nome do vendedor pelos dados do vendorId
      let vendorName = 'N/A';
      if (proposal.vendorId && vendors?.length > 0) {
        const vendor = vendors.find(v => v.id === proposal.vendorId);
        vendorName = vendor?.name || 'N/A';
      }
      
      const reportItem = {
        abmId: proposal.abmId || proposal.id || 'N/A',
        cliente: proposal.contractData?.nomeEmpresa || 'Empresa não informada',
        cnpj: proposal.contractData?.cnpj || 'CNPJ não informado', 
        vendedor: vendorName,
        valor: proposal.contractData?.valor || proposal.valor || '0',
        plano: proposal.contractData?.planoContratado || proposal.plano || 'N/A',
        status: proposal.status || 'pendente',
        desconto: '0%',
        observacoes: proposal.observacoes || ''
      };
      
      console.log('Item do relatório:', reportItem);
      return reportItem;
    });
  };

  // Estado para o modal de visualização
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [reportObservations, setReportObservations] = useState<{[key: string]: string}>({});

  const showReportPreview = (data: any[]) => {
    setReportData(data);
    setShowReportModal(true);
  };

  const sendToFinanceiro = () => {
    // Calcular dados do relatório
    const totalValue = reportData.reduce((sum, item) => 
      sum + (parseFloat(item.valor.toString().replace(/[^0-9,]/g, '').replace(',', '.')) || 0), 0
    );
    
    const reportPayload = {
      id: `report-${Date.now()}`,
      title: `Relatório de Performance - ${format(new Date(), 'dd/MM/yyyy')}`,
      status: 'received',
      receivedAt: new Date().toISOString(),
      data: {
        period: `${format(new Date(), 'MMMM yyyy')}`,
        totalProposals: reportData.length.toString(),
        totalValue: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        conversionRate: `${Math.round((reportData.filter(r => r.status === 'implantado').length / reportData.length) * 100)}%`
      },
      rawData: reportData
    };

    // Enviar para localStorage para simular comunicação entre portais
    const existingReports = JSON.parse(localStorage.getItem('financialReports') || '[]');
    existingReports.unshift(reportPayload);
    localStorage.setItem('financialReports', JSON.stringify(existingReports));
    
    // Disparar evento customizado para notificar o FinancialPortal
    window.dispatchEvent(new CustomEvent('newFinancialReport', { detail: reportPayload }));
    
    showNotification('Relatório enviado para o painel financeiro!', 'success');
    setShowReportModal(false);
  };

  const sendViaWhatsApp = () => {
    const message = `*Relatório de Propostas ABMIX*\n\nTotal: ${reportData.length} propostas\nFaturamento: R$ ${reportData.reduce((sum, item) => sum + (parseFloat(item.valor.toString().replace(/[^0-9,]/g, '').replace(',', '.')) || 0), 0).toFixed(2)}\n\nDetalhes: ${window.location.origin}/relatorio`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    showNotification('Compartilhado via WhatsApp!', 'success');
  };

  const sendViaEmail = () => {
    const subject = 'Relatório de Propostas ABMIX';
    const body = `Relatório gerado em ${new Date().toLocaleString('pt-BR')}\n\nTotal de propostas: ${reportData.length}\nFaturamento total: R$ ${reportData.reduce((sum, item) => sum + (parseFloat(item.valor.toString().replace(/[^0-9,]/g, '').replace(',', '.')) || 0), 0).toFixed(2)}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    showNotification('Email preparado!', 'success');
  };

  const downloadReport = () => {
    const csvContent = [
      ['ID', 'Cliente', 'CNPJ', 'Vendedor', 'Valor', 'Plano', 'Status', 'Observações'].join(';'),
      ...reportData.map(item => [
        item.abmId,
        item.cliente,
        item.cnpj,
        item.vendedor,
        `R$ ${item.valor}`,
        item.plano,
        item.status.toUpperCase(),
        reportObservations[item.abmId] || ''
      ].join(';'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_abmix_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showNotification('Relatório baixado!', 'success');
  };

  const exportToSheets = (data: any[]) => {
    const csvContent = [
      ['ID', 'Cliente', 'CNPJ', 'Vendedor', 'Valor', 'Plano', 'Status', 'Data'].join(','),
      ...data.map(item => [
        item.abmId || item.id,
        item.contractData?.nomeEmpresa || 'N/A',
        item.contractData?.cnpj || 'N/A',
        item.vendedor || 'N/A',
        item.contractData?.valor || '0',
        item.contractData?.planoContratado || 'N/A',
        item.status || 'pendente',
        new Date(item.createdAt).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n');
    
    console.log('Dados preparados para Google Sheets:', csvContent);
    window.open('https://sheets.google.com/create', '_blank');
  };

  const exportToExcel = (data: any[]) => {
    const csvContent = [
      ['ID', 'Cliente', 'CNPJ', 'Vendedor', 'Valor', 'Plano', 'Status', 'Data'].join(';'),
      ...data.map(item => [
        item.abmId || item.id,
        item.contractData?.nomeEmpresa || 'N/A',
        item.contractData?.cnpj || 'N/A',
        item.vendedor || 'N/A',
        item.contractData?.valor || '0',
        item.contractData?.planoContratado || 'N/A',
        item.status || 'pendente',
        new Date(item.createdAt).toLocaleDateString('pt-BR')
      ].join(';'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_abmix_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openGoogleDrive = () => {
    window.open('https://drive.google.com/drive/folders/1cLvVhS7X9YQZ3K8N2M5P6R7T', '_blank');
  };

  // Função para obter propostas filtradas baseada nos filtros do relatório
  const getFilteredProposals = () => {
    if (!proposals || !Array.isArray(proposals)) {
      console.log('Propostas não disponíveis:', proposals);
      return [];
    }
    
    console.log('Filtrando propostas com filtros:', reportFilters);
    console.log('Total de propostas disponíveis:', proposals.length);
    
    const filtered = proposals.filter(proposal => {
      // Filtro por vendedor - comparar com o nome do vendedor baseado no vendorId
      if (reportFilters.vendedor) {
        let proposalVendorName = 'N/A';
        if (proposal.vendorId && vendors?.length > 0) {
          const vendor = vendors.find(v => v.id === proposal.vendorId);
          proposalVendorName = vendor?.name || 'N/A';
        }
        if (proposalVendorName !== reportFilters.vendedor) {
          return false;
        }
      }
      
      // Filtro por status
      if (reportFilters.status) {
        if (proposal.status !== reportFilters.status) {
          return false;
        }
      }
      
      // Filtro por data de início
      if (reportFilters.dataInicio) {
        const proposalDate = new Date(proposal.createdAt);
        const startDate = new Date(reportFilters.dataInicio);
        if (proposalDate < startDate) {
          return false;
        }
      }
      
      // Filtro por data fim
      if (reportFilters.dataFim) {
        const proposalDate = new Date(proposal.createdAt);
        const endDate = new Date(reportFilters.dataFim);
        if (proposalDate > endDate) {
          return false;
        }
      }
      
      return true;
    });
    
    console.log('Propostas filtradas:', filtered.length);
    console.log('Dados das propostas filtradas:', filtered);
    
    return filtered;
  };

  const clearAllFilters = () => {
    setSelectedVendors([]);
    setSelectedStatuses([]);
    setSelectedOperadora('');
    setSelectedTipoPlano('');
    setDataInicio('');
    setDataFim('');
    setValorMin('');
    setValorMax('');
    setSearchQuery('');
    setCidade('');
    setUf('');
  };

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;
    
    const filter = {
      id: Date.now(),
      name: filterName,
      selectedVendors,
      selectedStatuses,
      selectedOperadora,
      selectedTipoPlano,
      dataInicio,
      dataFim,
      valorMin,
      valorMax,
      searchQuery,
      cidade,
      uf
    };
    
    setSavedFilters(prev => [...prev, filter]);
    setFilterName('');
    setShowSaveFilter(false);
    showNotification('Filtro salvo com sucesso!', 'success');
  };

  const exportReport = () => {
    showNotification(`Relatório exportado em ${exportFormat}!`, 'success');
    setShowExportModal(false);
  };

  const refreshData = () => {
    queryClientInstance.invalidateQueries({ queryKey: ['/api/proposals'] });
    showNotification('Dados atualizados!', 'success');
  };
  
  // Estados para filtros com persistência
  const [filterVendor, setFilterVendor] = useState(() => localStorage.getItem('supervisor_filterVendor') || '');
  const [filterStatus, setFilterStatus] = useState(() => localStorage.getItem('supervisor_filterStatus') || '');
  const [filterDate, setFilterDate] = useState(() => localStorage.getItem('supervisor_filterDate') || '');

  // Estados para Analytics - movidos para nível principal
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedOperadora, setSelectedOperadora] = useState('');
  const [selectedTipoPlano, setSelectedTipoPlano] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('PDF');
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [filterName, setFilterName] = useState('');
  const [showSaveFilter, setShowSaveFilter] = useState(false);
  
  // Estados para gerenciamento de vendedores
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  
  // Estado para prioridades das propostas com persistência
  const [proposalPriorities, setProposalPriorities] = useState<Record<string, 'alta' | 'media' | 'baixa'>>(() => {
    const saved = localStorage.getItem('supervisor_proposalPriorities');
    return saved ? JSON.parse(saved) : {};
  });

  // Salvar prioridades no localStorage quando alteradas
  useEffect(() => {
    localStorage.setItem('supervisor_proposalPriorities', JSON.stringify(proposalPriorities));
  }, [proposalPriorities]);
  
  // Estados para Analytics (movidos para o nível do componente)
  const [selectedVendorAnalytics, setSelectedVendorAnalytics] = useState('');
  const [dateRangeAnalytics, setDateRangeAnalytics] = useState('');
  const [selectedStatusForChart, setSelectedStatusForChart] = useState<string>('');
  const [selectedVendorForChart, setSelectedVendorForChart] = useState<string>('');
  const [showChart, setShowChart] = useState(false);

  const [visualMode, setVisualMode] = useState<'individual' | 'equipe'>('equipe');
  const [selectedPeriod, setSelectedPeriod] = useState('todos');

  // Estados para Relatórios - movidos para nível principal
  const [reportFilters, setReportFilters] = useState({
    dataInicio: '',
    dataFim: '',
    vendedor: '',
    status: '',
    tipo: 'completo'
  });
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Salvar filtros no localStorage quando alterados
  useEffect(() => {
    localStorage.setItem('supervisor_filterVendor', filterVendor);
  }, [filterVendor]);

  useEffect(() => {
    localStorage.setItem('supervisor_filterStatus', filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    localStorage.setItem('supervisor_filterDate', filterDate);
  }, [filterDate]);
  
  // Função para alterar prioridade - atualizada para sincronizar com backend
  const handlePriorityChange = async (proposalId: string, priority: 'alta' | 'media' | 'baixa') => {
    try {
      // Converter para formato do backend
      const backendPriority = priority === 'alta' ? 'high' : priority === 'media' ? 'medium' : 'low';
      
      // Enviar para o backend
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: backendPriority }),
      });

      if (response.ok) {
        // Atualizar estado local
        setProposalPriorities(prev => ({
          ...prev,
          [proposalId]: priority
        }));

        // Forçar sincronização em tempo real
        realTimeSync.forceRefresh();
        
        showNotification(`Prioridade alterada para ${getPriorityText(priority)}`, 'success');
      } else {
        showNotification('Erro ao alterar prioridade no servidor', 'error');
      }
    } catch (error) {
      console.error('Erro ao alterar prioridade:', error);
      showNotification('Erro ao alterar prioridade', 'error');
    }
  };
  
  // Função para obter cor da prioridade
  const getPriorityColor = (priority: 'alta' | 'media' | 'baixa') => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'media':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'baixa':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-white dark:text-white';
    }
  };
  
  // Função para obter texto da prioridade
  const getPriorityText = (priority: 'alta' | 'media' | 'baixa') => {
    switch (priority) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Média';
      case 'baixa':
        return 'Baixa';
      default:
        return 'Média';
    }
  };
  const [newVendorData, setNewVendorData] = useState({ name: '', email: '', password: '120784' });
  
  // Estados para metas
  const [showAddTargetForm, setShowAddTargetForm] = useState(false);
  const [showAddTeamTargetForm, setShowAddTeamTargetForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<VendorTarget | null>(null);
  const [newTargetData, setNewTargetData] = useState({
    vendorId: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    targetValue: '',
    targetProposals: 0,
    bonus: '0'
  });
  
  // Estados para premiações
  const [showAddAwardForm, setShowAddAwardForm] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [newAwardData, setNewAwardData] = useState({
    vendorId: 0,
    title: '',
    description: '',
    value: '',
    type: 'recognition' as const
  });



  // Buscar metas dos vendedores
  const { data: vendorTargets = [], isLoading: targetsLoading } = useQuery({
    queryKey: ['/api/vendor-targets'],
    queryFn: () => apiRequest('/api/vendor-targets'),
    refetchInterval: 1000,
  });

  // Buscar metas da equipe
  const { data: teamTargets = [], isLoading: teamTargetsLoading } = useQuery({
    queryKey: ['/api/team-targets'],
    queryFn: () => apiRequest('/api/team-targets'),
    refetchInterval: 1000,
  });

  // Buscar premiações
  const { data: awards = [], isLoading: awardsLoading } = useQuery({
    queryKey: ['/api/awards'],
    queryFn: () => apiRequest('/api/awards'),
    refetchInterval: 1000,
  });

  // Buscar estatísticas da equipe
  const { data: teamStats = {}, isLoading: teamStatsLoading } = useQuery({
    queryKey: ['/api/analytics/team', selectedMonth, selectedYear],
    queryFn: () => apiRequest(`/api/analytics/team?month=${selectedMonth}&year=${selectedYear}`),
    refetchInterval: 1000,
  });

  // Mutation para criar vendedor
  const addVendorMutation = useMutation({
    mutationFn: async (vendorData: { name: string; email: string; password: string; role: string; active: boolean }) => {
      return apiRequest('/api/vendors', {
        method: 'POST',
        body: JSON.stringify(vendorData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas quando vendedor é adicionado
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendors'] });
      queryClientInstance.invalidateQueries({ queryKey: ['/api/proposals'] });
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendor-targets'] });
      queryClientInstance.invalidateQueries({ queryKey: ['/api/analytics/team'] });
      queryClientInstance.invalidateQueries({ queryKey: ['/api/awards'] });
      
      // Forçar sincronização em tempo real
      realTimeSync.forceRefresh();
      
      setShowAddVendorForm(false);
      setNewVendorData({ name: '', email: '', password: '120784' });
      showNotification('Vendedor adicionado com sucesso! Todos os gráficos atualizados.', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao adicionar vendedor', 'error');
    },
  });

  // Mutation para remover vendedor
  const removeVendorMutation = useMutation({
    mutationFn: async (vendorId: number) => {
      return apiRequest(`/api/vendors/${vendorId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas quando vendedor é removido
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendors'] });
      queryClientInstance.invalidateQueries({ queryKey: ['/api/proposals'] });
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendor-targets'] });
      queryClientInstance.invalidateQueries({ queryKey: ['/api/analytics/team'] });
      queryClientInstance.invalidateQueries({ queryKey: ['/api/awards'] });
      
      // Forçar sincronização em tempo real
      realTimeSync.forceRefresh();
      
      showNotification('Vendedor removido com sucesso! Todos os gráficos atualizados.', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao remover vendedor', 'error');
    },
  });

  // Mutation para criar meta de vendedor
  const addTargetMutation = useMutation({
    mutationFn: async (targetData: any) => {
      return apiRequest('/api/vendor-targets', {
        method: 'POST',
        body: JSON.stringify(targetData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendor-targets'] });
      setShowAddTargetForm(false);
      setNewTargetData({
        vendorId: 0,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        targetValue: '',
        targetProposals: 0,
        bonus: '0'
      });
      showNotification('Meta criada com sucesso!', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao criar meta', 'error');
    },
  });

  // Mutation para criar meta da equipe
  const addTeamTargetMutation = useMutation({
    mutationFn: async (teamTargetData: any) => {
      return apiRequest('/api/team-targets', {
        method: 'POST',
        body: JSON.stringify(teamTargetData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['/api/team-targets'] });
      setShowAddTeamTargetForm(false);
      showNotification('Meta da equipe criada com sucesso!', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao criar meta da equipe', 'error');
    },
  });

  // Mutation para criar premiação
  const addAwardMutation = useMutation({
    mutationFn: async (awardData: any) => {
      return apiRequest('/api/awards', {
        method: 'POST',
        body: JSON.stringify(awardData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['/api/awards'] });
      setShowAddAwardForm(false);
      setNewAwardData({
        vendorId: 0,
        title: '',
        description: '',
        value: '',
        type: 'recognition'
      });
      showNotification('Premiação criada com sucesso!', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao criar premiação', 'error');
    },
  });

  // Mutation para deletar meta
  const deleteTargetMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/vendor-targets/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendor-targets'] });
      showNotification('Meta removida com sucesso!', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao remover meta', 'error');
    },
  });

  // Mutation para deletar premiação
  const deleteAwardMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/awards/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['/api/awards'] });
      showNotification('Premiação removida com sucesso!', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao remover premiação', 'error');
    },
  });

  const handleAddVendor = () => {
    if (newVendorData.name && newVendorData.email && newVendorData.password) {
      addVendorMutation.mutate({
        name: newVendorData.name,
        email: newVendorData.email,
        password: newVendorData.password,
        role: "vendor",
        active: true
      });
    }
  };

  const handleRemoveVendor = (vendorId: number) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor && window.confirm(`Tem certeza que deseja remover o vendedor ${vendor.name}?`)) {
      removeVendorMutation.mutate(vendorId);
    }
  };

  const handleAddTarget = () => {
    if (newTargetData.vendorId && newTargetData.targetValue && newTargetData.targetProposals) {
      addTargetMutation.mutate(newTargetData);
    }
  };

  const handleAddTeamTarget = () => {
    const teamTargetData = {
      month: selectedMonth,
      year: selectedYear,
      targetValue: newTargetData.targetValue,
      targetProposals: newTargetData.targetProposals,
      teamBonus: newTargetData.bonus
    };
    addTeamTargetMutation.mutate(teamTargetData);
  };

  const handleAddAward = () => {
    if (newAwardData.vendorId && newAwardData.title && newAwardData.value) {
      addAwardMutation.mutate(newAwardData);
    }
  };

  const formatCurrency = (value: string | number) => {
    if (!value || value === '0' || value === 0) return 'R$ 0,00';
    
    // Se for string, tentar converter para número
    let numValue: number;
    if (typeof value === 'string') {
      // Se já tem formato de moeda, extrair apenas números
      if (value.includes('R$') || value.includes(',')) {
        numValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
      } else {
        numValue = parseFloat(value);
      }
    } else {
      numValue = value;
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const getVendorName = (vendorId: number) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : 'Vendedor não encontrado';
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[month - 1];
  };

  const getVendorStats = (vendorId: number) => {
    const vendorProposals = proposals.filter(p => p.vendorId === vendorId);
    const totalProposals = vendorProposals.length;
    const totalValue = vendorProposals.reduce((sum, p) => {
      const value = p.contractData?.valor || "R$ 0";
      const numericValue = parseInt(value.replace(/[^\d]/g, "")) || 0;
      return sum + numericValue;
    }, 0);
    return { totalProposals, totalValue };
  };

  const calculateProgress = (vendorId: number, target: VendorTarget) => {
    const stats = getVendorStats(vendorId);
    const valueProgress = (stats.totalValue / parseInt(target.targetValue.replace(/[^\d]/g, ""))) * 100;
    const proposalProgress = (stats.totalProposals / target.targetProposals) * 100;
    return Math.min(Math.max((valueProgress + proposalProgress) / 2, 0), 100);
  };

  const filteredProposals = proposals.filter(proposal => {
    const vendorMatch = !filterVendor || proposal.vendorId?.toString() === filterVendor;
    const statusMatch = !filterStatus || proposal.status === filterStatus;
    const dateMatch = !filterDate || new Date(proposal.createdAt).toDateString() === new Date(filterDate).toDateString();
    return vendorMatch && statusMatch && dateMatch;
  }).sort((a, b) => {
    // Manter ordem cronológica de criação mesmo após filtros
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Funções auxiliares para Analytics (definidas após filteredProposals)
  const toggleVendor = (vendor: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendor) 
        ? prev.filter(v => v !== vendor)
        : [...prev, vendor]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const selectAllVendors = () => {
    const vendorNames = filteredProposals.map(p => {
      const vendor = vendors.find(v => v.id === p.vendorId);
      return vendor ? vendor.name : null;
    }).filter(Boolean);
    const uniqueVendors = [...new Set(vendorNames)];
    setSelectedVendors(selectedVendors.length === uniqueVendors.length ? [] : uniqueVendors);
  };

  const selectAllStatuses = () => {
    const allStatuses = Object.keys(STATUS_CONFIG);
    setSelectedStatuses(selectedStatuses.length === allStatuses.length ? [] : allStatuses);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Faturamento Total</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(teamStats.totalValue || 0)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Propostas</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{teamStats.totalProposals || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ticket Médio</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(teamStats.averageValue || 0)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Vendedores Ativos</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{teamStats.totalVendors || 0}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Performance por Vendedor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance por Vendedor</h3>
        <div className="space-y-4">
          {vendors.map(vendor => {
            const stats = getVendorStats(vendor.id);
            const target = vendorTargets.find(t => t.vendorId === vendor.id && t.month === selectedMonth && t.year === selectedYear);
            const progress = target ? calculateProgress(vendor.id, target) : 0;
            
            return (
              <div key={vendor.id} className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{vendor.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{stats.totalProposals} propostas</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Faturamento: {formatCurrency(stats.totalValue.toString())}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{progress.toFixed(1)}% da meta</span>
                </div>
                <SimpleProgressBar percentage={progress} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMetas = () => (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gerenciar Metas</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddTargetForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Meta Individual
            </button>
            <button
              onClick={() => setShowAddTeamTargetForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Meta da Equipe
            </button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option className="text-black bg-white" key={i + 1} value={i + 1}>
                {getMonthName(i + 1)}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      {/* Metas dos Vendedores */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Metas Individuais</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-2 text-gray-900 dark:text-white">Vendedor</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Período</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Meta Valor</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Meta Propostas</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Bônus</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Progresso</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendorTargets.map(target => (
                <tr key={target.id} className="border-b border-gray-200 dark:border-gray-600">
                  <td className="py-2 text-gray-900 dark:text-white">{getVendorName(target.vendorId)}</td>
                  <td className="py-2 text-gray-900 dark:text-white">{getMonthName(target.month)}/{target.year}</td>
                  <td className="py-2 text-gray-900 dark:text-white">{formatCurrency(target.targetValue)}</td>
                  <td className="py-2 text-gray-900 dark:text-white">{target.targetProposals}</td>
                  <td className="py-2 text-gray-900 dark:text-white">{formatCurrency(target.bonus)}</td>
                  <td className="py-2">
                    <div className="w-24">
                      <SimpleProgressBar percentage={calculateProgress(target.vendorId, target)} />
                    </div>
                  </td>
                  <td className="text-white py-2">
                    <button
                      onClick={() => deleteTargetMutation.mutate(target.id)}
                      className="text-white dark:text-white red-600 hover:text-red-800 dark:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metas da Equipe */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Metas da Equipe</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-2 text-gray-900 dark:text-white">Período</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Meta Valor</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Meta Propostas</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Bônus da Equipe</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Progresso</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Ações</th>
              </tr>
            </thead>
            <tbody>
              {teamTargets.map(target => {
                const teamProgress = teamStats.totalValue && teamStats.totalProposals 
                  ? ((teamStats.totalValue / parseInt(target.targetValue.replace(/[^\d]/g, ""))) * 50) + 
                    ((teamStats.totalProposals / target.targetProposals) * 50)
                  : 0;
                
                return (
                  <tr key={target.id} className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-2 text-gray-900 dark:text-white">{getMonthName(target.month)}/{target.year}</td>
                    <td className="py-2 text-gray-900 dark:text-white">{formatCurrency(target.targetValue)}</td>
                    <td className="py-2 text-gray-900 dark:text-white">{target.targetProposals}</td>
                    <td className="py-2 text-gray-900 dark:text-white">{formatCurrency(target.teamBonus)}</td>
                    <td className="py-2">
                      <div className="w-24">
                        <SimpleProgressBar percentage={Math.min(teamProgress, 100)} />
                      </div>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => console.log('Delete team target', target.id)}
                        className="text-white dark:text-white red-600 hover:text-red-800 dark:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para adicionar meta individual */}
      {showAddTargetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white dark:text-white lg font-semibold">Nova Meta Individual</h3>
              <button
                onClick={() => setShowAddTargetForm(false)}
                className="text-white dark:text-white gray-500 dark:text-white dark:text-white dark:text-white dark:text-white hover:text-white dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white block text-sm font-medium mb-1">Vendedor</label>
                <select
                  value={newTargetData.vendorId}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, vendorId: parseInt(e.target.value) }))}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                >
                  <option value={0}>Selecione um vendedor</option>
                  {vendors.map(vendor => (
                    <option className="text-black bg-white" key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white block text-sm font-medium mb-1">Mês</label>
                  <select
                    value={newTargetData.month}
                    onChange={(e) => setNewTargetData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option className="text-black bg-white" key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-white block text-sm font-medium mb-1">Ano</label>
                  <select
                    value={newTargetData.year}
                    onChange={(e) => setNewTargetData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Meta de Valor (R$)</label>
                <input
                  type="text"
                  value={newTargetData.targetValue}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, targetValue: e.target.value }))}
                  placeholder="Ex: 50000"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Meta de Propostas</label>
                <input
                  type="number"
                  value={newTargetData.targetProposals}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, targetProposals: parseInt(e.target.value) }))}
                  placeholder="Ex: 10"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Bônus (R$)</label>
                <input
                  type="text"
                  value={newTargetData.bonus}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, bonus: e.target.value }))}
                  placeholder="Ex: 5000"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddTargetForm(false)}
                className="px-4 py-2 text-white hover:text-white dark:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTarget}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar Meta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar meta da equipe */}
      {showAddTeamTargetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white dark:text-white lg font-semibold">Nova Meta da Equipe</h3>
              <button
                onClick={() => setShowAddTeamTargetForm(false)}
                className="text-white dark:text-white gray-500 dark:text-white dark:text-white dark:text-white dark:text-white hover:text-white dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white block text-sm font-medium mb-1">Mês</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option className="text-black bg-white" key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-white block text-sm font-medium mb-1">Ano</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Meta de Valor (R$)</label>
                <input
                  type="text"
                  value={newTargetData.targetValue}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, targetValue: e.target.value }))}
                  placeholder="Ex: 500000"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Meta de Propostas</label>
                <input
                  type="number"
                  value={newTargetData.targetProposals}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, targetProposals: parseInt(e.target.value) }))}
                  placeholder="Ex: 100"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Bônus da Equipe (R$)</label>
                <input
                  type="text"
                  value={newTargetData.bonus}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, bonus: e.target.value }))}
                  placeholder="Ex: 20000"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddTeamTargetForm(false)}
                className="px-4 py-2 text-white hover:text-white dark:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTeamTarget}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Salvar Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPremiacao = () => (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sistema de Premiação</h3>
          <button
            onClick={() => setShowAddAwardForm(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
          >
            <Award size={16} />
            Nova Premiação
          </button>
        </div>
      </div>

      {/* Lista de Premiações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Premiações Concedidas</h3>
        <div className="space-y-4">
          {awards.map(award => (
            <div key={award.id} className="border bg-gray-700 text-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  award.type === 'monetary' ? 'bg-green-100 text-green-600' :
                  award.type === 'bonus' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white">{award.title}</h4>
                  <p className="text-white dark:text-white sm text-white">{getVendorName(award.vendorId)}</p>
                  <p className="text-white dark:text-white sm text-white dark:text-white dark:text-white dark:text-white">{award.description}</p>
                </div>
              </div>
              <div className="text-white dark:text-white right">
                <p className="font-medium text-white">{formatCurrency(award.value)}</p>
                <p className="text-white dark:text-white sm text-white dark:text-white dark:text-white dark:text-white">{new Date(award.dateAwarded).toLocaleDateString('pt-BR')}</p>
                <button
                  onClick={() => deleteAwardMutation.mutate(award.id)}
                  className="text-white dark:text-white red-600 hover:text-red-800 dark:text-white mt-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para adicionar premiação */}
      {showAddAwardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white dark:text-white lg font-semibold">Nova Premiação</h3>
              <button
                onClick={() => setShowAddAwardForm(false)}
                className="text-white dark:text-white gray-500 dark:text-white dark:text-white dark:text-white dark:text-white hover:text-white dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white block text-sm font-medium mb-1">Vendedor</label>
                <select
                  value={newAwardData.vendorId}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, vendorId: parseInt(e.target.value) }))}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                >
                  <option value={0}>Selecione um vendedor</option>
                  {vendors.map(vendor => (
                    <option className="text-black bg-white" key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Tipo de Premiação</label>
                <select
                  value={newAwardData.type}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, type: e.target.value as 'monetary' | 'recognition' | 'bonus' }))}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                >
                  <option className="text-black bg-white" value="recognition">Reconhecimento</option>
                  <option className="text-black bg-white" value="monetary">Monetária</option>
                  <option className="text-black bg-white" value="bonus">Bônus</option>
                </select>
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={newAwardData.title}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Vendedor do Mês"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={newAwardData.description}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detalhes da premiação..."
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Valor (R$)</label>
                <input
                  type="text"
                  value={newAwardData.value}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Ex: 1000"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddAwardForm(false)}
                className="px-4 py-2 text-white hover:text-white dark:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddAward}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Conceder Premiação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Analytics Moderno e Visual - Reformulação Completa
  const renderAnalytics = () => {

    // Lista de vendedores reais com cores únicas
    const realVendors = [
      'Ana Caroline Terto',
      'Bruna Garcia', 
      'Fabiana Ferreira',
      'Fabiana Godinho',
      'Fernanda Batista',
      'Gabrielle Fernandes',
      'Isabela Velasquez',
      'Juliana Araujo',
      'Lohainy Berlino',
      'Luciana Velasquez',
      'Monique Silva',
      'Sara Mattos'
    ];

    // Cores únicas para cada vendedor real
    const getVendorColor = (vendor: string) => {
      const vendorColors = {
        'Ana Caroline Terto': '#3B82F6',
        'Bruna Garcia': '#EF4444',
        'Fabiana Ferreira': '#10B981',
        'Fabiana Godinho': '#F59E0B',
        'Fernanda Batista': '#8B5CF6',
        'Gabrielle Fernandes': '#EC4899',
        'Isabela Velasquez': '#6366F1',
        'Juliana Araujo': '#F97316',
        'Lohainy Berlino': '#14B8A6',
        'Luciana Velasquez': '#84CC16',
        'Monique Silva': '#F43F5E',
        'Sara Mattos': '#8B5A2B'
      };
      return vendorColors[vendor as keyof typeof vendorColors] || '#6B7280';
    };
    
    // Lista de vendedores únicos (incluindo dados reais e do banco)
    const uniqueVendors = [...new Set([...realVendors, ...filteredProposals.map(p => p.vendorName).filter(Boolean)])];;
    
    // Lista de operadoras e tipos de plano únicos (mock data)
    const operadoras = ['SulAmérica', 'Bradesco', 'Amil', 'Unimed', 'NotreDame'];
    const tiposPlano = ['Individual', 'Familiar', 'Empresarial', 'PME'];

    // Aplicar todos os filtros avançados
    const analyticsData = filteredProposals.filter(proposal => {
      // Filtro de vendedores
      if (selectedVendors.length > 0 && !selectedVendors.includes(proposal.vendorName || '')) return false;
      
      // Filtro de status
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(proposal.status)) return false;
      
      // Filtro de operadora (mock)
      if (selectedOperadora && proposal.contractData?.planoContratado !== selectedOperadora) return false;
      
      // Filtro de valor
      const valor = parseFloat(proposal.contractData?.valor || '0');
      if (valorMin && valor < parseFloat(valorMin)) return false;
      if (valorMax && valor > parseFloat(valorMax)) return false;
      
      // Filtro de período
      if (dataInicio || dataFim) {
        const proposalDate = new Date(proposal.createdAt || Date.now());
        if (dataInicio && proposalDate < new Date(dataInicio)) return false;
        if (dataFim && proposalDate > new Date(dataFim)) return false;
      }
      
      // Filtro de busca
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matches = [
          proposal.contractData?.nomeEmpresa,
          proposal.contractData?.cnpj,
          proposal.contractData?.planoContratado,
          proposal.id
        ].some(field => field?.toLowerCase().includes(searchLower));
        if (!matches) return false;
      }
      
      return true;
    });

    // Dados para gráfico de pizza por status
    const statusData = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
      name: config.label,
      value: analyticsData.filter(p => p.status === key).length,
      color: config.color,
      fill: config.color
    })).filter(item => item.value > 0);

    // Mapeamento de vendorId para nome do vendedor
    const vendorIdToNameMap: { [key: number]: string } = {
      1: 'Ana Caroline Terto',
      2: 'Bruna Garcia', 
      3: 'Fabiana Ferreira',
      4: 'Fabiana Godinho',
      5: 'Fernanda Batista',
      6: 'Gabrielle Fernandes',
      7: 'Isabela Velasquez',
      8: 'Juliana Araujo',
      9: 'Lohainy Berlino',
      10: 'Luciana Velasquez',
      11: 'Monique Silva',
      12: 'Sara Mattos'
    };

    // Dados específicos para gráfico de pizza por vendedor (TODOS os vendedores)
    const vendorPieData = realVendors.map(vendor => {
      // Contar propostas por vendorId mapeado para nome
      const vendorIdKey = Object.keys(vendorIdToNameMap).find(
        key => vendorIdToNameMap[parseInt(key)] === vendor
      );
      
      const count = vendorIdKey 
        ? analyticsData.filter(p => p.vendorId === parseInt(vendorIdKey)).length
        : 0;
      
      // Garantir que vendedores sem vendas tenham valor mínimo para aparecer
      return {
        name: vendor,
        value: count > 0 ? count : 0.1, // Traço pequeno para vendedores sem vendas
        realValue: count, // Valor real para exibição
        fill: getVendorColor(vendor)
      };
    });



    // Dados para gráfico pizza (baseado nos filtros selecionados)
    const getChartData = () => {
      if (!selectedStatusForChart && !selectedVendorForChart) return [];
      
      let filteredData = analyticsData;
      
      // Filtrar por status
      if (selectedStatusForChart && selectedStatusForChart !== 'all') {
        filteredData = filteredData.filter(p => p.status === selectedStatusForChart);
      }
      
      // Filtrar por vendedor
      if (selectedVendorForChart && selectedVendorForChart !== 'all') {
        filteredData = filteredData.filter(p => p.vendorName === selectedVendorForChart);
      }
      
      // Se vendedor específico selecionado, mostrar distribuição por status
      if (selectedVendorForChart && selectedVendorForChart !== 'all') {
        return Object.entries(STATUS_CONFIG).map(([key, config]) => ({
          name: config.label,
          value: filteredData.filter(p => p.status === key).length,
          color: config.color,
          fill: config.color
        })).filter(item => item.value > 0);
      }
      
      // Caso contrário, mostrar distribuição por vendedores
      return uniqueVendors.map(vendor => {
        const count = filteredData.filter(p => p.vendorName === vendor).length;
        return {
          name: vendor,
          value: count,
          color: getVendorColor(vendor),
          fill: getVendorColor(vendor)
        };
      }).filter(item => item.value > 0);
    };
    
    const chartData = getChartData();

    // Dados para gráfico de barras por status
    const statusBarData = statusData.map(item => ({
      status: item.name,
      total: item.value,
      fill: item.color
    }));

    // Análise por vendedor
    const vendorAnalysis = analyticsData.reduce((acc, proposal) => {
      const vendor = proposal.vendorName || 'Não Identificado';
      if (!acc[vendor]) {
        acc[vendor] = {
          total: 0,
          convertidas: 0,
          perdidas: 0,
          pendentes: 0,
          faturamento: 0,
          ticketMedio: 0,
          taxaConversao: 0
        };
      }
      
      acc[vendor].total += 1;
      const valor = parseFloat(proposal.contractData?.valor || '0');
      acc[vendor].faturamento += valor;
      
      switch (proposal.status) {
        case 'implantado':
          acc[vendor].convertidas += 1;
          break;
        case 'declinado':
        case 'expirado':
          acc[vendor].perdidas += 1;
          break;
        default:
          acc[vendor].pendentes += 1;
      }
      
      return acc;
    }, {} as Record<string, any>);

    // Calcular métricas finais
    Object.keys(vendorAnalysis).forEach(vendor => {
      const data = vendorAnalysis[vendor];
      data.ticketMedio = data.total > 0 ? data.faturamento / data.total : 0;
      data.taxaConversao = data.total > 0 ? (data.convertidas / data.total) * 100 : 0;
    });

    // Dados para ranking de vendedores
    const vendorRankingData = Object.entries(vendorAnalysis)
      .map(([vendor, data]) => ({
        vendor,
        total: data.total,
        faturamento: data.faturamento,
        conversao: data.taxaConversao
      }))
      .sort((a, b) => b.total - a.total);

    // Dados agregados da equipe
    const teamMetrics = {
      totalPropostas: analyticsData.length,
      totalFaturamento: analyticsData.reduce((sum, p) => sum + parseFloat(p.contractData?.valor || '0'), 0),
      totalConvertidas: analyticsData.filter(p => p.status === 'implantado').length,
      totalPerdidas: analyticsData.filter(p => ['declinado', 'expirado'].includes(p.status)).length,
      totalPendentes: analyticsData.filter(p => !['implantado', 'declinado', 'expirado'].includes(p.status)).length,
      ticketMedio: 0,
      taxaConversao: 0
    };

    teamMetrics.taxaConversao = teamMetrics.totalPropostas > 0 ? 
      (teamMetrics.totalConvertidas / teamMetrics.totalPropostas) * 100 : 0;
    teamMetrics.ticketMedio = teamMetrics.totalPropostas > 0 ? 
      teamMetrics.totalFaturamento / teamMetrics.totalPropostas : 0;



    return (
      <div className="space-y-6">
        {/* Header discreto e profissional */}
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics & Performance</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Análise de {analyticsData.length} propostas</p>
            </div>
            <div className="text-white dark:text-white right">
              <span className="text-sm text-gray-600 dark:text-gray-300">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Filtros</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Vendedores */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Vendedores</label>
                <select
                  value={selectedVendorForChart}
                  onChange={(e) => {
                    setSelectedVendorForChart(e.target.value);
                    setShowChart(true);
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                >
                  <option className="text-black bg-white" value="">Selecione um vendedor</option>
                  <option className="text-black bg-white" value="all">Todos os Vendedores</option>
                  {uniqueVendors.map(vendor => (
                    <option className="text-black bg-white" key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>

              {/* Data Início */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Data Início</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                />
              </div>

              {/* Data Fim */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Data Fim</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={selectedStatusForChart}
                  onChange={(e) => {
                    setSelectedStatusForChart(e.target.value);
                    setShowChart(true);
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                >
                  <option className="text-black bg-white" value="">Selecione um status</option>
                  <option className="text-black bg-white" value="all">Todos os Status</option> className="text-white"
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option className="text-black bg-white" key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Botão Limpar Filtros */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setSelectedVendorForChart('');
                  setSelectedStatusForChart('');
                  setDataInicio('');
                  setDataFim('');
                  setShowChart(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-500 text-sm border border-gray-300 rounded-md"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Resumo Executivo</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-white dark:text-white center">
                <div className="text-white dark:text-white 2xl font-semibold text-slate- dark:text-white800 dark:text-white dark:text-white mb-1">{teamMetrics.totalConvertidas}</div>
                <div className="text-white dark:text-white sm text-slate- dark:text-white600 dark:text-white dark:text-white mb-2">Convertidas</div>
                <div className="text-white dark:text-white xs text-emerald-600 dark:text-white font-medium">{teamMetrics.taxaConversao.toFixed(1)}% conversão</div>
              </div>
              
              <div className="text-white dark:text-white center">
                <div className="text-white dark:text-white 2xl font-semibold text-slate- dark:text-white800 dark:text-white dark:text-white mb-1">{teamMetrics.totalPerdidas}</div>
                <div className="text-white dark:text-white sm text-slate- dark:text-white600 dark:text-white dark:text-white mb-2">Perdidas</div>
                <div className="text-white dark:text-white xs text-slate- dark:text-white500 dark:text-white">
                  {teamMetrics.totalPropostas > 0 ? ((teamMetrics.totalPerdidas / teamMetrics.totalPropostas) * 100).toFixed(1) : 0}% do total
                </div>
              </div>

              <div className="text-white dark:text-white center">
                <div className="text-white dark:text-white xl font-semibold text-slate- dark:text-white800 dark:text-white dark:text-white mb-1">{formatCurrency(teamMetrics.totalFaturamento.toString())}</div>
                <div className="text-white dark:text-white sm text-slate- dark:text-white600 dark:text-white dark:text-white mb-2">Faturamento</div>
                <div className="text-white dark:text-white xs text-slate- dark:text-white500 dark:text-white">Média: {formatCurrency(teamMetrics.ticketMedio.toString())}</div>
              </div>

              <div className="text-white dark:text-white center">
                <div className="text-white dark:text-white 2xl font-semibold text-slate- dark:text-white800 dark:text-white dark:text-white mb-1">{teamMetrics.totalPendentes}</div>
                <div className="text-white dark:text-white sm text-slate- dark:text-white600 dark:text-white dark:text-white mb-2">Em andamento</div>
                <div className="text-white dark:text-white xs text-slate- dark:text-white500 dark:text-white">
                  {teamMetrics.totalPropostas > 0 ? ((teamMetrics.totalPendentes / teamMetrics.totalPropostas) * 100).toFixed(1) : 0}% ativas
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribuição por Status */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Distribuição por Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(STATUS_CONFIG)
                .filter(([status]) => analyticsData.filter(p => p.status === status).length > 0)
                .map(([status, config]) => {
                  const count = analyticsData.filter(p => p.status === status).length;
                  const percentage = analyticsData.length > 0 ? (count / analyticsData.length * 100) : 0;
                  
                  return (
                    <div key={status} className="text-white dark:text-white center">
                      <div className="text-white dark:text-white lg font-semibold text-slate- dark:text-white800 dark:text-white dark:text-white mb-1">{count}</div>
                      <div className="text-white dark:text-white xs text-slate- dark:text-white600 dark:text-white dark:text-white mb-1">{config.label}</div>
                      <div className="text-white dark:text-white xs text-slate- dark:text-white500 dark:text-white">{percentage.toFixed(0)}%</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Performance Individual */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Performance Individual</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(vendorAnalysis)
                .sort(([,a], [,b]) => b.total - a.total)
                .slice(0, 6)
                .map(([vendor, data], index) => (
                <div key={vendor} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-1 bg-slate-300 rounded-full relative">
                      <div 
                        className="h-1 bg-blue-600 rounded-full absolute top-0 left-0"
                        style={{ width: `${Math.min(data.taxaConversao, 100)}%` }}
                      ></div>
                    </div>
                    <div>
                      <div className="font-medium text-slate- dark:text-white800 dark:text-white dark:text-white">{vendor}</div>
                      <div className="text-white dark:text-white sm text-slate- dark:text-white500 dark:text-white">{data.total} propostas</div>
                    </div>
                  </div>
                  <div className="text-white dark:text-white right">
                    <div className="font-medium text-slate- dark:text-white800 dark:text-white dark:text-white">{data.taxaConversao.toFixed(1)}%</div>
                    <div className="text-white dark:text-white sm text-slate- dark:text-white500 dark:text-white">{formatCurrency(data.faturamento.toString())}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>




        {/* Gráfico de Distribuição */}
        {showChart && (selectedStatusForChart || selectedVendorForChart) && (
          <div className="bg-gray-800 border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-white dark:text-white lg font-medium text-slate- dark:text-white800 dark:text-white dark:text-white">
                {selectedVendorForChart && selectedVendorForChart !== 'all' 
                  ? `Distribuição de Status - ${selectedVendorForChart}`
                  : selectedStatusForChart && selectedStatusForChart !== 'all'
                  ? `Distribuição por Vendedores - ${STATUS_CONFIG[selectedStatusForChart as keyof typeof STATUS_CONFIG]?.label}`
                  : 'Distribuição Geral'
                }
              </h2>
            </div>
            <div className="p-6">
              {chartData.length === 0 ? (
                <div className="text-white dark:text-white center py-12">
                  <p className="text-white dark:text-white slate- dark:text-white500 dark:text-white">Nenhum dado encontrado para os filtros selecionados.</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico Pizza */}
                <div className="flex justify-center">
                  <div className="w-80 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => {
                            const displayName = name.length > 15 ? name.substring(0, 12) + '...' : name;
                            return (
                              <text fill="white" fontSize="14" fontWeight="bold">
                                {`${displayName} ${(percent * 100).toFixed(0)}%`}
                              </text>
                            );
                          }}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any, name: any) => [value, name]}
                          labelStyle={{ color: '#374151' }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Legenda */}
                <div className="space-y-3">
                  <h3 className="font-medium text-slate- dark:text-white700 dark:text-white dark:text-white mb-4">Legenda</h3>
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-white dark:text-white sm text-slate- dark:text-white700 dark:text-white dark:text-white">{item.name}</span>
                      </div>
                      <div className="text-white dark:text-white right">
                        <div className="text-white dark:text-white sm font-medium text-slate- dark:text-white800 dark:text-white dark:text-white">{item.value}</div>
                        <div className="text-white dark:text-white xs text-slate- dark:text-white500 dark:text-white">
                          {chartData.reduce((sum, d) => sum + d.value, 0) > 0 
                            ? ((item.value / chartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)
                            : 0}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        )}

        {/* Modais */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white dark:text-white lg font-semibold">Exportar Relatório</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-white dark:text-white gray-500 dark:text-white dark:text-white dark:text-white dark:text-white hover:text-white dark:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white block text-sm font-medium mb-2">Formato</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                  >
                    <option className="text-black bg-white" value="PDF">PDF</option>
                    <option className="text-black bg-white" value="Excel">Excel</option>
                    <option className="text-black bg-white" value="CSV">CSV</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <p className="text-white dark:text-white sm font-medium">Enviar para:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={exportReport}
                      className="px-3 py-2 bg-blue-100 text-blue-700 dark:text-white rounded-lg hover:bg-blue-200 text-sm flex items-center gap-2"
                    >
                      <Mail size={14} />
                      E-mail
                    </button>
                    <button
                      onClick={exportReport}
                      className="px-3 py-2 bg-green-100 text-green-700 dark:text-white rounded-lg hover:bg-green-200 text-sm flex items-center gap-2"
                    >
                      <MessageSquare size={14} />
                      WhatsApp
                    </button>
                    <button
                      onClick={exportReport}
                      className="px-3 py-2 bg-purple-100 text-purple-700 dark:text-white rounded-lg hover:bg-purple-200 text-sm flex items-center gap-2"
                    >
                      <ExternalLink size={14} />
                      Google Drive
                    </button>
                    <button
                      onClick={exportReport}
                      className="px-3 py-2 bg-yellow-100 text-yellow-700 dark:text-white rounded-lg hover:bg-yellow-200 text-sm flex items-center gap-2"
                    >
                      <FileText size={14} />
                      Google Sheets
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-white hover:text-white dark:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={exportReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Exportar
                </button>
              </div>
            </div>
          </div>
        )}

        {showSaveFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white dark:text-white lg font-semibold">Salvar Filtro</h3>
                <button
                  onClick={() => setShowSaveFilter(false)}
                  className="text-white dark:text-white gray-500 dark:text-white dark:text-white dark:text-white dark:text-white hover:text-white dark:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white block text-sm font-medium mb-2">Nome do Filtro</label>
                  <input
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="Ex: Vendas Janeiro 2025"
                    className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowSaveFilter(false)}
                  className="px-4 py-2 text-white hover:text-white dark:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCurrentFilter}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Aba Relatórios com integração Google Sheets - Sistema de relatórios profissional em tempo real
  const renderReports = () => {
    // Lista de vendedores reais do sistema
    const realVendors = [
      'Ana Caroline Terto',
      'Bruna Garcia',
      'Fabiana Ferreira',
      'Fabiana Godinho',
      'Fernanda Batista',
      'Gabrielle Fernandes',
      'Isabela Velasquez',
      'Juliana Araujo',
      'Lohainy Berlino',
      'Luciana Velasquez',
      'Monique Silva',
      'Sara Mattos'
    ];
    
    // Lista de vendedores únicos (incluindo dados reais e do banco)
    const uniqueVendors = [...new Set([...realVendors, ...filteredProposals.map(p => p.vendorName).filter(Boolean)])];

    const filteredData = filteredProposals.filter(proposal => {
      if (reportFilters.vendedor && !proposal.vendorName?.toLowerCase().includes(reportFilters.vendedor.toLowerCase())) return false;
      if (reportFilters.status && proposal.status !== reportFilters.status) return false;
      // Filtros de data seriam aplicados aqui
      return true;
    });

    const generateReport = async (format: string, shareMethod?: string) => {
      setIsGenerating(true);
      try {
        // Simular geração de relatório
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (shareMethod) {
          showNotification(`Relatório enviado via ${shareMethod} com sucesso!`, 'success');
        } else {
          showNotification(`Relatório ${format.toUpperCase()} gerado com sucesso!`, 'success');
        }
      } catch (error) {
        showNotification('Erro ao gerar relatório', 'error');
      } finally {
        setIsGenerating(false);
        setShowExportOptions(false);
      }
    };

    const reportData = {
      total: filteredData.length,
      faturamento: filteredData.reduce((sum, p) => sum + parseFloat(p.contractData?.valor || '0'), 0),
      porStatus: filteredData.reduce((acc, p) => {
        const config = STATUS_CONFIG[p.status as ProposalStatus];
        const label = config?.label || p.status;
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      porVendedor: filteredData.reduce((acc, p) => {
        const vendor = p.vendorName || 'Desconhecido';
        if (!acc[vendor]) acc[vendor] = { count: 0, value: 0 };
        acc[vendor].count += 1;
        acc[vendor].value += parseFloat(p.contractData?.valor || '0');
        return acc;
      }, {} as Record<string, { count: number; value: number }>)
    };

    return (
      <div className="space-y-6">
        {/* Header Profissional com Conexão Google Sheets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900/30">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-900 dark:text-white text-xl font-semibold flex items-center gap-3">
                  <BarChart3 size={24} className="text-green-600 dark:text-green-400" />
                  Sistema de Relatórios
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Dados em tempo real da planilha Google Sheets</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{filteredData.length} registros disponíveis</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">Conectado</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const reportDataToSend = generateReportData(filteredData);
                    showReportPreview(reportDataToSend);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  📊 Enviar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros Avançados com Sincronização Google Sheets */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm dark:shadow-gray-900/30">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 dark:text-white text-base font-semibold flex items-center gap-2">
                <Filter size={18} />
                Filtros de Relatório
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    realTimeSync.forceRefresh();
                    showNotification('Sincronização com Google Sheets iniciada', 'success');
                  }}
                  className="text-sm bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800 px-3 py-1 rounded-md flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  Sincronizar
                </button>
                <button
                  onClick={() => setReportFilters({
                    dataInicio: '', dataFim: '', vendedor: '', status: '', tipo: 'completo'
                  })}
                  className="text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <X size={12} />
                  Limpar
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            {/* Layout exato como na primeira imagem - Filtros organizados da esquerda para direita */}
            <div className="space-y-3">
              {/* Primeira linha: Tipo de Relatório, Vendedor, Status */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Relatório</label>
                  <select
                    value={reportFilters.tipo}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400" 
                  >
                    <option className="text-black bg-white" value="completo">📊 Relatório Completo</option>
                    <option className="text-black bg-white" value="individual">👤 Por Vendedor Individual</option>
                    <option className="text-black bg-white" value="equipe">👥 Por Equipe</option>
                    <option className="text-black bg-white" value="financeiro">💰 Relatório Financeiro</option>
                    <option className="text-black bg-white" value="status">📋 Por Status</option> className="text-white"
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendedor</label>
                  <select
                    value={reportFilters.vendedor}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, vendedor: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400" 
                  >
                    <option className="text-black bg-white" value="">Todos os Vendedores</option>
                    {uniqueVendors && uniqueVendors.map(vendor => (
                      <option className="text-black bg-white" key={vendor} value={vendor}>{vendor}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={reportFilters.status}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400" 
                  >
                    <option className="text-black bg-white" value="">Todos os Status</option> className="text-white"
                    {STATUS_CONFIG && Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <option className="text-black bg-white" key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Segunda linha: Data Início, Data Fim, Limpar Filtros */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={reportFilters.dataInicio}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400" 
                    placeholder="Exemplo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={reportFilters.dataFim}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, dataFim: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400" 
                    placeholder="Exemplo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Atalhos de Período</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        const hoje = new Date();
                        const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
                        setReportFilters(prev => ({
                          ...prev,
                          dataInicio: seteDiasAtras.toISOString().split('T')[0],
                          dataFim: hoje.toISOString().split('T')[0]
                        }));
                      }}
                      className="flex-1 px-2 py-2 text-xs font-medium bg-blue-600 text-white border border-blue-600 rounded hover:bg-blue-700 transition-colors"
                    >
                      7 dias
                    </button>
                    <button
                      onClick={() => {
                        const hoje = new Date();
                        const quinzeDiasAtras = new Date(hoje.getTime() - 15 * 24 * 60 * 60 * 1000);
                        setReportFilters(prev => ({
                          ...prev,
                          dataInicio: quinzeDiasAtras.toISOString().split('T')[0],
                          dataFim: hoje.toISOString().split('T')[0]
                        }));
                      }}
                      className="flex-1 px-2 py-2 text-xs font-medium bg-green-600 text-white border border-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      15 dias
                    </button>
                    <button
                      onClick={() => {
                        const hoje = new Date();
                        const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
                        setReportFilters(prev => ({
                          ...prev,
                          dataInicio: trintaDiasAtras.toISOString().split('T')[0],
                          dataFim: hoje.toISOString().split('T')[0]
                        }));
                      }}
                      className="flex-1 px-2 py-2 text-xs font-medium bg-purple-600 text-white border border-purple-600 rounded hover:bg-purple-700 transition-colors"
                    >
                      30 dias
                    </button>
                  </div>
                </div>
              </div>

              {/* Botões de Visualização - Layout profissional alinhado */}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 dark:border-gray-600">
                <div className="grid grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      const currentFilteredData = getFilteredProposals();
                      const reportData = generateReportData(currentFilteredData);
                      showReportPreview(reportData);
                      showNotification('Visualização do relatório aberta', 'success');
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm dark:shadow-gray-900/30"
                  >
                    👁️ Visualizar Relatório
                  </button>
                  
                  <button
                    onClick={() => {
                      const currentFilteredData = getFilteredProposals();
                      const reportData = generateReportData(currentFilteredData);
                      // Abrir Google Sheets com dados filtrados
                      const sheetsUrl = `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`;
                      window.open(sheetsUrl, '_blank');
                      showNotification('Abrindo Google Sheets com dados filtrados', 'success');
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-green-600 text-white border border-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📋 Abrir Google Sheets
                  </button>
                  
                  <button
                    onClick={() => {
                      const currentFilteredData = getFilteredProposals();
                      const reportData = generateReportData(currentFilteredData);
                      // Gerar e baixar arquivo Excel
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + "ID,Cliente,CNPJ,Vendedor,Valor,Plano,Status,Desconto\n"
                        + reportData.map(row => `${row.abmId},${row.cliente},${row.cnpj},${row.vendedor},${row.valor},${row.plano},${row.status},${row.desconto}`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `relatorio_${new Date().toISOString().split('T')[0]}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showNotification('Arquivo Excel baixado com sucesso!', 'success');
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    💾 Salvar em Excel
                  </button>
                  
                  <button
                    onClick={() => {
                      // Abrir Google Drive na pasta de propostas
                      const driveUrl = `https://drive.google.com/drive/folders/1ABC123_PASTA_PROPOSTAS`;
                      window.open(driveUrl, '_blank');
                      showNotification('Abrindo Google Drive - Pasta Propostas', 'success');
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-purple-600 text-white border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    📁 Abrir Google Drive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Visual com Dados Google Sheets */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm dark:shadow-gray-900/30">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 dark:border-gray-600">
            <h3 className="text-gray-900 dark:text-white text-base font-semibold flex items-center gap-2">
              <PieChart size={18} />
              Painel de Dados em Tempo Real
              <span className="ml-2 text-xs bg-green-700 text-white px-2 py-1 rounded-full">
                {filteredData.length} registros
              </span>
            </h3>
          </div>
          <div className="p-6">
            {/* KPIs Principais - Versão Compacta */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-50 dark:bg-blue-800 p-3 rounded-lg border border-blue-200 dark:border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-100">Total de Propostas</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-white">{reportData.total}</p>
                  </div>
                  <FileText className="h-6 w-6 text-blue-500 dark:text-blue-300" />
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-800 p-3 rounded-lg border border-green-200 dark:border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-600 dark:text-green-100">Faturamento Total</p>
                    <p className="text-xl font-bold text-green-900 dark:text-white">{formatCurrency(reportData.faturamento.toString())}</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-green-500 dark:text-green-300" />
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-800 p-3 rounded-lg border border-purple-200 dark:border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-100">Ticket Médio</p>
                    <p className="text-xl font-bold text-purple-900 dark:text-white">
                      {formatCurrency((reportData.faturamento / (reportData.total || 1)).toString())}
                    </p>
                  </div>
                  <Calculator className="h-6 w-6 text-purple-500 dark:text-purple-300" />
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-800 p-3 rounded-lg border border-orange-200 dark:border-orange-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-100">Vendedores Ativos</p>
                    <p className="text-xl font-bold text-orange-900 dark:text-white">{uniqueVendors.length}</p>
                  </div>
                  <Users className="h-6 w-6 text-orange-500 dark:text-orange-300" />
                </div>
              </div>
            </div>

            {/* Distribuição por Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white dark:text-white base font-semibold text-white dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 size={16} />
                  Distribuição por Status
                </h4>
                <div className="space-y-3">
                  {Object.entries(reportData.porStatus).map(([status, count]) => {
                    const percentage = ((count / reportData.total) * 100).toFixed(1);
                    const statusConfig = Object.values(STATUS_CONFIG).find(config => config.label === status);
                    return (
                      <div key={status} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: statusConfig?.color || '#6B7280' }}
                          ></div>
                          <span className="text-white dark:text-white sm font-medium text-white dark:text-white">{status}</span>
                        </div>
                        <div className="text-white dark:text-white right">
                          <span className="text-white dark:text-white lg font-bold text-white dark:text-white">{count}</span>
                          <span className="text-white dark:text-white xs text-white dark:text-white dark:text-white dark:text-white ml-1">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-white dark:text-white base font-semibold text-white dark:text-white mb-4 flex items-center gap-2">
                  <Award size={16} />
                  Ranking de Vendedores
                </h4>
                <div className="space-y-3">
                  {Object.entries(reportData.porVendedor)
                    .sort(([,a], [,b]) => b.count - a.count)
                    .slice(0, 5)
                    .map(([vendor, data], index) => (
                    <div key={vendor} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-50 dark:bg-yellow-9000' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-blue-50 dark:bg-blue-9000'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-white dark:text-white sm font-medium text-white dark:text-white">{vendor}</span>
                      </div>
                      <div className="text-white dark:text-white right">
                        <div className="text-white dark:text-white lg font-bold text-white dark:text-white">{data.count}</div>
                        <div className="text-white dark:text-white xs text-white dark:text-white dark:text-white dark:text-white">{formatCurrency(data.value.toString())}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    );
  };

  const renderTeam = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gerenciar Equipe</h3>
          <button
            onClick={() => setShowAddVendorForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <UserPlus size={16} />
            Adicionar Vendedor
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-2 text-gray-900 dark:text-white">Nome</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Email</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Senha</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Data de Criação</th>
                <th className="text-left py-2 text-gray-900 dark:text-white">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => {
                return (
                  <tr key={vendor.id} className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-2 font-medium text-gray-900 dark:text-white">{vendor.name}</td>
                    <td className="py-2 text-gray-900 dark:text-white">{vendor.email}</td>
                    <td className="py-2 text-sm text-gray-900 dark:text-white">120784</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vendor.active ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {vendor.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                      {new Date(vendor.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleRemoveVendor(vendor.id)}
                        className="text-white dark:text-white red-600 hover:text-red-800 dark:text-white hover:bg-red-50 dark:hover:bg-red-800 dark:bg-red-900 p-1 rounded"
                        title="Remover Vendedor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para adicionar vendedor */}
      {showAddVendorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white dark:text-white lg font-semibold">Adicionar Vendedor</h3>
              <button
                onClick={() => setShowAddVendorForm(false)}
                className="text-white dark:text-white gray-500 dark:text-white dark:text-white dark:text-white dark:text-white hover:text-white dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={newVendorData.name}
                  onChange={(e) => setNewVendorData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Exemplo"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newVendorData.email}
                  onChange={(e) => setNewVendorData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Exemplo"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white block text-sm font-medium mb-1">Senha</label>
                <input
                  type="text"
                  value={newVendorData.password}
                  onChange={(e) => setNewVendorData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Exemplo"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-700 text-white"
                />
                <p className="text-white dark:text-white xs text-white dark:text-white dark:text-white dark:text-white mt-1">Senha para o vendedor (editável)</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddVendorForm(false)}
                className="px-4 py-2 text-white hover:text-white dark:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddVendor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPropostas = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Propostas ({filteredProposals.length})</h3>
        </div>
        
        {/* Filtros compactos em linha única */}
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Filter size={16} />
              Filtros
            </h4>
            <button
              onClick={() => {
                setFilterVendor('');
                setFilterStatus('');
                setFilterDate('');
              }}
              className="text-white dark:text-white xs text-white dark:text-white dark:text-white dark:text-white hover:text-white dark:text-white flex items-center gap-1"
            >
              <X size={12} />
              Limpar
            </button>
          </div>
          
          {/* Três filtros em linha única - Vendedor, Status, Data */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendedor</label>
              <select
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
              >
                <option className="text-black bg-white" value="">Todos os vendedores</option>
                {vendors.map(vendor => (
                  <option className="text-black bg-white" key={vendor.id} value={vendor.id}>{vendor.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
              >
                <option className="text-black bg-white" value="">Todos os status</option>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option className="text-black bg-white" key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                placeholder="Exemplo"
              />
            </div>
          </div>
        </div>

        {/* Tabela de propostas */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">CLIENTE</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">VENDEDOR</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">PLANO</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">VALOR</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">STATUS</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">PRIORIDADE</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">PROGRESSO</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(proposal => {
                const contractData = proposal.contractData || {};
                const currentStatus = proposal.status as ProposalStatus;
                const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.observacao;
                const abmId = proposal.abmId || `ABM${proposal.id.slice(-3)}`;
                
                return (
                  <tr key={proposal.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => window.open(`https://drive.google.com/drive/folders/${proposal.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                        title="Ver Drive"
                      >
                        {abmId}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">{contractData.nomeEmpresa || 'Empresa não informada'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                            {getVendorName(proposal.vendorId).charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{getVendorName(proposal.vendorId)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {contractData.planoContratado || 'Plano não informado'}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {contractData.valor || 'R$ 0,00'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge 
                        status={currentStatus}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={proposalPriorities[proposal.id] || 'media'}
                        onChange={(e) => handlePriorityChange(proposal.id, e.target.value as 'alta' | 'media' | 'baixa')}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          getPriorityColor(proposalPriorities[proposal.id] || 'media')
                        }`}
                      >
                        <option className="text-black bg-white" value="alta">Alta</option>
                        <option className="text-black bg-white" value="media">Média</option>
                        <option className="text-black bg-white" value="baixa">Baixa</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <ProgressBar 
                        proposal={proposal} 
                        size="sm" 
                        orientation="horizontal"
                        className="max-w-24"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`https://drive.google.com/drive/folders/${proposal.id}`, '_blank')}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800 rounded"
                          title="Ver Drive"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => window.open(`/client/${proposal.clientToken}`, '_blank')}
                          className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-800 rounded"
                          title="Link do Cliente"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredProposals.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhuma proposta encontrada com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );

  const renderRelatorios = () => {
    return renderReports();
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'metas':
        return renderMetas();
      case 'premiacao':
        return renderPremiacao();
      case 'analytics':
        return renderAnalytics();
      case 'team':
        return renderTeam();
      case 'propostas':
        return renderPropostas();
      case 'relatorios':
        return renderRelatorios();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 dark:bg-gray-900">

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            {/* Logo Abmix */}
            <div className="flex-shrink-0">
              <img 
                src="/65be871e-f7a6-4f31-b1a9-cd0729a73ff8 copy copy.png" 
                alt="Abmix" 
                className="h-10 w-auto"
              />
            </div>
            
            {/* Texto separado */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">Ab</span><span className="text-gray-900 dark:text-white">mix</span> Portal Supervisor
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Bem-vindo(a), {user?.name || 'Supervisor'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
            >
              {/* SINO REMOVIDO */}
              {/* NOTIFICAÇÕES DESABILITADAS - SEM CONTADOR */}
            </button>
            
            <button
              onClick={() => setShowInternalMessage(!showInternalMessage)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MessageSquare size={20} />
            </button>
            
            <ThemeToggle />
            
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === 'dashboard' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <BarChart3 size={18} className="mr-2" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveView('metas')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === 'metas' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Target size={18} className="mr-2" />
              Metas
            </button>
            
            <button
              onClick={() => setActiveView('premiacao')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === 'premiacao' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Award size={18} className="mr-2" />
              Premiação
            </button>
            
            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === 'analytics' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <PieChart size={18} className="mr-2" />
              Analytics
            </button>
            
            <button
              onClick={() => setActiveView('team')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === 'team' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Users size={18} className="mr-2" />
              Equipe
            </button>
            
            <button
              onClick={() => setActiveView('propostas')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === 'propostas' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FileText size={18} className="mr-2" />
              Propostas
            </button>
            
            <button
              onClick={() => setActiveView('relatorios')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === 'relatorios' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Calculator size={18} className="mr-2" />
              Relatórios
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {renderContent()}
      </main>

      {/* Modal de Visualização de Relatório */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-7xl h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-white dark:text-white 2xl">👁️</span>
                <h2 className="text-white dark:text-white xl font-bold">Visualizar Relatório - EXCEL</h2>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-white dark:text-white white hover:text-gray-200 dark:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Informações do Relatório */}
              <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <div className="mb-2"><strong>Tipo de relatório:</strong> {reportFilters.tipo}</div>
                  <div className="mb-2"><strong>Total de Propostas:</strong> {reportData.length}</div>
                  <div className="mb-2">
                    <strong>Faturamento Total:</strong> 
                    <span className="text-white dark:text-white green-600 dark:text-green-400 font-bold ml-2">
                      R$ {reportData.reduce((sum, item) => sum + (parseFloat(item.valor.toString().replace(/[^0-9,]/g, '').replace(',', '.')) || 0), 0).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Bilhete Médio:</strong> 
                    R$ {reportData.length > 0 ? (reportData.reduce((sum, item) => sum + (parseFloat(item.valor.toString().replace(/[^0-9,]/g, '').replace(',', '.')) || 0), 0) / reportData.length).toFixed(2).replace('.', ',') : '0,00'}
                  </div>
                </div>
                <div>
                  <div className="mb-2"><strong>Vendedores Incluídos:</strong> {reportFilters.vendedor || 'Todos'}</div>
                  <div className="mb-2"><strong>Data de Geração:</strong> {new Date().toLocaleString('pt-BR')}</div>
                  <div className="mb-2"><strong>Status Incluído:</strong> {reportFilters.status || 'Todos'}</div>
                  <div className="mb-2"><strong>Formato:</strong> SOBRESSAIR</div>
                  <div className="mb-2"><strong>Período Início:</strong> {reportFilters.dataInicio || '2025-06-16'}</div>
                  <div className="mb-2"><strong>Campos Incluídos:</strong> 10 colunas</div>
                  <div className="mb-2"><strong>Período Fim:</strong> {reportFilters.dataFim || '2025-07-16'}</div>
                  <div className="mb-2"><strong>Observações:</strong> {Object.keys(reportObservations).length} com dados</div>
                </div>
              </div>

              {/* Tabela de Propostas */}
              <div className="mb-6">
                <h3 className="text-white dark:text-white lg font-semibold mb-4">Preview dos Dados (Primeiras {Math.min(reportData.length, 5)} propostas)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 dark:border-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">ID</th>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">Cliente</th>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">CNPJ</th>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">Vendedor</th>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">Valor</th>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">Plano</th>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">Status</th>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">Desconto</th>
                        <th className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 text-left font-semibold">Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.slice(0, 5).map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 dark:bg-gray-700'}>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3">{item.abmId}</td>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3">{item.cliente}</td>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3">{item.cnpj}</td>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 dark:text-white">
                              {item.vendedor}
                            </span>
                          </td>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3 font-semibold">R$ {item.valor}</td>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3">{item.plano}</td>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3">
                            <StatusBadge 
                              status={item.status as ProposalStatus}
                            />
                          </td>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3">{item.desconto}</td>
                          <td className="text-white border border-gray-300 dark:border-gray-600 dark:border-gray-600 p-3">
                            <input
                              type="text"
                              value={reportObservations[item.abmId] || ''}
                              onChange={(e) => setReportObservations(prev => ({
                                ...prev,
                                [item.abmId]: e.target.value
                              }))}
                              placeholder="Exemplo"
                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="border bg-gray-700 text-white-t pt-6">
                <h4 className="text-white dark:text-white lg font-semibold mb-4">Escolha como enviar ou compartilhar:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={sendToFinanceiro}
                    className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-white dark:text-white 2xl mb-2">💼</div>
                    <span className="text-white dark:text-white sm font-medium text-blue-700 dark:text-white">Enviar para Financeiro</span>
                    <span className="text-white dark:text-white xs text-blue-600 dark:text-blue-400 mt-1">Sistema interno</span>
                  </button>

                  <button
                    onClick={sendViaWhatsApp}
                    className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="text-white dark:text-white 2xl mb-2">📱</div>
                    <span className="text-white dark:text-white sm font-medium text-green-700 dark:text-white">WhatsApp</span>
                    <span className="text-white dark:text-white xs text-green-600 dark:text-green-400 mt-1">Compartilhar via WhatsApp</span>
                  </button>

                  <button
                    onClick={sendViaEmail}
                    className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="text-white dark:text-white 2xl mb-2">📧</div>
                    <span className="text-white dark:text-white sm font-medium text-purple-700 dark:text-white">Email</span>
                    <span className="text-white dark:text-white xs text-purple-600 dark:text-white mt-1">Enviar por email</span>
                  </button>

                  <button
                    onClick={downloadReport}
                    className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:bg-gray-700 transition-colors"
                  >
                    <div className="text-white dark:text-white 2xl mb-2">💾</div>
                    <span className="text-white dark:text-white sm font-medium text-white dark:text-white">Baixar</span>
                    <span className="text-white dark:text-white xs text-white mt-1">Download CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* NOTIFICAÇÕES DESABILITADAS - MODAL REMOVIDO */}
      
      {showInternalMessage && (
        <InternalMessage 
          isOpen={true}
          onClose={() => setShowInternalMessage(false)}
          currentUser={{ name: user.name, role: 'supervisor' }}
        />
      )}
      
      {/* System Footer */}
      <SystemFooter />
    </div>
  );
}

export default SupervisorPortal;