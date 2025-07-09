import React, { useState } from 'react';
import { LogOut, BarChart3, Users, Clock, TrendingUp, AlertTriangle, CheckCircle, Eye, Calendar, Download, MessageCircle, Mail, Search, Filter, FileText } from 'lucide-react';

interface SupervisorPortalProps {
  user: any;
  onLogout: () => void;
}

interface Proposal {
  id: string;
  client: string;
  vendor: string;
  plan: string;
  value: string;
  status: string;
  submissionDate: string;
  documents: number;
  email: string;
  phone: string;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
}

const SupervisorPortal: React.FC<SupervisorPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedView, setSelectedView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const allProposals: Proposal[] = [
    {
      id: 'VEND001-PROP123',
      client: 'Empresa ABC Ltda',
      vendor: 'Ana Caroline',
      plan: 'Plano Empresarial Premium',
      value: 'R$ 1.250,00',
      status: 'client_filling',
      submissionDate: '2024-01-15',
      documents: 8,
      email: 'contato@empresaabc.com.br',
      phone: '(11) 99999-9999',
      attachments: [
        { id: '1', name: 'cnpj_empresa_abc.pdf', type: 'pdf', size: '2.1 MB', url: '/docs/cnpj_empresa_abc.pdf' },
        { id: '2', name: 'rg_titular.jpg', type: 'image', size: '1.8 MB', url: '/docs/rg_titular.jpg' },
      ]
    },
    {
      id: 'VEND002-PROP124',
      client: 'Tech Solutions SA',
      vendor: 'Bruna Garcia',
      plan: 'Plano Família Básico',
      value: 'R$ 650,00',
      status: 'docs_pending',
      submissionDate: '2024-01-14',
      documents: 6,
      email: 'admin@techsolutions.com',
      phone: '(11) 88888-8888',
      attachments: [
        { id: '3', name: 'contrato_social.pdf', type: 'pdf', size: '3.2 MB', url: '/docs/contrato_social.pdf' },
      ]
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
      email: 'contato@consultoriaxyz.com.br',
      phone: '(11) 77777-7777',
      attachments: [
        { id: '4', name: 'carteirinha_atual.jpg', type: 'image', size: '1.2 MB', url: '/docs/carteirinha_atual.jpg' },
      ]
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
      email: 'contato@inovacaodigital.com',
      phone: '(11) 66666-6666',
      attachments: [
        { id: '5', name: 'analitico_plano.pdf', type: 'pdf', size: '1.5 MB', url: '/docs/analitico_plano.pdf' },
      ]
    },
  ];

  const overallStats = [
    {
      name: 'Total de Propostas',
      value: allProposals.length.toString(),
      change: '+12% vs mês anterior',
      changeType: 'positive',
      icon: BarChart3,
      color: 'blue',
    },
    {
      name: 'Taxa de Conversão',
      value: '68%',
      change: '+5% vs mês anterior',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'green',
    },
    {
      name: 'Tempo Médio',
      value: '8.5 dias',
      change: '-2 dias vs mês anterior',
      changeType: 'positive',
      icon: Clock,
      color: 'yellow',
    },
    {
      name: 'Propostas Atrasadas',
      value: '23',
      change: '+30 dias ou mais',
      changeType: 'warning',
      icon: AlertTriangle,
      color: 'red',
    },
  ];

  const vendorPerformance = [
    {
      name: 'Ana Caroline',
      proposals: 45,
      completed: 38,
      pending: 7,
      avgTime: '6.2 dias',
      conversionRate: '84%',
    },
    {
      name: 'Bruna Garcia',
      proposals: 32,
      completed: 28,
      pending: 4,
      avgTime: '7.8 dias',
      conversionRate: '88%',
    },
    {
      name: 'Carlos Silva',
      proposals: 28,
      completed: 22,
      pending: 6,
      avgTime: '9.1 dias',
      conversionRate: '79%',
    },
    {
      name: 'Diana Santos',
      proposals: 35,
      completed: 29,
      pending: 6,
      avgTime: '8.3 dias',
      conversionRate: '83%',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client_filling':
        return 'bg-blue-100 text-blue-800';
      case 'docs_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'sent_to_automation':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'client_filling':
        return 'Cliente Preenchendo';
      case 'docs_pending':
        return 'Documentos Pendentes';
      case 'validated':
        return 'Validado';
      case 'sent_to_automation':
        return 'Enviado p/ Automação';
      default:
        return 'Desconhecido';
    }
  };

  const handleSendWhatsApp = (phone: string, clientName: string) => {
    const message = `Olá! Entrando em contato sobre a proposta de plano de saúde da ${clientName}.`;
    const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendEmail = (email: string, clientName: string) => {
    const subject = `Acompanhamento - Proposta de Plano de Saúde - ${clientName}`;
    const body = `Olá!

Entrando em contato para acompanhar o andamento da proposta de plano de saúde.

Qualquer dúvida, estou à disposição.

Atenciosamente,
${user.name}
Supervisor - Abmix Seguros`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleDownloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Download iniciado: ${attachment.name}`);
  };

  const filteredProposals = allProposals.filter(proposal => {
    const matchesSearch = proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderCompleteSpreadsheet = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Planilha Completa - Visão Supervisor</h1>
        <p className="text-orange-100">Acesso total a todas as propostas e documentos do sistema</p>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, ID ou vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos os Status</option>
              <option value="client_filling">Cliente Preenchendo</option>
              <option value="docs_pending">Documentos Pendentes</option>
              <option value="validated">Validadas</option>
              <option value="sent_to_automation">Enviadas p/ Automação</option>
            </select>
          </div>
        </div>
      </div>

      {/* Planilha Completa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anexos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proposal.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proposal.client}</div>
                    <div className="text-sm text-gray-500">{new Date(proposal.submissionDate).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-900">{proposal.vendor}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proposal.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {proposal.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                      {getStatusText(proposal.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{proposal.email}</div>
                    <div className="text-sm text-gray-500">{proposal.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {proposal.attachments.map((attachment) => (
                        <button
                          key={attachment.id}
                          onClick={() => handleDownloadAttachment(attachment)}
                          className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                          title={`${attachment.name} (${attachment.size})`}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {attachment.type}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => setSelectedProposal(proposal)}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleSendWhatsApp(proposal.phone, proposal.client)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleSendEmail(proposal.email, proposal.client)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/Logo Abmix.jpg" 
                  alt="Abmix" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Supervisor</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="90days">Últimos 90 dias</option>
              </select>
              
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
        {selectedView === 'overview' ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white mb-6">
              <h1 className="text-2xl font-bold mb-2">Dashboard Supervisor</h1>
              <p className="text-orange-100">Supervisão e relatórios gerenciais em tempo real</p>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {overallStats.map((stat) => {
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
                        stat.changeType === 'warning' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Vendor Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Performance dos Vendedores</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {vendorPerformance.map((vendor) => (
                      <div key={vendor.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                            <p className="text-xs text-gray-500">
                              {vendor.proposals} propostas • {vendor.completed} finalizadas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{vendor.conversionRate}</p>
                          <p className="text-xs text-gray-500">{vendor.avgTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedView('spreadsheet')}
                      className="w-full flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-900">Planilha Completa</p>
                        <p className="text-xs text-gray-500">Ver todas as propostas e anexos</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-900">Relatório Completo</p>
                        <p className="text-xs text-gray-500">Análise detalhada de performance</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-900">Propostas Atrasadas</p>
                        <p className="text-xs text-gray-500">Lista de propostas com mais de 30 dias</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          renderCompleteSpreadsheet()
        )}
      </main>

      {/* Modal de Visualização da Proposta */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes da Proposta - Visão Supervisor
                </h3>
                <button 
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Informações da Proposta</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">ID:</span> <span className="ml-2">{selectedProposal.id}</span></div>
                      <div><span className="font-medium text-gray-700">Cliente:</span> <span className="ml-2">{selectedProposal.client}</span></div>
                      <div><span className="font-medium text-gray-700">Vendedor:</span> <span className="ml-2">{selectedProposal.vendor}</span></div>
                      <div><span className="font-medium text-gray-700">Plano:</span> <span className="ml-2">{selectedProposal.plan}</span></div>
                      <div><span className="font-medium text-gray-700">Valor:</span> <span className="ml-2">{selectedProposal.value}</span></div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedProposal.status)}`}>
                          {getStatusText(selectedProposal.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Informações de Contato</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">Email:</span> <span className="ml-2">{selectedProposal.email}</span></div>
                      <div><span className="font-medium text-gray-700">Telefone:</span> <span className="ml-2">{selectedProposal.phone}</span></div>
                      <div><span className="font-medium text-gray-700">Documentos:</span> <span className="ml-2">{selectedProposal.documents}</span></div>
                      <div><span className="font-medium text-gray-700">Data Submissão:</span> <span className="ml-2">{new Date(selectedProposal.submissionDate).toLocaleDateString('pt-BR')}</span></div>
                    </div>
                  </div>
                </div>

                {/* Anexos */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Anexos ({selectedProposal.attachments.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProposal.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{attachment.name}</div>
                            <div className="text-xs text-gray-500">{attachment.size}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadAttachment(attachment)}
                          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Baixar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => handleSendEmail(selectedProposal.email, selectedProposal.client)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Email
                  </button>
                  <button
                    onClick={() => handleSendWhatsApp(selectedProposal.phone, selectedProposal.client)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar WhatsApp
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

export default SupervisorPortal;