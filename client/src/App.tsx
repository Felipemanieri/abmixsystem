import React, { useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Users, FileText, DollarSign, Zap, Shield, ArrowRight, CheckCircle, MessageCircle, Bot, X, Send, Phone, Mail, MapPin, Globe, Lock } from 'lucide-react';
import LoginPage from './components/LoginPage';
import VendorPortal from './components/VendorPortal';
import ClientPortal from './components/ClientPortal';
import FinancialPortal from './components/FinancialPortal';
import ImplantacaoPortal from './components/ImplantacaoPortal';
import SupervisorPortal from './components/SupervisorPortal';
import RestrictedAreaPortal from './components/RestrictedAreaPortal';
import ClientLinkPortal from './components/ClientLinkPortal';

type Portal = 'home' | 'client' | 'vendor' | 'financial' | 'implantacao' | 'supervisor' | 'restricted';
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

// Component for client link routing
function ClientLinkPage() {
  const { clientLink } = useParams<{ clientLink: string }>();
  return <ClientLinkPortal clientLink={clientLink!} />;
}

// Main home component
function HomePage() {
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
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: newMessage,
        isBot: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Obrigado pela sua mensagem! Nossa equipe irá analisá-la e retornará em breve.',
          isBot: true,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  if (currentPortal === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        {/* Header */}
        <header className="relative bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Abmix
                  </h1>
                  <p className="text-sm text-gray-600">Sistema de Gestão Empresarial</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>(11) 3333-3333</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>contato@abmix.com.br</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Gerencie seus 
                <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Negócios com Eficiência
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Plataforma completa para gestão de propostas, clientes e processos empresariais com ferramentas integradas e automação inteligente.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <FileText className="w-8 h-8 text-teal-600 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Propostas</h3>
                  <p className="text-gray-600 text-sm">Crie, acompanhe e gerencie propostas com links únicos para clientes</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <Users className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Portal Colaborativo</h3>
                  <p className="text-gray-600 text-sm">Múltiplos portais especializados para diferentes funções</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <Zap className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Automação Inteligente</h3>
                  <p className="text-gray-600 text-sm">Automatize processos e integre com ferramentas externas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Access Portals */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Portais de Acesso</h2>
              <p className="text-gray-600">Escolha seu portal para acessar as funcionalidades específicas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <button
                onClick={() => setCurrentPortal('client')}
                className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Portal Cliente</h3>
                <p className="text-gray-600">Acompanhe suas propostas e complete documentação</p>
              </button>

              <button
                onClick={() => setCurrentPortal('vendor')}
                className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Portal Vendedor</h3>
                <p className="text-gray-600">Crie propostas e gerencie clientes</p>
              </button>

              <button
                onClick={() => setCurrentPortal('financial')}
                className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Portal Financeiro</h3>
                <p className="text-gray-600">Validação e análise financeira</p>
              </button>

              <button
                onClick={() => setCurrentPortal('implantacao')}
                className="group bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Portal Implantação</h3>
                <p className="text-gray-600">Automação e implementação</p>
              </button>

              <button
                onClick={() => setCurrentPortal('supervisor')}
                className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 transform hover:scale-105 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Portal Supervisor</h3>
                <p className="text-gray-600">Gestão de equipe e relatórios</p>
              </button>

              <button
                onClick={() => setCurrentPortal('restricted')}
                className="group bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl hover:from-red-100 hover:to-red-200 transition-all duration-300 transform hover:scale-105 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Área Restrita</h3>
                <p className="text-gray-600">Administração e integrações</p>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Abmix</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Sistema de gestão empresarial completo para otimização de processos e automação de workflows.
                </p>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">São Paulo, SP</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">www.abmix.com.br</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Contato</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">(11) 3333-3333</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">contato@abmix.com.br</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Suporte</h4>
                <div className="space-y-2 text-gray-400">
                  <p className="text-sm">Segunda à Sexta</p>
                  <p className="text-sm">08:00 às 18:00</p>
                  <p className="text-sm">suporte@abmix.com.br</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p className="text-sm">&copy; 2024 Abmix. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>

        {/* Floating Chat */}
        <div className="fixed bottom-6 right-6 z-50">
          {showChat ? (
            <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-6 h-6 text-white" />
                  <span className="text-white font-medium">Assistente Virtual</span>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 ${message.isBot ? 'text-left' : 'text-right'}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-xl max-w-[80%] ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-teal-100'}`}>
                        {message.timestamp.toLocaleTimeString()}
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

  if (currentPortal === 'client') {
    return <ClientPortal user={currentUser} onLogout={handleLogout} />;
  }

  if (currentPortal === 'vendor') {
    return <VendorPortal user={currentUser} onLogout={handleLogout} />;
  }

  if (currentPortal === 'financial') {
    return <FinancialPortal user={currentUser} onLogout={handleLogout} />;
  }

  if (currentPortal === 'implantacao') {
    return <ImplantacaoPortal user={currentUser} onLogout={handleLogout} />;
  }

  if (currentPortal === 'supervisor') {
    return <SupervisorPortal user={currentUser} onLogout={handleLogout} />;
  }

  if (currentPortal === 'restricted') {
    return <RestrictedAreaPortal user={currentUser} onLogout={handleLogout} />;
  }

  return <LoginPage onLogin={handleLogin} />;
}

// Main App component with routing
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cliente/:clientLink" element={<ClientLinkPage />} />
    </Routes>
  );
}

export default App;