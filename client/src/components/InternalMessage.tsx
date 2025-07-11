import React, { useState } from 'react';
import { X, Send, User, MessageSquare, Clock, Search, Filter, Download, FileText, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  recipient: string;
  recipientRole: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
}

interface InternalMessageProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    role: string;
  };
}

const InternalMessage: React.FC<InternalMessageProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [composeData, setComposeData] = useState({
    recipient: '',
    subject: '',
    content: '',
  });

  // Dados simulados de mensagens
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Ana Caroline',
      senderRole: 'vendor',
      recipient: currentUser.name,
      recipientRole: currentUser.role,
      subject: 'Proposta VEND001-PROP123',
      content: 'Olá! Precisamos verificar os documentos da proposta VEND001-PROP123. O cliente está com dúvidas sobre o processo de carência.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      read: false,
    },
    {
      id: '2',
      sender: 'Carlos Silva',
      senderRole: 'financial',
      recipient: currentUser.name,
      recipientRole: currentUser.role,
      subject: 'Validação pendente',
      content: 'Por favor, verifique a proposta VEND002-PROP124 que está aguardando validação há 3 dias. Precisamos finalizar até amanhã.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      read: true,
    },
    {
      id: '3',
      sender: 'Bruna Garcia',
      senderRole: 'implantacao',
      recipient: currentUser.name,
      recipientRole: currentUser.role,
      subject: 'Documentação incompleta',
      content: 'A proposta VEND003-PROP126 está com documentação incompleta. Falta o comprovante de residência e a carteirinha do plano atual. Por favor, solicite ao cliente.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      read: true,
      attachments: [
        { name: 'lista_documentos.pdf', size: '245 KB', type: 'pdf' }
      ]
    },
    {
      id: '4',
      sender: currentUser.name,
      senderRole: currentUser.role,
      recipient: 'Ana Caroline',
      recipientRole: 'vendor',
      subject: 'Re: Proposta VEND001-PROP123',
      content: 'Vou verificar os documentos e entrar em contato com o cliente para esclarecer as dúvidas sobre carência.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutos atrás
      read: true,
    },
  ]);

  const filteredMessages = messages.filter(message => {
    // Filtrar por caixa de entrada ou enviados
    if (activeTab === 'inbox' && message.recipient !== currentUser.name) return false;
    if (activeTab === 'sent' && message.sender !== currentUser.name) return false;
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        message.subject.toLowerCase().includes(searchLower) ||
        message.content.toLowerCase().includes(searchLower) ||
        message.sender.toLowerCase().includes(searchLower) ||
        message.recipient.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleSendMessage = () => {
    // Simulação de envio de mensagem
    alert('Mensagem enviada com sucesso!');
    setComposeData({
      recipient: '',
      subject: '',
      content: '',
    });
    setActiveTab('sent');
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Mensagens Internas</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'inbox'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Caixa de Entrada
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'sent'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Enviadas
              </button>
            </div>
            
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            {/* Message List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma mensagem encontrada
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedMessage?.id === message.id ? 'bg-gray-50' : ''
                    } ${!message.read && activeTab === 'inbox' ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">
                        {activeTab === 'inbox' ? message.sender : message.recipient}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{message.subject}</p>
                    <p className="text-xs text-gray-500 truncate">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-blue-600">
                          <span className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            {message.attachments.length} anexo(s)
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Compose Button */}
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setActiveTab('compose');
                }}
                className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
              >
                Nova Mensagem
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'compose' ? (
              <div className="flex-1 flex flex-col p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatário
                  </label>
                  <select
                    value={composeData.recipient}
                    onChange={(e) => setComposeData({...composeData, recipient: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Selecione um destinatário</option>
                    <option value="Ana Caroline">Ana Caroline (Vendedor)</option>
                    <option value="Carlos Silva">Carlos Silva (Financeiro)</option>
                    <option value="Bruna Garcia">Bruna Garcia (Implantação)</option>
                    <option value="Diana Santos">Diana Santos (Supervisora)</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Assunto da mensagem"
                  />
                </div>
                
                <div className="flex-1 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    value={composeData.content}
                    onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                    className="w-full h-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    placeholder="Digite sua mensagem aqui..."
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <button className="flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      <FileText className="w-4 h-4 mr-2" />
                      Anexar Arquivo
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setActiveTab('inbox')}
                      className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="flex items-center px-4 py-2 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedMessage ? (
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedMessage.subject}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">
                          {activeTab === 'inbox' ? selectedMessage.sender : `Para: ${selectedMessage.recipient}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedMessage.timestamp.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mb-4">
                  <div className="text-sm text-gray-800 whitespace-pre-line">
                    {selectedMessage.content}
                  </div>
                </div>
                
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mb-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Anexos</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm">{attachment.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({attachment.size})</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setComposeData({
                        recipient: activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.recipient,
                        subject: `Re: ${selectedMessage.subject}`,
                        content: `\n\n-------- Mensagem Original --------\nDe: ${selectedMessage.sender}\nData: ${selectedMessage.timestamp.toLocaleString('pt-BR')}\n\n${selectedMessage.content}`
                      });
                      setActiveTab('compose');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Responder
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma mensagem selecionada</h3>
                  <p className="text-sm text-gray-500">
                    Selecione uma mensagem para visualizar ou clique em Nova Mensagem
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalMessage;