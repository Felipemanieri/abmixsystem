import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, Zap, Shield, ArrowRight, CheckCircle, MessageCircle, Bot, X, Send, Phone, Mail, MapPin, Globe, Crown, Database, Clock, Award, Lock, Calculator, BarChart3, TrendingUp, PieChart, Briefcase, Settings } from 'lucide-react';
import LoginPage from './components/LoginPage';
import VendorPortal from './components/VendorPortal';
import ClientPortal from './components/ClientPortal';
import FinancialPortal from './components/FinancialPortal';
import ImplantacaoPortal from './components/ImplantacaoPortal';
import SupervisorPortal from './components/SupervisorPortal';
import RestrictedAreaPortal from './components/RestrictedAreaPortal';
import ClientProposalView from './components/ClientProposalView';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

type Portal = 'home' | 'client' | 'vendor' | 'financial' | 'implementation' | 'supervisor' | 'restricted';
type User = {
  id: string;
  name: string;
  role: Portal;
  email: string;
} | null;

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

function App() {
  const [currentPortal, setCurrentPortal] = useState<Portal>('home');
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [clientProposalToken, setClientProposalToken] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
     text: 'Olá! Sou o assistente virtual do sistema. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [portalVisibility, setPortalVisibility] = useState({
    showClientPortal: true,
    showVendorPortal: true,
    showFinancialPortal: true,
    showImplementationPortal: true,
    showSupervisorPortal: true
  });

  // Carrega configurações globais dos portais
  useEffect(() => {
    const loadPortalVisibility = async () => {
      try {
        const response = await fetch('/api/portal-visibility');
        if (response.ok) {
          const data = await response.json();
          setPortalVisibility(data);
        }
      } catch (error) {
        console.error('Erro ao carregar visibilidade dos portais:', error);
      }
    };
    
    loadPortalVisibility();

    // 1. Escuta mudanças via PostMessage
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PORTAL_VISIBILITY_CHANGED') {
        loadPortalVisibility();
        // Se usuário está logado em portal desativado, fazer logout
        if (currentUser && isPortalDisabled(currentUser.role)) {
          handleLogout();
        }
      }
    };
    
    // 2. Escuta mudanças via BroadcastChannel
    const bc = new BroadcastChannel('portal-changes');
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'PORTAL_VISIBILITY_CHANGED') {
        if (event.data.data) {
          setPortalVisibility(event.data.data);
        } else {
          loadPortalVisibility();
        }
        // Se usuário está logado em portal desativado, fazer logout
        if (currentUser && isPortalDisabled(currentUser.role)) {
          handleLogout();
        }
      }
    };
    
    // 3. Escuta mudanças via evento personalizado
    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail) {
        setPortalVisibility(event.detail);
        // Se usuário está logado em portal desativado, fazer logout
        if (currentUser && isPortalDisabled(currentUser.role)) {
          handleLogout();
        }
      }
    };
    
    // 4. Polling do localStorage para detectar mudanças
    let lastTimestamp = localStorage.getItem('portal-visibility-timestamp');
    const checkLocalStorage = () => {
      const currentTimestamp = localStorage.getItem('portal-visibility-timestamp');
      if (currentTimestamp && currentTimestamp !== lastTimestamp) {
        lastTimestamp = currentTimestamp;
        const storedData = localStorage.getItem('portal-visibility');
        if (storedData) {
          try {
            const data = JSON.parse(storedData);
            setPortalVisibility(data);
            // Se usuário está logado em portal desativado, fazer logout
            if (currentUser && isPortalDisabled(currentUser.role)) {
              handleLogout();
            }
          } catch (e) {
            console.error('Erro ao parsear dados do localStorage:', e);
          }
        }
      }
    };
    
    const storageInterval = setInterval(checkLocalStorage, 1000);
    
    // Registrar listeners
    window.addEventListener('message', handleMessage);
    bc.addEventListener('message', handleBroadcast);
    window.addEventListener('portalVisibilityChanged', handleCustomEvent as EventListener);

    console.log('Sistema Abmix carregado com sucesso');
    
    return () => {
      window.removeEventListener('message', handleMessage);
      bc.removeEventListener('message', handleBroadcast);
      window.removeEventListener('portalVisibilityChanged', handleCustomEvent as EventListener);
      clearInterval(storageInterval);
      bc.close();
    };
  }, [currentUser]);

  // Função auxiliar para verificar se portal está desativado
  const isPortalDisabled = (role: string) => {
    switch (role) {
      case 'client':
        return !portalVisibility.showClientPortal;
      case 'vendor':
        return !portalVisibility.showVendorPortal;
      case 'financial':
        return !portalVisibility.showFinancialPortal;
      case 'implementation':
        return !portalVisibility.showImplementationPortal;
      case 'supervisor':
        return !portalVisibility.showSupervisorPortal;
      case 'restricted':
        return false;
      default:
        return true;
    }
  };

  // Verificar URLs específicas para acesso direto aos portais
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // URLs específicas para cada portal
    if (path === '/portal/cliente' || hash === '#cliente') {
      setCurrentPortal('client');
    } else if (path === '/portal/vendedor' || hash === '#vendedor') {
      setCurrentPortal('vendor');
    } else if (path === '/portal/financeiro' || hash === '#financeiro') {
      setCurrentPortal('financial');
    } else if (path === '/portal/implantacao' || hash === '#implantacao') {
      setCurrentPortal('implementation');
    } else if (path === '/portal/supervisor' || hash === '#supervisor') {
      setCurrentPortal('supervisor');
    } else if (path === '/portal/restrito' || hash === '#restrito') {
      setCurrentPortal('restricted');
    }
  }, []);

  // Check for client proposal token in URL
  useEffect(() => {
    const path = window.location.pathname;
    const clientProposalMatch = path.match(/\/cliente\/proposta\/(.+)/);
    
    if (clientProposalMatch) {
      setClientProposalToken(clientProposalMatch[1]);
    }
  }, []);

  // Set correct page title
  useEffect(() => {
    document.title = "Abmix Consultoria em Benefícios";
  }, [currentPortal]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user) {
      setCurrentPortal(user.role);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPortal('home');
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
    
    if (lowerMessage.includes('plano') || lowerMessage.includes('saúde')) {
      return 'Oferecemos diversos planos de saúde empresariais e individuais com coberturas completas. Nossos especialistas podem fazer uma apresentação personalizada para sua empresa. Gostaria de agendar?';
    }
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('cotação')) {
      return 'Os valores são calculados conforme o perfil da empresa e número de colaboradores. Nossa equipe comercial faz cotações gratuitas em até 24h. Posso conectá-lo com um consultor?';
    }
    if (lowerMessage.includes('documento') || lowerMessage.includes('anexo') || lowerMessage.includes('papelada')) {
      return 'O processo é 100% digital! Você precisará apenas de: CNPJ da empresa, RG e CPF dos beneficiários, e comprovante de endereço. Tudo pode ser enviado pelo sistema online.';
    }
    if (lowerMessage.includes('contato') || lowerMessage.includes('telefone') || lowerMessage.includes('whatsapp')) {
      return 'Você pode falar conosco por WhatsApp: (11) 98888-8888, telefone: (11) 99999-9999 ou email: contato@abmix.com.br. Atendemos com suporte especializado para sua comodidade!';
    }
    if (lowerMessage.includes('portal') || lowerMessage.includes('acesso') || lowerMessage.includes('login')) {
      return 'Cada usuário tem acesso ao seu portal específico: Cliente (acompanhar propostas), Vendedor (criar propostas), Financeiro (análises) e Supervisor (relatórios). Qual portal você precisa acessar?';
    }
    if (lowerMessage.includes('como funciona') || lowerMessage.includes('processo')) {
      return 'É muito simples: 1) Vendedor cria a proposta, 2) Cliente preenche os dados online, 3) Sistema valida automaticamente, 4) Aprovação em até 48h. Todo processo é acompanhado em tempo real!';
    }
    
    return 'Estou aqui para ajudar! Posso esclarecer sobre planos, preços, documentação, processo de contratação ou conectá-lo com nossa equipe especializada. Como posso auxiliá-lo?';
  };

  // If accessing client proposal via direct link
  if (clientProposalToken) {
    return (
      <ThemeProvider>
        <ClientProposalView token={clientProposalToken} />
      </ThemeProvider>
    );
  }

  // Se não está logado e não está na home, mostrar login
  if (!currentUser && currentPortal !== 'home') {
    return (
      <ThemeProvider>
        <LoginPage portal={currentPortal} onLogin={handleLogin} onBack={() => setCurrentPortal('home')} />
      </ThemeProvider>
    );
  }

  // Se está logado, verificar se o portal está ativo antes de renderizar
  if (currentUser) {

    // Se o portal está desativado, mostrar mensagem e forçar logout
    if (isPortalDisabled(currentUser.role)) {
      return (
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Portal Desativado
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Este portal foi temporariamente desativado pelo administrador do sistema.
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Entre em contato com o administrador ou tente novamente mais tarde.
                </p>
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Voltar à Página Inicial
                </button>
              </div>
            </div>
          </div>
        </ThemeProvider>
      );
    }

    // Portal ativo - renderizar normalmente
    return (
      <ThemeProvider>
        {(() => {
          switch (currentUser.role) {
            case 'vendor':
              return <VendorPortal user={currentUser} onLogout={handleLogout} />;
            case 'client':
              return <ClientPortal user={currentUser} onLogout={handleLogout} />;
            case 'financial':
              return <FinancialPortal user={currentUser} onLogout={handleLogout} />;
            case 'implementation':
              return <ImplantacaoPortal user={currentUser} onLogout={handleLogout} />;
            case 'supervisor':
              return <SupervisorPortal user={currentUser} onLogout={handleLogout} />;
            case 'restricted':
              return <RestrictedAreaPortal user={currentUser} onLogout={handleLogout} />;
            default:
              return null;
          }
        })()}
      </ThemeProvider>
    );
  }

  // Página inicial com seleção de portais
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/65be871e-f7a6-4f31-b1a9-cd0729a73ff8 copy copy.png" 
                  alt="Abmix" 
                  className="h-16 w-auto"
                />
              </div>
              <button
                onClick={() => setCurrentPortal('restricted')}
                className="text-gray-700 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 font-medium transition-colors"
              >
                Área Restrita
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-700 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 font-medium transition-colors">Sobre</a>
                <a href="#" className="text-gray-700 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 font-medium transition-colors">Suporte</a>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Title */}
        <div className="text-center mb-20 relative">
          {/* Logo como marca d'água */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img 
              src="/6078b216-6252-4ede-8d9b-4c2164c3ed8f copy copy.png" 
              alt="Abmix Logo Watermark" 
              className="w-96 h-96 opacity-20 object-contain"
            />
          </div>
          
          {/* Texto principal com z-index maior */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-600 dark:text-gray-300 mb-6 leading-tight">
            Sistema Abmix de Propostas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-bold max-w-4xl mx-auto leading-relaxed relative z-10">
            Plataforma completa para gestão de propostas de planos de saúde empresariais. 
            Acesse sua área específica e gerencie todo o processo de forma simples, segura e eficiente.
          </p>
          
          <div className="flex items-center justify-center space-x-8 mt-8 relative z-10">
            <div className="flex items-center text-gray-600 dark:text-gray-400 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>100% Digital</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Seguro e Rápido</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Suporte Especializado</span>
            </div>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-16 px-4 justify-items-center max-w-5xl mx-auto">
          {/* Portal do Cliente - Condicional */}
          {portalVisibility.showClientPortal && (
            <div 
              onClick={() => setCurrentPortal('client')}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-blue-200 dark:border-blue-700 p-4 hover:shadow-3xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden hover:border-blue-500 dark:hover:border-blue-400"
              style={{ width: '220px', height: '280px', minWidth: '220px', minHeight: '280px' }}
            >
            {/* Status Indicator */}
            <div className="absolute top-0 right-0 m-2 flex items-center">
              <span className="text-xs font-bold text-green-500">🟢 Online</span>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mb-4 transition-all shadow-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Portal do Cliente</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-medium">
                Acompanhe suas propostas e documentos
              </p>
              <div className="flex items-center text-teal-600 font-bold group-hover:text-teal-700 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>
          )}

          {/* Portal Vendedor */}
          {portalVisibility.showVendorPortal && (
          <div 
            onClick={() => setCurrentPortal('vendor')}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-200 dark:border-green-700 p-4 hover:shadow-3xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden hover:border-green-500 dark:hover:border-green-400"
            style={{ width: '220px', height: '280px', minWidth: '220px', minHeight: '280px' }}
          >
            {/* Status Indicator */}
            <div className="absolute top-0 right-0 m-2 flex items-center">
              <span className="text-xs font-bold text-green-500">🟢 Online</span>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mb-4 transition-all shadow-xl">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">Portal Vendedor</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-medium">
                Gerencie propostas e clientes
              </p>
              <div className="flex items-center text-green-700 font-bold group-hover:text-green-800 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>
          )}

          {/* Portal Implantação */}
          {portalVisibility.showImplementationPortal && (
          <div 
            onClick={() => setCurrentPortal('implementation')}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-teal-200 dark:border-teal-700 p-4 hover:shadow-3xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden hover:border-teal-500 dark:hover:border-teal-400"
            style={{ width: '220px', height: '280px', minWidth: '220px', minHeight: '280px' }}
          >
            {/* Status Indicator */}
            <div className="absolute top-0 right-0 m-2 flex items-center">
              <span className="text-xs font-bold text-green-500">🟢 Online</span>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mb-4 transition-all shadow-xl">
                <Settings className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-teal-900 dark:text-teal-300 mb-3 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">Portal Implantação</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-medium">
                Validação e automação de propostas
              </p>
              <div className="flex items-center text-teal-700 font-bold group-hover:text-teal-800 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>
          )}

          {/* Portal Financeiro */}
          {portalVisibility.showFinancialPortal && (
          <div 
            onClick={() => setCurrentPortal('financial')}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 p-4 hover:shadow-3xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden hover:border-purple-500 dark:hover:border-purple-400"
            style={{ width: '220px', height: '280px', minWidth: '220px', minHeight: '280px' }}
          >
            {/* Status Indicator */}
            <div className="absolute top-0 right-0 m-2 flex items-center">
              <span className="text-xs font-bold text-green-500">🟢 Online</span>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mb-4 transition-all shadow-xl">
                <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Portal Financeiro</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-medium">
                Análise financeira e relatórios
              </p>
              <div className="flex items-center text-purple-700 font-bold group-hover:text-purple-800 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>
          )}

          {/* Portal Supervisor */}
          {portalVisibility.showSupervisorPortal && (
          <div 
            onClick={() => setCurrentPortal('supervisor')}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-4 hover:shadow-3xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden hover:border-gray-600 dark:hover:border-gray-400"
            style={{ width: '220px', height: '280px', minWidth: '220px', minHeight: '280px' }}
          >
            {/* Status Indicator */}
            <div className="absolute top-0 right-0 m-2 flex items-center">
              <span className="text-xs font-bold text-green-500">🟢 Online</span>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mb-4 transition-all shadow-xl">
                <Crown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">Portal Supervisor</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-medium">
                Supervisão e relatórios gerenciais
              </p>
              <div className="flex items-center text-gray-700 font-bold group-hover:text-gray-800 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl px-6 py-4 mb-16 border border-gray-200 dark:border-gray-700 mx-auto" style={{ width: '960px' }}>
          <div className="text-center mb-4">

            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Tecnologia de ponta para simplificar seus processos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Database className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">Gestão Centralizada</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Sistema integrado para controle total de propostas e documentos</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">Eficiência Operacional</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Automação inteligente reduz o tempo de processamento</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">Excelência Corporativa</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Padrões empresariais com conformidade e segurança</p>
            </div>
          </div>
        </div>


      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            
            {/* Seção Esquerda - Logo e Info do Sistema */}
            <div className="flex items-center space-x-3">
              <img 
                src="/65be871e-f7a6-4f31-b1a9-cd0729a73ff8 copy copy.png" 
                alt="Abmix" 
                className="h-16 w-auto"
              />
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">Sistema Interno v2.0</span>
                <span className="text-gray-500 dark:text-gray-400">© 2025 Abmix Consultoria</span>
              </div>
            </div>

            {/* Seção Centro - Suporte e Links */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <span>Suporte:</span>
                <a 
                  href="mailto:suporte@abmix.com.br" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  suporte@abmix.com.br
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Manual do Sistema
                </a>
                <span className="text-gray-400">|</span>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  FAQ
                </a>
                <span className="text-gray-400">|</span>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Configurações
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span>Status:</span>
                <span className="text-green-600 font-medium">🟢 Online</span>
              </div>
            </div>

            {/* Seção Direita - Informações do Sistema */}
            <div className="flex flex-col items-end space-y-1">
              <span>Última Sync: <span className="font-medium">14:39</span></span>
              <span>Propostas Hoje: <span className="font-medium text-blue-600">45</span></span>
              <span>Backup: <span className="font-medium text-green-600">Ativo</span></span>
            </div>

          </div>
        </div>
      </footer>

      {/* Chatbot temporariamente removido para estabilização */}
      </div>
    </ThemeProvider>
  );
}

export default App;