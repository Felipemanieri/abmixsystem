import React, { useState, useEffect } from 'react';
import { LogOut, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Calculator, Calendar, FileText, User, Bell, CreditCard, PieChart, BarChart3, Wallet, MessageSquare, Zap, Users, Upload, Database, Filter, Search, Settings, Mail, Download, Share2, ExternalLink, Send, Copy } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import FinancialAutomationModal from './FinancialAutomationModal';
import NotificationCenter from './NotificationCenter';
import ClientForm from './ClientForm';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import ProposalProgressTracker from './ProposalProgressTracker';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { showNotification } from '../utils/notifications';
import { useProposals, useRealTimeProposals } from '../hooks/useProposals';
import { realTimeSync } from '../utils/realTimeSync';
import StatusManager, { ProposalStatus } from '@shared/statusSystem';

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
  const [statusManager] = useState(() => StatusManager.getInstance());
  const [proposalStatuses, setProposalStatuses] = useState<Map<string, ProposalStatus>>(new Map());
  
  // Estado para relatórios recebidos do supervisor (inicia vazio)
  const [receivedReports, setReceivedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportsBox, setShowReportsBox] = useState(false);
  const [reportDateFilter, setReportDateFilter] = useState('all');

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
    // Criar uma janela modal com formato Excel
    const excelContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório Excel - ${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .excel-header { background: #217346; color: white; padding: 10px; text-align: center; font-weight: bold; }
          .excel-table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          .excel-table th, .excel-table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .excel-table th { background: #f0f0f0; font-weight: bold; }
          .excel-table tr:nth-child(even) { background: #f9f9f9; }
          .summary-box { background: #e8f5e8; padding: 15px; border-left: 4px solid #217346; margin: 20px 0; }
          .print-btn { background: #217346; color: white; padding: 10px 20px; border: none; margin: 10px 5px; cursor: pointer; }
          .print-btn:hover { background: #1a5c37; }
        </style>
      </head>
      <body>
        <div class="excel-header">RELATÓRIO FINANCEIRO ABMIX - FORMATO EXCEL</div>
        
        <div class="summary-box">
          <h3>📊 Resumo Executivo</h3>
          <p><strong>Período:</strong> ${report.data.period}</p>
          <p><strong>Total de Propostas:</strong> ${report.data.totalProposals}</p>
          <p><strong>Valor Total:</strong> ${report.data.totalValue}</p>
          <p><strong>Taxa de Conversão:</strong> ${report.data.conversionRate}</p>
          <p><strong>Gerado em:</strong> ${new Date(report.receivedAt).toLocaleString('pt-BR')}</p>
        </div>

        <table class="excel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>CLIENTE</th>
              <th>CNPJ</th>
              <th>VENDEDOR</th>
              <th>VALOR</th>
              <th>PLANO</th>
              <th>STATUS</th>
              <th>OBSERVAÇÕES</th>
            </tr>
          </thead>
          <tbody>
            ${report.rawData ? report.rawData.map(item => `
              <tr>
                <td>${item.abmId}</td>
                <td>${item.cliente}</td>
                <td>${item.cnpj}</td>
                <td>${item.vendedor}</td>
                <td>${item.valor}</td>
                <td>${item.plano}</td>
                <td>${item.status.toUpperCase()}</td>
                <td>${item.observacoes || ''}</td>
              </tr>
            `).join('') : '<tr><td colspan="8">Nenhum dado disponível</td></tr>'}
          </tbody>
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <button class="print-btn" onclick="window.print()">🖨️ Imprimir</button>
          <button class="print-btn" onclick="downloadExcel()">📊 Baixar Excel</button>
          <button class="print-btn" onclick="window.close()">❌ Fechar</button>
        </div>

        <script>
          function downloadExcel() {
            const table = document.querySelector('.excel-table');
            const wb = XLSX.utils.table_to_book(table);
            XLSX.writeFile(wb, 'relatorio_abmix_${Date.now()}.xlsx');
          }
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
      </body>
      </html>
    `;

    // Abrir em nova janela com formato Excel
    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    newWindow.document.write(excelContent);
    newWindow.document.close();
    
    showNotification('Relatório aberto em formato Excel', 'success');
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

      {/* Caixa de Relatórios Recebidos do Supervisor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div 
          className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowReportsBox(!showReportsBox)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Relatórios do Supervisor</h3>
                <p className="text-sm text-gray-500">
                  {receivedReports.length === 0 
                    ? "Clique para acessar relatórios" 
                    : `${receivedReports.length} relatório(s) disponível(eis)`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {receivedReports.length > 0 && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {receivedReports.filter(r => r.status === 'received').length} Novos
                </span>
              )}
              <div className={`transform transition-transform ${showReportsBox ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h4 className="text-sm font-medium text-gray-900 mb-3">Filtros de Período</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dd/mm/aaaa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dd/mm/aaaa"
                  />
                </div>
              </div>
            </div>

            {receivedReports.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Aguardando Relatórios</h4>
                <p className="text-gray-500 mb-1">Nenhum relatório recebido do supervisor ainda</p>
                <p className="text-sm text-gray-400">Quando o supervisor enviar relatórios, eles aparecerão aqui para análise</p>
              </div>
            ) : (
              <div className="space-y-4">
                {receivedReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">{report.title}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            report.status === 'received' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {report.status === 'received' ? 'Novo' : 'Processado'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Recebido em {new Date(report.receivedAt).toLocaleDateString('pt-BR')} às {new Date(report.receivedAt).toLocaleTimeString('pt-BR')}
                        </p>
                        
                        {/* Botão para visualizar relatório completo */}
                        <button
                          onClick={() => handleViewReport(report)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar Relatório Completo
                        </button>
                      </div>
                    </div>
                    
                    {/* Ações do Relatório */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Ações do Relatório</h5>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="flex flex-col items-center p-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                        >
                          <Download className="h-4 w-4 text-blue-600 mb-1" />
                          <span className="text-blue-700 text-xs">Baixar</span>
                        </button>
                        
                        <button
                          onClick={() => handleEmailReport(report.id)}
                          className="flex flex-col items-center p-2 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                        >
                          <Mail className="h-4 w-4 text-green-600 mb-1" />
                          <span className="text-green-700 text-xs">Email</span>
                        </button>
                        
                        <button
                          onClick={() => handleViewInDrive(report.id)}
                          className="flex flex-col items-center p-2 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-purple-600 mb-1" />
                          <span className="text-purple-700 text-xs">Google Drive</span>
                        </button>
                        
                        <button
                          onClick={() => handleViewInSheets(report.id)}
                          className="flex flex-col items-center p-2 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
                        >
                          <BarChart3 className="h-4 w-4 text-yellow-600 mb-1" />
                          <span className="text-yellow-700 text-xs">Google Sheets</span>
                        </button>
                        
                        <button
                          onClick={() => handleWhatsAppShare(report.id)}
                          className="flex flex-col items-center p-2 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 text-emerald-600 mb-1" />
                          <span className="text-emerald-700 text-xs">WhatsApp</span>
                        </button>
                        
                        <button
                          onClick={() => handleViewExcel(report)}
                          className="flex flex-col items-center p-2 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
                        >
                          <FileText className="h-4 w-4 text-orange-600 mb-1" />
                          <span className="text-orange-700 text-xs">Excel</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
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
                    <button 
                      onClick={() => window.open(`https://drive.google.com/drive/folders/${transaction.id.replace('TXN', 'ABM').slice(0, 6)}`, '_blank')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                    >
                      {transaction.id.replace('TXN', 'ABM').slice(0, 6)}
                    </button>
                  </td>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {realProposals?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(0, 10).map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => window.open(`https://drive.google.com/drive/folders/${proposal.abmId}`, '_blank')}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {proposal.abmId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proposal.contractData?.nomeEmpresa}</div>
                    <div className="text-sm text-gray-500">CNPJ: {proposal.contractData?.cnpj}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{proposal.vendorName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">R$ {proposal.contractData?.valor}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                      className="text-blue-600 hover:text-blue-900"
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

      {/* Report Visualization Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedReport.title}</h3>
                  <p className="text-blue-100 text-sm">
                    Recebido em {new Date(selectedReport.receivedAt).toLocaleDateString('pt-BR')} às {new Date(selectedReport.receivedAt).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                >
                  <span className="text-white text-lg font-bold">×</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Report Summary */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumo Executivo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Período</p>
                        <p className="text-blue-900 text-lg font-bold">{selectedReport.data.period}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Total de Propostas</p>
                        <p className="text-green-900 text-lg font-bold">{selectedReport.data.totalProposals}</p>
                      </div>
                      <FileText className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Valor Total</p>
                        <p className="text-purple-900 text-lg font-bold">{selectedReport.data.totalValue}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Taxa de Conversão</p>
                        <p className="text-orange-900 text-lg font-bold">{selectedReport.data.conversionRate}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Análise Detalhada</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    Este relatório apresenta uma análise completa do desempenho da equipe para o período de <strong>{selectedReport.data.period}</strong>.
                  </p>
                  <p className="text-gray-700 mb-2">
                    Foram processadas <strong>{selectedReport.data.totalProposals} propostas</strong> com um valor total de <strong>{selectedReport.data.totalValue}</strong>, 
                    resultando em uma taxa de conversão de <strong>{selectedReport.data.conversionRate}</strong>.
                  </p>
                  <p className="text-gray-700">
                    Todos os dados foram coletados e validados automaticamente pelo sistema de gestão, 
                    garantindo a precisão e confiabilidade das informações apresentadas.
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ações Disponíveis</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <button
                    onClick={() => {
                      handleDownloadReport(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <Download className="h-6 w-6 text-blue-600 mb-1" />
                    <span className="text-blue-700 text-xs font-medium">Baixar</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleEmailReport(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    <Mail className="h-6 w-6 text-green-600 mb-1" />
                    <span className="text-green-700 text-xs font-medium">Email</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleViewInDrive(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-6 w-6 text-purple-600 mb-1" />
                    <span className="text-purple-700 text-xs font-medium">Google Drive</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleViewInSheets(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
                  >
                    <BarChart3 className="h-6 w-6 text-yellow-600 mb-1" />
                    <span className="text-yellow-700 text-xs font-medium">Google Sheets</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleWhatsAppShare(selectedReport.id);
                      setShowReportModal(false);
                    }}
                    className="flex flex-col items-center p-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                  >
                    <MessageSquare className="h-6 w-6 text-emerald-600 mb-1" />
                    <span className="text-emerald-700 text-xs font-medium">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPortal;