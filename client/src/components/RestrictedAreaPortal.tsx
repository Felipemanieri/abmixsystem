import React, { useState } from 'react';
import { LogOut, Settings, Users, FileText, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Download, Calendar, Filter, Search, Bell, MessageSquare, Lock, Database, Shield, Zap, Home, Mail, Link, Trash2 } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import IntegrationGuide from './IntegrationGuide';
import GoogleDriveSetup from './GoogleDriveSetup';

// Configurações do Google Drive
const GOOGLE_DRIVE_CONFIG = {
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  apiKey: 'YOUR_API_KEY',
  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  scopes: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets',
};

interface RestrictedAreaPortalProps {
  user: any;
  onLogout: () => void;
}

type RestrictedView = 'dashboard' | 'integrations' | 'settings' | 'users';

// Adicionar novo tipo para visualizações específicas de integração
type IntegrationView = 'guide' | 'google-drive' | 'make' | 'sheets';

interface DriveIntegrationStatus {
  connected: boolean;
  lastSync: string;
  totalFiles: number;
  totalSheets: number;
}

const RestrictedAreaPortal: React.FC<RestrictedAreaPortalProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<RestrictedView>('dashboard');
  const [activeIntegration, setActiveIntegration] = useState<IntegrationView>('guide');
  const [driveStatus, setDriveStatus] = useState<DriveIntegrationStatus>({
    connected: true,
    lastSync: '2024-05-15 15:30:25',
    totalFiles: 156,
    totalSheets: 8
  });

  // Simular conexão com o Google Drive
  const connectGoogleDrive = () => {
    // Em um ambiente real, aqui você abriria a janela de autenticação do Google
    alert('Em um ambiente de produção, isso abriria a janela de autenticação do Google para autorizar o acesso ao Drive e Sheets.');
    
    // Simular conexão bem-sucedida
    setDriveStatus({
      connected: true,
      lastSync: new Date().toLocaleString(),
      totalFiles: 156,
      totalSheets: 8
    });
  };

  // Simular sincronização com o Google Drive
  const syncGoogleDrive = () => {
    alert('Sincronizando dados com o Google Drive...');
    
    // Simular sincronização bem-sucedida
    setTimeout(() => {
      setDriveStatus({
        ...driveStatus,
        lastSync: new Date().toLocaleString(),
        totalFiles: driveStatus.totalFiles + Math.floor(Math.random() * 5)
      });
      alert('Sincronização concluída com sucesso!');
    }, 2000);
  };

  const renderIntegrationsView = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Integrações</h1>
        <p className="text-purple-200">Configure integrações com serviços externos</p>
      </div>
      
      {/* Navigation tabs for integrations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'guide', label: 'Guia de Integração', icon: FileText },
              { id: 'google-drive', label: 'Google Drive', icon: Database },
              { id: 'make', label: 'Make.com', icon: Zap },
              { id: 'sheets', label: 'Google Sheets', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveIntegration(tab.id as IntegrationView)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeIntegration === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {activeIntegration === 'guide' && <IntegrationGuide />}
          {activeIntegration === 'google-drive' && <GoogleDriveSetup />}
          {activeIntegration === 'make' && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Integração Make.com</h3>
              <p className="text-gray-500">Configure automações avançadas com Make.com</p>
              <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Configurar Make.com
              </button>
            </div>
          )}
          {activeIntegration === 'sheets' && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Google Sheets</h3>
              <p className="text-gray-500">Sincronize dados com planilhas do Google</p>
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Conectar Sheets
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Configurações</h1>
        <p className="text-blue-200">Gerencie as configurações do sistema</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Configurações Gerais</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="Abmix" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
              <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="contato@abmix.com" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Segurança</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Autenticação 2FA</span>
              <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Ativo
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Backup Automático</span>
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                Diário
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Usuários</h1>
        <p className="text-green-200">Gerencie usuários e permissões</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lista de Usuários</h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Adicionar Usuário</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'João Silva', email: 'joao@abmix.com', role: 'Administrador', status: 'Ativo' },
                { name: 'Maria Santos', email: 'maria@abmix.com', role: 'Supervisor', status: 'Ativo' },
                { name: 'Pedro Costa', email: 'pedro@abmix.com', role: 'Vendedor', status: 'Inativo' }
              ].map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                    <button className="text-red-600 hover:text-red-900">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDashboardView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-indigo-200">Visão geral do sistema e métricas importantes</p>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total de Usuários', value: '1,234', icon: Users, color: 'blue', change: '+12%' },
          { title: 'Propostas Ativas', value: '89', icon: FileText, color: 'green', change: '+5%' },
          { title: 'Receita Mensal', value: 'R$ 45.2K', icon: DollarSign, color: 'purple', change: '+18%' },
          { title: 'Taxa de Conversão', value: '68%', icon: TrendingUp, color: 'orange', change: '+3%' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-600 text-sm font-medium">{metric.change}</span>
                <span className="text-gray-500 text-sm ml-2">vs mês anterior</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Atividades Recentes</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'Nova proposta criada', user: 'João Silva', time: '2 min atrás', type: 'success' },
                { action: 'Usuário aprovado', user: 'Maria Santos', time: '15 min atrás', type: 'info' },
                { action: 'Documento enviado', user: 'Pedro Costa', time: '1h atrás', type: 'warning' },
                { action: 'Pagamento processado', user: 'Ana Lima', time: '2h atrás', type: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span>Mensagens Recentes</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { message: 'Preciso de ajuda com a integração', sender: 'Cliente ABC', time: '5 min atrás' },
                { message: 'Proposta aprovada, quando começamos?', sender: 'Empresa XYZ', time: '20 min atrás' },
                { message: 'Documentos enviados para análise', sender: 'Fornecedor 123', time: '45 min atrás' },
                { message: 'Reunião agendada para amanhã', sender: 'Equipe Interna', time: '1h atrás' }
              ].map((msg, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <p className="text-sm text-gray-900">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{msg.sender} • {msg.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <AbmixLogo className="h-8 w-auto" />
              <nav className="hidden md:flex space-x-8">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Home },
                  { id: 'integrations', label: 'Integrações', icon: Link },
                  { id: 'settings', label: 'Configurações', icon: Settings },
                  { id: 'users', label: 'Usuários', icon: Users }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id as RestrictedView)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                        activeView === item.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrador'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@abmix.com'}</p>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && renderDashboardView()}
        {activeView === 'integrations' && renderIntegrationsView()}
        {activeView === 'settings' && renderSettingsView()}
        {activeView === 'users' && renderUsersView()}
      </main>
    </div>
  );
};

export default RestrictedAreaPortal;