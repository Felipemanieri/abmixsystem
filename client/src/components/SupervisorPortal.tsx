import React, { useState, useEffect } from 'react';
import { LogOut, BarChart3, Users, FileText, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Download, Calendar, Filter, Search, Bell, Settings, Target, PieChart, Calculator, MessageSquare, X, UserPlus, Trash2, Edit3 } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import NotificationCenter from './NotificationCenter';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import ProposalProgressTracker from './ProposalProgressTracker';
import { showNotification } from '../utils/notifications';
import StatusManager, { ProposalStatus } from '../../../shared/statusSystem';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProposalManager, { ProposalData } from '../services/proposalManager';

interface SupervisorPortalProps {
  user: any;
  onLogout: () => void;
}

type SupervisorView = 'dashboard' | 'reports' | 'analytics' | 'team' | 'settings';

const SupervisorPortal: React.FC<SupervisorPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeView, setActiveView] = useState<SupervisorView>('dashboard');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [statusManager] = useState(() => StatusManager.getInstance());
  const [proposalStatuses, setProposalStatuses] = useState<Map<string, ProposalStatus>>(new Map());
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  const [newVendorData, setNewVendorData] = useState({ name: '', email: '' });
  const queryClientInstance = useQueryClient();
  const [proposalManager] = useState(() => ProposalManager.getInstance());
  const [realProposals, setRealProposals] = useState<ProposalData[]>([]);

  // Inicializar propostas reais e escutar mudanças
  useEffect(() => {
    // Carregar propostas reais do ProposalManager
    const loadRealProposals = () => {
      const proposals = proposalManager.getAllProposals();
      setRealProposals(proposals);
      
      // Inicializar status para as propostas reais
      const statusMap = new Map<string, ProposalStatus>();
      proposals.forEach(proposal => {
        statusMap.set(proposal.id, statusManager.getStatus(proposal.id));
      });
      setProposalStatuses(statusMap);
    };

    loadRealProposals();

    const handleStatusChange = (proposalId: string, newStatus: ProposalStatus) => {
      setProposalStatuses(prev => new Map(prev.set(proposalId, newStatus)));
    };

    const handleProposalUpdate = () => {
      loadRealProposals();
    };

    statusManager.subscribe(handleStatusChange);
    proposalManager.subscribe(handleProposalUpdate);

    return () => {
      statusManager.unsubscribe(handleStatusChange);
      proposalManager.unsubscribe(handleProposalUpdate);
    };
  }, [statusManager, proposalManager]);

  // Notificações simuladas
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Meta Atingida',
      message: 'Ana Caroline atingiu 120% da meta mensal',
      type: 'approval',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      link: '/supervisor/team'
    },
    {
      id: '2',
      title: 'Proposta Aprovada',
      message: 'Proposta ABM001 foi aprovada pelo financeiro',
      type: 'document',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      link: '/supervisor/proposals'
    },
    {
      id: '3',
      title: 'Nova Mensagem',
      message: 'Carlos Silva enviou relatório de vendas',
      type: 'message',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      link: '/supervisor/messages'
    },
    {
      id: '4',
      title: 'Alerta de Performance',
      message: 'Diana Santos está 30% abaixo da meta',
      type: 'alert',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      link: '/supervisor/team'
    }
  ]);

  const handleStatusChange = (proposalId: string, newStatus: ProposalStatus) => {
    // Supervisor não pode alterar status - apenas visualizar
    showNotification('Apenas o portal de Implantação pode alterar status', 'info');
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleViewVendor = (vendorId: string) => {
    setSelectedVendor(vendorId);
    showNotification(`Visualizando detalhes do vendedor ${vendorId}`, 'success');
  };

  // Buscar todos os vendedores
  const { data: vendors = [], isLoading: vendorsLoading, error: vendorsError } = useQuery({
    queryKey: ['/api/vendors'],
    queryFn: () => apiRequest('/api/vendors'),
    retry: false,
  });



  // Mutation para criar vendedor
  const createVendorMutation = useMutation({
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
      showNotification('Login criado com sucesso!', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao criar login', 'error');
    },
  });

  // Mutation para deletar vendedor
  const deleteVendorMutation = useMutation({
    mutationFn: async (vendorId: number) => {
      return apiRequest(`/api/vendors/${vendorId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['/api/vendors'] });
      showNotification('Login removido com sucesso!', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message || 'Erro ao remover login', 'error');
    },
  });

  const handleAddVendor = () => {
    if (!newVendorData.name || !newVendorData.email) {
      showNotification('Nome e email são obrigatórios', 'error');
      return;
    }

    createVendorMutation.mutate({
      name: newVendorData.name,
      email: newVendorData.email,
      password: '120784',
      role: 'vendor',
      active: true,
    });
  };

  const handleDeleteVendor = (vendorId: number, vendorName: string) => {
    if (confirm(`Tem certeza que deseja remover o vendedor ${vendorName}?`)) {
      deleteVendorMutation.mutate(vendorId);
    }
  };

  const renderTeamManagement = () => {
    if (vendorsLoading) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Lista de Vendedores Simples */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Vendedores Cadastrados</h2>
            <button
              onClick={() => setShowAddVendorForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar login
            </button>
          </div>

          {/* Lista formatada como solicitado */}
          <div className="space-y-3">
            {vendors.map((vendor: any) => (
              <div key={vendor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex-1 text-sm">
                  <span className="font-medium text-gray-900 w-48 inline-block">{vendor.name}</span>
                  <span className="text-gray-600 mx-2">|</span>
                  <span className="text-gray-700 w-56 inline-block">{vendor.email}</span>
                  <span className="text-gray-600 mx-2">|</span>
                  <span className="text-gray-700">Senha: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">120784</span></span>
                </div>
                <button
                  onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                  className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  disabled={deleteVendorMutation.isPending}
                >
                  Remover login
                </button>
              </div>
            ))}

            {vendors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum vendedor cadastrado ainda.
              </div>
            )}
          </div>
        </div>

        {/* Modal para adicionar vendedor */}
        {showAddVendorForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Adicionar Login</h3>
                  <button
                    onClick={() => setShowAddVendorForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={newVendorData.name}
                      onChange={(e) => setNewVendorData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Ana Caroline Terto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newVendorData.email}
                      onChange={(e) => setNewVendorData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: comercial@abmix.com.br"
                    />
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Senha padrão:</strong> 120784
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      O vendedor poderá alterar a senha após o primeiro login
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddVendor}
                    disabled={createVendorMutation.isPending}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {createVendorMutation.isPending ? 'Criando login...' : 'Criar login'}
                  </button>
                  <button
                    onClick={() => setShowAddVendorForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Cálculos baseados em propostas reais
  const calculateRealKPIs = () => {
    if (!realProposals.length) {
      return {
        totalRevenue: 'R$ 0',
        totalProposals: '0',
        conversionRate: '0%',
        averageTicket: 'R$ 0'
      };
    }

    const totalProposals = realProposals.length;
    
    // Calcular receita total das propostas
    const totalRevenue = realProposals.reduce((sum, proposal) => {
      const value = parseFloat(proposal.contractData.valor?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
      return sum + value;
    }, 0);

    // Calcular ticket médio
    const averageTicket = totalProposals > 0 ? totalRevenue / totalProposals : 0;

    // Simular taxa de conversão (aqui poderia vir de dados reais de fechamento)
    const conversionRate = totalProposals > 0 ? Math.round((realProposals.filter(p => p.status !== 'draft').length / totalProposals) * 100) : 0;

    return {
      totalRevenue: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      totalProposals: totalProposals.toString(),
      conversionRate: `${conversionRate}%`,
      averageTicket: `R$ ${averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    };
  };

  const kpiData = calculateRealKPIs();

  // Dados dos vendedores
  const vendorData = [
    { 
      id: '1', 
      name: 'Ana Caroline', 
      email: 'ana@abmix.com',
      phone: '11999888777',
      proposals: 15, 
      revenue: 'R$ 85.500', 
      conversionRate: 85,
      target: 'R$ 80.000',
      performance: 'above'
    },
    { 
      id: '2', 
      name: 'Carlos Silva', 
      email: 'carlos@abmix.com',
      phone: '11888777666',
      proposals: 12, 
      revenue: 'R$ 72.300', 
      conversionRate: 75,
      target: 'R$ 70.000',
      performance: 'above'
    },
    { 
      id: '3', 
      name: 'Diana Santos', 
      email: 'diana@abmix.com',
      phone: '11777666555',
      proposals: 8, 
      revenue: 'R$ 45.200', 
      conversionRate: 60,
      target: 'R$ 65.000',
      performance: 'below'
    },
    { 
      id: '4', 
      name: 'Marcos Oliveira', 
      email: 'marcos@abmix.com',
      phone: '11666555444',
      proposals: 7, 
      revenue: 'R$ 42.780', 
      conversionRate: 70,
      target: 'R$ 60.000',
      performance: 'below'
    }
  ];

  // Atividade recente
  const recentActivity = [
    { id: '1', vendor: 'Ana Caroline', client: 'Empresa ABC', type: 'proposal_sent', timestamp: '10 min atrás', status: 'success' },
    { id: '2', vendor: 'Carlos Silva', client: 'Tech Solutions', type: 'meeting_scheduled', timestamp: '25 min atrás', status: 'success' },
    { id: '3', vendor: 'Diana Santos', client: 'Startup XYZ', type: 'proposal_rejected', timestamp: '1 hora atrás', status: 'error' },
    { id: '4', vendor: 'Marcos Oliveira', client: 'Indústria Metal', type: 'contract_signed', timestamp: '2 horas atrás', status: 'success' },
    { id: '5', vendor: 'Ana Caroline', client: 'Escola Premium', type: 'follow_up', timestamp: '3 horas atrás', status: 'success' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal_sent':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'meeting_scheduled':
        return <Calendar className="w-4 h-4 text-green-600" />;
      case 'proposal_rejected':
        return <X className="w-4 h-4 text-red-600" />;
      case 'contract_signed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'follow_up':
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'proposal_sent':
        return 'enviou proposta para';
      case 'meeting_scheduled':
        return 'agendou reunião com';
      case 'proposal_rejected':
        return 'teve proposta rejeitada por';
      case 'contract_signed':
        return 'fechou contrato com';
      case 'follow_up':
        return 'fez follow-up com';
      default:
        return 'interagiu com';
    }
  };

  const renderDashboard = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-2xl font-bold text-gray-900">{kpiData.totalRevenue}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.5% vs mês anterior</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Propostas</p>
                    <p className="text-2xl font-bold text-gray-900">{kpiData.totalProposals}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.2% vs mês anterior</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-gray-900">{kpiData.conversionRate}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+3.1% vs mês anterior</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-gray-900">{kpiData.averageTicket}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+5.7% vs mês anterior</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance dos Vendedores */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Performance dos Vendedores</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mês</option>
                    <option value="quarter">Este Trimestre</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendedor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Propostas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receita
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversão
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendorData.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {vendor.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                              <div className="text-sm text-gray-500">{vendor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vendor.proposals}</div>
                          <div className="text-sm text-gray-500">propostas</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{vendor.revenue}</div>
                          <div className="text-sm text-gray-500">Meta: {vendor.target}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-48">
                            <ProgressBar 
                              proposal={{
                                id: `vendor-${vendor.id}`,
                                status: vendor.conversionRate > 80 ? 'completed' : 
                                       vendor.conversionRate > 50 ? 'processing' : 'pending_validation',
                                progress: vendor.conversionRate
                              }}
                              className="w-full"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons 
                            onView={() => handleViewVendor(vendor.id)}
                           onCopyLink={() => {
                               navigator.clipboard.writeText(`${window.location.origin}/supervisor/vendedor/${vendor.id}`);
                               showNotification('Link copiado para a área de transferência!', 'success');
                           }}
                            onMessage={() => setShowInternalMessage(true)}
                            onEdit={() => showNotification(`Editando dados de ${vendor.name}`, 'info')}
                            onWhatsApp={() => window.open(`https://wa.me/55${vendor.phone}?text=${encodeURIComponent(`Olá ${vendor.name}! Preciso falar sobre sua performance de vendas.`)}`)}
                            onEmail={() => window.open(`mailto:${vendor.email}?subject=Performance de Vendas`)}
                            onExternalLink={() => window.open(`${window.location.origin}/supervisor/vendedor/${vendor.id}`, '_blank')}
                           onSend={() => showNotification(`Enviando metas para ${vendor.name}...`, 'info')}
                           onShare={() => {
                             navigator.clipboard.writeText(`${window.location.origin}/supervisor/compartilhar/${vendor.id}`);
                             showNotification('Link de compartilhamento copiado!', 'success');
                           }}
                            onDownload={() => showNotification('Baixando relatório de performance...', 'success')}
                            onDelete={() => showNotification('Esta ação requer confirmação adicional', 'error')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.vendor}</span>
                          {' '}
                          {getActivityText(activity.type)}
                          {' '}
                          <span className="font-medium">{activity.client}</span>
                        </p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          activity.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.status === 'success' ? 'Sucesso' : 'Erro'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Relatórios de Vendas</h2>
              <p className="text-gray-600">Funcionalidade de relatórios em desenvolvimento...</p>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Avançado</h2>
              <p className="text-gray-600">Dashboard de analytics em desenvolvimento...</p>
            </div>
          </div>
        );

      case 'team':
        return renderTeamManagement();

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h2>
              <p className="text-gray-600">Painel de configurações em desenvolvimento...</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h2>
              <p className="text-gray-600">Bem-vindo ao painel do supervisor!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AbmixLogo className="h-8 w-auto" />
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">Portal do Supervisor</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notificações */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <NotificationCenter
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onClose={() => setShowNotifications(false)}
                    userRole="supervisor"
                  />
                )}
              </div>

              {/* Mensagens Internas */}
              <button
                onClick={() => setShowInternalMessage(true)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <MessageSquare className="w-6 h-6" />
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'reports', label: 'Relatórios', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: PieChart },
              { id: 'team', label: 'Equipe', icon: Users },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as SupervisorView)}
                  className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium ${
                    activeView === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderDashboard()}
        </div>
      </main>

      {/* Modais */}
      {showInternalMessage && (
        <InternalMessage 
          isOpen={showInternalMessage}
          onClose={() => setShowInternalMessage(false)}
          currentUser={{ name: user?.name || 'Supervisor', role: 'supervisor' }}
        />
      )}
    </div>
  );
};

export default SupervisorPortal;