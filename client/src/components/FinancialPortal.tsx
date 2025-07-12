import React, { useState } from 'react';
import { LogOut, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Calculator, Calendar, FileText, User, Bell, CreditCard, PieChart, BarChart3, Wallet, MessageSquare, Zap, Users, Upload, Database, Filter, Search, Settings, Mail } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import FinancialAutomationModal from './FinancialAutomationModal';
import NotificationCenter from './NotificationCenter';
import ClientForm from './ClientForm';
import ProgressBar from './ProgressBar';
import ProposalProgressTracker from './ProposalProgressTracker';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { showNotification } from '../utils/notifications';

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
  const [showFinancialArea, setShowFinancialArea] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getClientDocuments } = useGoogleDrive();

  const mockTransactions: Transaction[] = [
    { id: '1', client: 'Empresa ABC', plan: 'Plano Premium', value: 'R$ 15.000', type: 'income', date: '2024-01-15', status: 'completed', category: 'subscription' },
    { id: '2', client: 'Tech Solutions', plan: 'Plano Básico', value: 'R$ 8.500', type: 'income', date: '2024-01-14', status: 'pending', category: 'subscription' },
    { id: '3', client: 'StartupXYZ', plan: 'Consultoria', value: 'R$ 12.000', type: 'income', date: '2024-01-13', status: 'completed', category: 'consulting' },
  ];

  const mockProposals = [
    { id: '1', client: 'Empresa ABC', value: 'R$ 25.000', status: 'approved', date: '2024-01-10' },
    { id: '2', client: 'Tech Solutions', value: 'R$ 18.000', status: 'pending', date: '2024-01-12' },
    { id: '3', client: 'StartupXYZ', value: 'R$ 30.000', status: 'review', date: '2024-01-14' },
  ];

  const mockClients = [
    { id: '1', name: 'Empresa ABC', plan: 'Premium', value: 'R$ 15.000/mês', status: 'active' },
    { id: '2', name: 'Tech Solutions', plan: 'Básico', value: 'R$ 8.500/mês', status: 'active' },
    { id: '3', name: 'StartupXYZ', plan: 'Consultoria', value: 'R$ 12.000/projeto', status: 'pending' },
  ];

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    const matchesSearch = transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.plan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalIncome = mockTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.value.replace('R$ ', '').replace('.', '').replace(',', '.')), 0);

  const totalPending = mockTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + parseFloat(t.value.replace('R$ ', '').replace('.', '').replace(',', '.')), 0);

  const handleAutomateProposal = (proposalId: string, clientName: string) => {
    setSelectedProposalForAutomation({ id: proposalId, client: clientName });
    setShowAutomationModal(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalIncome.toLocaleString('pt-BR')}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-500 ml-1">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendente</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalPending.toLocaleString('pt-BR')}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">{mockTransactions.filter(t => t.status === 'pending').length} transações</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{mockClients.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">+2</span>
            <span className="text-gray-500 ml-1">novos este mês</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900">68%</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">+5.2%</span>
            <span className="text-gray-500 ml-1">vs mês anterior</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todas as categorias</option>
                <option value="subscription">Assinaturas</option>
                <option value="consulting">Consultoria</option>
                <option value="project">Projetos</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Concluído' : 
                       transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionButtons 
                      onView={() => showNotification(`Visualizando transação ${transaction.id}`, 'info')}
                      onCopyLink={() => navigator.clipboard.writeText(`${window.location.origin}/financial/transaction/${transaction.id}`)}
                      onWhatsApp={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Informações sobre a transação ${transaction.id}`)}`)}
                      onEmail={() => window.open(`mailto:?subject=Transação ${transaction.id}&body=Detalhes da transação: ${transaction.client} - ${transaction.value}`)}
                      onDownload={() => showNotification('Baixando comprovante...', 'success')}
                      onMessage={() => setShowInternalMessage(true)}
                      onEdit={() => showNotification(`Editando transação ${transaction.id}...`, 'info')}
                      onExternalLink={() => window.open(`${window.location.origin}/financial/transaction/${transaction.id}`, '_blank')}
                      onSend={() => showNotification(`Enviando transação ${transaction.id} para processamento...`, 'info')}
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

  const renderProposals = () => (
    <div className="space-y-6">
      {/* Barra de Progresso Independente */}
      <ProposalProgressTracker
        contractData={{
          nomeEmpresa: 'Tech Solutions Ltda',
          cnpj: '12.345.678/0001-90',
          planoContratado: 'Plano Empresarial',
          valor: '1.250,00',
          inicioVigencia: '2024-02-01'
        }}
        titulares={[{
          id: '1',
          nomeCompleto: 'João Silva Santos',
          cpf: '123.456.789-00',
          rg: '12.345.678-9',
          dataNascimento: '1985-03-15',
          nomeMae: 'Maria Silva',
          sexo: 'masculino',
          estadoCivil: 'casado',
          peso: '75',
          altura: '1.75',
          emailPessoal: 'joao@email.com',
          telefonePessoal: '(11) 99999-9999',
          emailEmpresa: 'joao@techsolutions.com',
          telefoneEmpresa: '(11) 3333-3333',
          cep: '01234-567',
          enderecoCompleto: 'Rua das Flores, 123 - Centro - São Paulo/SP',
          dadosReembolso: 'Banco do Brasil - Ag: 1234 - Conta: 56789-0'
        }]}
        dependentes={[]}
        attachments={[]}
        className="mb-6"
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Propostas em Andamento</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proposal.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proposal.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      proposal.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : proposal.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {proposal.status === 'approved' ? 'Aprovada' : 
                       proposal.status === 'pending' ? 'Pendente' : 'Em Análise'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-48">
                      <ProgressBar 
                        proposal={proposal}
                        className="w-full"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(proposal.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleAutomateProposal(proposal.id, proposal.client)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs mr-2"
                    >
                      <Zap className="h-3 w-3 inline mr-1" />
                      Automatizar
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Gestão de Clientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedClient(client.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <FileText className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Receita</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <BarChart3 className="h-16 w-16 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Plano</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <PieChart className="h-16 w-16 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderForms = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Formulários Financeiros</h3>
        <ClientForm />
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
              <AbmixLogo />
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">Portal Financeiro</h1>
                <p className="text-sm text-gray-500">Gestão financeira e análises</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ActionButtons 
                onMessage={() => setShowInternalMessage(true)}
                userRole="financial"
              />
              
              <button
                onClick={() => setShowFinancialArea(!showFinancialArea)}
                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                title={showFinancialArea ? "Mostrar Área Financeira Completa" : "Mostrar Área Financeira Simplificada"}
              >
                <Settings className="h-6 w-6" />
              </button>
              
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário Financeiro'}</p>
                  <p className="text-xs text-gray-500">Área Financeira</p>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'proposals', label: 'Propostas', icon: FileText },
              { id: 'clients', label: 'Clientes', icon: Users },
              { id: 'analysis', label: 'Análises', icon: PieChart },
              { id: 'forms', label: 'Formulários', icon: Calculator }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Área Financeira Completa */}
      {showFinancialArea && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Área Financeira Completa</h2>
            <p className="text-gray-600 mb-4">
              Esta área permite validar propostas, aprovar ou rejeitar documentos, e enviar para automação.
            </p>
            <button
              onClick={() => setShowAutomationModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Zap className="w-4 h-4 mr-2 inline-block" />
              Enviar Proposta para Automação
            </button>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationCenter 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          userRole="financial"
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard Financeiro'}
                {activeTab === 'proposals' && 'Gestão de Propostas'}
                {activeTab === 'clients' && 'Gestão de Clientes'}
                {activeTab === 'analysis' && 'Análises e Relatórios'}
                {activeTab === 'forms' && 'Formulários'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'dashboard' && 'Visão geral das métricas financeiras'}
                {activeTab === 'proposals' && 'Acompanhe e gerencie propostas comerciais'}
                {activeTab === 'clients' && 'Gerencie informações dos clientes'}
                {activeTab === 'analysis' && 'Relatórios detalhados e análises'}
                {activeTab === 'forms' && 'Formulários para coleta de dados'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
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
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'proposals' && renderProposals()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'forms' && renderForms()}
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