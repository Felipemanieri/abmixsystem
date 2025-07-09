import React, { useState } from 'react';
import { LogOut, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Calculator, Calendar, FileText, User, Bell, MessageCircle, Bot, X, Send as SendIcon, CreditCard, PieChart, BarChart3, Wallet } from 'lucide-react';

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

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FinancialPortal: React.FC<FinancialPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do portal financeiro. Como posso ajudá-lo com análises financeiras e relatórios?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

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

  const categoryStats = [
    { name: 'Planos Empresariais', value: 'R$ 28.500', percentage: 62 },
    { name: 'Planos Familiares', value: 'R$ 12.800', percentage: 28 },
    { name: 'Planos Individuais', value: 'R$ 4.380', percentage: 10 },
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
    
    if (lowerMessage.includes('receita') || lowerMessage.includes('faturamento')) {
      return 'A receita total este mês foi de R$ 45.680,00, com crescimento de 12%. Os planos empresariais representam 62% do faturamento.';
    }
    if (lowerMessage.includes('despesa') || lowerMessage.includes('custo')) {
      return 'As despesas totais foram R$ 8.920,00, principalmente comissões e custos operacionais. Houve redução de 3% vs mês anterior.';
    }
    if (lowerMessage.includes('lucro') || lowerMessage.includes('margem')) {
      return 'O lucro líquido foi R$ 36.760,00 com margem de 80.5%. Excelente performance financeira com crescimento sustentável.';
    }
    if (lowerMessage.includes('relatório') || lowerMessage.includes('análise')) {
      return 'Posso gerar relatórios detalhados por período, categoria ou vendedor. Use os filtros para análises específicas.';
    }
    
    return 'Como analista financeiro, posso ajudar com relatórios de receita, análise de custos, projeções e métricas de performance. O que precisa analisar?';
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
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Financeiro</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  4
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Financeiro</h1>
              <p className="text-gray-600">Análise financeira, receitas, despesas e relatórios</p>
            </div>
            <div className="flex items-center space-x-4">
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
        </div>

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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Calculadora</h3>
                  <p className="text-sm text-gray-500">Cálculos financeiros</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Análises</h3>
                  <p className="text-sm text-gray-500">Gráficos e métricas</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Projeções</h3>
                  <p className="text-sm text-gray-500">Previsões financeiras</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                  <Wallet className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Fluxo de Caixa</h3>
                  <p className="text-sm text-gray-500">Controle financeiro</p>
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
                        <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbot */}
      <div className="chatbot-container">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente Financeiro</h3>
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
                  <SendIcon className="w-4 h-4" />
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
    </div>
  );
};

export default FinancialPortal;