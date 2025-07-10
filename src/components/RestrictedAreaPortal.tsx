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
      
      {/* Tabs de navegação */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveIntegration('guide')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeIntegration === 'guide'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Info className="w-4 h-4 mr-2" />
              Guia Geral
            </button>
            <button
              onClick={() => setActiveIntegration('google-drive')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeIntegration === 'google-drive'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Google Drive
            </button>
            <button
              onClick={() => setActiveIntegration('sheets')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeIntegration === 'sheets'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Google Sheets
            </button>
            <button
              onClick={() => setActiveIntegration('make')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeIntegration === 'make'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Make (Integromat)
            </button>
          </nav>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">Integração com Google Drive</h1>
        <p className="text-yellow-100">Configure a integração para armazenar dados dos clientes</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status da Integração</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Google Drive</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                driveStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {driveStatus.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Última sincronização:</span>
                <span className="font-medium">{driveStatus.lastSync}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de arquivos:</span>
                <span className="font-medium">{driveStatus.totalFiles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Planilhas:</span>
                <span className="font-medium">{driveStatus.totalSheets}</span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-3">
              <button 
                onClick={connectGoogleDrive}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  driveStatus.connected 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={driveStatus.connected}
              >
                {driveStatus.connected ? 'Conectado' : 'Conectar'}
              </button>
              
              <button 
                onClick={syncGoogleDrive}
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={!driveStatus.connected}
              >
                Sincronizar Agora
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Configurações</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID da Pasta Principal
                </label>
                <input
                  type="text"
                  value={GOOGLE_DRIVE_CONFIG.clientId}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID da Planilha Principal
                </label>
                <input
                  type="text"
                  value={GOOGLE_DRIVE_CONFIG.spreadsheetId}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Criar pasta por cliente</span>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" id="toggle-folder" className="sr-only" defaultChecked />
                  <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sincronização automática</span>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" id="toggle-sync" className="sr-only" defaultChecked />
                  <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Estrutura de Armazenamento</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Organização de Pastas</h3>
          
          <div className="space-y-2 pl-4 border-l-2 border-gray-300">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium">Abmix - Propostas (Pasta Raiz)</span>
            </div>
            
            <div className="space-y-2 pl-4 border-l-2 border-gray-300">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm">Clientes</span>
              </div>
              
              <div className="space-y-2 pl-4 border-l-2 border-gray-300">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm">[ID do Cliente] - [Nome do Cliente]</span>
                </div>
                
                <div className="space-y-1 pl-4 border-l-2 border-gray-300">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm">Documentos Pessoais</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">Documentos da Empresa</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm">Contratos</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm">Planilha de Clientes.xlsx</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-3">Estrutura da Planilha</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">ID Cliente</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Nome</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">CPF</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Telefone</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Empresa</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Plano</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Data Envio</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-blue-800">Pasta Drive</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-100">
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-500">CLIENT-123456</td>
                  <td className="px-3 py-2 text-xs text-gray-500">João Silva</td>
                  <td className="px-3 py-2 text-xs text-gray-500">123.456.789-00</td>
                  <td className="px-3 py-2 text-xs text-gray-500">joao@email.com</td>
                  <td className="px-3 py-2 text-xs text-gray-500">(11) 99999-9999</td>
                  <td className="px-3 py-2 text-xs text-gray-500">Empresa ABC</td>
                  <td className="px-3 py-2 text-xs text-gray-500">Plano Empresarial</td>
                  <td className="px-3 py-2 text-xs text-gray-500">15/05/2024</td>
                  <td className="px-3 py-2 text-xs text-blue-500 underline">Link</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {activeIntegration === 'guide' && <IntegrationGuide />}
      {activeIntegration === 'google-drive' && <GoogleDriveSetup />}
    </div>
  );
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Configurações do Sistema</h1>
        <p className="text-gray-300">Configurações avançadas e personalizações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Modo de Manutenção</span>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" id="toggle-maintenance" className="sr-only" />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Logs de Auditoria</span>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" id="toggle-audit" className="sr-only" defaultChecked />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backup Automático</span>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" id="toggle-backup" className="sr-only" defaultChecked />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Autenticação em 2 Fatores</span>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" id="toggle-2fa" className="sr-only" defaultChecked />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bloqueio após 5 tentativas</span>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" id="toggle-lockout" className="sr-only" defaultChecked />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expiração de Senha (90 dias)</span>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" id="toggle-expiration" className="sr-only" />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Gerenciamento de Usuários</h1>
        <p className="text-blue-200">Administre usuários e permissões do sistema</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Usuários do Sistema</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Adicionar Usuário
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 1, name: 'Felipe Abmix', email: 'felipe@abmix.com.br', role: 'Administrador', status: 'Ativo', lastLogin: '2024-05-15 14:30' },
                { id: 2, name: 'Ana Caroline', email: 'ana@abmix.com.br', role: 'Vendedor', status: 'Ativo', lastLogin: '2024-05-15 10:15' },
                { id: 3, name: 'Carlos Silva', email: 'carlos@abmix.com.br', role: 'Financeiro', status: 'Ativo', lastLogin: '2024-05-14 16:45' },
                { id: 4, name: 'Bruna Garcia', email: 'bruna@abmix.com.br', role: 'Implantação', status: 'Ativo', lastLogin: '2024-05-14 09:20' },
                { id: 5, name: 'Diana Santos', email: 'diana@abmix.com.br', role: 'Supervisor', status: 'Inativo', lastLogin: '2024-05-10 11:30' },
              ].map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                     <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                       <Settings className="w-4 h-4" />
                     </button>
                     <button className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors">
                       <Mail className="w-4 h-4" />
                     </button>
                     <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                       <Link className="w-4 h-4" />
                     </button>
                     <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                       </svg>
                     </button>
                     <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                    </div>
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
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Área Restrita - Administração</h1>
        <p className="text-gray-300">Acesso exclusivo para administradores do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Usuários</h3>
                <p className="text-sm text-gray-500">Gerenciamento de contas</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">12</span>
          </div>
          <button 
            onClick={() => setActiveView('users')}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Gerenciar Usuários
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Integrações</h3>
                <p className="text-sm text-gray-500">APIs e webhooks</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">5</span>
          </div>
          <button 
            onClick={() => setActiveView('integrations')}
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Configurar Integrações
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Configurações</h3>
                <p className="text-sm text-gray-500">Parâmetros do sistema</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">18</span>
          </div>
          <button 
            onClick={() => setActiveView('settings')}
            className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Ajustar Configurações
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade do Sistema</h2>
        
        <div className="space-y-4">
          {[
            { time: '15:30:25', type: 'user', message: 'Felipe Abmix fez login no sistema' },
            { time: '15:28:12', type: 'backup', message: 'Backup automático iniciado' },
            { time: '15:25:45', type: 'integration', message: 'Sincronização com Google Sheets concluída' },
            { time: '15:22:33', type: 'security', message: 'Tentativa de login inválida para usuário diana@abmix.com.br' },
            { time: '15:20:18', type: 'database', message: 'Otimização de banco de dados concluída' },
            { time: '15:18:07', type: 'user', message: 'Ana Caroline criou uma nova proposta' },
            { time: '15:15:52', type: 'email', message: 'Envio de emails em lote concluído' },
            { time: '15:12:39', type: 'system', message: 'Sistema reiniciado após atualização' },
          ].map((log, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 font-mono w-16">
                {log.time}
              </div>
              <div className={`w-2 h-2 rounded-full ${
                log.type === 'user' ? 'bg-blue-500' :
                log.type === 'backup' ? 'bg-green-500' :
                log.type === 'integration' ? 'bg-purple-500' :
                log.type === 'security' ? 'bg-red-500' :
                log.type === 'database' ? 'bg-yellow-500' :
                log.type === 'email' ? 'bg-indigo-500' : 'bg-gray-500'
              }`}></div>
              <div className="flex-1 text-sm text-gray-700">
                {log.message}
              </div>
            </div>
          ))}
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
              {activeView !== 'dashboard' && (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
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
        {activeView === 'dashboard' && renderDashboardView()}
        {activeView === 'integrations' && renderIntegrationsView()}
        {activeView === 'settings' && renderSettingsView()}
        {activeView === 'users' && renderUsersView()}
      </main>
    </div>
  );
};

export default RestrictedAreaPortal;
      </main>
    </div>
  );
};

export default RestrictedAreaPortal;