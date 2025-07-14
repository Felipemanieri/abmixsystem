import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BarChart3, Users, TrendingUp, DollarSign, FileText, Target, Calculator, UserPlus, Bell, MessageSquare, LogOut, X, CheckCircle, Calendar, PieChart, Settings } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import { ProgressBar } from './ProgressBar';
import ActionButtons from './ActionButtons';
import NotificationCenter from './NotificationCenter';
import InternalMessage from './InternalMessage';
import { ProposalStatus, STATUS_CONFIG } from '@shared/statusSystem';
import { StatusManager } from '@shared/statusSystem';
import { apiRequest } from '@/lib/queryClient';
import { queryClient as queryClientInstance } from '@/lib/queryClient';
import { showNotification } from '@/utils/notifications';

interface SupervisorPortalProps {
  user: any;
  onLogout: () => void;
}

type SupervisorView = 'dashboard' | 'reports' | 'analytics' | 'team' | 'settings';

export function SupervisorPortal({ user, onLogout }: SupervisorPortalProps) {
  const [activeView, setActiveView] = useState<SupervisorView>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  
  // Estados para filtros
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  // Estados para gerenciamento de vendedores
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  const [newVendorData, setNewVendorData] = useState({ name: '', email: '' });

  // Dados KPI
  const kpiData = {
    totalRevenue: 'R$ 2.847.320',
    totalProposals: '847',
    conversionRate: '68.2%',
    averageTicket: 'R$ 3.360'
  };

  // Buscar propostas
  const { data: proposals = [], isLoading: proposalsLoading } = useQuery({
    queryKey: ['/api/proposals'],
    queryFn: () => apiRequest('/api/proposals'),
  });

  // Buscar vendedores
  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ['/api/vendors'],
    queryFn: () => apiRequest('/api/vendors'),
    retry: false,
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

    addVendorMutation.mutate({
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

  // Filtrar propostas
  const filteredProposals = proposals.filter(proposal => {
    if (filterVendor && proposal.vendor !== filterVendor) return false;
    if (filterStatus && proposal.status !== filterStatus) return false;
    if (filterDate) {
      const proposalDate = new Date(proposal.submissionDate).toISOString().split('T')[0];
      if (proposalDate !== filterDate) return false;
    }
    return true;
  });

  // Notificações
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nova Proposta',
      message: 'Ana Caroline enviou nova proposta para TechCorp',
      type: 'message' as const,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      link: '/supervisor/proposals'
    },
    {
      id: '2',
      title: 'Meta Atingida',
      message: 'Bruna Garcia atingiu 100% da meta mensal',
      type: 'approval' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      link: '/supervisor/team'
    },
    {
      id: '3',
      title: 'Documento Aprovado',
      message: 'Proposta ABM234 foi aprovada pela área financeira',
      type: 'document' as const,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      link: '/supervisor/messages'
    },
    {
      id: '4',
      title: 'Alerta de Performance',
      message: 'Diana Santos está 30% abaixo da meta',
      type: 'alert' as const,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      link: '/supervisor/team'
    }
  ]);

  const handleStatusChange = (proposalId: string, newStatus: ProposalStatus) => {
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

  // Atividade recente
  const recentActivity = [
    {
      id: '1',
      vendor: 'Ana Caroline',
      action: 'proposal_sent',
      client: 'TechCorp',
      timestamp: 'há 15 minutos',
      status: 'success'
    },
    {
      id: '2',
      vendor: 'Bruna Garcia',
      action: 'meeting_scheduled',
      client: 'MedCenter',
      timestamp: 'há 1 hora',
      status: 'success'
    },
    {
      id: '3',
      vendor: 'Carlos Silva',
      action: 'contract_signed',
      client: 'FinanceFlow',
      timestamp: 'há 2 horas',
      status: 'success'
    },
    {
      id: '4',
      vendor: 'Diana Santos',
      action: 'follow_up',
      client: 'StartupXYZ',
      timestamp: 'há 3 horas',
      status: 'success'
    }
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
        {/* Lista de Vendedores */}
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

          {/* Lista formatada */}
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

                <form onSubmit={(e) => { e.preventDefault(); handleAddVendor(); }}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Vendedor
                    </label>
                    <input
                      type="text"
                      value={newVendorData.name}
                      onChange={(e) => setNewVendorData({ ...newVendorData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Ana Caroline Terto"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newVendorData.email}
                      onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: ana@abmix.com.br"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha (Automática)
                    </label>
                    <input
                      type="text"
                      value="120784"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Senha padrão para todos os vendedores</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddVendorForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={addVendorMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {addVendorMutation.isPending ? 'Adicionando...' : 'Adicionar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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

            {/* Acompanhamento de Vendas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Propostas ({filteredProposals.length})
                  </h2>
                  
                  {/* Filtros */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-600">Vendedor:</label>
                      <select 
                        value={filterVendor}
                        onChange={(e) => setFilterVendor(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Todos</option>
                        <option value="Ana Caroline">Ana Caroline</option>
                        <option value="Bruna Garcia">Bruna Garcia</option>
                        <option value="Carlos Silva">Carlos Silva</option>
                        <option value="Diana Santos">Diana Santos</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-600">Status:</label>
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Todos</option>
                        <option value="observacao">OBSERVAÇÃO</option>
                        <option value="analise">ANÁLISE</option>
                        <option value="assinatura_ds">ASSINATURA DS</option>
                        <option value="expirado">EXPIRADO</option>
                        <option value="implantado">IMPLANTADO</option>
                        <option value="aguar_pagamento">AGUARDANDO PAGAMENTO</option>
                        <option value="assinatura_proposta">ASSINATURA PROPOSTA</option>
                        <option value="aguar_selecao_vigencia">AGUARDAR SELEÇÃO VIGÊNCIA</option>
                        <option value="pendencia">PENDÊNCIA</option>
                        <option value="declinado">DECLINADO</option>
                        <option value="aguar_vigencia">AGUARDAR VIGÊNCIA</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-600">Data:</label>
                      <input 
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {proposalsLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProposals.map((proposal: any) => {
                        const statusConfig = STATUS_CONFIG[proposal.status as ProposalStatus];
                        const proposalId = `ABM${String(proposal.id).padStart(3, '0')}`;
                        
                        return (
                          <tr key={proposal.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                onClick={() => window.open(`https://drive.google.com/drive/folders/${proposal.id}`, '_blank')}
                              >
                                {proposalId}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {proposal.client}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {proposal.vendor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {proposal.plan}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {proposal.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span 
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig?.bgColor} ${statusConfig?.textColor}`}
                              >
                                {statusConfig?.label || proposal.status}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                Somente leitura
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <ProgressBar proposal={proposal} className="w-full" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <ActionButtons
                                onView={() => window.open(`https://drive.google.com/drive/folders/${proposal.id}`, '_blank')}
                                onExternalLink={() => window.open(`/proposal/${proposal.token}`, '_blank')}
                                userRole="supervisor"
                                className="flex gap-1"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredProposals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {proposals.length === 0 ? 'Nenhuma proposta encontrada.' : 'Nenhuma proposta corresponde aos filtros aplicados.'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Performance dos Vendedores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance dos Vendedores</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Ana Caroline', target: 100, current: 125, color: 'green' },
                    { name: 'Bruna Garcia', target: 100, current: 100, color: 'blue' },
                    { name: 'Carlos Silva', target: 100, current: 85, color: 'yellow' },
                    { name: 'Diana Santos', target: 100, current: 70, color: 'red' }
                  ].map((vendor) => (
                    <div key={vendor.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-sm text-gray-500">{vendor.current}% da meta</p>
                      </div>
                      <div className="w-32">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              vendor.color === 'green' ? 'bg-green-500' :
                              vendor.color === 'blue' ? 'bg-blue-500' :
                              vendor.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(vendor.current, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atividade Recente */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.vendor}</span>
                          {' '}
                          {getActivityText(activity.action)}
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
                      ? 'border-teal-500 text-teal-600'
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderDashboard()}
      </main>

      {/* Mensagem Interna Modal */}
      {showInternalMessage && (
        <InternalMessage
          isOpen={showInternalMessage}
          onClose={() => setShowInternalMessage(false)}
          currentUser={{
            name: user?.name || 'Supervisor',
            role: 'supervisor'
          }}
        />
      )}
    </div>
  );
}