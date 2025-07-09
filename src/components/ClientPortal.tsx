import React, { useState } from 'react';
import { LogOut, Upload, Camera, FileText, Check, User, Phone, Mail, MapPin, Calendar, Plus, Trash2, Info, AlertCircle, CheckCircle2, Clock, Download, MessageCircle, Bot, X, Send, Bell } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ClientForm from './ClientForm';

interface ClientPortalProps {
  user: any;
  onLogout: () => void;
}

interface Proposal {
  id: string;
  status: string;
  date: string;
  plan: string;
  value: string;
  documents: number;
  lastUpdate: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'profile' | 'documents'>('proposals');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual do portal do cliente. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const proposals: Proposal[] = [
    {
      id: 'PROP-2024-001',
      status: 'pending',
      date: '2024-01-15',
      plan: 'Plano Empresarial Premium',
      value: 'R$ 1.250,00',
      documents: 8,
      lastUpdate: '2 horas atrás'
    },
    {
      id: 'PROP-2024-002',
      status: 'approved',
      date: '2024-01-10',
      plan: 'Plano Família Básico',
      value: 'R$ 650,00',
      documents: 6,
      lastUpdate: '5 dias atrás'
    }
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
    
    if (lowerMessage.includes('proposta') || lowerMessage.includes('status')) {
      return 'Você pode acompanhar o status das suas propostas na aba "Propostas". Lá você verá todas as informações e poderá enviar documentos adicionais se necessário.';
    }
    if (lowerMessage.includes('documento') || lowerMessage.includes('anexo')) {
      return 'Para enviar documentos, acesse a aba "Documentos" ou clique em uma proposta específica para anexar documentos a ela.';
    }
    if (lowerMessage.includes('perfil') || lowerMessage.includes('dados')) {
      return 'Seus dados pessoais podem ser visualizados e editados na aba "Perfil". Mantenha sempre suas informações atualizadas.';
    }
    if (lowerMessage.includes('contato') || lowerMessage.includes('ajuda')) {
      return 'Para falar com um atendente humano, você pode ligar para (11) 99999-9999 ou enviar um email para atendimento@abmix.com.br.';
    }
    
    return 'Estou aqui para ajudar com informações sobre suas propostas, documentos necessários e dados do seu perfil. Como posso auxiliá-lo?';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
  };

  const renderProposalsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Minhas Propostas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
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
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proposal.id}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(proposal.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedProposal(proposal.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProposal && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalhes da Proposta {selectedProposal}
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Informações da Proposta</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ID:</span>
                        <span className="text-sm font-medium">{proposal.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Plano:</span>
                        <span className="text-sm font-medium">{proposal.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Valor:</span>
                        <span className="text-sm font-medium">{proposal.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-sm font-medium ${
                          proposal.status === 'approved' ? 'text-green-600' : 
                          proposal.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {getStatusText(proposal.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Data:</span>
                        <span className="text-sm font-medium">{new Date(proposal.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Última Atualização:</span>
                        <span className="text-sm font-medium">{proposal.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Documentos</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Documentos Enviados:</span>
                        <span className="text-sm font-medium">{proposal.documents} / 10</span>
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Arraste e solte arquivos aqui</p>
                        <p className="text-xs text-gray-500">ou</p>
                        <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Selecionar Arquivos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Próximos Passos</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Aguardando análise da operadora</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Sua proposta está sendo analisada pela operadora. Você receberá uma notificação assim que houver uma atualização.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preencher Nova Proposta</h3>
        <p className="text-gray-600 mb-4">
          Você tem uma nova proposta para preencher? Clique no botão abaixo para começar.
        </p>
        <button 
          onClick={() => setActiveTab('documents')}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Preencher Formulário
        </button>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Meu Perfil</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{user.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{user.email}</p>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                Alterar Foto
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    defaultValue="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    defaultValue="123.456.789-00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  defaultValue="Rua das Flores, 123 - Centro, São Paulo - SP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por Email</p>
              <p className="text-sm text-gray-600">Receba atualizações sobre suas propostas</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" id="toggle-email" className="sr-only" defaultChecked />
              <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por WhatsApp</p>
              <p className="text-sm text-gray-600">Receba mensagens sobre status de propostas</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" id="toggle-whatsapp" className="sr-only" defaultChecked />
              <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Lembretes de Documentos</p>
              <p className="text-sm text-gray-600">Receba lembretes sobre documentos pendentes</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" id="toggle-reminders" className="sr-only" defaultChecked />
              <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <ClientForm />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <AbmixLogo size={40} className="mr-3" />
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal do Cliente</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Área do Cliente</h1>
          <p className="text-gray-600">Gerencie suas propostas e documentos</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('proposals')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'proposals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Propostas
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Formulário
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'proposals' && renderProposalsTab()}
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
        </div>
      </main>

      {/* Chatbot */}
      <div className="chatbot-container">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente do Cliente</h3>
                  <p className="text-xs text-blue-100">Online agora</p>
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
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;