import React, { useState } from 'react';
import { LogOut, Settings, TrendingUp, CheckCircle, AlertCircle, Eye, Send, Calendar, FileText, User, Bell, MessageCircle, Bot, X, Send as SendIcon, Zap, Database, Cloud, Cog } from 'lucide-react';

interface ImplantacaoPortalProps {
  user: any;
  onLogout: () => void;
}

interface Proposal {
  id: string;
  client: string;
  vendor: string;
  plan: string;
  value: string;
  status: 'pending_validation' | 'validated' | 'sent_to_automation';
  submissionDate: string;
  documents: number;
  observations?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ImplantacaoPortal: React.FC<ImplantacaoPortalProps> = ({ user, onLogout }) => {
  const [selectedStatus, setSelectedStatus] = useState('pending_validation');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [observations, setObservations] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do portal de implantação. Como posso ajudá-lo com as validações e automações?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 'VEND001-PROP123',
      client: 'Empresa ABC Ltda',
      vendor: 'Ana Caroline',
      plan: 'Plano Empresarial Premium',
      value: 'R$ 1.250,00',
      status: 'pending_validation',
      submissionDate: '2024-01-15',
      documents: 8,
    },
    {
      id: 'VEND002-PROP124',
      client: 'Tech Solutions SA',
      vendor: 'Bruna Garcia',
      plan: 'Plano Família Básico',
      value: 'R$ 650,00',
      status: 'pending_validation',
      submissionDate: '2024-01-14',
      documents: 6,
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
      observations: 'Documentação completa e validada',
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
      observations: 'Enviado para automação Make/Zapier',
    },
  ]);

  const implantacaoStats = [
    {
      name: 'Aguardando Validação',
      value: proposals.filter(p => p.status === 'pending_validation').length.toString(),
      change: 'Para revisar',
      changeType: 'warning',
      icon: AlertCircle,
    },
    {
      name: 'Validadas Hoje',
      value: proposals.filter(p => p.status === 'validated').length.toString(),
      change: 'Prontas para envio',
      changeType: 'positive',
      icon: CheckCircle,
    },
    {
      name: 'Enviadas p/ Automação',
      value: proposals.filter(p => p.status === 'sent_to_automation').length.toString(),
      change: 'Processadas',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'Sistemas Integrados',
      value: '12',
      change: 'Ativos',
      changeType: 'positive',
      icon: Database,
    },
  ];

  const validateProposal = (proposalId: string) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, status: 'validated', observations }
        : proposal
    ));
    setSelectedProposal(null);
    setObservations('');
    showNotification('Proposta validada com sucesso!', 'success');
  };

  const sendToAutomation = (proposalId: string) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { 
            ...proposal, 
            status: 'sent_to_automation',
            observations: observations || 'Enviado para automação Make/Zapier'
          }
        : proposal
    ));
    setSelectedProposal(null);
    setObservations('');
    showNotification('Proposta enviada para automação!', 'success');
  };

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
    
    if (lowerMessage.includes('validar') || lowerMessage.includes('aprovar')) {
      return 'Para validar uma proposta, clique no ícone de visualização e depois em "Validar Proposta". Certifique-se de revisar todos os documentos antes.';
    }
    if (lowerMessage.includes('automação') || lowerMessage.includes('make') || lowerMessage.includes('zapier')) {
      return 'Após validar uma proposta, você pode enviá-la para automação. Isso irá processar os dados no Make/Zapier para criação automática do contrato.';
    }
    if (lowerMessage.includes('documento') || lowerMessage.includes('anexo')) {
      return 'Verifique se todos os documentos obrigatórios foram enviados antes de validar. RG, CPF, CNPJ e comprovantes são essenciais.';
    }
    if (lowerMessage.includes('implantação') || lowerMessage.includes('sistema')) {
      return 'A implantação envolve validação de dados, integração com sistemas e automação de processos. Posso ajudar com qualquer etapa.';
    }
    
    return 'Como especialista em implantação, você pode validar propostas, configurar automações e integrar sistemas. O que precisa fazer?';
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
      case 'pending_validation':
        return 'bg-orange-100 text-orange-800';
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
      case 'pending_validation':
        return 'Aguardando Validação';
      case 'validated':
        return 'Validado';
      case 'sent_to_automation':
        return 'Enviado p/ Automação';
      default:
        return 'Desconhecido';
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    if (selectedStatus === 'all') return true;
    return proposal.status === selectedStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Implantação</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Implantação</h1>
          <p className="text-gray-600">Valide propostas, configure automações e gerencie integrações</p>
        </div>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {implantacaoStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-teal-100 rounded-full">
                      <Icon className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'warning' ? 'text-orange-600' : 'text-gray-600'
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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className="p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Automações</h3>
                  <p className="text-sm text-gray-500">Configurar Make/Zapier</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Integrações</h3>
                  <p className="text-sm text-gray-500">Sistemas externos</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Cloud className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Deploy</h3>
                  <p className="text-sm text-gray-500">Publicar alterações</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                  <Cog className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Configurações</h3>
                  <p className="text-sm text-gray-500">Sistema</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Propostas para Validação</h2>
                <p className="text-sm text-gray-600">Gerencie o fluxo de validação e automação</p>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
                            className="text-teal-600 hover:text-teal-900 p-1 rounded hover:bg-teal-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {proposal.status === 'validated' && (
                            <button 
                              onClick={() => sendToAutomation(proposal.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
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
      </main>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Validação da Proposta
                </h3>
                <button 
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {(() => {
                const proposal = proposals.find(p => p.id === selectedProposal);
                if (!proposal) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Cliente:</span>
                        <span className="ml-2">{proposal.client}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Vendedor:</span>
                        <span className="ml-2">{proposal.vendor}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Plano:</span>
                        <span className="ml-2">{proposal.plan}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Valor:</span>
                        <span className="ml-2">{proposal.value}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações de Implantação
                      </label>
                      <textarea
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Adicione observações sobre a validação e implantação..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setSelectedProposal(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                      {proposal.status === 'pending_validation' && (
                        <button
                          onClick={() => validateProposal(proposal.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Validar Proposta
                        </button>
                      )}
                      {proposal.status === 'validated' && (
                        <button
                          onClick={() => sendToAutomation(proposal.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                        >
                          Enviar para Make/Zapier
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="chatbot-container">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente Implantação</h3>
                  <p className="text-xs text-teal-100">Online agora</p>
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
                      : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-teal-100'
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-colors"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImplantacaoPortal;