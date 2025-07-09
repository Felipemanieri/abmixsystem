import React, { useState } from 'react';
import { Users, FileText, DollarSign, Zap, Shield, ArrowRight } from 'lucide-react';
import LoginPage from './components/LoginPage';
import VendorPortal from './components/VendorPortal';
import ClientPortal from './components/ClientPortal';
import FinancialPortal from './components/FinancialPortal';
import SupervisorPortal from './components/SupervisorPortal';

type Portal = 'home' | 'client' | 'vendor' | 'financial' | 'supervisor';
type User = {
  id: string;
  name: string;
  role: Portal;
  email: string;
} | null;

function App() {
  const [currentPortal, setCurrentPortal] = useState<Portal>('home');
  const [currentUser, setCurrentUser] = useState<User>(null);

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
      case 'supervisor':
        return <SupervisorPortal user={currentUser} onLogout={handleLogout} />;
    }
  }

  // Página inicial com seleção de portais
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/Logo Abmix.jpg" 
                  alt="Abmix" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Abmix</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Propostas de Plano de Saúde
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acesse sua área específica para gerenciar propostas e acompanhar processos
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Portal do Cliente */}
          <div 
            onClick={() => setCurrentPortal('client')}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Portal do Cliente</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Acompanhe suas propostas e documentos
            </p>
            <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>

          {/* Portal Vendedor */}
          <div 
            onClick={() => setCurrentPortal('vendor')}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Portal Vendedor</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Gerencie propostas e clientes
            </p>
            <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>

          {/* Portal Financeiro */}
          <div 
            onClick={() => setCurrentPortal('financial')}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Portal Financeiro</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Validação e aprovação de propostas
            </p>
            <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>

          {/* Portal Supervisor */}
          <div 
            onClick={() => setCurrentPortal('supervisor')}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Portal Supervisor</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Supervisão e relatórios gerenciais
            </p>
            <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
              <ArrowRight className="w-4 h-4 mr-2" />
              Acessar Portal
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-teal-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Segurança e Privacidade</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Dados Protegidos</h4>
              <p className="text-sm text-gray-600">Todas as informações são criptografadas e protegidas</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Acesso Controlado</h4>
              <p className="text-sm text-gray-600">Cada usuário acessa apenas sua área específica</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Conformidade LGPD</h4>
              <p className="text-sm text-gray-600">Sistema em conformidade com a legislação</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;