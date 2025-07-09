import React, { useState } from 'react';
import { Users, FileText, DollarSign, Zap, Shield, ArrowRight, CheckCircle, MessageCircle, Bot, X, Send } from 'lucide-react';
import LoginPage from './components/LoginPage';
import VendorPortal from './components/VendorPortal';
import ClientPortal from './components/ClientPortal';
import FinancialPortal from './components/FinancialPortal';
import ImplantacaoPortal from './components/ImplantacaoPortal';
import SupervisorPortal from './components/SupervisorPortal';

type Portal = 'home' | 'client' | 'vendor' | 'financial' | 'implantacao' | 'supervisor';
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
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual da Abmix. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

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

    // Bot response
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
      return 'Oferecemos diversos planos de saúde empresariais e individuais. Posso conectá-lo com um de nossos vendedores para mais informações.';
    }
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('cotação')) {
      return 'Os valores variam conforme o plano escolhido. Nossos vendedores podem fazer uma cotação personalizada para você.';
    }
    if (lowerMessage.includes('documento') || lowerMessage.includes('anexo')) {
      return 'Para contratar um plano, você precisará de documentos como RG, CPF, comprovante de residência e CNPJ da empresa. Posso ajudar com mais detalhes.';
    }
    if (lowerMessage.includes('contato') || lowerMessage.includes('telefone')) {
      return 'Você pode entrar em contato conosco pelo telefone (11) 99999-9999 ou WhatsApp. Também temos atendimento online 24/7.';
    }
    
    return 'Entendi sua pergunta! Para informações mais específicas, recomendo falar com nossos especialistas. Posso ajudar com informações gerais sobre planos de saúde.';
  };

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
      case 'implantacao':
        return <ImplantacaoPortal user={currentUser} onLogout={handleLogout} />;
      case 'supervisor':
        return <SupervisorPortal user={currentUser} onLogout={handleLogout} />;
    }
  }

  // Página inicial com seleção de portais
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden watermark-bg particles-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Header */}
      <header className="nav-professional relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/Logo Abmix.jpg" 
                  alt="Abmix" 
                  className="h-12 w-auto logo-enhanced"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Sobre</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contato</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Suporte</a>
              </div>
              <button className="btn-primary">
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Title */}
        <div className="text-center mb-20 fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 rounded-full text-sm font-semibold mb-8 shadow-soft">
            <Shield className="w-4 h-4 mr-2" />
            Sistema Seguro e Confiável
          </div>
          <h1 className="heading-primary mb-8 slide-up">
            Sistema de Propostas de Plano de Saúde
          </h1>
          <p className="text-professional max-w-4xl mx-auto mb-12 slide-up">
            Plataforma completa para gestão de propostas de planos de saúde. 
            Acesse sua área específica e gerencie todo o processo de forma simples e segura.
          </p>
          
          <div className="flex items-center justify-center space-x-12 slide-up">
            <div className="flex items-center text-gray-600 font-medium">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>100% Digital</span>
            </div>
            <div className="flex items-center text-gray-600 font-medium">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Seguro e Rápido</span>
            </div>
            <div className="flex items-center text-gray-600 font-medium">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {/* Portal do Cliente */}
          <div 
            onClick={() => setCurrentPortal('client')}
            className="card-professional cursor-pointer group hover-lift"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all shadow-medium mx-auto">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors text-center">Portal do Cliente</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-center">
              Acompanhe suas propostas e documentos
            </p>
            <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>

          {/* Portal Vendedor */}
          <div 
            onClick={() => setCurrentPortal('vendor')}
            className="card-professional cursor-pointer group hover-lift"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-all shadow-medium mx-auto">
              <FileText className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors text-center">Portal Vendedor</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-center">
              Gerencie propostas e clientes
            </p>
            <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>

          {/* Portal Financeiro */}
          <div 
            onClick={() => setCurrentPortal('implantacao')}
            className="card-professional cursor-pointer group hover-lift"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mb-6 group-hover:from-teal-200 group-hover:to-teal-300 transition-all shadow-medium mx-auto">
              <Zap className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors text-center">Portal Implantação</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-center">
              Validação e automação de propostas
            </p>
            <div className="flex items-center justify-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>

          {/* Portal Financeiro */}
          <div 
            onClick={() => setCurrentPortal('financial')}
            className="card-professional cursor-pointer group hover-lift"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-all shadow-medium mx-auto">
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors text-center">Portal Financeiro</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-center">
              Análise financeira e relatórios
            </p>
            <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>

          {/* Portal Supervisor */}
          <div 
            onClick={() => setCurrentPortal('supervisor')}
            className="card-professional cursor-pointer group hover-lift"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:from-orange-200 group-hover:to-orange-300 transition-all shadow-medium mx-auto">
              <Zap className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors text-center">Portal Supervisor</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-center">
              Supervisão e relatórios gerenciais
            </p>
            <div className="flex items-center justify-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="card-professional mb-16 watermark-bg">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">Por que escolher nossa plataforma?</h2>
            <p className="text-professional">Tecnologia de ponta para simplificar seus processos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Processo Ágil</h3>
              <p className="text-gray-600 leading-relaxed">Automatização completa do fluxo de propostas, reduzindo tempo e erros</p>
            </div>
            
            <div className="text-center hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Máxima Segurança</h3>
              <p className="text-gray-600 leading-relaxed">Criptografia avançada e conformidade total com LGPD</p>
            </div>
            
            <div className="text-center hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Suporte Dedicado</h3>
              <p className="text-gray-600 leading-relaxed">Equipe especializada disponível 24/7 para auxiliar</p>
            </div>
          </div>
        </div>
        {/* Security Notice */}
        <div className="card-professional bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-large">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="heading-secondary">Segurança e Privacidade</h3>
              <p className="text-teal-700 font-medium">Seus dados protegidos com a mais alta tecnologia</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-8">
            <div className="hover-lift">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Dados Protegidos</h4>
              <p className="text-gray-600 leading-relaxed">Criptografia de ponta a ponta e armazenamento seguro</p>
            </div>
            <div className="hover-lift">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Acesso Controlado</h4>
              <p className="text-gray-600 leading-relaxed">Permissões granulares e autenticação multifator</p>
            </div>
            <div className="hover-lift">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                <FileText className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Conformidade LGPD</h4>
              <p className="text-gray-600 leading-relaxed">100% em conformidade com a legislação brasileira</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="footer-professional py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/Logo Abmix.jpg" 
                  alt="Abmix" 
                  className="h-10 w-auto logo-enhanced"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <p className="text-gray-300 leading-relaxed">Soluções completas em seguros e benefícios para sua empresa.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Contato</h3>
              <div className="space-y-3 text-gray-300">
                <p>📞 (11) 99999-9999</p>
                <p>✉️ contato@abmix.com.br</p>
                <p>📍 São Paulo, SP</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Suporte</h3>
              <div className="space-y-3 text-gray-300">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 12h</p>
                <p>Atendimento 24/7 online</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Redes Sociais</h3>
              <div className="flex space-x-3">
                <button className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all hover-lift shadow-medium">
                  <span className="text-white font-bold">f</span>
                </button>
                <button className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all hover-lift shadow-medium">
                  <span className="text-white font-bold">t</span>
                </button>
                <button className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center hover:bg-blue-800 transition-all hover-lift shadow-medium">
                  <span className="text-white font-bold">in</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p className="font-medium">&copy; 2024 Abmix. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <div className="chatbot-container">
        {showChat ? (
          <div className="card-professional w-96 h-96 flex flex-col p-0 shadow-large">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold text-lg">Assistente Abmix</h3>
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

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-4 rounded-2xl shadow-soft ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="input-professional flex-1"
                />
                <button
                  onClick={sendMessage}
                  className="btn-primary p-3"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full shadow-large hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center hover-lift"
          >
            <MessageCircle className="w-10 h-10" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;