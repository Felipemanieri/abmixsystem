import React, { useState, useEffect } from 'react';
import { X, Send, User, MessageSquare, Clock, Search, Filter, Download, FileText, Trash2, Paperclip, UserPlus } from 'lucide-react';
import DiscreteNotification from './DiscreteNotification';

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

interface User {
  name: string;
  role: string;
  department: string;
  email: string;
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
  const [dragActive, setDragActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Sistema de mensagens limpo - FORÇAR LIMPEZA TOTAL
  const [messages, setMessages] = useState<Message[]>([]);

  // LIMPAR TUDO AO CARREGAR
  useEffect(() => {
    localStorage.removeItem('internalMessages');
    localStorage.removeItem('notifications');
    localStorage.removeItem('userNotifications');
    setMessages([]);
    setUnreadCount(0);
    console.log('TODAS AS MENSAGENS E NOTIFICAÇÕES FORAM APAGADAS');
  }, []);
  
  // Sistema de detecção automática de usuários do banco de dados
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  const getDepartmentFromRole = (role: string) => {
    switch (role) {
      case 'vendor': return 'Comercial';
      case 'supervisor': return 'Supervisão';
      case 'financial': return 'Financeiro';
      case 'implementation': return 'Implementação';
      case 'admin': return 'Administração';
      case 'system': return 'Sistema';
      default: return 'Geral';
    }
  };

  // Carregar usuários automaticamente do banco de dados
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Buscar usuários do sistema
        const systemUsersResponse = await fetch('/api/auth/users');
        const systemUsers = systemUsersResponse.ok ? await systemUsersResponse.json() : [];

        // Buscar vendedores
        const vendorsResponse = await fetch('/api/vendors');
        const vendors = vendorsResponse.ok ? await vendorsResponse.json() : [];

        // Combinar e formatar usuários
        const allUsers: User[] = [
          // Usuários do sistema
          ...systemUsers
            .filter((user: any) => user.userType === 'system')
            .map((user: any) => ({
              name: user.name || user.email?.split('@')[0] || 'Usuário',
              role: user.role || 'system',
              department: getDepartmentFromRole(user.role || 'system'),
              email: user.email
            })),
          // Vendedores
          ...vendors.map((vendor: any) => ({
            name: vendor.name || vendor.email?.split('@')[0] || 'Vendedor',
            role: 'vendor',
            department: 'Comercial',
            email: vendor.email
          }))
        ];

        setAvailableUsers(allUsers);
        console.log('Usuários carregados automaticamente:', allUsers.length);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        // Fallback para usuários básicos (apenas em caso de erro de API)
        setAvailableUsers([
          { name: 'Sistema', role: 'system', department: 'Sistema', email: 'sistema@abmix.com.br' }
        ]);
      }
    };

    loadUsers();

    // Recarregar usuários a cada 30 segundos para detectar mudanças
    const interval = setInterval(loadUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Detectar novos usuários em mensagens
  useEffect(() => {
    if (availableUsers.length === 0) return;

    const detectMessageUsers = () => {
      const existingMessages = JSON.parse(localStorage.getItem('internalMessages') || '[]');
      const existingUserNames = new Set(availableUsers.map(u => u.name));
      const newUsers: User[] = [];
      
      existingMessages.forEach((msg: any) => {
        // Detectar remetente não cadastrado
        if (!existingUserNames.has(msg.sender) && msg.sender !== safeCurrentUser.name) {
          newUsers.push({
            name: msg.sender,
            role: msg.senderRole || 'user',
            department: getDepartmentFromRole(msg.senderRole || 'user'),
            email: `${msg.sender.toLowerCase().replace(/\s+/g, '.')}@abmix.com.br`
          });
          existingUserNames.add(msg.sender);
        }
        
        // Detectar destinatário não cadastrado
        if (!existingUserNames.has(msg.recipient) && msg.recipient !== safeCurrentUser.name) {
          newUsers.push({
            name: msg.recipient,
            role: msg.recipientRole || 'user',
            department: getDepartmentFromRole(msg.recipientRole || 'user'),
            email: `${msg.recipient.toLowerCase().replace(/\s+/g, '.')}@abmix.com.br`
          });
          existingUserNames.add(msg.recipient);
        }
      });

      if (newUsers.length > 0) {
        setAvailableUsers(prev => [...prev, ...newUsers]);
        console.log('Novos usuários detectados:', newUsers.length);
      }
    };

    detectMessageUsers();
  }, [messages, availableUsers, safeCurrentUser.name]);

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
      setNotificationMessage('Por favor, preencha todos os campos obrigatórios.');
      setShowNotification(true);
      return;
    }

    // SISTEMA CORRIGIDO: Enviar APENAS para o destinatário escolhido
    if (composeData.recipient === 'Mensagem Geral') {
      // Para mensagem geral, enviar para TODOS exceto o remetente
      const recipients = availableUsers.filter(user => user.name !== safeCurrentUser.name);
      const newMessages: Message[] = recipients.map((user, index) => ({
        id: `${Date.now()}-${index}-${user.name.replace(/\s+/g, '')}`,
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
      
      console.log(`Mensagem geral enviada para ${recipients.length} usuários`);
      setNotificationMessage(`Mensagem geral enviada para ${recipients.length} usuários!`);
      setShowNotification(true);
    } else {
      // Para mensagem individual, enviar APENAS para a pessoa escolhida
      const selectedUser = availableUsers.find(user => user.name === composeData.recipient);
      if (!selectedUser) {
        setNotificationMessage('Destinatário não encontrado.');
        setShowNotification(true);
        return;
      }

      const newMessage: Message = {
        id: `${Date.now()}-individual-${selectedUser.name.replace(/\s+/g, '')}`,
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

      console.log(`APENAS ${composeData.recipient} foi notificado`);
      setNotificationMessage('Mensagem enviada com sucesso!');
      setShowNotification(true);
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
    
    // Atualizar contador imediatamente
    const unread = updatedMessages.filter(msg => 
      msg.recipient === safeCurrentUser.name && !msg.read
    ).length;
    setUnreadCount(unread);
  };

  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem('internalMessages', JSON.stringify(updatedMessages));
    
    // Se a mensagem sendo deletada é a selecionada, limpar seleção
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    
    // Atualizar contador de mensagens não lidas
    const unread = updatedMessages.filter(msg => 
      msg.recipient === safeCurrentUser.name && !msg.read
    ).length;
    setUnreadCount(unread);
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

  // Funções de drag and drop EXATAS do VendorPortal_backup
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const novosArquivos = Array.from(e.dataTransfer.files);
      setComposeData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...novosArquivos]
      }));
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center">
            <MessageSquare className="w-6 h-6 text-gray-600 dark:text-gray-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sistema de Mensagens Internas</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
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
                    ? 'text-gray-600 dark:text-gray-300 border-b-2 border-gray-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Caixa de Entrada
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'sent'
                    ? 'text-gray-600 dark:text-gray-300 border-b-2 border-gray-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
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
                      // FORÇAR MARCAÇÃO COMO LIDA E REMOVER NOTIFICAÇÃO
                      if (!message.read && message.recipient === safeCurrentUser.name) {
                        console.log('MARCANDO COMO LIDA E REMOVENDO NOTIFICAÇÃO:', message.id);
                        handleMarkAsRead(message.id);
                        // Forçar atualização do contador
                        setUnreadCount(prev => Math.max(0, prev - 1));
                      }
                    }}
                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 group ${
                      selectedMessage?.id === message.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                    } ${!message.read && activeTab === 'inbox' && message.recipient === safeCurrentUser.name ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-gray-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate text-gray-900 dark:text-white">
                        {activeTab === 'inbox' ? message.sender : message.recipient}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Apagar mensagem"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{message.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
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
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Destinatário 
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({availableUsers.length} usuários disponíveis)
                    </span>
                  </label>
                  <select
                    value={composeData.recipient}
                    onChange={(e) => setComposeData({...composeData, recipient: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecione um destinatário</option>
                    <option value="Mensagem Geral">📢 Mensagem Geral - Todos os usuários</option>
                    
                    {/* Agrupar por departamento automaticamente */}
                    {Array.from(new Set(availableUsers.map(user => user.department)))
                      .sort((a, b) => {
                        const order = ['Comercial', 'Supervisão', 'Financeiro', 'Implementação', 'Administração', 'Sistema', 'Geral'];
                        return order.indexOf(a) - order.indexOf(b);
                      })
                      .map(dept => {
                        const usersInDept = availableUsers.filter(user => user.department === dept);
                        if (usersInDept.length === 0) return null;
                        
                        return (
                          <optgroup key={dept} label={dept}>
                            {usersInDept
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map(user => (
                                <option key={user.email} value={user.name}>
                                  {user.name} - {user.department}
                                </option>
                              ))}
                          </optgroup>
                        );
                      })}
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
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    value={composeData.content}
                    onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                    className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none dark:bg-gray-700 dark:text-white"
                    placeholder="Digite sua mensagem aqui..."
                    rows={6}
                  />
                </div>

                {/* Anexos */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Anexos
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragActive 
                        ? 'border-gray-500 bg-gray-50 dark:bg-gray-800' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Paperclip className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Arraste arquivos aqui ou clique para anexar
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
                
                <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
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
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedMessage.subject}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activeTab === 'inbox' ? selectedMessage.sender : `Para: ${selectedMessage.recipient}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedMessage.timestamp.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                        title="Apagar mensagem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        title="Download anexos"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>
                
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Anexos ({selectedMessage.attachments.length})</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md border dark:border-gray-600">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{attachment.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({attachment.size})</span>
                          </div>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => {
                      setComposeData({
                        recipient: activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.recipient,
                        subject: `Re: ${selectedMessage.subject}`,
                        content: `\n\n-------- Mensagem Original --------\nDe: ${selectedMessage.sender}\nData: ${selectedMessage.timestamp.toLocaleString('pt-BR')}\n\n${selectedMessage.content}`,
                        attachments: []
                      });
                      setActiveTab('compose');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-white bg-gray-600 dark:bg-gray-700 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Responder
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhuma mensagem selecionada</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecione uma mensagem para visualizar ou clique em Nova Mensagem
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notificação Discreta Verde */}
      <DiscreteNotification
        message={notificationMessage}
        type="success"
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default InternalMessage;