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
     text: 'Olá! Sou o assistente virtual do sistema. Como posso ajudá-lo hoje?',
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-blue-900 hover:text-blue-800 font-bold transition-colors">Sobre</a>
                <a href="#" className="text-blue-900 hover:text-blue-800 font-bold transition-colors">Contato</a>
                <a href="#" className="text-blue-900 hover:text-blue-800 font-bold transition-colors">Suporte</a>
              </div>
              <button className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-6 py-3 rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all shadow-lg hover:shadow-xl font-bold">
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Title */}
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Sistema Seguro e Confiável
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Plataforma de Gestão
          </h1>
          <p className="text-xl text-blue-900 font-bold max-w-4xl mx-auto leading-relaxed">
            Plataforma completa para gestão empresarial. 
            Acesse sua área específica e gerencie seus processos de forma simples e segura.
          </p>
          
          <div className="flex items-center justify-center space-x-8 mt-8">
            <div className="flex items-center text-blue-900 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>100% Digital</span>
            </div>
            <div className="flex items-center text-blue-900 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Seguro e Rápido</span>
            </div>
            <div className="flex items-center text-blue-900 font-bold">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16 px-4">
          {/* Portal do Cliente */}
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
            onClick={() => setCurrentPortal('implantacao')}
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
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-orange-200 p-8 hover:shadow-3xl transition-all duration-500 cursor-pointer group hover:-translate-y-3 hover:scale-105 relative overflow-hidden hover:border-orange-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-300 rounded-3xl transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mb-6 group-hover:from-orange-200 group-hover:to-orange-300 transition-all shadow-xl group-hover:shadow-2xl group-hover:scale-110">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-3 group-hover:text-orange-600 transition-colors">Portal Supervisor</h3>
              <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                Supervisão e relatórios gerenciais
              </p>
              <div className="flex items-center text-orange-700 font-bold group-hover:text-orange-800 transition-colors">
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
              <p className="text-gray-600 font-medium">Equipe especializada disponível 24/7 para auxiliar</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl p-12 border border-teal-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-700">Segurança e Privacidade</h3>
              <p className="text-gray-600 font-semibold">Seus dados protegidos com a mais alta tecnologia</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-8">
            <div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-bold text-gray-700 mb-2 text-lg">Dados Protegidos</h4>
              <p className="text-gray-600 font-medium">Criptografia de ponta a ponta e armazenamento seguro</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-bold text-gray-700 mb-2 text-lg">Acesso Controlado</h4>
              <p className="text-gray-600 font-medium">Permissões granulares e autenticação multifator</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-bold text-gray-700 mb-2 text-lg">Conformidade LGPD</h4>
              <p className="text-gray-600 font-medium">100% em conformidade com a legislação brasileira</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-blue-500">Plataforma</span>
              </div>
              <p className="text-gray-300 font-semibold">Plataforma completa de gestão empresarial.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <div className="space-y-2 text-gray-400">
                <p>📞 (11) 99999-9999</p>
                <p>✉️ contato@abmix.com.br</p>
                <p>📍 São Paulo, SP</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Suporte</h3>
              <div className="space-y-2 text-gray-400">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 12h</p>
                <p>Atendimento 24/7 online</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-white font-bold">f</span>
                </button>
                <button className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="text-white font-bold">t</span>
                </button>
                <button className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <span className="text-white font-bold">in</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Plataforma. Todos os direitos reservados.</p>
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
                  <h3 className="font-bold">Assistente Virtual</h3>
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