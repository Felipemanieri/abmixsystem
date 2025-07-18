import React, { useState, useEffect } from 'react';
import { LogOut, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Calculator, Calendar, FileText, User, CreditCard, PieChart, BarChart3, Wallet, MessageSquare, Zap, Users, Upload, Database, Filter, Search, Settings, Mail, Download, Share2, ExternalLink, Send, Copy, X } from 'lucide-react';
// import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import FinancialAutomationModal from './FinancialAutomationModal';
import SystemStatusIndicator from './SystemStatusIndicator';
// NotificationCenter removido
import ClientForm from './ClientForm';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import ProposalProgressTracker from './ProposalProgressTracker';
import SystemFooter from './SystemFooter';
import ThemeToggle from './ThemeToggle';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
// Notificações completamente removidas
import { useProposals, useRealTimeProposals } from '../hooks/useProposals';
import { realTimeSync } from '../utils/realTimeSync';
import StatusManager, { ProposalStatus, STATUS_CONFIG } from '@shared/statusSystem';

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
  realStatus?: string;
}

const FinancialPortal: React.FC<FinancialPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  // NOTIFICAÇÕES COMPLETAMENTE REMOVIDAS
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedProposalForAutomation, setSelectedProposalForAutomation] = useState<{id: string, client: string} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  const [activeTab, setActiveTab] = useState<'dashboard' | 'proposals' | 'clients' | 'analysis'>('dashboard');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showFinancialArea, setShowFinancialArea] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusManager] = useState(() => StatusManager.getInstance());
  const [proposalStatuses, setProposalStatuses] = useState<Map<string, ProposalStatus>>(new Map());
  
  // Estado para relatórios recebidos do supervisor (inicia vazio)
  const [receivedReports, setReceivedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportsBox, setShowReportsBox] = useState(false);
  const [reportDateFilter, setReportDateFilter] = useState('all');
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelReportData, setExcelReportData] = useState(null);

  // Carregar relatórios do localStorage ao inicializar
  useEffect(() => {
    const loadReports = () => {
      const savedReports = JSON.parse(localStorage.getItem('financialReports') || '[]');
      setReceivedReports(savedReports);
    };

    loadReports();

    // Escutar eventos de novos relatórios
    const handleNewReport = (event: any) => {
      const newReport = event.detail;
      setReceivedReports(prev => [newReport, ...prev]);
      showNotification('Novo relatório recebido do supervisor!', 'success');
    };

    window.addEventListener('newFinancialReport', handleNewReport);
    
    return () => {
      window.removeEventListener('newFinancialReport', handleNewReport);
    };
  }, []);
  
  // Ativar sincronização em tempo real
  useEffect(() => {
    realTimeSync.enableAggressivePolling();
  }, []);
  // Usar propostas reais da API
  const { proposals: realProposals, isLoading: proposalsLoading } = useProposals();
  const { getClientDocuments } = useGoogleDrive();
  
  // Hook para propostas com sincronização em tempo real

  // Inicializar status e escutar mudanças
  useEffect(() => {
    const mockProposals = [
      { id: 'VEND001-PROP123' },
      { id: 'VEND002-PROP124' },
      { id: 'VEND001-PROP125' },
      { id: 'VEND003-PROP126' },
      { id: 'VEND002-PROP127' },
      { id: 'VEND001-PROP128' }
    ];

    const initializeStatuses = () => {
      const statusMap = new Map<string, ProposalStatus>();
      mockProposals.forEach(proposal => {
        statusMap.set(proposal.id, statusManager.getStatus(proposal.id));
      });
      setProposalStatuses(statusMap);
    };

    initializeStatuses();

    const handleStatusChange = (proposalId: string, newStatus: ProposalStatus) => {
      setProposalStatuses(prev => new Map(prev.set(proposalId, newStatus)));
    };

    statusManager.subscribe(handleStatusChange);

    return () => {
      statusManager.unsubscribe(handleStatusChange);
    };
  }, [statusManager]);

  // Gerar transações reais baseadas nas propostas
  const realTransactions: Transaction[] = (realProposals || []).map(proposal => {
    const contractData = proposal.contractData || {};
    const value = contractData.valor ? `R$ ${contractData.valor}` : 'R$ 0';
    const isCompleted = proposal.status === 'implantado';
    const isPending = ['aguar_pagamento', 'aguar_selecao_vigencia', 'aguar_vigencia', 'analise', 'observacao', 'assinatura_ds', 'assinatura_proposta', 'pendencia'].includes(proposal.status);
    
    return {
      id: proposal.abmId || proposal.id, // Usar abmId se disponível
      client: contractData.nomeEmpresa || 'Cliente não informado',
      plan: contractData.planoContratado || 'Plano não informado',
      value: value,
      type: 'income' as const,
      date: proposal.createdAt || new Date().toISOString(),
      status: isCompleted ? 'completed' as const : isPending ? 'pending' as const : proposal.status === 'declinado' ? 'cancelled' as const : 'pending' as const,
      category: 'subscription',
      realStatus: proposal.status // Manter status real para debugging
    };
  });

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

  const filteredTransactions = realTransactions.filter(transaction => {
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    const matchesSearch = transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.plan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalIncome = realTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.value.replace('R$ ', '').replace('.', '').replace(',', '.')), 0);

  const totalPending = realTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + parseFloat(t.value.replace('R$ ', '').replace('.', '').replace(',', '.')), 0);

  // Calcular taxa de conversão real
  const totalProposals = realTransactions.length;
  const completedProposals = realTransactions.filter(t => t.status === 'completed').length;
  const conversionRate = totalProposals > 0 ? Math.round((completedProposals / totalProposals) * 100) : 0;

  // Usando o componente StatusBadge oficial do projeto para garantir cores corretas

  const handleAutomateProposal = (proposalId: string, clientName: string) => {
    setSelectedProposalForAutomation({ id: proposalId, client: clientName });
    setShowAutomationModal(true);
  };

  // Funções para ações dos relatórios
  const handleDownloadReport = (reportId: string) => {
    showNotification('Download do relatório iniciado', 'success');
    // Simular download
    const report = receivedReports.find(r => r.id === reportId);
    if (report) {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleEmailReport = (reportId: string) => {
    showNotification('Email com relatório enviado', 'success');
    // Aqui integraria com o SendGrid
    const report = receivedReports.find(r => r.id === reportId);
    if (report) {
      const mailtoLink = `mailto:?subject=Relatório: ${report.title}&body=Segue em anexo o relatório solicitado.`;
      window.open(mailtoLink);
    }
  };

  const handleViewInDrive = (reportId: string) => {
    showNotification('Abrindo no Google Drive', 'info');
    window.open(`https://drive.google.com/drive/folders/reports/${reportId}`, '_blank');
  };

  const handleViewInSheets = (reportId: string) => {
    showNotification('Abrindo no Google Sheets', 'info');
    window.open(`https://docs.google.com/spreadsheets/d/reports_${reportId}`, '_blank');
  };

  const handleWhatsAppShare = (reportId: string) => {
    showNotification('Compartilhando via WhatsApp', 'success');
    const report = receivedReports.find(r => r.id === reportId);
    if (report) {
      const message = `*Relatório Financeiro*%0A%0A📊 ${report.title}%0A📅 Período: ${report.data.period}%0A💰 Valor Total: ${report.data.totalValue}%0A📈 Propostas: ${report.data.totalProposals}%0A🎯 Conversão: ${report.data.conversionRate}`;
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  // Função para visualizar relatório completo
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  // Função para visualizar relatório no formato Excel
  const handleViewExcel = (report: any) => {
    setExcelReportData(report);
    setShowExcelModal(true);
    showNotification('Relatório Excel aberto no painel', 'success');
  };

  // Função para simular recebimento de relatório do supervisor (para testes)
  const simulateReportReceived = (reportData: any) => {
    setReceivedReports(prev => [reportData, ...prev]);
    showNotification('Novo relatório recebido do supervisor', 'success');
  };

  // Simular recebimento de relatório de teste
  const sendTestReport = () => {
    const testReport = {
      id: `report-${Date.now()}`,
      title: 'Relatório Semanal de Performance',
      status: 'received',
      receivedAt: new Date().toISOString(),
      data: {
        period: 'Semana 02/2025 (13-19 Jan)',
        totalProposals: '47',
        totalValue: 'R$ 187.500,00',
        conversionRate: '73.4%'
      }
    };
    simulateReportReceived(testReport);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white dark:text-gray-500 dark:text-white">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
            <span className="text-gray-600 dark:text-gray-400">+0%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white dark:text-gray-500 dark:text-white">Pendente</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">{formatCurrency(totalPending)}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500 dark:text-white dark:text-gray-500 dark:text-white">{realTransactions.filter(t => t.status === 'pending').length} transações</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white dark:text-gray-500 dark:text-white">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">{realTransactions.filter(t => t.status === 'completed').length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">+0</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">novos este mês</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white dark:text-gray-500 dark:text-white">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">{conversionRate}%</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">+0%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs mês anterior</span>
          </div>
        </div>
      </div>

      {/* Caixa de Relatórios Recebidos do Supervisor */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
        <div 
          className="p-6 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:bg-gray-700 transition-colors"
          onClick={() => setShowReportsBox(!showReportsBox)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white">Relatórios do Supervisor</h3>
                <p className="text-sm text-gray-500 dark:text-white dark:text-gray-500 dark:text-white">
                  {receivedReports.length === 0 
                    ? "Clique para acessar relatórios" 
                    : `${receivedReports.length} relatório(s) disponível(eis)`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {receivedReports.length > 0 && (
                <span className="bg-emerald-100 text-emerald-700 dark:text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {receivedReports.filter(r => r.status === 'received').length} Novos
                </span>
              )}
              <div className={`transform transition-transform ${showReportsBox ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {showReportsBox && (
          <div className="p-6">
            {/* Filtros de Data */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white dark:text-white mb-3">Filtros de Período</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white dark:text-white mb-1">Data Início</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dd/mm/aaaa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white dark:text-white mb-1">Data Fim</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dd/mm/aaaa"
                  />
                </div>
              </div>
            </div>

            {receivedReports.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500 dark:text-white" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white dark:text-white mb-2">Aguardando Relatórios</h4>
                <p className="text-gray-500 dark:text-white dark:text-gray-500 dark:text-white mb-1">Nenhum relatório recebido do supervisor ainda</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 dark:text-white">Quando o supervisor enviar relatórios, eles aparecerão aqui para análise</p>
              </div>
            ) : (
              <div className="space-y-4">
                {receivedReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 dark:border-gray-700 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white dark:text-white">{report.title}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            report.status === 'received' 
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white dark:text-white'
                          }`}>
                            {report.status === 'received' ? 'Novo' : 'Processado'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-white dark:text-gray-500 dark:text-white mb-3">
                          Recebido em {new Date(report.receivedAt).toLocaleDateString('pt-BR')} às {new Date(report.receivedAt).toLocaleTimeString('pt-BR')}
                        </p>
                        
                        {/* Botão para visualizar relatório completo */}
                        <button
                          onClick={() => handleViewReport(report)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 dark:text-white bg-blue-50 dark:bg-blue-900 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar Relatório Completo
                        </button>
                      </div>
                    </div>
                    
                    {/* Ações do Relatório */}
                    <div className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 rounded-lg p-3">
                      <h5 className="text-xs font-medium text-gray-700 dark:text-white dark:text-white mb-2">Ações do Relatório</h5>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="flex flex-col items-center p-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                        >
                          <Download className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
                          <span className="text-blue-700 dark:text-white text-xs">Baixar</span>
                        </button>
                        
                        <button
                          onClick={() => handleEmailReport(report.id)}
                          className="flex flex-col items-center p-2 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                        >
                          <Mail className="h-4 w-4 text-green-600 dark:text-green-400 mb-1" />
                          <span className="text-green-700 dark:text-white text-xs">Email</span>
                        </button>
                        
                        <button
                          onClick={() => handleViewInDrive(report.id)}
                          className="flex flex-col items-center p-2 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-purple-600 dark:text-white mb-1" />
                          <span className="text-purple-700 dark:text-white text-xs">Google Drive</span>
                        </button>
                        
                        <button
                          onClick={() => handleViewInSheets(report.id)}
                          className="flex flex-col items-center p-2 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
                        >
                          <BarChart3 className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mb-1" />
                          <span className="text-yellow-700 dark:text-white text-xs">Google Sheets</span>
                        </button>
                        
                        <button
                          onClick={() => handleWhatsAppShare(report.id)}
                          className="flex flex-col items-center p-2 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-white mb-1" />
                          <span className="text-emerald-700 dark:text-white text-xs">WhatsApp</span>
                        </button>
                        
                        <button
                          onClick={() => handleViewExcel(report)}
                          className="flex flex-col items-center p-2 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
                        >
                          <FileText className="h-4 w-4 text-orange-600 dark:text-white mb-1" />
                          <span className="text-orange-700 dark:text-white text-xs">Excel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white">Transações Recentes</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 dark:text-white" />
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <thead className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 dark:bg-gray-800 divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => window.open(`https://drive.google.com/drive/folders/${transaction.id}`, '_blank')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-white underline"
                    >
                      {transaction.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white dark:text-white">{transaction.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-white dark:text-gray-500 dark:text-white">{transaction.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white dark:text-white">{transaction.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={transaction.realStatus as ProposalStatus || 'observacao'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white dark:text-gray-500 dark:text-white">
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
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white">Propostas em Andamento</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Vendedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Progresso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 dark:bg-gray-800 divide-y divide-gray-200">
              {realProposals?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(0, 10).map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => window.open(`https://drive.google.com/drive/folders/${proposal.abmId}`, '_blank')}
                      className="text-blue-600 hover:text-blue-800 dark:text-white font-medium transition-colors"
                    >
                      {proposal.abmId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white dark:text-white">{proposal.contractData?.nomeEmpresa}</div>
                    <div className="text-sm text-gray-500 dark:text-white dark:text-gray-500 dark:text-white">CNPJ: {proposal.contractData?.cnpj}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white dark:text-white">{proposal.vendorName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white dark:text-white">R$ {proposal.contractData?.valor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={proposal.status}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-48">
                      <ProgressBar 
                        proposal={proposal}
                        className="w-full"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white dark:text-gray-500 dark:text-white">
                    {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleAutomateProposal(proposal.id, proposal.contractData?.nomeEmpresa)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs mr-2"
                    >
                      <Zap className="h-3 w-3 inline mr-1" />
                      Automatizar
                    </button>
                    <button 
                      onClick={() => window.open(`${window.location.origin}/cliente/proposta/${proposal.clientToken}`, '_blank')}
                      className="text-blue-600 hover:text-blue-900 dark:text-white"
                    >
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
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white">Gestão de Clientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white dark:text-gray-500 dark:text-white uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 dark:bg-gray-800 divide-y divide-gray-200">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white dark:text-white">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-white dark:text-gray-500 dark:text-white">{client.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white dark:text-white">{client.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {client.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedClient(client.id)}
                      className="text-blue-600 hover:text-blue-900 dark:text-white mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 dark:text-white">
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
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white mb-4">Análise de Receita</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 rounded-lg">
            <BarChart3 className="h-16 w-16 text-gray-400 dark:text-gray-500 dark:text-white" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white mb-4">Distribuição por Plano</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 rounded-lg">
            <PieChart className="h-16 w-16 text-gray-400 dark:text-gray-500 dark:text-white" />
          </div>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 dark:bg-gray-900">
      <SystemStatusIndicator />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 dark:bg-gray-800 shadow-sm dark:shadow-gray-900/30 border-b border-gray-200 dark:border-gray-700 dark:border-gray-600 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/65be871e-f7a6-4f31-b1a9-cd0729a73ff8 copy copy.png" 
                alt="Abmix" 
                className="h-10 w-auto mr-3"
              />
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white dark:text-white">Portal Financeiro</h1>
                <p className="text-sm text-gray-500 dark:text-white dark:text-gray-500 dark:text-white dark:text-gray-300 dark:text-white">Gestão financeira e análises</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ActionButtons 
                onMessage={() => setShowInternalMessage(true)}
                userRole="financial"
              />
              
              <button
                onClick={() => setShowFinancialArea(!showFinancialArea)}
                className="p-2 text-gray-400 dark:text-gray-500 dark:text-white hover:text-gray-500 dark:text-white dark:text-gray-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                title={showFinancialArea ? "Mostrar Área Financeira Completa" : "Mostrar Área Financeira Simplificada"}
              >
                <Settings className="h-6 w-6" />
              </button>
              
              {/* TODAS AS NOTIFICAÇÕES REMOVIDAS */}
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white dark:text-white">{user?.name || 'Usuário Financeiro'}</p>
                  <p className="text-xs text-gray-500 dark:text-white dark:text-gray-500 dark:text-white dark:text-gray-300 dark:text-white">Área Financeira</p>
                </div>
                
                <ThemeToggle />
                
                <button
                  onClick={onLogout}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-white dark:text-white hover:text-gray-900 dark:text-white dark:hover:text-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md transition-colors"
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
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 dark:border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'proposals', label: 'Propostas', icon: FileText },
              { id: 'clients', label: 'Clientes', icon: Users },
              { id: 'analysis', label: 'Análises', icon: PieChart }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 dark:text-white dark:text-gray-500 dark:text-white hover:text-gray-700 dark:text-white dark:text-white hover:border-gray-300 dark:border-gray-600 dark:border-gray-600'
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
          <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white dark:text-white mb-6">Área Financeira Completa</h2>
            <p className="text-gray-600 dark:text-white dark:text-gray-500 dark:text-white mb-4">
              Esta área permite validar propostas, aprovar ou rejeitar documentos.
            </p>
          </div>
        </div>
      )}

      {/* NOTIFICAÇÕES COMPLETAMENTE REMOVIDAS */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
                {activeTab === 'dashboard' && 'Dashboard Financeiro'}
                {activeTab === 'proposals' && 'Gestão de Propostas'}
                {activeTab === 'clients' && 'Gestão de Clientes'}
                {activeTab === 'analysis' && 'Análises e Relatórios'}
                {activeTab === 'forms' && 'Formulários'}
              </h2>
              <p className="text-gray-600 dark:text-white dark:text-gray-500 dark:text-white">
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
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {/* Report Visualization Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedReport.title}</h3>
                  <p className="text-blue-100 dark:text-white text-sm">
                    Recebido em {new Date(selectedReport.receivedAt).toLocaleDateString('pt-BR')} às {new Date(selectedReport.receivedAt).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="h-8 w-8 bg-white dark:bg-gray-800 dark:bg-gray-800 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                >
                  <span className="text-white text-lg font-bold">×</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Report Summary */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white mb-4">Resumo Executivo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Período</p>
                        <p className="text-blue-900 dark:text-white text-lg font-bold">{selectedReport.data.period}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total de Propostas</p>
                        <p className="text-green-900 dark:text-white text-lg font-bold">{selectedReport.data.totalProposals}</p>
                      </div>
                      <FileText className="h-8 w-8 text-green-500 dark:text-green-400" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 dark:text-white text-sm font-medium">Valor Total</p>
                        <p className="text-purple-900 dark:text-white text-lg font-bold">{selectedReport.data.totalValue}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500 dark:text-white" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 dark:text-white text-sm font-medium">Taxa de Conversão</p>
                        <p className="text-orange-900 dark:text-white text-lg font-bold">{selectedReport.data.conversionRate}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500 dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white mb-4">Análise Detalhada</h4>
                <div className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-white dark:text-white mb-2">
                    Este relatório apresenta uma análise completa do desempenho da equipe para o período de <strong>{selectedReport.data.period}</strong>.
                  </p>
                  <p className="text-gray-700 dark:text-white dark:text-white mb-2">
                    Foram processadas <strong>{selectedReport.data.totalProposals} propostas</strong> com um valor total de <strong>{selectedReport.data.totalValue}</strong>, 
                    resultando em uma taxa de conversão de <strong>{selectedReport.data.conversionRate}</strong>.
                  </p>
                  <p className="text-gray-700 dark:text-white dark:text-white">
                    Todos os dados foram coletados e validados automaticamente pelo sistema de gestão, 
                    garantindo a precisão e confiabilidade das informações apresentadas.
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white mb-4">Ações Disponíveis</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <button
                    onClick={() => {
                      handleDownloadReport(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <Download className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1" />
                    <span className="text-blue-700 dark:text-white text-xs font-medium">Baixar</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleEmailReport(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    <Mail className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                    <span className="text-green-700 dark:text-white text-xs font-medium">Email</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleViewInDrive(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-6 w-6 text-purple-600 dark:text-white mb-1" />
                    <span className="text-purple-700 dark:text-white text-xs font-medium">Google Drive</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleViewInSheets(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
                  >
                    <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-1" />
                    <span className="text-yellow-700 dark:text-white text-xs font-medium">Google Sheets</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleWhatsAppShare(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                  >
                    <MessageSquare className="h-6 w-6 text-emerald-600 dark:text-white mb-1" />
                    <span className="text-emerald-700 dark:text-white text-xs font-medium">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excel */}
      {showExcelModal && excelReportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-7xl w-full max-h-[95vh] overflow-hidden">
            {/* Header Excel */}
            <div className="bg-green-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Relatório Excel - {excelReportData.title}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const printContent = document.getElementById('excel-content');
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                      <html><head><title>Relatório Excel</title>
                      <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background: #f0f0f0; font-weight: bold; }
                        tr:nth-child(even) { background: #f9f9f9; }
                      </style>
                      </head><body>
                      ${printContent.innerHTML}
                      </body></html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center gap-2"
                >
                  🖨️ Imprimir
                </button>
                <button
                  onClick={() => {
                    // Simular download Excel
                    const csvData = [
                      ['ID', 'CLIENTE', 'CNPJ', 'VENDEDOR', 'VALOR', 'PLANO', 'STATUS', 'OBSERVAÇÕES'],
                      ...(excelReportData.rawData || []).map(item => [
                        item.abmId, item.cliente, item.cnpj, item.vendedor, 
                        item.valor, item.plano, item.status.toUpperCase(), item.observacoes || ''
                      ])
                    ].map(row => row.join(',')).join('\n');
                    
                    const blob = new Blob([csvData], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `relatorio_abmix_${Date.now()}.csv`;
                    link.click();
                    URL.revokeObjectURL(url);
                    showNotification('Relatório Excel baixado!', 'success');
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm flex items-center gap-2"
                >
                  📊 Baixar Excel
                </button>
                <button
                  onClick={() => setShowExcelModal(false)}
                  className="text-white hover:text-gray-300 dark:text-white p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo Excel */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]" id="excel-content">
              {/* Resumo Executivo */}
              <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-500 p-4 mb-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-white mb-3">📊 Resumo Executivo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-white dark:text-white">Período:</span>
                    <div className="text-green-700 dark:text-white">{excelReportData.data.period}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-white dark:text-white">Total Propostas:</span>
                    <div className="text-green-700 dark:text-white font-bold">{excelReportData.data.totalProposals}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-white dark:text-white">Valor Total:</span>
                    <div className="text-green-700 dark:text-white font-bold">{excelReportData.data.totalValue}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-white dark:text-white">Taxa Conversão:</span>
                    <div className="text-green-700 dark:text-white font-bold">{excelReportData.data.conversionRate}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 dark:text-white dark:text-gray-500 dark:text-white">
                  Gerado em: {new Date(excelReportData.receivedAt).toLocaleString('pt-BR')}
                </div>
              </div>

              {/* Tabela Excel */}
              <div className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-white dark:text-white uppercase">ID</th>
                      <th className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-white dark:text-white uppercase">CLIENTE</th>
                      <th className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-white dark:text-white uppercase">CNPJ</th>
                      <th className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-white dark:text-white uppercase">VENDEDOR</th>
                      <th className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-white dark:text-white uppercase">VALOR</th>
                      <th className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-white dark:text-white uppercase">PLANO</th>
                      <th className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-white dark:text-white uppercase">STATUS</th>
                      <th className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-white dark:text-white uppercase">OBSERVAÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelReportData.rawData && excelReportData.rawData.length > 0 ? (
                      excelReportData.rawData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 dark:bg-gray-700'}>
                          <td className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-sm">{item.abmId}</td>
                          <td className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-sm font-medium">{item.cliente}</td>
                          <td className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-sm">{item.cnpj}</td>
                          <td className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-sm">{item.vendedor}</td>
                          <td className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-sm font-bold">R$ {item.valor}</td>
                          <td className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-sm">{item.plano}</td>
                          <td className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-sm">
                            <span className="px-2 py-1 bg-sky-100 text-sky-700 dark:text-white rounded text-xs font-medium">
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-2 text-sm">{item.observacoes || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="border border-gray-300 dark:border-gray-600 dark:border-gray-600 px-3 py-4 text-center text-gray-500 dark:text-white dark:text-gray-500 dark:text-white">
                          Nenhum dado disponível
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* System Footer */}
      <SystemFooter />
    </div>
  );
};

export default FinancialPortal;