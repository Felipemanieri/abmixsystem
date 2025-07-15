import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BarChart3, Users, TrendingUp, DollarSign, FileText, Target, Calculator, UserPlus, Bell, MessageSquare, LogOut, X, CheckCircle, Calendar, PieChart, Settings, Award, Plus, Edit, Trash2, Save, Filter, Search, Download, Eye, ExternalLink } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import SimpleProgressBar from './SimpleProgressBar';
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
  
  // Estados para filtros
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  // Estados para gerenciamento de vendedores
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  
  // Estado para prioridades das propostas
  const [proposalPriorities, setProposalPriorities] = useState<Record<string, 'alta' | 'media' | 'baixa'>>({});
  
  // Função para alterar prioridade
  const handlePriorityChange = (proposalId: string, priority: 'alta' | 'media' | 'baixa') => {
    setProposalPriorities(prev => ({
      ...prev,
      [proposalId]: priority
    }));
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
  const [newVendorData, setNewVendorData] = useState({ name: '', email: '' });
  
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
      setNewVendorData({ name: '', email: '' });
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
    if (newVendorData.name && newVendorData.email) {
      addVendorMutation.mutate({
        name: newVendorData.name,
        email: newVendorData.email,
        password: "120784",
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
  });

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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Análise de Performance</h3>
        
        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            <option value={0}>Todos os meses</option>
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

        {/* Métricas da Equipe */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800">Total de Propostas</h4>
            <p className="text-2xl font-bold text-blue-600">{teamStats.totalProposals || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800">Faturamento Total</h4>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(teamStats.totalValue?.toString() || '0')}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-800">Ticket Médio</h4>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(teamStats.averageValue?.toString() || '0')}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-medium text-orange-800">Vendedores Ativos</h4>
            <p className="text-2xl font-bold text-orange-600">{teamStats.totalVendors || 0}</p>
          </div>
        </div>

        {/* Performance Individual */}
        <div className="space-y-4">
          <h4 className="font-medium">Performance Individual</h4>
          {vendors.map(vendor => {
            const stats = getVendorStats(vendor.id);
            const target = vendorTargets.find(t => t.vendorId === vendor.id && t.month === selectedMonth && t.year === selectedYear);
            
            return (
              <div key={vendor.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{vendor.name}</span>
                  <span className="text-sm text-gray-600">{vendor.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Propostas:</span>
                    <span className="font-medium ml-2">{stats.totalProposals}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Faturamento:</span>
                    <span className="font-medium ml-2">{formatCurrency(stats.totalValue.toString())}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Meta:</span>
                    <span className="font-medium ml-2">
                      {target ? `${calculateProgress(vendor.id, target).toFixed(1)}%` : 'Não definida'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

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
                <th className="text-left py-2">Propostas</th>
                <th className="text-left py-2">Faturamento</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => {
                const stats = getVendorStats(vendor.id);
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
                    <td className="py-2">{stats.totalProposals}</td>
                    <td className="py-2">{formatCurrency(stats.totalValue.toString())}</td>
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
                  value="120784"
                  disabled
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Senha padrão para todos os vendedores</p>
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
              {filteredProposals.map(proposal => {
                const contractData = proposal.contractData || {};
                const progress = Math.floor(Math.random() * 100);
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
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${
                              progress >= 80 ? 'bg-green-500' :
                              progress >= 60 ? 'bg-yellow-500' :
                              progress >= 40 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          {progress}%
                        </span>
                      </div>
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

  const renderRelatorios = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Relatórios Gerenciais</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download size={16} />
            Exportar
          </button>
        </div>
        
        {/* Resumo Executivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Resumo do Mês</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Propostas:</span>
                <span className="font-medium">{teamStats.totalProposals || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Faturamento:</span>
                <span className="font-medium">{formatCurrency(teamStats.totalValue?.toString() || '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Meta:</span>
                <span className="font-medium">85%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Top Performers</h4>
            <div className="space-y-2">
              {vendors.slice(0, 3).map((vendor, index) => {
                const stats = getVendorStats(vendor.id);
                return (
                  <div key={vendor.id} className="flex justify-between">
                    <span className="text-sm">{index + 1}. {vendor.name}</span>
                    <span className="font-medium">{stats.totalProposals}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Premiações</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Concedidas:</span>
                <span className="font-medium">{awards.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Valor Total:</span>
                <span className="font-medium">
                  {formatCurrency(awards.reduce((sum, award) => sum + parseInt(award.value.replace(/[^\d]/g, "")), 0).toString())}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Performance por Vendedor</h4>
            <div className="space-y-3">
              {vendors.map(vendor => {
                const stats = getVendorStats(vendor.id);
                const maxValue = Math.max(...vendors.map(v => getVendorStats(v.id).totalValue));
                const percentage = maxValue > 0 ? (stats.totalValue / maxValue) * 100 : 0;
                
                return (
                  <div key={vendor.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{vendor.name}</span>
                      <span>{formatCurrency(stats.totalValue.toString())}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Status das Propostas</h4>
            <div className="space-y-3">
              {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                const count = proposals.filter(p => p.status === status).length;
                const percentage = proposals.length > 0 ? (count / proposals.length) * 100 : 0;
                
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{config.label}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${config.bgColor.replace('bg-', 'bg-')}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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