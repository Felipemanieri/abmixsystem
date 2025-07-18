import React, { useState, useEffect } from 'react';
import { X, Send, User, MessageSquare, Clock, Search, Filter, Download, FileText, Trash2, Paperclip, UserPlus } from 'lucide-react';

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
  // Garantir que currentUser tenha valores padrão
  const safeCurrentUser = currentUser || { name: 'Usuário', role: 'user' };
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [composeData, setComposeData] = useState({
    recipient: '',
    subject: '',
    content: '',
    attachments: [] as File[]
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // Lista de usuários disponíveis para envio de mensagens
  const [availableUsers] = useState([
    { name: 'Ana Caroline Terto', role: 'vendor', email: 'comercial14@abmix.com.br' },
    { name: 'Bruna Garcia', role: 'vendor', email: 'comercial10@abmix.com.br' },
    { name: 'Fabiana Ferreira', role: 'vendor', email: 'comercial17@abmix.com.br' },
    { name: 'Fabiana Godinho', role: 'vendor', email: 'comercial@abmix.com.br' },
    { name: 'Fernanda Batista', role: 'vendor', email: 'comercial18@abmix.com.br' },
    { name: 'Gabrielle Fernandes', role: 'vendor', email: 'comercial3@abmix.com.br' },
    { name: 'Isabela Velasquez', role: 'vendor', email: 'comercial4@abmix.com.br' },
    { name: 'Juliana Araujo', role: 'vendor', email: 'comercial6@abmix.com.br' },
    { name: 'Lohainy Berlino', role: 'vendor', email: 'comercial15@abmix.com.br' },
    { name: 'Luciana Velasquez', role: 'vendor', email: 'comercial21@abmix.com.br' },
    { name: 'Monique Silva', role: 'vendor', email: 'comercial2@abmix.com.br' },
    { name: 'Sara Mattos', role: 'vendor', email: 'comercial8@abmix.com.br' },
    { name: 'Supervisor Abmix', role: 'supervisor', email: 'supervisao@abmix.com.br' },
    { name: 'Financeiro Abmix', role: 'financial', email: 'financeiro@abmix.com.br' },
    { name: 'Implementação Abmix', role: 'implementation', email: 'implementacao@abmix.com.br' },
    { name: 'Cliente Portal', role: 'client', email: 'cliente@abmix.com.br' },
    { name: 'Felipe Admin', role: 'admin', email: 'felipe@abmix.com.br' }
  ]);

  // Sistema de mensagens limpo - sem dados demo
  const [messages, setMessages] = useState<Message[]>([]);

  // Carregar mensagens do localStorage na inicialização
  useEffect(() => {
    const savedMessages = localStorage.getItem('internalMessages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
    }
  }, []);

  // Atualizar contador de não lidas
  useEffect(() => {
    const unread = messages.filter(msg => 
      msg.recipient === safeCurrentUser.name && !msg.read
    ).length;
    setUnreadCount(unread);
  }, [messages, safeCurrentUser.name]);

  const filteredMessages = messages.filter(message => {
    // Filtrar por caixa de entrada ou enviados
    if (activeTab === 'inbox' && message.recipient !== safeCurrentUser.name) return false;
    if (activeTab === 'sent' && message.sender !== safeCurrentUser.name) return false;
    
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
    if (!composeData.recipient || !composeData.subject || !composeData.content) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Se for mensagem geral, enviar para todos os usuários
    if (composeData.recipient === 'Mensagem Geral') {
      const newMessages: Message[] = availableUsers.map(user => ({
        id: `${Date.now()}-${user.name}`,
        sender: safeCurrentUser.name,
        senderRole: safeCurrentUser.role,
        recipient: user.name,
        recipientRole: user.role,
        subject: `[GERAL] ${composeData.subject}`,
        content: composeData.content,
        timestamp: new Date(),
        read: false,
        attachments: composeData.attachments.map(file => ({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type
        }))
      }));

      const updatedMessages = [...messages, ...newMessages];
      setMessages(updatedMessages);
      localStorage.setItem('internalMessages', JSON.stringify(updatedMessages));
      
      alert(`Mensagem enviada para ${availableUsers.length} usuários!`);
    } else {
      // Mensagem individual
      const selectedUser = availableUsers.find(user => user.name === composeData.recipient);
      if (!selectedUser) {
        alert('Destinatário não encontrado.');
        return;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        sender: safeCurrentUser.name,
        senderRole: safeCurrentUser.role,
        recipient: composeData.recipient,
        recipientRole: selectedUser.role,
        subject: composeData.subject,
        content: composeData.content,
        timestamp: new Date(),
        read: false,
        attachments: composeData.attachments.map(file => ({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type
        }))
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem('internalMessages', JSON.stringify(updatedMessages));

      alert('Mensagem enviada com sucesso!');
    }

    setComposeData({
      recipient: '',
      subject: '',
      content: '',
      attachments: []
    });
    setActiveTab('sent');
  };

  const handleMarkAsRead = (messageId: string) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('internalMessages', JSON.stringify(updatedMessages));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setComposeData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setComposeData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
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
                    : 'text-gray-500 dark:text-white hover:text-gray-700'
                }`}
              >
                Caixa de Entrada
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'sent'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 dark:text-white hover:text-gray-700'
                }`}
              >
                Enviadas
              </button>
            </div>
            
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 dark:text-white" />
                <input
                  type="text"
                  placeholder="Buscar mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            {/* Message List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-white">
                  Nenhuma mensagem encontrada
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read && message.recipient === safeCurrentUser.name) {
                        handleMarkAsRead(message.id);
                      }
                    }}
                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedMessage?.id === message.id ? 'bg-gray-50' : ''
                    } ${!message.read && activeTab === 'inbox' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">
                        {activeTab === 'inbox' ? message.sender : message.recipient}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-white">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{message.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-white truncate">{message.content}</p>
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
            <div className="p-3 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setActiveTab('compose');
                }}
                className="w-full py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Destinatário
                  </label>
                  <select
                    value={composeData.recipient}
                    onChange={(e) => setComposeData({...composeData, recipient: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecione um destinatário</option>
                    <option value="Mensagem Geral">📢 Mensagem Geral (Todos os usuários)</option>
                    <optgroup label="Vendedores">
                      {availableUsers.filter(user => user.role === 'vendor').map(user => (
                        <option key={user.email} value={user.name}>
                          {user.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Equipe Interna">
                      {availableUsers.filter(user => user.role !== 'vendor').map(user => (
                        <option key={user.email} value={user.name}>
                          {user.name} ({user.role === 'supervisor' ? 'Supervisão' : 
                                        user.role === 'financial' ? 'Financeiro' : 
                                        user.role === 'implementation' ? 'Implementação' : 
                                        user.role === 'client' ? 'Cliente' : 'Administrador'})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Assunto da mensagem"
                  />
                </div>
                
                <div className="flex-1 mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    value={composeData.content}
                    onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                    className="w-full h-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none dark:bg-gray-700 dark:text-white"
                    placeholder="Digite sua mensagem aqui..."
                    rows={8}
                  />
                </div>

                {/* Anexos */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Anexos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="text-center">
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Paperclip className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Clique para anexar arquivos ou arraste aqui
                          </span>
                        </div>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xlsx,.xls"
                        />
                      </label>
                    </div>
                    
                    {composeData.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Arquivos anexados ({composeData.attachments.length})
                        </h4>
                        {composeData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setActiveTab('inbox')}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="flex items-center px-4 py-2 text-sm text-white bg-gray-600 dark:bg-gray-700 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
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
                        <p className="text-xs text-gray-500 dark:text-white">
                          {selectedMessage.timestamp.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 dark:text-gray-500 dark:text-white hover:text-gray-600 p-1 rounded hover:bg-gray-100 dark:bg-gray-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 dark:text-gray-500 dark:text-white hover:text-gray-600 p-1 rounded hover:bg-gray-100 dark:bg-gray-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mb-4">
                  <div className="text-sm text-gray-800 dark:text-gray-200 dark:text-white whitespace-pre-line">
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
                            <span className="text-xs text-gray-500 dark:text-white ml-2">({attachment.size})</span>
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
                  <p className="text-sm text-gray-500 dark:text-white">
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