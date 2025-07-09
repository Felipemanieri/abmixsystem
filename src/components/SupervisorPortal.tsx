import React, { useState } from 'react';
import { LogOut, BarChart3, Users, Clock, TrendingUp, AlertTriangle, CheckCircle, Eye, Calendar } from 'lucide-react';

interface SupervisorPortalProps {
  user: any;
  onLogout: () => void;
}

const SupervisorPortal: React.FC<SupervisorPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedView, setSelectedView] = useState('overview');

  const overallStats = [
    {
      name: 'Total de Propostas',
      value: '156',
      change: '+12% vs mês anterior',
      changeType: 'positive',
      icon: BarChart3,
      color: 'blue',
    },
    {
      name: 'Taxa de Conversão',
      value: '68%',
      change: '+5% vs mês anterior',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'green',
    },
    {
      name: 'Tempo Médio',
      value: '8.5 dias',
      change: '-2 dias vs mês anterior',
      changeType: 'positive',
      icon: Clock,
      color: 'yellow',
    },
    {
      name: 'Propostas Atrasadas',
      value: '23',
      change: '+30 dias ou mais',
      changeType: 'warning',
      icon: AlertTriangle,
      color: 'red',
    },
  ];

  const vendorPerformance = [
    {
      name: 'Ana Caroline',
      proposals: 45,
      completed: 38,
      pending: 7,
      avgTime: '6.2 dias',
      conversionRate: '84%',
    },
    {
      name: 'Bruna Garcia',
      proposals: 32,
      completed: 28,
      pending: 4,
      avgTime: '7.8 dias',
      conversionRate: '88%',
    },
    {
      name: 'Carlos Silva',
      proposals: 28,
      completed: 22,
      pending: 6,
      avgTime: '9.1 dias',
      conversionRate: '79%',
    },
    {
      name: 'Diana Santos',
      proposals: 35,
      completed: 29,
      pending: 6,
      avgTime: '8.3 dias',
      conversionRate: '83%',
    },
  ];

  const recentActivity = [
    {
      id: 'VEND001-PROP123',
      client: 'Empresa ABC Ltda',
      vendor: 'Ana Caroline',
      action: 'Proposta finalizada',
      timestamp: '2 horas atrás',
      status: 'completed',
    },
    {
      id: 'VEND002-PROP124',
      client: 'Tech Solutions SA',
      vendor: 'Bruna Garcia',
      action: 'Cliente preenchendo dados',
      timestamp: '4 horas atrás',
      status: 'in_progress',
    },
    {
      id: 'VEND003-PROP125',
      client: 'Startup Inovadora',
      vendor: 'Carlos Silva',
      action: 'Documentos pendentes há 15 dias',
      timestamp: '1 dia atrás',
      status: 'delayed',
    },
    {
      id: 'VEND001-PROP126',
      client: 'Consultoria XYZ',
      vendor: 'Ana Caroline',
      action: 'Enviado para financeiro',
      timestamp: '2 dias atrás',
      status: 'financial',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      case 'financial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'delayed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'financial':
        return <BarChart3 className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <div className="hidden w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Supervisor</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="90days">Últimos 90 dias</option>
              </select>
              
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-2xl font-bold mb-2">Dashboard Supervisor</h1>
          <p className="text-orange-100">Supervisão e relatórios gerenciais em tempo real</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {overallStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'warning' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Vendor Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Performance dos Vendedores</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {vendorPerformance.map((vendor) => (
                  <div key={vendor.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-xs text-gray-500">
                          {vendor.proposals} propostas • {vendor.completed} finalizadas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{vendor.conversionRate}</p>
                      <p className="text-xs text-gray-500">{vendor.avgTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.client}
                      </p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{activity.vendor}</span>
                        <span className="mx-1 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Relatórios Detalhados</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedView('overview')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedView === 'overview' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setSelectedView('delayed')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedView === 'delayed' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Atrasadas
                </button>
                <button
                  onClick={() => setSelectedView('financial')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedView === 'financial' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Financeiro
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Relatório Completo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Análise detalhada de todas as propostas e performance
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Gerar Relatório
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Propostas Atrasadas</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Lista de propostas com mais de 30 dias em aberto
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Ver Atrasadas
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Análise de Tendências</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tendências de conversão e performance ao longo do tempo
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  Ver Tendências
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupervisorPortal;