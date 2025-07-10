import React, { useState } from 'react';
import { LogOut, FileSpreadsheet, Zap, Database, ShieldAlert, Settings, Download, Users, FileText, DollarSign, TrendingUp, Bell, AlertCircle, Lock, Eye, Search, Filter, X } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import NotificationCenter from './NotificationCenter';
import IntegrationGuide from './IntegrationGuide';

interface RestrictedAreaPortalProps {
  user: any;
  onLogout: () => void;
}

type RestrictedView = 'dashboard' | 'sheets' | 'make' | 'database' | 'users' | 'integrations';

const RestrictedAreaPortal: React.FC<RestrictedAreaPortalProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<RestrictedView>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  // Notificações simuladas
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Integração Make atualizada',
      message: 'A integração com Make foi atualizada com sucesso',
      type: 'approval',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      read: false,
    },
    {
      id: '2',
      title: 'Backup automático',
      message: 'O backup diário do sistema foi concluído com sucesso',
      type: 'document',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      read: false,
    },
    {
      id: '3',
      title: 'Alerta de segurança',
      message: 'Foram detectadas 3 tentativas de login inválidas',
      type: 'alert',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 horas atrás
      read: true,
    },
  ]);

  const restrictedStats = [
    {
      name: 'Total de Usuários',
      value: '42',
      change: '+3 este mês',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
    },
    {
      name: 'Propostas Ativas',
      value: '156',
      change: '+12% este mês',
      changeType: 'positive',
      icon: FileText,
      color: 'green',
    },
    {
      name: 'Receita Total',
      value: 'R$ 89.450',
      change: '+18% este mês',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple',
    },
    {
      name: 'Automações Ativas',
      value: '8',
      change: '2 novas este mês',
      changeType: 'positive',
      icon: Zap,
      color: 'orange',
    },
  ];

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const exportData = () => {
    const reportData = {
      periodo: selectedPeriod,
      stats: restrictedStats,
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dados-sistema-${selectedPeriod}.json`;
    link.click();
    
    showNotification('Dados exportados com sucesso!', 'success');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {restrictedStats.map((stat) => {
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
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Google Sheets</h3>
          </div>
          <p className="text-gray-600 mb-4">Integração com planilhas para relatórios e análises</p>
          <button 
            onClick={() => {
              setActiveView('sheets');
              showNotification('Acessando integração com Google Sheets', 'info');
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Configurar Integração
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Make</h3>
          </div>
          <p className="text-gray-600 mb-4">Automações e integrações com sistemas externos</p>
          <button 
            onClick={() => {
              setActiveView('make');
              showNotification('Acessando integração com Make', 'info');
            }}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Configurar Automações
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Database className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Banco de Dados</h3>
          </div>
          <p className="text-gray-600 mb-4">Acesso direto ao banco de dados do sistema</p>
          <button 
            onClick={() => {
              setActiveView('database');
              showNotification('Acessando configurações do banco de dados', 'info');
            }}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Gerenciar Banco de Dados
          </button>
        </div>
      </div>

      {/* Configurações Avançadas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações Avançadas do Sistema</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldAlert className="w-5 h-5 text-orange-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Permissões de Acesso</h3>
                  <p className="text-sm text-gray-600">Gerenciar permissões de usuários e funções</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveView('users');
                  showNotification('Acessando gerenciamento de usuários', 'info');
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              >
                Configurar
              </button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Backup do Sistema</h3>
                  <p className="text-sm text-gray-600">Configurar backups automáticos e restauração</p>
                </div>
              </div>
              <button 
                onClick={() => showNotification('Iniciando backup do sistema...', 'info')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              >
                Iniciar Backup
              </button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Webhooks e APIs</h3>
                  <p className="text-sm text-gray-600">Gerenciar endpoints e chaves de API</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveView('integrations');
                  showNotification('Acessando configurações de integrações', 'info');
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              >
                Configurar
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Atenção:</span> Alterações nesta área podem afetar todo o sistema. Certifique-se de que você entende as consequências antes de fazer qualquer modificação.
            </p>
          </div>
        </div>
      </div>

      {/* Planilha Completa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Planilha Completa do Sistema</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <FileSpreadsheet className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Planilha Mestra Abmix</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            A planilha mestra contém todos os dados do sistema, incluindo:
          </p>
          
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4">
            <li>Propostas e status</li>
            <li>Dados de clientes</li>
            <li>Performance de vendedores</li>
            <li>Análises financeiras</li>
            <li>Métricas de conversão</li>
            <li>Relatórios gerenciais</li>
          </ul>
          
          <div className="flex justify-center">
            <button 
              onClick={() => window.open('https://docs.google.com/spreadsheets/d/1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '_blank')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Acessar Planilha Completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSheetsIntegration = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Integração com Google Sheets</h1>
        <p className="text-blue-100">Configure a sincronização de dados com planilhas do Google</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Planilhas Conectadas</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Sincronização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileSpreadsheet className="w-5 h-5 text-blue-500 mr-2" />
                    <div className="text-sm font-medium text-gray-900">Planilha Mestra</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Completa</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Tempo Real</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Há 5 minutos</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileSpreadsheet className="w-5 h-5 text-blue-500 mr-2" />
                    <div className="text-sm font-medium text-gray-900">Relatório Vendas</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Vendas</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Diária</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Hoje, 08:00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileSpreadsheet className="w-5 h-5 text-blue-500 mr-2" />
                    <div className="text-sm font-medium text-gray-900">Dashboard Financeiro</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Financeiro</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Semanal</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Segunda, 10:00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Adicionar Nova Integração</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Planilha</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Relatório Mensal"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Planilha</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Dados</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione o tipo</option>
                <option value="completa">Dados Completos</option>
                <option value="vendas">Apenas Vendas</option>
                <option value="clientes">Apenas Clientes</option>
                <option value="financeiro">Dados Financeiros</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequência de Sincronização</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione a frequência</option>
                <option value="realtime">Tempo Real</option>
                <option value="hourly">A cada hora</option>
                <option value="daily">Diária</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="button"
              onClick={() => showNotification('Nova integração configurada com sucesso!', 'success')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Adicionar Integração
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderMakeIntegration = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Integração com Make</h1>
        <p className="text-purple-100">Configure automações e integrações com sistemas externos</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cenários Ativos</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Execuções</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Execução</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-2" />
                    <div className="text-sm font-medium text-gray-900">Notificação WhatsApp</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Webhook</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">1,245</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Há 10 minutos</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-2" />
                    <div className="text-sm font-medium text-gray-900">Sincronização CRM</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Agendado</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">458</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Hoje, 08:00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-500 mr-2" />
                    <div className="text-sm font-medium text-gray-900">Gerador de PDF</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Webhook</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">89</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Ontem, 15:30</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Manutenção
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuração de Webhook</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-2">URL do Webhook</h3>
          <div className="flex items-center">
            <input
              type="text"
              value="https://hook.make.com/abmix/12345678901234567890"
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText("https://hook.make.com/abmix/12345678901234567890");
                showNotification('URL copiada para a área de transferência!', 'success');
              }}
              className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Copiar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use esta URL no Make para receber eventos do sistema Abmix.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eventos Ativos</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="event-proposal" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                <label htmlFor="event-proposal" className="ml-2 text-sm text-gray-700">Criação de Proposta</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="event-client" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                <label htmlFor="event-client" className="ml-2 text-sm text-gray-700">Cadastro de Cliente</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="event-validation" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                <label htmlFor="event-validation" className="ml-2 text-sm text-gray-700">Validação de Proposta</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="event-document" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                <label htmlFor="event-document" className="ml-2 text-sm text-gray-700">Upload de Documento</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="event-status" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                <label htmlFor="event-status" className="ml-2 text-sm text-gray-700">Mudança de Status</label>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="button"
              onClick={() => showNotification('Configurações de webhook salvas com sucesso!', 'success')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabaseConfig = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Configuração do Banco de Dados</h1>
        <p className="text-red-100">Gerencie conexões e configurações do banco de dados</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status do Banco de Dados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-2">Conexões Ativas</h3>
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-xs text-gray-500 mt-1">Máximo: 100</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-2">Uso de Armazenamento</h3>
            <p className="text-2xl font-bold text-green-600">2.4 GB</p>
            <p className="text-xs text-gray-500 mt-1">Limite: 10 GB</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-2">Último Backup</h3>
            <p className="text-2xl font-bold text-purple-600">Hoje, 04:00</p>
            <p className="text-xs text-gray-500 mt-1">Automático: Diário</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => showNotification('Iniciando backup manual...', 'info')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Backup Manual
          </button>
          
          <button
            onClick={() => showNotification('Otimizando banco de dados...', 'info')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Otimizar DB
          </button>
          
          <button
            onClick={() => showNotification('Verificando integridade...', 'info')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Verificar Integridade
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações de Backup</h2>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequência de Backup</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="daily">Diário</option>
                <option value="hourly">A cada hora</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário do Backup</label>
              <input
                type="time"
                defaultValue="04:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retenção de Backups</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="7">7 dias</option>
              <option value="14">14 dias</option>
              <option value="30" selected>30 dias</option>
              <option value="90">90 dias</option>
              <option value="365">365 dias</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Local de Armazenamento</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="storage-local" className="rounded border-gray-300 text-red-600 focus:ring-red-500" defaultChecked />
                <label htmlFor="storage-local" className="ml-2 text-sm text-gray-700">Armazenamento Local</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="storage-cloud" className="rounded border-gray-300 text-red-600 focus:ring-red-500" defaultChecked />
                <label htmlFor="storage-cloud" className="ml-2 text-sm text-gray-700">Google Drive</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="storage-s3" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <label htmlFor="storage-s3" className="ml-2 text-sm text-gray-700">Amazon S3</label>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="button"
              onClick={() => showNotification('Configurações de backup salvas com sucesso!', 'success')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Gerenciamento de Usuários</h1>
        <p className="text-orange-100">Administre usuários e permissões do sistema</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Usuários do Sistema</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos os Perfis</option>
              <option value="vendor">Vendedores</option>
              <option value="financial">Financeiro</option>
              <option value="implantacao">Implantação</option>
              <option value="supervisor">Supervisores</option>
              <option value="admin">Administradores</option>
            </select>
            
            <button
              onClick={() => showNotification('Adicionando novo usuário...', 'info')}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Adicionar Usuário
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acesso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Felipe Abmix</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">felipe@abmix.com.br</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Administrador
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Agora</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Ana Caroline</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">ana@abmix.com.br</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Vendedor
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Hoje, 10:45</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Carlos Silva</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">carlos@abmix.com.br</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    Financeiro
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Ontem, 16:20</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Bruna Garcia</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">bruna@abmix.com.br</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Implantação
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Hoje, 09:15</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsConfig = () => (
    <IntegrationGuide />
  );

  const renderContent = () => {
    switch (activeView) {
      case 'sheets':
        return renderSheetsIntegration();
      case 'make':
        return renderMakeIntegration();
      case 'database':
        return renderDatabaseConfig();
      case 'users':
        return renderUsersManagement();
      case 'integrations':
        return renderIntegrationsConfig();
      default:
        return renderDashboard();
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
                <AbmixLogo size={40} className="mr-3" />
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mr-3">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Área Restrita</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* Navigation */}
                {activeView !== 'dashboard' && (
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Dashboard
                  </button>
                )}
              </div>
              
              <button 
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <NotificationCenter 
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClose={() => setShowNotifications(false)}
                />
              )}
              
              <span className="text-sm text-gray-600">Olá, {user.name}</span>

              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
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
        {activeView === 'dashboard' && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Área Restrita</h1>
                <p className="text-gray-600">Configurações avançadas e integrações do sistema</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="quarter">Este Trimestre</option>
                  <option value="year">Este Ano</option>
                </select>
                <button
                  onClick={exportData}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
                </button>
              </div>
            </div>
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  );
};

export default RestrictedAreaPortal;