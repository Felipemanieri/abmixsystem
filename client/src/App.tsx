import React, { useState } from 'react';
import { Users, FileText, DollarSign, Zap, Shield, ArrowRight, CheckCircle, MessageCircle, Bot, X, Send, Phone, Mail, MapPin, Globe } from 'lucide-react';
import LoginPage from './components/LoginPage';
import VendorPortal from './components/VendorPortal';
import ClientPortal from './components/ClientPortal';
import FinancialPortal from './components/FinancialPortal';
import ImplantacaoPortal from './components/ImplantacaoPortal';
import SupervisorPortal from './components/SupervisorPortal';
import RestrictedAreaPortal from './components/RestrictedAreaPortal';
import { Lock } from 'lucide-react';

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
      return 'Oferecemos diversos planos de saúde empresariais e individuais com coberturas completas. Nossos especialistas podem fazer uma apresentação personalizada para sua empresa. Gostaria de agendar?';
    }
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('cotação')) {
      return 'Os valores são calculados conforme o perfil da empresa e número de colaboradores. Nossa equipe comercial faz cotações gratuitas em até 24h. Posso conectá-lo com um consultor?';
    }
    if (lowerMessage.includes('documento') || lowerMessage.includes('anexo') || lowerMessage.includes('papelada')) {
      return 'O processo é 100% digital! Você precisará apenas de: CNPJ da empresa, RG e CPF dos beneficiários, e comprovante de endereço. Tudo pode ser enviado pelo sistema online.';
    }
    if (lowerMessage.includes('contato') || lowerMessage.includes('telefone') || lowerMessage.includes('whatsapp')) {
      return 'Você pode falar conosco por WhatsApp: (11) 98888-8888, telefone: (11) 99999-9999 ou email: contato@abmix.com.br. Atendemos 24/7 para sua comodidade!';
    }
    if (lowerMessage.includes('portal') || lowerMessage.includes('acesso') || lowerMessage.includes('login')) {
      return 'Cada usuário tem acesso ao seu portal específico: Cliente (acompanhar propostas), Vendedor (criar propostas), Financeiro (análises) e Supervisor (relatórios). Qual portal você precisa acessar?';
    }
    if (lowerMessage.includes('como funciona') || lowerMessage.includes('processo')) {
      return 'É muito simples: 1) Vendedor cria a proposta, 2) Cliente preenche os dados online, 3) Sistema valida automaticamente, 4) Aprovação em até 48h. Todo processo é acompanhado em tempo real!';
    }
    
    return 'Estou aqui para ajudar! Posso esclarecer sobre planos, preços, documentação, processo de contratação ou conectá-lo com nossa equipe especializada. Como posso auxiliá-lo?';
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/65be871e-f7a6-4f31-b1a9-cd0729a73ff8 copy copy.png" 
                alt="Abmix" 
                className="h-24 w-auto"
              />
            </div>
            
            {/* Contato */}
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>contato@abmix.com.br</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Rua das Flores, 123 - Centro</span>
                </div>
                <p className="ml-6">São Paulo, SP</p>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>www.abmix.com.br</span>
                </div>
              </div>
            </div>
            
            {/* WhatsApp */}
            <div>
              <h3 className="font-bold mb-4">WhatsApp</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-green-400" />
                  <span>(11) 98888-8888</span>
                </div>
                <p className="text-sm">Atendimento 24/7</p>
                <button 
                  onClick={() => window.open('https://wa.me/5511988888888?text=Olá! Gostaria de mais informações.', '_blank')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-3"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar no WhatsApp
                </button>
              </div>
            </div>
            
            {/* Redes Sociais */}
            <div>
              <h3 className="font-bold mb-4">Redes Sociais</h3>
              <div className="space-y-2 text-gray-400">
                <p className="mb-4">Siga-nos nas redes sociais</p>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => window.open('https://facebook.com/abmix', '_blank')}
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => window.open('https://instagram.com/abmix', '_blank')}
                    className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.367-.315-.49-.753-.49-1.243 0-.49.123-.928.49-1.243.369-.367.807-.49 1.297-.49s.928.123 1.297.49c.367.315.49.753.49 1.243 0 .49-.123.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => window.open('https://linkedin.com/company/abmix', '_blank')}
                    className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex items-center justify-between">
            <div className="text-gray-400 text-xl">
              <p>&copy; 2024 Abmix. Todos os direitos reservados.</p>
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