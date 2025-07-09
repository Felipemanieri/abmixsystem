import React, { useState } from 'react';
import { LogOut, BarChart3, Users, FileText, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Download, Calendar, Filter, Search, Bell, MessageCircle, Bot, X, Send } from 'lucide-react';

interface SupervisorPortalProps {
  user: any;
  onLogout: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const SupervisorPortal: React.FC<SupervisorPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do portal supervisor. Como posso ajudá-lo com relatórios e análises?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const supervisorStats = [
    {
      name: 'Total de Propostas',
      value: '156',
      change: '+12% este mês',
      changeType: 'positive',
      icon: FileText,
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
      name: 'Receita Total',
      value: 'R$ 89.450',
      change: '+18% este mês',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple',
    },
    {
      name: 'Vendedores Ativos',
      value: '8',
      change: '2 novos este mês',
      changeType: 'positive',
      icon: Users,
      color: 'orange',
    },
  ];

  const vendorPerformance = [
    {
      name: 'Ana Caroline',
      proposals: 45,
      converted: 32,
      revenue: 'R$ 28.500',
      conversionRate: 71,
    },
    {
      name: 'Bruna Garcia',
      proposals: 38,
      converted: 24,
      revenue: 'R$ 22.100',
      conversionRate: 63,
    },
    {
      name: 'Carlos Silva',
      proposals: 42,
      converted: 29,
      revenue: 'R$ 25.800',
      conversionRate: 69,
    },
    {
      name: 'Diana Santos',
      proposals: 31,
      converted: 18,
      revenue: 'R$ 13.050',
      conversionRate: 58,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'proposal_created',
      vendor: 'Ana Caroline',
      client: 'Empresa ABC Ltda',
      timestamp: '2 horas atrás',
      status: 'success',
    },
    {
      id: '2',
      type: 'proposal_validated',
      vendor: 'Carlos Silva',
      client: 'Tech Solutions SA',
      timestamp: '4 horas atrás',
      status: 'success',
    },
    {
      id: '3',
      type: 'proposal_rejected',
      vendor: 'Diana Santos',
      client: 'Startup XYZ',
      timestamp: '6 horas atrás',
      status: 'error',
    },
    {
      id: '4',
      type: 'proposal_completed',
      vendor: 'Bruna Garcia',
      client: 'Consultoria ABC',
      timestamp: '8 horas atrás',
      status: 'success',
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
    
    if (lowerMessage.includes('relatório') || lowerMessage.includes('report')) {
      return 'Você pode gerar relatórios detalhados de performance, conversão e receita. Use os filtros de período para análises específicas.';
    }
    if (lowerMessage.includes('vendedor') || lowerMessage.includes('performance')) {
      return 'A tabela de performance mostra métricas individuais de cada vendedor: propostas, conversões e receita gerada.';
    }
    if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo')) {
      return 'Você pode definir metas mensais para vendedores e acompanhar o progresso em tempo real através dos dashboards.';
    }
    
    return 'Como supervisor, você tem acesso a relatórios completos, análise de performance e métricas da equipe. O que gostaria de analisar?';
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal_created':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'proposal_validated':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'proposal_rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'proposal_completed':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'proposal_created':
        return 'criou uma proposta para';
      case 'proposal_validated':
        return 'validou a proposta de';
      case 'proposal_rejected':
        return 'rejeitou a proposta de';
      case 'proposal_completed':
        return 'finalizou a proposta de';
      default:
        return 'interagiu com';
    }
  };

  const exportReport = () => {
    const reportData = {
      periodo: selectedPeriod,
      stats: supervisorStats,
      vendedores: vendorPerformance,
      atividades: recentActivity,
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-supervisor-${selectedPeriod}.json`;
    link.click();
    
    showNotification('Relatório exportado com sucesso!', 'success');
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
                <div className="hidden w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Supervisor</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  5
                </span>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Supervisor</h1>
              <p className="text-gray-600">Supervisão e relatórios gerenciais da equipe</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
              <button
                onClick={exportReport}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supervisorStats.map((stat) => {
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

          {/* Vendor Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Performance dos Vendedores</h2>
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
                      Convertidas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxa Conversão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receita
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendorPerformance.map((vendor) => (
                    <tr key={vendor.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vendor.proposals}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vendor.converted}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${vendor.conversionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{vendor.conversionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vendor.revenue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
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
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente Supervisor</h3>
                  <p className="text-xs text-orange-100">Online agora</p>
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
                      : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-orange-100'
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SupervisorPortal;