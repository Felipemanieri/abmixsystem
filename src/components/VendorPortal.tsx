import React, { useState } from 'react';
import { LogOut, Plus, Users, FileText, Link, Eye, BarChart3, Clock, CheckCircle, AlertCircle, Copy, ExternalLink, Mail, Download, Search, Filter, ArrowLeft, Home, MessageCircle, Bot, X, Send, Bell, Calculator, Target, TrendingUp, DollarSign } from 'lucide-react';
import ProposalGenerator from './ProposalGenerator';
import ProposalTracker from './ProposalTracker';

interface VendorPortalProps {
  user: any;
  onLogout: () => void;
}

type VendorView = 'dashboard' | 'new-proposal' | 'tracker' | 'clients' | 'spreadsheet' | 'quotation';

interface Proposal {
  id: string;
  client: string;
  plan: string;
  status: string;
  progress: number;
  date: string;
  link: string;
  value: string;
  empresa: string;
  cnpj: string;
  vendedor: string;
  documents: number;
  lastActivity: string;
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

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface InternalMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface QuotationData {
  numeroVidas: number;
  operadora: string;
  idades: number[];
}

const VendorPortal: React.FC<VendorPortalProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<VendorView>('dashboard');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do portal vendedor. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [internalMessages, setInternalMessages] = useState<InternalMessage[]>([
    {
      id: '1',
      from: 'Financeiro',
      to: 'vendedor',
      message: 'Proposta PROP-123 foi validada e aprovada.',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '2',
      from: 'Supervisor',
      to: 'todos',
      message: 'Reunião de equipe amanhã às 14h.',
      timestamp: new Date(Date.now() - 1800000),
      read: false
    }
  ]);
  const [newInternalMessage, setNewInternalMessage] = useState('');
  const [quotationData, setQuotationData] = useState<QuotationData>({
    numeroVidas: 1,
    operadora: '',
    idades: [25]
  });

  const stats = [
    {
      name: 'Propostas Ativas',
      value: '23',
      change: '+3 hoje',
      changeType: 'positive',
      icon: FileText,
      color: 'blue',
    },
    {
      name: 'Clientes Preenchendo',
      value: '8',
      change: 'Em andamento',
      changeType: 'neutral',
      icon: Users,
      color: 'yellow',
    },
    {
      name: 'Aguardando Documentos',
      value: '5',
      change: 'Pendente',
      changeType: 'warning',
      icon: Clock,
      color: 'orange',
    },
    {
      name: 'Finalizadas',
      value: '12',
      change: '+2 hoje',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green',
    },
  ];

  const recentProposals: Proposal[] = [
    {
      id: 'VEND001-PROP123',
      client: 'Empresa ABC Ltda',
      plan: 'Plano Empresarial Premium',
      status: 'client_filling',
      progress: 75,
      date: '2024-01-15',
      link: `${window.location.origin}/cliente/VEND001-PROP123`,
      value: 'R$ 1.250,00',
      empresa: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      vendedor: user.name,
      documents: 8,
      lastActivity: '2 horas atrás',
      email: 'contato@empresaabc.com.br',
      phone: '11999999999',
      attachments: [
        { id: '1', name: 'cnpj_empresa_abc.pdf', type: 'pdf', size: '2.1 MB', url: '/docs/cnpj_empresa_abc.pdf' },
        { id: '2', name: 'rg_titular.jpg', type: 'image', size: '1.8 MB', url: '/docs/rg_titular.jpg' },
        { id: '3', name: 'cpf_titular.pdf', type: 'pdf', size: '0.9 MB', url: '/docs/cpf_titular.pdf' },
      ]
    },
    {
      id: 'VEND001-PROP124',
      client: 'Tech Solutions SA',
      plan: 'Plano Família Básico',
      status: 'docs_pending',
      progress: 45,
      date: '2024-01-14',
      link: `${window.location.origin}/cliente/VEND001-PROP124`,
      value: 'R$ 650,00',
      empresa: 'Tech Solutions SA',
      cnpj: '98.765.432/0001-10',
      vendedor: user.name,
      documents: 6,
      lastActivity: '1 dia atrás',
      email: 'admin@techsolutions.com',
      phone: '11888888888',
      attachments: [
        { id: '4', name: 'contrato_social.pdf', type: 'pdf', size: '3.2 MB', url: '/docs/contrato_social.pdf' },
        { id: '5', name: 'comprovante_residencia.pdf', type: 'pdf', size: '0.8 MB', url: '/docs/comprovante_residencia.pdf' },
      ]
    },
    {
      id: 'VEND001-PROP125',
      client: 'Consultoria XYZ',
      plan: 'Plano Individual',
      status: 'completed',
      progress: 100,
      date: '2024-01-13',
      link: `${window.location.origin}/cliente/VEND001-PROP125`,
      value: 'R$ 320,00',
      empresa: 'Consultoria XYZ',
      cnpj: '11.222.333/0001-44',
      vendedor: user.name,
      documents: 5,
      lastActivity: '3 dias atrás',
      email: 'contato@consultoriaxyz.com.br',
      phone: '11777777777',
      attachments: [
        { id: '6', name: 'carteirinha_atual.jpg', type: 'image', size: '1.2 MB', url: '/docs/carteirinha_atual.jpg' },
        { id: '7', name: 'analitico_plano.pdf', type: 'pdf', size: '1.5 MB', url: '/docs/analitico_plano.pdf' },
      ]
    },
  ];

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const response = getBotResponse(newMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setNewMessage('');
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('proposta') || lowerMessage.includes('criar')) {
      return 'Para criar uma nova proposta, clique em "Nova Proposta" e preencha os dados da empresa e plano. Depois você pode gerar o link para o cliente.';
    }
    if (lowerMessage.includes('cotação') || lowerMessage.includes('preço')) {
      return 'No módulo de cotação você pode calcular valores baseado no número de vidas, operadora e idades. Acesse através do menu "Cotação".';
    }
    if (lowerMessage.includes('cliente') || lowerMessage.includes('contato')) {
      return 'Você pode entrar em contato com clientes via WhatsApp ou email diretamente das propostas. Use os botões de ação nas propostas.';
    }
    if (lowerMessage.includes('documento') || lowerMessage.includes('anexo')) {
      return 'Os documentos enviados pelos clientes ficam disponíveis para download nas propostas. Você pode organizá-los antes de enviar para o financeiro.';
    }
    
    return 'Como vendedor, você pode criar propostas, gerar cotações, acompanhar o progresso dos clientes e gerenciar documentos. O que você precisa fazer?';
  };

  const sendInternalMessage = () => {
    if (!newInternalMessage.trim()) return;

    const message: InternalMessage = {
      id: Date.now().toString(),
      from: user.name,
      to: 'todos',
      message: newInternalMessage,
      timestamp: new Date(),
      read: false
    };

    setInternalMessages(prev => [...prev, message]);
    setNewInternalMessage('');
    showNotification('Mensagem enviada para todos!', 'success');
  };

  const markMessagesAsRead = () => {
    setInternalMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  const unreadCount = internalMessages.filter(msg => !msg.read).length;

  const addIdade = () => {
    setQuotationData(prev => ({
      ...prev,
      idades: [...prev.idades, 25]
    }));
  };

  const removeIdade = (index: number) => {
    setQuotationData(prev => ({
      ...prev,
      idades: prev.idades.filter((_, i) => i !== index)
    }));
  };

  const updateIdade = (index: number, value: number) => {
    setQuotationData(prev => ({
      ...prev,
      idades: prev.idades.map((idade, i) => i === index ? value : idade)
    }));
  };

  const generateQuotation = () => {
    // Simular geração de cotação
    const baseValue = 150;
    const ageMultiplier = quotationData.idades.reduce((acc, idade) => {
      if (idade < 30) return acc + 1;
      if (idade < 50) return acc + 1.5;
      return acc + 2;
    }, 0);
    
    const totalValue = baseValue * ageMultiplier * quotationData.numeroVidas;
    
    showNotification(`Cotação gerada: R$ ${totalValue.toFixed(2)}`, 'success');
  };

  const downloadQuotation = () => {
    // Simular download da cotação
    const quotationData = {
      numeroVidas: quotationData.numeroVidas,
      operadora: quotationData.operadora,
      idades: quotationData.idades,
      valorTotal: 'R$ 2.450,00',
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    };
    
    const dataStr = JSON.stringify(quotationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cotacao.json';
    link.click();
    
    showNotification('Cotação baixada com sucesso!', 'success');
  };

  const handleViewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      showNotification('Link copiado para a área de transferência!', 'success');
    } catch (err) {
      showNotification('Erro ao copiar link. Tente novamente.', 'error');
    }
  };

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

  const renderQuotationModule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </button>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Módulo de Cotação</h1>
        <p className="text-green-100">Gere cotações personalizadas para seus clientes</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados da Cotação</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Vidas
            </label>
            <input
              type="number"
              min="1"
              value={quotationData.numeroVidas}
              onChange={(e) => setQuotationData(prev => ({ ...prev, numeroVidas: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operadora
            </label>
            <select
              value={quotationData.operadora}
              onChange={(e) => setQuotationData(prev => ({ ...prev, operadora: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione a operadora</option>
              <option value="unimed">Unimed</option>
              <option value="bradesco">Bradesco Saúde</option>
              <option value="amil">Amil</option>
              <option value="sulamerica">SulAmérica</option>
              <option value="notredame">Notre Dame</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Idades dos Beneficiários
            </label>
            <button
              onClick={addIdade}
              className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Idade
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quotationData.idades.map((idade, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={idade}
                  onChange={(e) => updateIdade(index, parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Idade"
                />
                {quotationData.idades.length > 1 && (
                  <button
                    onClick={() => removeIdade(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={generateQuotation}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Gerar Cotação
          </button>
          
          <button
            onClick={downloadQuotation}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Cotação
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client_filling':
        return 'bg-blue-100 text-blue-800';
      case 'docs_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
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
      case 'completed':
        return 'Finalizada';
      default:
        return 'Desconhecido';
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'new-proposal':
        return <ProposalGenerator onBack={() => setActiveView('dashboard')} />;
      case 'tracker':
        return <ProposalTracker onBack={() => setActiveView('dashboard')} />;
      case 'quotation':
        return renderQuotationModule();
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
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
                        stat.changeType === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <button
                onClick={() => setActiveView('new-proposal')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Nova Proposta</h3>
                    <p className="text-sm text-gray-500">Criar proposta</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('quotation')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Gerar Cotação</h3>
                    <p className="text-sm text-gray-500">Calcular valores</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('tracker')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Acompanhar</h3>
                    <p className="text-sm text-gray-500">Status propostas</p>
                  </div>
                </div>
              </button>

              <button
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Relatórios</h3>
                    <p className="text-sm text-gray-500">Análises</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Recent Proposals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Propostas Recentes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plano
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progresso
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
                    {recentProposals.map((proposal) => (
                      <tr key={proposal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{proposal.client}</div>
                            <div className="text-sm text-gray-500">{proposal.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{proposal.plan}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                            {getStatusText(proposal.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${proposal.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{proposal.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(proposal.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewProposal(proposal)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleCopyLink(proposal.link)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <Link className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => window.open(`https://wa.me/55${proposal.phone}?text=${encodeURIComponent(`Olá! Segue o link da proposta: ${proposal.link}`)}`)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                              </svg>
                            </button>
                            <button 
                              onClick={() => window.open(`mailto:${proposal.email}?subject=Proposta de Plano de Saúde&body=Olá! Segue o link da proposta: ${proposal.link}`)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
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
    }
  };

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
                <div className="hidden w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Vendedor</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowInternalChat(true);
                  markMessagesAsRead();
                }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>
              
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard do Vendedor</h1>
            <p className="text-gray-600">Gerencie suas propostas e acompanhe o progresso dos clientes</p>
          </div>
        )}
        
        {renderContent()}
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente Vendedor</h3>
                  <p className="text-xs text-green-100">Online agora</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-green-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Internal Chat Modal */}
      {showInternalChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Chat Interno da Equipe
              </h3>
              <button 
                onClick={() => setShowInternalChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {internalMessages.map((message) => (
                <div key={message.id} className={`flex ${message.from === user.name ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.from === user.name
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="text-xs font-medium mb-1 opacity-75">
                      {message.from}
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 opacity-75`}>
                      {message.timestamp.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newInternalMessage}
                  onChange={(e) => setNewInternalMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendInternalMessage()}
                  placeholder="Mensagem para toda a equipe..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={sendInternalMessage}
                  className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      {/* Modal de Visualização da Proposta */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes da Proposta
                </h3>
                <button 
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Informações Básicas</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">ID:</span> <span className="ml-2">{selectedProposal.id}</span></div>
                      <div><span className="font-medium text-gray-700">Cliente:</span> <span className="ml-2">{selectedProposal.client}</span></div>
                      <div><span className="font-medium text-gray-700">CNPJ:</span> <span className="ml-2">{selectedProposal.cnpj}</span></div>
                      <div><span className="font-medium text-gray-700">Plano:</span> <span className="ml-2">{selectedProposal.plan}</span></div>
                      <div><span className="font-medium text-gray-700">Valor:</span> <span className="ml-2">{selectedProposal.value}</span></div>
                      <div><span className="font-medium text-gray-700">Progresso:</span> <span className="ml-2">{selectedProposal.progress}%</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Contato</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">Email:</span> <span className="ml-2">{selectedProposal.email}</span></div>
                      <div><span className="font-medium text-gray-700">Telefone:</span> <span className="ml-2">({selectedProposal.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')})</span></div>
                      <div><span className="font-medium text-gray-700">Documentos:</span> <span className="ml-2">{selectedProposal.documents}</span></div>
                      <div><span className="font-medium text-gray-700">Última Atividade:</span> <span className="ml-2">{selectedProposal.lastActivity}</span></div>
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
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = attachment.url;
                            link.download = attachment.name;
                            link.click();
                          }}
                          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Baixar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-700">Link do Cliente:</span>
                  <div className="flex items-center mt-2 space-x-2">
                    <input
                      type="text"
                      value={selectedProposal.link}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                    />
                    <button
                      onClick={() => handleCopyLink(selectedProposal.link)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => window.open(`mailto:${selectedProposal.email}?subject=Proposta de Plano de Saúde&body=Olá! Segue o link da proposta: ${selectedProposal.link}`)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Email
                  </button>
                  <button
                    onClick={() => window.open(`https://wa.me/55${selectedProposal.phone}?text=${encodeURIComponent(`Olá! Segue o link da proposta: ${selectedProposal.link}`)}`)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Enviar WhatsApp
                  </button>
                  <button
                    onClick={() => window.open(selectedProposal.link, '_blank')}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

  );
};

export default VendorPortal;