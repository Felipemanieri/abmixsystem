import { useState, useEffect } from 'react';
import { 
  Settings, 
  LogOut, 
  Lock, 
  Users, 
  Eye, 
  EyeOff,
  Save,
  RotateCcw,
  Zap,
  Database,
  Cloud,
  Globe,
  Bot,
  Workflow,
  Shield,
  Cog,
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
  Calendar,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Activity,
  Server,
  Link,
  Key,
  Monitor,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface RestrictedAreaPortalProps {
  user: User;
  onLogout: () => void;
}

export default function RestrictedAreaPortal({ user, onLogout }: RestrictedAreaPortalProps) {
  const [activeSection, setActiveSection] = useState('interface');
  const [showClientPortal, setShowClientPortal] = useState(() => {
    return localStorage.getItem('showClientPortal') !== 'false';
  });

  // Estados para automação
  const [automationRules, setAutomationRules] = useState([
    { id: '1', name: 'Auto-envio para Google Drive', status: 'active', trigger: 'Nova proposta', action: 'Upload automático', lastRun: '2 min atrás' },
    { id: '2', name: 'Notificação WhatsApp vendedor', status: 'active', trigger: 'Cliente completa', action: 'Enviar mensagem', lastRun: '5 min atrás' },
    { id: '3', name: 'Sync Google Sheets', status: 'active', trigger: 'Status alterado', action: 'Atualizar planilha', lastRun: '1 min atrás' },
    { id: '4', name: 'Email automático financeiro', status: 'inactive', trigger: 'Proposta aprovada', action: 'Enviar relatório', lastRun: '1h atrás' }
  ]);

  // Estados para integrações
  const [integrations, setIntegrations] = useState([
    { id: '1', name: 'Google Drive', status: 'connected', type: 'cloud', lastSync: '2 min atrás' },
    { id: '2', name: 'Google Sheets', status: 'connected', type: 'spreadsheet', lastSync: '1 min atrás' },
    { id: '3', name: 'WhatsApp Business', status: 'connected', type: 'messaging', lastSync: '5 min atrás' },
    { id: '4', name: 'SendGrid Email', status: 'disconnected', type: 'email', lastSync: '2h atrás' },
    { id: '5', name: 'Make (Integromat)', status: 'connected', type: 'automation', lastSync: '3 min atrás' }
  ]);

  // Estados para controles manuais
  const [vendors, setVendors] = useState([
    { id: 1, name: 'Ana Caroline Terto', email: 'comercial14@abmix.com.br', status: 'active', proposals: 15 },
    { id: 2, name: 'Bruna Garcia', email: 'comercial10@abmix.com.br', status: 'active', proposals: 12 },
    { id: 3, name: 'Fabiana Ferreira', email: 'comercial17@abmix.com.br', status: 'active', proposals: 8 }
  ]);

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    realTimeSync: true,
    notifications: true,
    maintenanceMode: false,
    debugMode: false
  });

  const handleToggleClientPortal = () => {
    const newValue = !showClientPortal;
    setShowClientPortal(newValue);
    localStorage.setItem('showClientPortal', newValue.toString());
    window.location.reload();
  };

  const resetToDefault = () => {
    setShowClientPortal(true);
    localStorage.removeItem('showClientPortal');
    window.location.reload();
  };

  const toggleAutomation = (id: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' } : rule
    ));
  };

  const reconnectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id ? { ...integration, status: 'connected', lastSync: 'Agora' } : integration
    ));
  };

  const menuItems = [
    { id: 'interface', label: 'Interface', icon: Eye },
    { id: 'automation', label: 'Automações', icon: Bot },
    { id: 'integrations', label: 'Integrações', icon: Link },
    { id: 'vendors', label: 'Vendedores', icon: Users },
    { id: 'system', label: 'Sistema', icon: Server },
    { id: 'monitoring', label: 'Monitoramento', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Lock className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Área Restrita</h1>
              <p className="text-sm text-gray-500">Administração</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-red-50 text-red-700 border-l-4 border-red-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">Administrador</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeSection)?.label}
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeSection === 'interface' && 'Configurações de interface do sistema'}
                  {activeSection === 'automation' && 'Gerenciar regras e fluxos automáticos'}
                  {activeSection === 'integrations' && 'Configurar conexões externas'}
                  {activeSection === 'vendors' && 'Gerenciar equipe de vendedores'}
                  {activeSection === 'system' && 'Configurações gerais do sistema'}
                  {activeSection === 'monitoring' && 'Monitorar desempenho e logs'}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Renderizar seção ativa */}
          {activeSection === 'interface' && renderInterfaceSection()}
          {activeSection === 'automation' && renderAutomationSection()}
          {activeSection === 'integrations' && renderIntegrationsSection()}
          {activeSection === 'vendors' && renderVendorsSection()}
          {activeSection === 'system' && renderSystemSection()}
          {activeSection === 'monitoring' && renderMonitoringSection()}
        </main>
      </div>
    </div>
  );

  function renderInterfaceSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Eye className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Configurações de Interface</h3>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Portal do Cliente</span>
                </div>
                <div className="flex items-center space-x-2">
                  {showClientPortal ? (
                    <>
                      <Eye className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Visível</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Oculto</span>
                    </>
                  )}
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showClientPortal}
                  onChange={handleToggleClientPortal}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {showClientPortal 
                  ? 'O Portal do Cliente está visível na tela inicial para acesso direto.'
                  : 'O Portal do Cliente está oculto da tela inicial. Clientes ainda podem acessar via links diretos.'
                }
              </p>
              
              {!showClientPortal && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Nota:</strong> Clientes continuam acessando o sistema normalmente através dos links diretos das propostas.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 mt-6">
            <button
              onClick={resetToDefault}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderAutomationSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bot className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Regras de Automação</h3>
            </div>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Nova Regra
            </button>
          </div>

          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{rule.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rule.status === 'active' ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Gatilho:</span> {rule.trigger} → <span className="font-medium">Ação:</span> {rule.action}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Última execução: {rule.lastRun}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAutomation(rule.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.status === 'active' 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={rule.status === 'active' ? 'Pausar' : 'Ativar'}
                    >
                      {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderIntegrationsSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Integrações Externas</h3>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Nova Integração
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration.type === 'cloud' ? 'bg-blue-100' :
                      integration.type === 'spreadsheet' ? 'bg-green-100' :
                      integration.type === 'messaging' ? 'bg-purple-100' :
                      integration.type === 'email' ? 'bg-orange-100' :
                      'bg-gray-100'
                    }`}>
                      {integration.type === 'cloud' && <Cloud className="w-5 h-5 text-blue-600" />}
                      {integration.type === 'spreadsheet' && <Database className="w-5 h-5 text-green-600" />}
                      {integration.type === 'messaging' && <Bell className="w-5 h-5 text-purple-600" />}
                      {integration.type === 'email' && <Globe className="w-5 h-5 text-orange-600" />}
                      {integration.type === 'automation' && <Workflow className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-500">Última sync: {integration.lastSync}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${
                      integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className={`text-sm font-medium ${
                      integration.status === 'connected' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {integration.status === 'disconnected' && (
                    <button
                      onClick={() => reconnectIntegration(integration.id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Reconectar
                    </button>
                  )}
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                    Configurar
                  </button>
                  <button className="px-3 py-2 text-gray-500 hover:text-red-600 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderVendorsSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Gerenciar Vendedores</h3>
            </div>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Vendedor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nome</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Propostas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{vendor.name}</td>
                    <td className="py-3 px-4 text-gray-600">{vendor.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        vendor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {vendor.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{vendor.proposals}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Editar">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Remover">
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
  }

  function renderSystemSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Server className="w-6 h-6 text-gray-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Configurações do Sistema</h3>
          </div>

          <div className="space-y-6">
            {Object.entries(systemSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {key === 'autoBackup' && 'Backup Automático'}
                    {key === 'realTimeSync' && 'Sincronização em Tempo Real'}
                    {key === 'notifications' && 'Notificações'}
                    {key === 'maintenanceMode' && 'Modo Manutenção'}
                    {key === 'debugMode' && 'Modo Debug'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {key === 'autoBackup' && 'Backup automático dos dados do sistema'}
                    {key === 'realTimeSync' && 'Sincronização automática entre portais'}
                    {key === 'notifications' && 'Notificações push para usuários'}
                    {key === 'maintenanceMode' && 'Ativar modo de manutenção'}
                    {key === 'debugMode' && 'Ativar logs detalhados'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => setSystemSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderMonitoringSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 text-orange-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Monitoramento do Sistema</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Sistema Online</h4>
              <p className="text-sm text-gray-600">99.9% uptime</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Database</h4>
              <p className="text-sm text-gray-600">Conectado</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">APIs</h4>
              <p className="text-sm text-gray-600">Todas funcionando</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Logs Recentes</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
              <div className="text-sm">
                <span className="text-gray-500">[10:01:42]</span>
                <span className="text-green-600 mx-2">[INFO]</span>
                <span className="text-gray-700">Nova proposta criada por Ana Caroline Terto</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">[10:01:38]</span>
                <span className="text-blue-600 mx-2">[SYNC]</span>
                <span className="text-gray-700">Google Sheets atualizado com sucesso</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">[10:01:30]</span>
                <span className="text-purple-600 mx-2">[AUTO]</span>
                <span className="text-gray-700">Automação WhatsApp executada</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">[10:01:25]</span>
                <span className="text-green-600 mx-2">[INFO]</span>
                <span className="text-gray-700">Backup automático concluído</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}