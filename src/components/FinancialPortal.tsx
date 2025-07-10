import React, { useState } from 'react';
import { LogOut, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Calculator, Calendar, FileText, User, Bell, CreditCard, PieChart, BarChart3, Wallet, MessageSquare, Zap, Users, Upload, Database, Filter, Search } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import FinancialAutomationModal from './FinancialAutomationModal';
import NotificationCenter from './NotificationCenter';
import ClientForm from './ClientForm';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

interface FinancialPortalProps {
  user: any;
  onLogout: () => void;
}

interface Transaction {
  id: string;
  client: string;
  plan: string;
  value: string;
  type: 'income' | 'expense' | 'pending';
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  category: string;
}

const FinancialPortal: React.FC<FinancialPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedProposalForAutomation, setSelectedProposalForAutomation] = useState<{id: string, client: string} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  const [activeTab, setActiveTab] = useState<'dashboard' | 'proposals' | 'clients' | 'analysis' | 'forms'>('dashboard');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { getClientDocuments } = useGoogleDrive();

  // Notificações simuladas
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nova proposta para validação',
      message: 'A proposta VEND001-PROP123 está aguardando validação financeira',
      type: 'approval',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      read: false,
    },
    {
      id: '2',
      title: 'Lembrete de validação',
      message: 'Existem 3 propostas aguardando validação há mais de 2 dias',
      type: 'reminder',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      read: false,
    },
    {
      id: '3',
      title: 'Relatório mensal disponível',
      message: 'O relatório financeiro de Abril/2024 está disponível para download',
      type: 'document',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      read: true,
    },
    {
      id: '4',
      title: 'Nova mensagem',
      message: 'Carlos Silva enviou uma mensagem sobre a proposta VEND002-PROP124',
      type: 'message',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
      read: true,
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      client: 'Empresa ABC Ltda',
      plan: 'Plano Empresarial Premium',
      value: 'R$ 1.250,00',
      type: 'income',
      date: '2024-01-15',
      status: 'completed',
      category: 'Planos Empresariais',
    },
    {
      id: 'TXN002',
      client: 'Tech Solutions SA',
      plan: 'Plano Família Básico',
      value: 'R$ 650,00',
      type: 'income',
      date: '2024-01-14',
      status: 'completed',
      category: 'Planos Familiares',
    },
    {
      id: 'TXN003',
      client: 'Consultoria XYZ',
      plan: 'Plano Individual',
      value: 'R$ 320,00',
      type: 'income',
      date: '2024-01-13',
      status: 'pending',
      category: 'Planos Individuais',
    },
    {
      id: 'TXN004',
      client: 'Inovação Digital',
      plan: 'Comissão Vendedor',
      value: 'R$ 125,00',
      type: 'expense',
      date: '2024-01-12',
      status: 'completed',
      category: 'Comissões',
    },
  ]);

  const financialStats = [
    {
      name: 'Receita Total',
      value: 'R$ 45.680,00',
      change: '+12% este mês',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green',
    },
    {
      name: 'Despesas',
      value: 'R$ 8.920,00',
      change: '-3% vs mês anterior',
      changeType: 'positive',
      icon: CreditCard,
      color: 'red',
    },
    {
      name: 'Lucro Líquido',
      value: 'R$ 36.760,00',
      change: '+18% este mês',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      name: 'Margem de Lucro',
      value: '80.5%',
      change: '+2.3% vs anterior',
      changeType: 'positive',
      icon: PieChart,
      color: 'purple',
    },
  ];

  // Dados simulados de clientes
  const clients = [
    {
      id: 'CLIENT-001',
      name: 'João Silva',
      company: 'Empresa ABC Ltda',
      plan: 'Plano Empresarial Premium',
      value: 'R$ 1.250,00',
      status: 'pending_validation',
      documents: 8,
      email: 'joao@empresaabc.com.br',
      phone: '11999999999',
      submissionDate: '2024-05-10',
      formCompleted: true
    },
    {
      id: 'CLIENT-002',
      name: 'Maria Santos',
      company: 'Tech Solutions SA',
      plan: 'Plano Família Básico',
      value: 'R$ 650,00',
      status: 'validated',
      documents: 6,
      email: 'maria@techsolutions.com',
      phone: '11888888888',
      submissionDate: '2024-05-08',
      formCompleted: true
    },
    {
      id: 'CLIENT-003',
      name: 'Pedro Costa',
      company: 'Consultoria XYZ',
      plan: 'Plano Individual',
      value: 'R$ 320,00',
      status: 'sent_to_automation',
      documents: 5,
      email: 'pedro@consultoriaxyz.com.br',
      phone: '11777777777',
      submissionDate: '2024-05-05',
      formCompleted: true
    },
    {
      id: 'CLIENT-004',
      name: 'Ana Oliveira',
      company: 'Startup Inovadora',
      plan: 'Plano Empresarial',
      value: 'R$ 890,00',
      status: 'pending_validation',
      documents: 3,
      email: 'ana@startup.com.br',
      phone: '11666666666',
      submissionDate: '2024-05-12',
      formCompleted: false
    }
  ];

  // Dados simulados de análise financeira
  const financialAnalysis = {
    monthlyRevenue: [
      { month: 'Jan', value: 35000 },
      { month: 'Fev', value: 42000 },
      { month: 'Mar', value: 38000 },
      { month: 'Abr', value: 45680 },
      { month: 'Mai', value: 52000 },
      { month: 'Jun', value: 49000 }
    ],
    planDistribution: [
      { plan: 'Empresarial Premium', value: 28500, percentage: 62 },
      { plan: 'Família Básico', value: 12800, percentage: 28 },
      { plan: 'Individual', value: 4380, percentage: 10 }
    ],
    expenses: [
      { category: 'Comissões', value: 5200 },
      { category: 'Marketing', value: 1800 },
      { category: 'Operacional', value: 1920 }
    ],
    profitMargin: 80.5,
    conversionRate: 68,
    averageTicket: 'R$ 780,00'
  };

  const categoryStats = [
    { name: 'Planos Empresariais', value: 'R$ 28.500', percentage: 62 },
    { name: 'Planos Familiares', value: 'R$ 12.800', percentage: 28 },
    { name: 'Planos Individuais', value: 'R$ 4.380', percentage: 10 },
  ];

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

  const handleSendToAutomation = (id: string, client: string) => {
    setSelectedProposalForAutomation({id, client});
    setShowAutomationModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'income':
        return 'Receita';
      case 'expense':
        return 'Despesa';
      case 'pending':
        return 'Pendente';
      default:
        return 'N/A';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedCategory === 'all') return true;
    return transaction.category === selectedCategory;
  });

  const exportFinancialReport = () => {
    const reportData = {
      periodo: selectedPeriod,
      stats: financialStats,
      categorias: categoryStats,
      transacoes: filteredTransactions,
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-financeiro-${selectedPeriod}.json`;
    link.click();
    
    showNotification('Relatório financeiro exportado!', 'success');
  };

  const handleViewClientForm = (clientId: string) => {
    setSelectedClient(clientId);
    setActiveTab('forms');
  };

  const handleViewClientDocuments = (clientId: string) => {
    // Buscar documentos do cliente no Google Drive
    getClientDocuments(clientId)
      .then(documents => {
        console.log('Documentos do cliente:', documents);
        // Aqui você poderia mostrar os documentos em um modal
        showNotification(`Documentos do cliente ${clientId} carregados`, 'success');
      })
      .catch(error => {
        console.error('Erro ao buscar documentos:', error);
        showNotification('Erro ao carregar documentos', 'error');
      });
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

  const renderDashboardTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat) => {
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
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
          onClick={() => setActiveTab('proposals')}>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Validar Propostas</h3>
              <p className="text-sm text-gray-500">Revisar e aprovar</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
          onClick={() => setActiveTab('clients')}>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Clientes</h3>
              <p className="text-sm text-gray-500">Dados e documentos</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
          onClick={() => setActiveTab('analysis')}>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Análise Financeira</h3>
              <p className="text-sm text-gray-500">Métricas e projeções</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
          onClick={() => handleSendToAutomation('BATCH-ALL', 'Todas as Propostas Validadas')}>
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Enviar para Automação</h3>
              <p className="text-sm text-gray-500">Planilha final para Make/Zapier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance por Categoria</h2>
        <div className="space-y-4">
          {categoryStats.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">{category.value}</span>
                <span className="text-sm text-gray-500 w-12 text-right">{category.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Transações Recentes</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todas as Categorias</option>
            <option value="Planos Empresariais">Planos Empresariais</option>
            <option value="Planos Familiares">Planos Familiares</option>
            <option value="Planos Individuais">Planos Individuais</option>
            <option value="Comissões">Comissões</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente/Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                      <div className="text-sm text-gray-500">{transaction.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.client}</div>
                      <div className="text-sm text-gray-500">{transaction.plan}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
                      {getTypeText(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type === 'expense' ? '-' : '+'}{transaction.value}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionButtons 
                      onView={() => showNotification(`Visualizando transação ${transaction.id}`, 'info')}
                      onCopyLink={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/financeiro/transacao/${transaction.id}`);
                        showNotification('Link copiado para a área de transferência!', 'success');
                      }}
                      onSend={() => handleSendToAutomation(transaction.id, transaction.client)}
                      onDownload={() => showNotification('Baixando comprovante...', 'success')}
                      onMessage={() => setShowInternalMessage(true)}
                      onEdit={() => showNotification('Editando transação...', 'info')}
                      onWhatsApp={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Olá! Sobre a transação ${transaction.id} do cliente ${transaction.client}...`)}`)}
                      onExternalLink={() => window.open(`${window.location.origin}/financeiro/transacao/${transaction.id}`, '_blank')}
                      onDelete={() => showNotification('Esta funcionalidade requer permissão especial', 'error')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProposalsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Propostas para Validação</h2>
            <p className="text-sm text-gray-600">Gerencie o fluxo de validação financeira</p>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="pending_validation">Aguardando Validação</option>
            <option value="validated">Validadas</option>
            <option value="sent_to_automation">Enviadas p/ Automação</option>
            <option value="all">Todas</option>
          </select>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documentos
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
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-900">{proposal.vendor}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{proposal.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proposal.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                      {getStatusText(proposal.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{proposal.documents}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(proposal.submissionDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedProposal(proposal.id)}
                        className="text-teal-600 hover:text-teal-900"
                        title="Enviar para automação"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {proposal.status === 'validated' && (
                        <button 
                          onClick={() => handleSendToAutomation(proposal.id, proposal.client)}
                          className="text-purple-600 hover:text-purple-900"
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
    </div>
  );

  const renderClientsTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="pending_validation">Aguardando Validação</option>
              <option value="validated">Validados</option>
              <option value="sent_to_automation">Enviados p/ Automação</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => showNotification('Exportando lista de clientes...', 'info')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Clientes ({clients.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formulário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                      {getStatusText(client.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      client.formCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.formCompleted ? 'Completo' : 'Incompleto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionButtons 
                      onView={() => handleViewClientForm(client.id)}
                      onDownload={() => handleViewClientDocuments(client.id)}
                      onMessage={() => setShowInternalMessage(true)}
                      onWhatsApp={() => window.open(`https://wa.me/55${client.phone}?text=${encodeURIComponent(`Olá ${client.name}! Sobre sua proposta...`)}`)}
                      onEmail={() => window.open(`mailto:${client.email}?subject=Proposta de Plano de Saúde`)}
                      onSend={() => handleSendToAutomation(client.id, client.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Análise Financeira</h1>
        <p className="text-purple-100">Métricas detalhadas e projeções financeiras</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            Receita Mensal
          </h3>
          <div className="h-48 flex items-end space-x-2">
            {financialAnalysis.monthlyRevenue.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-md" 
                  style={{ height: `${(month.value / 55000) * 100}%` }}
                ></div>
                <div className="text-xs font-medium text-gray-700 mt-2">{month.month}</div>
                <div className="text-xs text-gray-500">R${(month.value/1000).toFixed(1)}k</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 text-blue-600 mr-2" />
            Distribuição por Plano
          </h3>
          <div className="space-y-4">
            {financialAnalysis.planDistribution.map((plan) => (
              <div key={plan.plan} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{plan.plan}</span>
                  <span className="text-gray-600">{plan.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${plan.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-500">R$ {plan.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
            Métricas Chave
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Margem de Lucro</span>
                <span className="text-sm font-medium text-green-600">{financialAnalysis.profitMargin}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${financialAnalysis.profitMargin}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Taxa de Conversão</span>
                <span className="text-sm font-medium text-blue-600">{financialAnalysis.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${financialAnalysis.conversionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Ticket Médio:</span>
                <span className="font-medium text-gray-900">{financialAnalysis.averageTicket}</span>
              </div>
              
              <div className="flex justify-between text-sm mt-2">
                <span className="font-medium text-gray-700">Despesas:</span>
                <span className="font-medium text-red-600">R$ {financialAnalysis.expenses.reduce((sum, exp) => sum + exp.value, 0).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhamento de Despesas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {financialAnalysis.expenses.map((expense) => (
            <div key={expense.category} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                <span className="text-sm font-medium text-red-600">R$ {expense.value.toLocaleString('pt-BR')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(expense.value / 8920) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {((expense.value / 8920) * 100).toFixed(1)}% do total
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projection Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ferramentas de Projeção</h3>
          <button
            onClick={() => showNotification('Gerando projeção financeira...', 'info')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
          >
            Gerar Projeção
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período de Projeção
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="3">Próximos 3 meses</option>
              <option value="6">Próximos 6 meses</option>
              <option value="12">Próximos 12 meses</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taxa de Crescimento Estimada
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="conservative">Conservadora (5%)</option>
              <option value="moderate">Moderada (10%)</option>
              <option value="aggressive">Agressiva (15%)</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormsTab = () => (
    <div className="space-y-6">
      {selectedClient ? (
        <>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Formulário do Cliente</h1>
                <p className="text-blue-100">
                  {clients.find(c => c.id === selectedClient)?.name || 'Cliente'} - {selectedClient}
                </p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Voltar para Lista
              </button>
            </div>
          </div>
          
          <ClientForm />
        </>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um Cliente</h3>
          <p className="text-gray-500 mb-6">
            Selecione um cliente na lista para visualizar o formulário preenchido
          </p>
          <button
            onClick={() => setActiveTab('clients')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Lista de Clientes
          </button>
        </div>
      )}
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
                <span className="text-xl font-bold text-gray-900">Portal Financeiro</span>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Financeiro</h1>
              <p className="text-gray-600">Análise financeira, receitas, despesas e relatórios</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with tabs */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Portal Financeiro</h1>
              <p className="text-gray-600">Análise financeira, validação e automação</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
              <button
                onClick={exportFinancialReport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar Relatório
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'proposals', label: 'Propostas', icon: FileText },
                  { id: 'clients', label: 'Clientes', icon: Users },
                  { id: 'analysis', label: 'Análise Financeira', icon: PieChart },
                  { id: 'forms', label: 'Formulários', icon: FileText }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600'
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
          </div>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'proposals' && renderProposalsTab()}
          {activeTab === 'clients' && renderClientsTab()}
          {activeTab === 'analysis' && renderAnalysisTab()}
          {activeTab === 'forms' && renderFormsTab()}
        </div>
      </main>

      {/* Internal Message Modal */}
      {showInternalMessage && (
        <InternalMessage 
          isOpen={showInternalMessage}
          onClose={() => setShowInternalMessage(false)}
          currentUser={{
            name: user?.name || 'Usuário Financeiro',
            role: 'financial' 
          }}
        />
      )}
      
      {/* Automation Modal */}
      {showAutomationModal && selectedProposalForAutomation && (
        <FinancialAutomationModal
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
          proposalId={selectedProposalForAutomation.id}
          clientName={selectedProposalForAutomation.client}
        />
      )}
    </div>
  );
};

export default FinancialPortal;