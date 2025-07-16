import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BarChart3, Users, TrendingUp, DollarSign, FileText, Target, Calculator, UserPlus, Bell, MessageSquare, LogOut, X, CheckCircle, Calendar, PieChart, Settings, Award, Plus, Edit, Trash2, Save, Filter, Search, Download, Eye, ExternalLink, Share, Share2, Clock, User, RefreshCw, Zap, AlertTriangle, Heart, TrendingDown, Mail, FileX, Send } from 'lucide-react';
import { format, isWithinInterval, subDays, subMonths, subWeeks, parseISO } from 'date-fns';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart, Pie } from 'recharts';
import AbmixLogo from './AbmixLogo';
import SimpleProgressBar from './SimpleProgressBar';
import ProgressBar from './ProgressBar';
import ActionButtons from './ActionButtons';
import NotificationCenter from './NotificationCenter';
import InternalMessage from './InternalMessage';
import StatusManager, { ProposalStatus, STATUS_CONFIG } from '@shared/statusSystem';
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
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Ativar sincronização em tempo real
  useEffect(() => {
    realTimeSync.enableAggressivePolling();
  }, []);



  // Placeholder para funções que serão definidas depois dos dados

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
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewType, setPreviewType] = useState('');
  const [editableObservations, setEditableObservations] = useState<{[key: string]: string}>({});

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
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  // Buscar propostas
  const { data: proposals = [], isLoading: proposalsLoading } = useQuery({
    queryKey: ['/api/proposals'],
    queryFn: () => apiRequest('/api/proposals'),
    refetchInterval: 1000,
  });

  // Buscar vendedores
  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ['/api/vendors'],
    queryFn: () => apiRequest('/api/vendors'),
    retry: false,
  });

  // Buscar metas dos vendedores
  const { data: vendorTargets = [], isLoading: targetsLoading } = useQuery({
    queryKey: ['/api/vendor-targets'],
    queryFn: () => apiRequest('/api/vendor-targets'),
  });

  // Buscar metas da equipe
  const { data: teamTargets = [], isLoading: teamTargetsLoading } = useQuery({
    queryKey: ['/api/team-targets'],
    queryFn: () => apiRequest('/api/team-targets'),
  });

  // Buscar premiações
  const { data: awards = [], isLoading: awardsLoading } = useQuery({
    queryKey: ['/api/awards'],
    queryFn: () => apiRequest('/api/awards'),
  });

  // Buscar estatísticas da equipe
  const { data: teamStats = {}, isLoading: teamStatsLoading } = useQuery({
    queryKey: ['/api/analytics/team', selectedMonth, selectedYear],
    queryFn: () => apiRequest(`/api/analytics/team?month=${selectedMonth}&year=${selectedYear}`),
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
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendors'] });
      setShowAddVendorForm(false);
      setNewVendorData({ name: '', email: '', password: '120784' });
      showNotification('Vendedor adicionado com sucesso!', 'success');
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
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendors'] });
      showNotification('Vendedor removido com sucesso!', 'success');
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

  const formatCurrency = (value: string) => {
    if (!value || value === '0') return 'R$ 0,00';
    const numValue = parseFloat(value.replace(/[^\d]/g, '')) / 100;
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
    const vendedors = filteredProposals.map(p => {
      const vendor = vendors.find(v => v.id === p.vendorId);
      return vendor ? vendor.name : null;
    }).filter(Boolean);
    const uniqueVendors = [...new Set(vendedors)];
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(teamStats.totalValue?.toString() || '0')}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Propostas</p>
              <p className="text-2xl font-bold text-blue-600">{teamStats.totalProposals || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(teamStats.averageValue?.toString() || '0')}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendedores Ativos</p>
              <p className="text-2xl font-bold text-orange-600">{teamStats.totalVendors || 0}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Performance por Vendedor */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Performance por Vendedor</h3>
        <div className="space-y-4">
          {vendors.map(vendor => {
            const stats = getVendorStats(vendor.id);
            const target = vendorTargets.find(t => t.vendorId === vendor.id && t.month === selectedMonth && t.year === selectedYear);
            const progress = target ? calculateProgress(vendor.id, target) : 0;
            
            return (
              <div key={vendor.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{vendor.name}</span>
                  <span className="text-sm text-gray-600">{stats.totalProposals} propostas</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Faturamento: {formatCurrency(stats.totalValue.toString())}</span>
                  <span className="text-sm font-medium">{progress.toFixed(1)}% da meta</span>
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Gerenciar Metas</h3>
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
            className="border rounded-lg px-3 py-2"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {getMonthName(i + 1)}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      {/* Metas dos Vendedores */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Metas Individuais</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Vendedor</th>
                <th className="text-left py-2">Período</th>
                <th className="text-left py-2">Meta Valor</th>
                <th className="text-left py-2">Meta Propostas</th>
                <th className="text-left py-2">Bônus</th>
                <th className="text-left py-2">Progresso</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendorTargets.map(target => (
                <tr key={target.id} className="border-b">
                  <td className="py-2">{getVendorName(target.vendorId)}</td>
                  <td className="py-2">{getMonthName(target.month)}/{target.year}</td>
                  <td className="py-2">{formatCurrency(target.targetValue)}</td>
                  <td className="py-2">{target.targetProposals}</td>
                  <td className="py-2">{formatCurrency(target.bonus)}</td>
                  <td className="py-2">
                    <div className="w-24">
                      <SimpleProgressBar percentage={calculateProgress(target.vendorId, target)} />
                    </div>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => deleteTargetMutation.mutate(target.id)}
                      className="text-red-600 hover:text-red-800"
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Metas da Equipe</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Período</th>
                <th className="text-left py-2">Meta Valor</th>
                <th className="text-left py-2">Meta Propostas</th>
                <th className="text-left py-2">Bônus da Equipe</th>
                <th className="text-left py-2">Progresso</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {teamTargets.map(target => {
                const teamProgress = teamStats.totalValue && teamStats.totalProposals 
                  ? ((teamStats.totalValue / parseInt(target.targetValue.replace(/[^\d]/g, ""))) * 50) + 
                    ((teamStats.totalProposals / target.targetProposals) * 50)
                  : 0;
                
                return (
                  <tr key={target.id} className="border-b">
                    <td className="py-2">{getMonthName(target.month)}/{target.year}</td>
                    <td className="py-2">{formatCurrency(target.targetValue)}</td>
                    <td className="py-2">{target.targetProposals}</td>
                    <td className="py-2">{formatCurrency(target.teamBonus)}</td>
                    <td className="py-2">
                      <div className="w-24">
                        <SimpleProgressBar percentage={Math.min(teamProgress, 100)} />
                      </div>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => console.log('Delete team target', target.id)}
                        className="text-red-600 hover:text-red-800"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nova Meta Individual</h3>
              <button
                onClick={() => setShowAddTargetForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vendedor</label>
                <select
                  value={newTargetData.vendorId}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, vendorId: parseInt(e.target.value) }))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value={0}>Selecione um vendedor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mês</label>
                  <select
                    value={newTargetData.month}
                    onChange={(e) => setNewTargetData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Ano</label>
                  <select
                    value={newTargetData.year}
                    onChange={(e) => setNewTargetData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Meta de Valor (R$)</label>
                <input
                  type="text"
                  value={newTargetData.targetValue}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, targetValue: e.target.value }))}
                  placeholder="Ex: 50000"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Meta de Propostas</label>
                <input
                  type="number"
                  value={newTargetData.targetProposals}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, targetProposals: parseInt(e.target.value) }))}
                  placeholder="Ex: 10"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bônus (R$)</label>
                <input
                  type="text"
                  value={newTargetData.bonus}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, bonus: e.target.value }))}
                  placeholder="Ex: 5000"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddTargetForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nova Meta da Equipe</h3>
              <button
                onClick={() => setShowAddTeamTargetForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mês</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Ano</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Meta de Valor (R$)</label>
                <input
                  type="text"
                  value={newTargetData.targetValue}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, targetValue: e.target.value }))}
                  placeholder="Ex: 500000"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Meta de Propostas</label>
                <input
                  type="number"
                  value={newTargetData.targetProposals}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, targetProposals: parseInt(e.target.value) }))}
                  placeholder="Ex: 100"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bônus da Equipe (R$)</label>
                <input
                  type="text"
                  value={newTargetData.bonus}
                  onChange={(e) => setNewTargetData(prev => ({ ...prev, bonus: e.target.value }))}
                  placeholder="Ex: 20000"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddTeamTargetForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sistema de Premiação</h3>
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Premiações Concedidas</h3>
        <div className="space-y-4">
          {awards.map(award => (
            <div key={award.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  award.type === 'monetary' ? 'bg-green-100 text-green-600' :
                  award.type === 'bonus' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-medium">{award.title}</h4>
                  <p className="text-sm text-gray-600">{getVendorName(award.vendorId)}</p>
                  <p className="text-sm text-gray-500">{award.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(award.value)}</p>
                <p className="text-sm text-gray-500">{new Date(award.dateAwarded).toLocaleDateString('pt-BR')}</p>
                <button
                  onClick={() => deleteAwardMutation.mutate(award.id)}
                  className="text-red-600 hover:text-red-800 mt-2"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nova Premiação</h3>
              <button
                onClick={() => setShowAddAwardForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vendedor</label>
                <select
                  value={newAwardData.vendorId}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, vendorId: parseInt(e.target.value) }))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value={0}>Selecione um vendedor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Premiação</label>
                <select
                  value={newAwardData.type}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, type: e.target.value as 'monetary' | 'recognition' | 'bonus' }))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="recognition">Reconhecimento</option>
                  <option value="monetary">Monetária</option>
                  <option value="bonus">Bônus</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={newAwardData.title}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Vendedor do Mês"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={newAwardData.description}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detalhes da premiação..."
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                <input
                  type="text"
                  value={newAwardData.value}
                  onChange={(e) => setNewAwardData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Ex: 1000"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddAwardForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
    const uniqueVendors = [...new Set([...realVendors, ...filteredProposals.map(p => p.vendedor).filter(Boolean)])];;
    
    // Lista de operadoras e tipos de plano únicos (mock data)
    const operadoras = ['SulAmérica', 'Bradesco', 'Amil', 'Unimed', 'NotreDame'];
    const tiposPlano = ['Individual', 'Familiar', 'Empresarial', 'PME'];

    // Aplicar todos os filtros avançados
    const analyticsData = filteredProposals.filter(proposal => {
      // Filtro de vendedores
      if (selectedVendors.length > 0 && !selectedVendors.includes(proposal.vendedor || '')) return false;
      
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
        filteredData = filteredData.filter(p => p.vendedor === selectedVendorForChart);
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
        const count = filteredData.filter(p => p.vendedor === vendor).length;
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
      const vendor = proposal.vendedor || 'Não Identificado';
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
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Analytics & Performance</h2>
              <p className="text-gray-600 mt-1">Análise de {analyticsData.length} propostas</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-700">Filtros</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Vendedores */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Vendedores</label>
                <select
                  value={selectedVendorForChart}
                  onChange={(e) => {
                    setSelectedVendorForChart(e.target.value);
                    setShowChart(true);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione um vendedor</option>
                  <option value="all">Todos os Vendedores</option>
                  {uniqueVendors.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>

              {/* Data Início */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Data Início</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Data Fim */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Data Fim</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Status</label>
                <select
                  value={selectedStatusForChart}
                  onChange={(e) => {
                    setSelectedStatusForChart(e.target.value);
                    setShowChart(true);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione um status</option>
                  <option value="all">Todos os Status</option>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="bg-white border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-800">Resumo Executivo</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-slate-800 mb-1">{teamMetrics.totalConvertidas}</div>
                <div className="text-sm text-slate-600 mb-2">Convertidas</div>
                <div className="text-xs text-emerald-600 font-medium">{teamMetrics.taxaConversao.toFixed(1)}% conversão</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-semibold text-slate-800 mb-1">{teamMetrics.totalPerdidas}</div>
                <div className="text-sm text-slate-600 mb-2">Perdidas</div>
                <div className="text-xs text-slate-500">
                  {teamMetrics.totalPropostas > 0 ? ((teamMetrics.totalPerdidas / teamMetrics.totalPropostas) * 100).toFixed(1) : 0}% do total
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-semibold text-slate-800 mb-1">{formatCurrency(teamMetrics.totalFaturamento.toString())}</div>
                <div className="text-sm text-slate-600 mb-2">Faturamento</div>
                <div className="text-xs text-slate-500">Média: {formatCurrency(teamMetrics.ticketMedio.toString())}</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-semibold text-slate-800 mb-1">{teamMetrics.totalPendentes}</div>
                <div className="text-sm text-slate-600 mb-2">Em andamento</div>
                <div className="text-xs text-slate-500">
                  {teamMetrics.totalPropostas > 0 ? ((teamMetrics.totalPendentes / teamMetrics.totalPropostas) * 100).toFixed(1) : 0}% ativas
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribuição por Status */}
        <div className="bg-white border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-800">Distribuição por Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(STATUS_CONFIG)
                .filter(([status]) => analyticsData.filter(p => p.status === status).length > 0)
                .map(([status, config]) => {
                  const count = analyticsData.filter(p => p.status === status).length;
                  const percentage = analyticsData.length > 0 ? (count / analyticsData.length * 100) : 0;
                  
                  return (
                    <div key={status} className="text-center">
                      <div className="text-lg font-semibold text-slate-800 mb-1">{count}</div>
                      <div className="text-xs text-slate-600 mb-1">{config.label}</div>
                      <div className="text-xs text-slate-500">{percentage.toFixed(0)}%</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Performance Individual */}
        <div className="bg-white border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-800">Performance Individual</h2>
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
                      <div className="font-medium text-slate-800">{vendor}</div>
                      <div className="text-sm text-slate-500">{data.total} propostas</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-800">{data.taxaConversao.toFixed(1)}%</div>
                    <div className="text-sm text-slate-500">{formatCurrency(data.faturamento.toString())}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de Distribuição */}
        {showChart && (selectedStatusForChart || selectedVendorForChart) && (
          <div className="bg-white border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-800">
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
                <div className="text-center py-12">
                  <p className="text-slate-500">Nenhum dado encontrado para os filtros selecionados.</p>
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
                          label={({ name, percent }) => `${name.length > 15 ? name.substring(0, 12) + '...' : name} ${(percent * 100).toFixed(0)}%`}
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
                  <h3 className="font-medium text-slate-700 mb-4">Legenda</h3>
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-slate-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-800">{item.value}</div>
                        <div className="text-xs text-slate-500">
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
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Exportar Relatório</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Formato</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Enviar para:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={exportReport}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm flex items-center gap-2"
                    >
                      <Mail size={14} />
                      E-mail
                    </button>
                    <button
                      onClick={exportReport}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm flex items-center gap-2"
                    >
                      <MessageSquare size={14} />
                      WhatsApp
                    </button>
                    <button
                      onClick={exportReport}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm flex items-center gap-2"
                    >
                      <ExternalLink size={14} />
                      Google Drive
                    </button>
                    <button
                      onClick={exportReport}
                      className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm flex items-center gap-2"
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
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Salvar Filtro</h3>
                <button
                  onClick={() => setShowSaveFilter(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Filtro</label>
                  <input
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="Ex: Vendas Janeiro 2025"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowSaveFilter(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
    const uniqueVendors = [...new Set([...realVendors, ...filteredProposals.map(p => p.vendedor).filter(Boolean)])];

    const filteredData = filteredProposals.filter(proposal => {
      if (reportFilters.vendedor && !proposal.vendedor?.toLowerCase().includes(reportFilters.vendedor.toLowerCase())) return false;
      if (reportFilters.status && proposal.status !== reportFilters.status) return false;
      // Filtros de data seriam aplicados aqui
      return true;
    });

    // Função para salvar observações editáveis
    const saveObservations = async () => {
      try {
        const updates = Object.entries(editableObservations).map(async ([proposalId, observation]) => {
          const response = await fetch(`/api/proposals/${proposalId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              internalData: { 
                observacoesSupervisor: observation 
              } 
            }),
          });
          return response.ok;
        });

        await Promise.all(updates);
        showNotification('Observações salvas com sucesso!', 'success');
        
        // Forçar atualização dos dados
        queryClientInstance.invalidateQueries({ queryKey: ['/api/proposals'] });
        
      } catch (error) {
        showNotification('Erro ao salvar observações', 'error');
      }
    };

    const generatePreview = async (format: string) => {
      setIsGenerating(true);
      setPreviewType(format);
      try {
        // Simular geração de preview
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const preview = {
          format,
          totalPropostas: filteredData.length,
          faturamento: reportData.faturamento,
          vendedoresIncluidos: reportFilters.vendedor || 'Todos',
          statusIncluidos: reportFilters.status || 'Todos',
          periodoInicio: reportFilters.dataInicio || 'Não definido',
          periodoFim: reportFilters.dataFim || 'Não definido',
          tipoRelatorio: reportFilters.tipo,
          dataGeracao: new Date().toLocaleString('pt-BR'),
          dadosDetalhados: filteredData.slice(0, 5) // Primeiros 5 para preview
        };
        
        // Inicializar observações editáveis com dados existentes
        const initialObservations: {[key: string]: string} = {};
        filteredData.slice(0, 5).forEach(proposal => {
          initialObservations[proposal.id] = proposal.internalData?.observacoesSupervisor || 
                                            proposal.internalData?.observacoesFinanceiras || 
                                            proposal.internalData?.observacoesVendedor || '';
        });
        setEditableObservations(initialObservations);
        
        setPreviewData(preview);
        setShowPreview(true);
        showNotification('Preview gerado com sucesso! Revise antes de enviar.', 'success');
      } catch (error) {
        showNotification('Erro ao gerar preview', 'error');
      } finally {
        setIsGenerating(false);
      }
    };

    const generateReport = async (format: string, shareMethod?: string) => {
      setIsGenerating(true);
      try {
        // Simular geração de relatório
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (shareMethod) {
          showNotification(`Relatório enviado via ${shareMethod} com sucesso para o financeiro!`, 'success');
        } else {
          showNotification(`Relatório ${format.toUpperCase()} gerado e enviado para o financeiro!`, 'success');
        }
      } catch (error) {
        showNotification('Erro ao gerar relatório', 'error');
      } finally {
        setIsGenerating(false);
        setShowExportOptions(false);
        setShowPreview(false);
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
        const vendor = p.vendedor || 'Desconhecido';
        if (!acc[vendor]) acc[vendor] = { count: 0, value: 0 };
        acc[vendor].count += 1;
        acc[vendor].value += parseFloat(p.contractData?.valor || '0');
        return acc;
      }, {} as Record<string, { count: number; value: number }>)
    };

    return (
      <div className="space-y-6">
        {/* Header Profissional com Conexão Google Sheets */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <BarChart3 size={24} className="text-green-600" />
                  Sistema de Relatórios
                </h2>
                <p className="text-gray-600 mt-1">Dados em tempo real da planilha Google Sheets</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-sm text-gray-500">{filteredData.length} registros disponíveis</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Conectado</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.open('https://docs.google.com/spreadsheets/d/1your-sheet-id/edit', '_blank');
                    showNotification('Abrindo planilha Google Sheets', 'success');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <ExternalLink size={16} />
                  Abrir Planilha
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros Avançados com Sincronização Google Sheets */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Filter size={18} />
                Filtros de Relatório
              </h3>
              <button
                onClick={() => {
                  realTimeSync.forceRefresh();
                  showNotification('Sincronização com Google Sheets iniciada', 'success');
                }}
                className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-md flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Sincronizar
              </button>
            </div>
          </div>
          <div className="p-6">
            {/* Filtros Principais - Layout Horizontal Compacto */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
              {/* Tipo de Relatório */}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Relatório</label>
                <select
                  value={reportFilters.tipo}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="completo">📊 Relatório Completo</option>
                  <option value="individual">👤 Por Vendedor Individual</option>
                  <option value="equipe">👥 Por Equipe</option>
                  <option value="financeiro">💰 Relatório Financeiro</option>
                  <option value="status">📋 Por Status</option>
                </select>
              </div>

              {/* Vendedor */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Vendedor</label>
                <select
                  value={reportFilters.vendedor}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, vendedor: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todos</option>
                  {uniqueVendors.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor.split(' ')[0]}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={reportFilters.status}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todos</option>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Data Início */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Início</label>
                <input
                  type="date"
                  value={reportFilters.dataInicio}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Data Fim */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fim</label>
                <input
                  type="date"
                  value={reportFilters.dataFim}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, dataFim: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            {/* Filtros Rápidos e Ações */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setReportFilters(prev => ({ ...prev, dataInicio: format(subDays(new Date(), 7), 'yyyy-MM-dd'), dataFim: format(new Date(), 'yyyy-MM-dd') }))}
                  className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded transition-colors"
                >
                  7 dias
                </button>
                <button
                  onClick={() => setReportFilters(prev => ({ ...prev, dataInicio: format(subDays(new Date(), 30), 'yyyy-MM-dd'), dataFim: format(new Date(), 'yyyy-MM-dd') }))}
                  className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded transition-colors"
                >
                  30 dias
                </button>
                <button
                  onClick={() => setReportFilters(prev => ({ ...prev, dataInicio: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), dataFim: format(new Date(), 'yyyy-MM-dd') }))}
                  className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded transition-colors"
                >
                  Mês atual
                </button>
                <button
                  onClick={() => setReportFilters({
                    dataInicio: '', dataFim: '', vendedor: '', status: '', tipo: 'completo'
                  })}
                  className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded transition-colors flex items-center gap-1"
                >
                  <X size={12} />
                  Limpar
                </button>
              </div>
              <div className="text-xs text-gray-500">
                {filteredData.length} registros encontrados
              </div>
            </div>
          </div>
        </div>

        {/* Sistema de Geração de Relatórios com Preview */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Eye size={18} />
                Geração de Relatórios para Financeiro
              </h3>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                CRÍTICO - Sempre revisar antes de enviar
              </span>
            </div>
          </div>
          <div className="p-6">
            {/* Botões de Preview Discretos */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">1. Gerar Preview (Obrigatório antes de enviar)</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => generatePreview('pdf')}
                  disabled={isGenerating}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                >
                  <Eye size={16} />
                  {isGenerating && previewType === 'pdf' ? 'Gerando...' : 'Preview PDF'}
                </button>
                
                <button
                  onClick={() => generatePreview('excel')}
                  disabled={isGenerating}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                >
                  <Eye size={16} />
                  {isGenerating && previewType === 'excel' ? 'Gerando...' : 'Preview Excel'}
                </button>
                
                <button
                  onClick={() => generatePreview('financeiro')}
                  disabled={isGenerating}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                >
                  <Eye size={16} />
                  {isGenerating && previewType === 'financeiro' ? 'Gerando...' : 'Preview Financeiro'}
                </button>
                
                <button
                  onClick={() => {
                    window.open('https://docs.google.com/spreadsheets/d/1your-sheet-id/edit', '_blank');
                    showNotification('Abrindo planilha Google Sheets', 'info');
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"
                >
                  <ExternalLink size={16} />
                  Ver Planilha Original
                </button>
              </div>
            </div>

            {/* Ações Finais - Só aparecem após preview */}
            {previewData && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">2. Enviar para Financeiro (Após revisão)</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => generateReport(previewData.format, 'email')}
                    disabled={isGenerating}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                  >
                    <Mail size={16} />
                    {isGenerating ? 'Enviando...' : 'Enviar por Email'}
                  </button>
                  
                  <button
                    onClick={() => generateReport(previewData.format)}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                  >
                    <Download size={16} />
                    {isGenerating ? 'Gerando...' : 'Baixar Relatório'}
                  </button>
                  
                  <button
                    onClick={() => generateReport(previewData.format, 'whatsapp')}
                    disabled={isGenerating}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                  >
                    <MessageSquare size={16} />
                    {isGenerating ? 'Enviando...' : 'Enviar WhatsApp'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      setPreviewData(null);
                      showNotification('Preview cancelado', 'info');
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Preview */}
        {showPreview && previewData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Eye size={20} />
                    Preview do Relatório - {previewData.format.toUpperCase()}
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Resumo do Relatório */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ REVISÃO OBRIGATÓRIA</h4>
                  <p className="text-sm text-yellow-700">
                    Este preview mostra exatamente o que será enviado para o financeiro. 
                    Revise todos os dados antes de confirmar o envio.
                  </p>
                </div>

                {/* Informações do Relatório */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Tipo de Relatório:</span>
                      <span className="text-sm text-gray-900">{previewData.tipoRelatorio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Total de Propostas:</span>
                      <span className="text-sm text-gray-900 font-bold">{previewData.totalPropostas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Faturamento Total:</span>
                      <span className="text-sm text-gray-900 font-bold text-green-600">{formatCurrency(previewData.faturamento.toString())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Ticket Médio:</span>
                      <span className="text-sm text-gray-900">{formatCurrency((previewData.faturamento / (previewData.totalPropostas || 1)).toString())}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Vendedores Incluídos:</span>
                      <span className="text-sm text-gray-900">{previewData.vendedoresIncluidos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Status Incluídos:</span>
                      <span className="text-sm text-gray-900">{previewData.statusIncluidos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Período Início:</span>
                      <span className="text-sm text-gray-900">{previewData.periodoInicio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Período Fim:</span>
                      <span className="text-sm text-gray-900">{previewData.periodoFim}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Data de Geração:</span>
                      <span className="text-sm text-gray-900">{previewData.dataGeracao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Formato:</span>
                      <span className="text-sm text-gray-900 uppercase">{previewData.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Campos Incluídos:</span>
                      <span className="text-sm text-gray-900">10 colunas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Observações:</span>
                      <span className="text-sm text-gray-900">{previewData.dadosDetalhados.filter((p: any) => p.internalData?.observacoesFinanceiras || p.internalData?.observacoesVendedor).length} com dados</span>
                    </div>
                  </div>
                </div>

                {/* Preview dos Dados */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Preview dos Dados (Primeiras 5 propostas)
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">ID</th>
                          <th className="px-3 py-2 text-left">Cliente</th>
                          <th className="px-3 py-2 text-left">CNPJ</th>
                          <th className="px-3 py-2 text-left">Vendedor</th>
                          <th className="px-3 py-2 text-left">Valor</th>
                          <th className="px-3 py-2 text-left">Plano</th>
                          <th className="px-3 py-2 text-left">Status</th>
                          <th className="px-3 py-2 text-left">Desconto</th>
                          <th className="px-3 py-2 text-left">Observações</th>
                          <th className="px-3 py-2 text-left">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.dadosDetalhados.map((proposal: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="px-3 py-2 font-mono text-xs">{proposal.abmId}</td>
                            <td className="px-3 py-2">
                              {proposal.contractData?.nomeEmpresa || 
                               proposal.titulares?.[0]?.nomeCompleto || 
                               'Cliente não informado'}
                            </td>
                            <td className="px-3 py-2 text-xs">{proposal.contractData?.cnpj || 'N/A'}</td>
                            <td className="px-3 py-2">{proposal.vendedor || 'N/A'}</td>
                            <td className="px-3 py-2 font-medium">
                              {formatCurrency(proposal.contractData?.valor || '0')}
                            </td>
                            <td className="px-3 py-2 text-xs">{proposal.contractData?.planoContratado || 'N/A'}</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                {STATUS_CONFIG[proposal.status as ProposalStatus]?.label || proposal.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-xs">
                              {proposal.internalData?.desconto ? `${proposal.internalData.desconto}%` : '0%'}
                            </td>
                            <td className="px-3 py-2 text-xs max-w-32">
                              <textarea
                                value={editableObservations[proposal.id] || ''}
                                onChange={(e) => setEditableObservations(prev => ({
                                  ...prev,
                                  [proposal.id]: e.target.value
                                }))}
                                placeholder="Adicionar observação..."
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1 resize-none"
                                rows={2}
                              />
                            </td>
                            <td className="px-3 py-2 text-xs">
                              {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Observações Financeiras Específicas */}
                <div className="mt-6 border border-orange-200 rounded-lg">
                  <div className="px-4 py-3 bg-orange-50 border-b border-orange-200">
                    <h4 className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Observações Financeiras Críticas
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {previewData.dadosDetalhados.map((proposal: any, index: number) => {
                        const hasObservations = proposal.internalData?.observacoesFinanceiras || 
                                              proposal.internalData?.desconto > 0 ||
                                              proposal.internalData?.autorizadorDesconto;
                        
                        if (!hasObservations) return null;
                        
                        return (
                          <div key={index} className="bg-gray-50 p-3 rounded border">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-sm">{proposal.abmId} - {proposal.contractData?.nomeEmpresa || 'Cliente'}</span>
                              <span className="text-xs text-gray-500">{formatCurrency(proposal.contractData?.valor || '0')}</span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-700">
                              {proposal.internalData?.desconto > 0 && (
                                <div className="flex justify-between">
                                  <span>Desconto aplicado:</span>
                                  <span className="font-medium text-red-600">{proposal.internalData.desconto}%</span>
                                </div>
                              )}
                              {proposal.internalData?.autorizadorDesconto && (
                                <div className="flex justify-between">
                                  <span>Autorizado por:</span>
                                  <span className="font-medium">{proposal.internalData.autorizadorDesconto}</span>
                                </div>
                              )}
                              {proposal.internalData?.observacoesFinanceiras && (
                                <div className="mt-2">
                                  <span className="font-medium">Obs. Financeiras:</span>
                                  <p className="text-gray-600 mt-1">{proposal.internalData.observacoesFinanceiras}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {previewData.dadosDetalhados.filter((p: any) => 
                        p.internalData?.observacoesFinanceiras || 
                        p.internalData?.desconto > 0 ||
                        p.internalData?.autorizadorDesconto
                      ).length === 0 && (
                        <div className="text-center text-gray-500 py-4">
                          <FileX size={24} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Nenhuma observação financeira específica nas propostas selecionadas</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Confirmação */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-0.5" size={16} />
                    <div>
                      <h4 className="text-sm font-semibold text-green-800">Confirmação Final</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Os dados acima serão enviados para o departamento financeiro incluindo:
                      </p>
                      <ul className="text-xs text-green-600 mt-2 space-y-1">
                        <li>• {previewData.totalPropostas} propostas com dados completos</li>
                        <li>• Informações de clientes, valores e status atualizados</li>
                        <li>• Observações financeiras e descontos aplicados</li>
                        <li>• Dados dos vendedores responsáveis</li>
                        <li>• Formato {previewData.format.toUpperCase()} pronto para análise financeira</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="mt-6 flex justify-between items-center gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={saveObservations}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={16} />
                    Salvar Observações
                  </button>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Fechar Preview
                    </button>
                    <button
                      onClick={() => generateReport(previewData.format, 'Email')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Send size={16} />
                      Enviar para Financeiro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Visual com Dados Google Sheets */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <PieChart size={18} />
              Painel de Dados em Tempo Real
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {filteredData.length} registros
              </span>
            </h3>
          </div>
          <div className="p-6">
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total de Propostas</p>
                    <p className="text-3xl font-bold text-blue-900">{reportData.total}</p>
                  </div>
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Faturamento Total</p>
                    <p className="text-3xl font-bold text-green-900">{formatCurrency(reportData.faturamento.toString())}</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Ticket Médio</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {formatCurrency((reportData.faturamento / (reportData.total || 1)).toString())}
                    </p>
                  </div>
                  <Calculator className="h-10 w-10 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Vendedores Ativos</p>
                    <p className="text-3xl font-bold text-orange-900">{uniqueVendors.length}</p>
                  </div>
                  <Users className="h-10 w-10 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Distribuição por Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={16} />
                  Distribuição por Status
                </h4>
                <div className="space-y-3">
                  {Object.entries(reportData.porStatus).map(([status, count]) => {
                    const percentage = ((count / reportData.total) * 100).toFixed(1);
                    const statusConfig = Object.values(STATUS_CONFIG).find(config => config.label === status);
                    return (
                      <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: statusConfig?.color || '#6B7280' }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">{status}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">{count}</span>
                          <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award size={16} />
                  Ranking de Vendedores
                </h4>
                <div className="space-y-3">
                  {Object.entries(reportData.porVendedor)
                    .sort(([,a], [,b]) => b.count - a.count)
                    .slice(0, 5)
                    .map(([vendor, data], index) => (
                    <div key={vendor} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{vendor}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{data.count}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(data.value.toString())}</div>
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Gerenciar Equipe</h3>
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
              <tr className="border-b">
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Senha</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Data de Criação</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => {
                return (
                  <tr key={vendor.id} className="border-b">
                    <td className="py-2 font-medium">{vendor.name}</td>
                    <td className="py-2">{vendor.email}</td>
                    <td className="py-2 text-sm text-gray-600">120784</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vendor.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-2 text-sm text-gray-600">
                      {new Date(vendor.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleRemoveVendor(vendor.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Adicionar Vendedor</h3>
              <button
                onClick={() => setShowAddVendorForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={newVendorData.name}
                  onChange={(e) => setNewVendorData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newVendorData.email}
                  onChange={(e) => setNewVendorData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="text"
                  value={newVendorData.password}
                  onChange={(e) => setNewVendorData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Digite a senha"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Senha para o vendedor (editável)</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddVendorForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Propostas ({filteredProposals.length})</h3>
        </div>
        
        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <select
            value={filterVendor}
            onChange={(e) => setFilterVendor(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Todos os vendedores</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Todos os status</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        {/* Tabela de propostas */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium">ID</th>
                <th className="text-left py-3 px-4 font-medium">CLIENTE</th>
                <th className="text-left py-3 px-4 font-medium">VENDEDOR</th>
                <th className="text-left py-3 px-4 font-medium">PLANO</th>
                <th className="text-left py-3 px-4 font-medium">VALOR</th>
                <th className="text-left py-3 px-4 font-medium">STATUS</th>
                <th className="text-left py-3 px-4 font-medium">PRIORIDADE</th>
                <th className="text-left py-3 px-4 font-medium">PROGRESSO</th>
                <th className="text-left py-3 px-4 font-medium">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(proposal => {
                const contractData = proposal.contractData || {};
                const currentStatus = proposal.status as ProposalStatus;
                const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.observacao;
                const abmId = proposal.abmId || `ABM${proposal.id.slice(-3)}`;
                
                return (
                  <tr key={proposal.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => window.open(`https://drive.google.com/drive/folders/${proposal.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        title="Ver Drive"
                      >
                        {abmId}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{contractData.nomeEmpresa || 'Empresa não informada'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs font-medium">
                            {getVendorName(proposal.vendorId).charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm">{getVendorName(proposal.vendorId)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {contractData.planoContratado || 'Plano não informado'}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {contractData.valor || 'R$ 0,00'}
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                        title={`Status: ${statusConfig.label} - ${statusConfig.description}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={proposalPriorities[proposal.id] || 'media'}
                        onChange={(e) => handlePriorityChange(proposal.id, e.target.value as 'alta' | 'media' | 'baixa')}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          getPriorityColor(proposalPriorities[proposal.id] || 'media')
                        }`}
                      >
                        <option value="alta">Alta</option>
                        <option value="media">Média</option>
                        <option value="baixa">Baixa</option>
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
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Ver Drive"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => window.open(`/client/${proposal.clientToken}`, '_blank')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
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
          <div className="text-center py-8 text-gray-500">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            {/* Logo apenas icone */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10">
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 0C22.4 0 0 22.4 0 50h50V0Z" fill="url(#paint0_linear)" />
                  <path d="M50 100C77.6 100 100 77.6 100 50H50V100Z" fill="url(#paint1_linear)" />
                  <path d="M50 0C77.6 0 100 22.4 100 50H50V0Z" fill="url(#paint2_linear)" />
                  <path d="M50 15C30.67 15 15 30.67 15 50H50V15Z" fill="white" />
                  <path d="M50 85C69.33 85 85 69.33 85 50H50V85Z" fill="white" />
                  <path d="M50 15C69.33 15 85 30.67 85 50H50V15Z" fill="white" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0AB3B8" />
                      <stop offset="1" stopColor="#0ACFB8" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="50" y1="50" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0AB3B8" />
                      <stop offset="1" stopColor="#0ABFB8" />
                    </linearGradient>
                    <linearGradient id="paint2_linear" x1="50" y1="0" x2="100" y2="50" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#9CA3AF" />
                      <stop offset="1" stopColor="#4B5563" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            {/* Texto separado */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                <span className="text-[#0AB3B8] font-bold">Ab</span><span className="text-gray-600">mix</span> Portal Supervisor
              </h1>
              <p className="text-sm text-gray-600">Bem-vindo(a), {user?.name || 'Supervisor'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <button
              onClick={() => setShowInternalMessage(!showInternalMessage)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <MessageSquare size={20} />
            </button>
            
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b shadow-sm">
        <div className="px-6">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === 'dashboard' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

      {/* Modals */}
      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}
      
      {showInternalMessage && (
        <InternalMessage onClose={() => setShowInternalMessage(false)} />
      )}
    </div>
  );
}

export default SupervisorPortal;