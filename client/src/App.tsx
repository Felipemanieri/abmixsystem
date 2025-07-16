import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, Zap, Shield, ArrowRight, CheckCircle, MessageCircle, Bot, X, Send, Phone, Mail, MapPin, Globe, Crown } from 'lucide-react';
import LoginPage from './components/LoginPage';
import VendorPortal from './components/VendorPortal';
import ClientPortal from './components/ClientPortal';
import FinancialPortal from './components/FinancialPortal';
import ImplantacaoPortal from './components/ImplantacaoPortal';
import SupervisorPortal from './components/SupervisorPortal';
import RestrictedAreaPortal from './components/RestrictedAreaPortal';
import ClientProposalView from './components/ClientProposalView';
import { Lock } from 'lucide-react';

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
  const [showClientPortal, setShowClientPortal] = useState(() => {
    return localStorage.getItem('showClientPortal') !== 'false';
  });

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
    return <ClientProposalView token={clientProposalToken} />;
  }

  // Se não está logado e não está na home, mostrar login
  if (!currentUser && currentPortal !== 'home') {
    return <LoginPage portal={currentPortal} onLogin={handleLogin} onBack={() => setCurrentPortal('home')} />;
  }

  // Se está logado, mostrar o portal correspondente
  if (currentUser) {
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
    }
  }

  // Página inicial com seleção de portais
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/65be871e-f7a6-4f31-b1a9-cd0729a73ff8 copy copy.png" 
                  alt="Abmix" 
                  className="h-20 w-auto"
                />
              </div>
              <button
                onClick={() => setCurrentPortal('restricted')}
                className="flex items-center px-4 py-2 text-sm font-bold text-white bg-gray-700 hover:bg-gray-800 rounded-lg transition-colors shadow-sm"
              >
                <Lock className="w-4 h-4 mr-2" />
                Área Restrita
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-800 font-bold transition-colors">Sobre</a>
                <a href="#" className="text-gray-600 hover:text-gray-800 font-bold transition-colors">Contato</a>
                <a href="#" className="text-gray-600 hover:text-gray-800 font-bold transition-colors">Suporte</a>
              </div>
              <button 
                onClick={() => window.open('https://wa.me/5511988888888?text=Olá! Gostaria de conhecer o Sistema Abmix.', '_blank')}
                className="bg-gradient-to-r from-teal-400 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl font-bold"
              >
                Solicitar Demonstração
              </button>
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-600 mb-6 leading-tight">
            Sistema Abmix de Propostas
          </h1>
          <p className="text-xl text-gray-600 font-bold max-w-4xl mx-auto leading-relaxed relative z-10">
            Plataforma completa para gestão de propostas de planos de saúde empresariais. 
            Acesse sua área específica e gerencie todo o processo de forma simples, segura e eficiente.
          </p>
          
          <div className="flex items-center justify-center space-x-8 mt-8 relative z-10">
            <div className="flex items-center text-gray-600 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>100% Digital</span>
            </div>
            <div className="flex items-center text-gray-600 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Seguro e Rápido</span>
            </div>
            <div className="flex items-center text-gray-600 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Suporte Especializado</span>
            </div>
          </div>
        </div>

        {/* Portal Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${showClientPortal ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-8 mb-16 px-4`}>
          {/* Portal do Cliente - Condicional */}
          {showClientPortal && (
            <div 
              onClick={() => setCurrentPortal('client')}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-blue-200 p-8 hover:shadow-3xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 relative overflow-hidden hover:border-blue-400"
            >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-teal-300 rounded-3xl transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-3xl flex items-center justify-center mb-6 group-hover:from-teal-200 group-hover:to-teal-300 transition-all shadow-xl group-hover:shadow-2xl group-hover:scale-110">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 mb-3 group-hover:text-teal-600 transition-colors">Portal do Cliente</h3>
              <p className="text-gray-600 mb-6 leading-relaxed font-medium">
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
          <div 
            onClick={() => setCurrentPortal('vendor')}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-200 p-8 hover:shadow-3xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 relative overflow-hidden hover:border-green-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-300 rounded-3xl transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-all shadow-xl group-hover:shadow-2xl group-hover:scale-110">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">Portal Vendedor</h3>
              <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                Gerencie propostas e clientes
              </p>
              <div className="flex items-center text-green-700 font-bold group-hover:text-green-800 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>

          {/* Portal Implantação */}
          <div 
            onClick={() => setCurrentPortal('implementation')}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-teal-200 p-8 hover:shadow-3xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 relative overflow-hidden hover:border-teal-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-teal-300 rounded-3xl transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-3xl flex items-center justify-center mb-6 group-hover:from-teal-200 group-hover:to-teal-300 transition-all shadow-xl group-hover:shadow-2xl group-hover:scale-110">
                <Zap className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-teal-900 mb-3 group-hover:text-teal-700 transition-colors">Portal Implantação</h3>
              <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                Validação e automação de propostas
              </p>
              <div className="flex items-center text-teal-700 font-bold group-hover:text-teal-800 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>

          {/* Portal Financeiro */}
          <div 
            onClick={() => setCurrentPortal('financial')}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 p-8 hover:shadow-3xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 relative overflow-hidden hover:border-purple-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-300 rounded-3xl transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mb-6 group-hover:from-purple-200 group-hover:to-purple-300 transition-all shadow-xl group-hover:shadow-2xl group-hover:scale-110">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-3 group-hover:text-purple-700 transition-colors">Portal Financeiro</h3>
              <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                Análise financeira e relatórios
              </p>
              <div className="flex items-center text-purple-700 font-bold group-hover:text-purple-800 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>

          {/* Portal Supervisor */}
          <div 
            onClick={() => setCurrentPortal('supervisor')}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gray-300 p-8 hover:shadow-3xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 relative overflow-hidden hover:border-gray-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-400 rounded-3xl transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6 group-hover:from-gray-200 group-hover:to-gray-300 transition-all shadow-xl group-hover:shadow-2xl group-hover:scale-110">
                <Crown className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-3 group-hover:text-gray-600 transition-colors">Portal Supervisor</h3>
              <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                Supervisão e relatórios gerenciais
              </p>
              <div className="flex items-center text-gray-700 font-bold group-hover:text-gray-800 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Acessar Portal
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 mb-16 border border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Por que escolher nossa plataforma?</h2>
            <p className="text-gray-600 text-lg font-medium">Tecnologia de ponta para simplificar seus processos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Processo Ágil</h3>
              <p className="text-gray-600 font-medium">Automatização completa do fluxo de propostas, reduzindo tempo e erros</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Máxima Segurança</h3>
              <p className="text-gray-600 font-medium">Criptografia avançada e conformidade total com LGPD</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Suporte Dedicado</h3>
              <p className="text-gray-600 font-medium">Equipe especializada com suporte dedicado para auxiliar</p>
            </div>
          </div>
        </div>


      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 px-6">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-600">
            
            {/* Seção Esquerda - Logo e Info do Sistema */}
            <div className="flex items-center space-x-3">
              <img 
                src="/65be871e-f7a6-4f31-b1a9-cd0729a73ff8 copy copy.png" 
                alt="Abmix" 
                className="h-12 w-auto"
              />
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-gray-700">Sistema Interno v2.0</span>
                <span className="text-gray-500">© 2025 Abmix Consultoria</span>
              </div>
            </div>

            {/* Seção Centro - Suporte e Links */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <span>Suporte:</span>
                <a 
                  href="mailto:suporte@abmix.com.br" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
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

      {/* Chatbot */}
      <div className="chatbot-container">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente Abmix</h3>
                  <p className="text-xs text-teal-100">Online agora</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
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

            {/* Chat Input */}
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
                  className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;