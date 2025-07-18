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
import SimpleUserManagement from './SimpleUserManagement';
import SystemFooter from './SystemFooter';

import SimplePasswordManagement from './SimplePasswordManagement';
import PlanilhaViewer from './PlanilhaViewer';
import LogsViewer from './LogsViewer';
import InternalMessage from './InternalMessage';
import NotificationCenter from './NotificationCenter';

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
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Automação</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Em desenvolvimento</p>
        </div>
      </div>
    );
  }

  function renderIntegracoesSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Link className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Integrações</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Em desenvolvimento</p>
        </div>
      </div>
    );
  }

  function renderPlanilhasSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Config Planilhas</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Em desenvolvimento</p>
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
              <NotificationCenter notifications={notifications} />
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
        {activeTab === 'usuarios' && <SimpleUserManagement />}

        {/* Aba Controle Senhas */}
        {activeTab === 'senhas' && <SimplePasswordManagement />}

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