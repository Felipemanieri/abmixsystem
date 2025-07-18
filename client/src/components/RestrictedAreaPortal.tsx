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
  FileText,
  BarChart3,
  Bot,
  Link,
  Shield,
  Monitor,
  CheckCircle,
  AlertTriangle,
  Layers,
  HardDrive,
  Wifi,
  Calendar,
  DollarSign,
  Crown,
  Paperclip,
  Search,
  Filter,
  Download,
  Upload,
  Tag,
  Image,
  FileImage,
  FileSpreadsheet,
  Clock,
  RefreshCw,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  X,
  Folder,
  FileCheck,
  Sun,
  Moon,
  Play,
  Pause,
  Code,
  RotateCw,
  Info,
  ChevronDown,
  ChevronUp,
  Archive,
  MessageSquare,
  Webhook,
  Copy,
  Bell,
  Mail,
  Phone,
  CreditCard
} from 'lucide-react';
import GoogleDriveSetup from './GoogleDriveSetup';
import IntegrationGuide from './IntegrationGuide';
import UserManagementDashboard from './UserManagementDashboard';
import SystemFooter from './SystemFooter';

import UnifiedUserManagement from './UnifiedUserManagement';
import PlanilhaViewer from './PlanilhaViewer';
import LogsViewer from './LogsViewer';
import InternalMessage from './InternalMessage';

import BackupManager from './BackupManager';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RestrictedAreaPortalProps {
  onLogout: () => void;
}

export default function RestrictedAreaPortal({ onLogout }: RestrictedAreaPortalProps) {
  const [activeTab, setActiveTab] = useState('interface');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
  }>>([]);

  const [savedConfigs, setSavedConfigs] = useState({
    drive: [] as any[],
    sheets: [] as any[],
    integrations: [] as any[]
  });

  const [showDriveConfigModal, setShowDriveConfigModal] = useState(false);
  const [showSheetsConfigModal, setShowSheetsConfigModal] = useState(false);
  const [showWhatsAppConfigModal, setShowWhatsAppConfigModal] = useState(false);

  const tabs = [
    { id: 'interface', label: 'Interface', icon: Monitor },
    { id: 'usuarios', label: 'Gestão Usuários', icon: Users },
    { id: 'senhas', label: 'Controle Senhas', icon: Lock },
    { id: 'planilha', label: 'Visualizar Planilha', icon: FileSpreadsheet },
    { id: 'logs', label: 'Logs Sistema', icon: FileText },
    { id: 'automacao', label: 'Automação', icon: Bot },
    { id: 'integracoes', label: 'Integrações', icon: Link },
    { id: 'planilhas', label: 'Config Planilhas', icon: BarChart3 },
    { id: 'gdrive', label: 'Google Drive', icon: HardDrive },
    { id: 'backup', label: 'Backup & Restore', icon: Archive },
    { id: 'sistema', label: 'Sistema', icon: Settings },
    { id: 'tempo', label: 'Configurações Tempo', icon: Clock },
  ];

  const showNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  // Função para renderizar a seção de configurações de tempo
  function renderTempoSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Tempo de Atualização</h3>
            </div>
            <button
              onClick={() => showNotification('Sistema', 'Todas as atualizações foram desabilitadas temporariamente!', 'info')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Desabilitar Tudo
            </button>
          </div>

          {/* Sincronização Tempo Real */}
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <RefreshCw className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Sincronização em Tempo Real</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-medium text-green-800 dark:text-green-200">Tempo Real</h5>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">Atualizações instantâneas</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 dark:text-green-400">Status: Ativo</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderAutomacaoSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Automação</h3>
            </div>
            <button
              onClick={() => showNotification('Automação', 'Todas as automações foram reiniciadas!', 'success')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reiniciar Automações
            </button>
          </div>

          {/* Automação de Propostas */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Automação de Propostas</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Geração Automática de Links</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="enabled">Habilitado (atual)</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Notificações Automáticas</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="enabled">Habilitado (atual)</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Automação de Documentos */}
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Automação de Documentos</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Organização Google Drive</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                  <option value="enabled">Habilitado (atual)</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Validação de Documentos</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                  <option value="enabled">Habilitado (atual)</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Automação de Status */}
          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <RefreshCw className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Automação de Status</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Mudança Automática de Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                  <option value="enabled">Habilitado (atual)</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Alertas de Prazos</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                  <option value="enabled">Habilitado (atual)</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logs de Automação */}
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Logs de Automação</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Geração de link automática executada</span>
                <span className="text-xs text-green-600 dark:text-green-400">2 min atrás</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Organização de documentos concluída</span>
                <span className="text-xs text-blue-600 dark:text-blue-400">5 min atrás</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Validação automática de proposta</span>
                <span className="text-xs text-purple-600 dark:text-purple-400">10 min atrás</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderIntegracoesSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Integrações Externas</h3>
            </div>
            <button
              onClick={() => showNotification('Integração', 'Todas as integrações foram sincronizadas!', 'success')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sincronizar Todas
            </button>
          </div>

          {/* Google Services */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Serviços Google</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Google Drive</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="connected">Conectado</option>
                    <option value="disconnected">Desconectado</option>
                  </select>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Google Sheets</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="connected">Conectado</option>
                    <option value="disconnected">Desconectado</option>
                  </select>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Google Forms</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="connected">Conectado</option>
                    <option value="disconnected">Desconectado</option>
                  </select>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Webhooks e APIs */}
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Webhook className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Webhooks e APIs</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Make.com Webhooks</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                  <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Testar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">APIs Terceiros</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                  <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comunicação */}
          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Comunicação</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">WhatsApp API</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                    <option value="connected">Conectado</option>
                    <option value="disconnected">Desconectado</option>
                  </select>
                  <button className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email SMTP</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                    <option value="connected">Conectado</option>
                    <option value="disconnected">Desconectado</option>
                  </select>
                  <button className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">SMS Gateway</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                    <option value="connected">Conectado</option>
                    <option value="disconnected">Desconectado</option>
                  </select>
                  <button className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status das Integrações */}
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Status das Integrações</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Google Drive API</span>
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Conectado</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Google Sheets API</span>
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Conectado</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Make.com Webhooks</span>
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Ativo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">WhatsApp API</span>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">Configurando</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderPlanilhasSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Planilhas</h3>
            </div>
            <button
              onClick={() => showNotification('Planilhas', 'Todas as planilhas foram sincronizadas!', 'success')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sincronizar Planilhas
            </button>
          </div>

          {/* Planilhas Principais */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Planilhas Principais</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Planilha 1 - Propostas</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                  </select>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Planilha 2 - Clientes</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                  </select>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Planilha 3 - Relatórios</label>
                <div className="flex items-center space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                  </select>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Campos */}
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Edit className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Configurações de Campos</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Campos Obrigatórios</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Nome da Empresa</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">CNPJ</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Plano</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Vendedor</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Campos Opcionais</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Observações</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Desconto</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Data de Vigência</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Prioridade</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Estrutura da Planilha */}
          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Layers className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Estrutura da Planilha</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Tipo de Estrutura</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                  <option value="horizontal">Horizontal (atual)</option>
                  <option value="vertical">Vertical</option>
                  <option value="mixed">Mista</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Máximo de Titulares</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                  <option value="dynamic">Dinâmico (atual)</option>
                  <option value="3">3 fixos</option>
                  <option value="5">5 fixos</option>
                  <option value="10">10 fixos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Automação de Planilhas */}
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Automação de Planilhas</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Sincronização Automática</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Atualiza planilhas em tempo real</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Backup Automático</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cria backup diário das planilhas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Validação de Dados</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Verifica integridade dos dados</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portal Restrito</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aba Interface */}
        {activeTab === 'interface' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações da Interface</h3>
              <p className="text-gray-600 dark:text-gray-400">Personalize a aparência do sistema</p>
            </div>
          </div>
        )}

        {/* Aba Gestão Usuários */}
        {activeTab === 'usuarios' && <UserManagementDashboard onClose={() => setActiveTab('interface')} />}

        {/* Aba Controle Senhas */}
        {activeTab === 'senhas' && <UnifiedUserManagement />}

        {/* Aba Visualizar Planilha */}
        {activeTab === 'planilha' && <PlanilhaViewer />}

        {/* Aba Logs Sistema */}
        {activeTab === 'logs' && <LogsViewer />}

        {/* Aba Automação */}
        {activeTab === 'automacao' && renderAutomacaoSection()}

        {/* Aba Integrações */}
        {activeTab === 'integracoes' && renderIntegracoesSection()}

        {/* Aba Config Planilhas */}
        {activeTab === 'planilhas' && renderPlanilhasSection()}

        {/* Aba Google Drive */}
        {activeTab === 'gdrive' && <GoogleDriveSetup />}

        {/* Aba Backup & Restore */}
        {activeTab === 'backup' && <BackupManager />}

        {/* Aba Sistema */}
        {activeTab === 'sistema' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações do Sistema</h3>
              <p className="text-gray-600 dark:text-gray-400">Configurações gerais do sistema</p>
            </div>
          </div>
        )}

        {/* Aba Configurações Tempo */}
        {activeTab === 'tempo' && renderTempoSection()}
      </main>

      {/* System Footer */}
      <SystemFooter />
    </div>
  );
}