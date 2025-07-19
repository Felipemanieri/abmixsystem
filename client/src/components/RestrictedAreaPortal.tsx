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
  Edit2,
  Trash2,
  X,
  Folder,
  FileCheck,
  Sun,
  Moon,
  Play,
  Pause,
  RotateCw,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  MessageSquare,
  Bell
} from 'lucide-react';
import GoogleDriveSetup from './GoogleDriveSetup';
import IntegrationGuide from './IntegrationGuide';
import UserManagementDashboard from './UserManagementDashboard';
import SystemFooter from './SystemFooter';

import UnifiedUserManagement from './UnifiedUserManagement';
import PlanilhaViewer from './PlanilhaViewer';
import LogsViewer from './LogsViewer';
import InternalMessage from './InternalMessage';
import NotificationCenter from './NotificationCenter';

import BackupManager from './BackupManager';

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
  const [activeTab, setActiveTab] = useState('interface');
  const [portalVisibility, setPortalVisibility] = useState({
    showClientPortal: true,
    showVendorPortal: true,
    showFinancialPortal: true,
    showImplementationPortal: true,
    showSupervisorPortal: true
  });

  // Carrega configurações globais dos portais
  useEffect(() => {
    const loadPortalVisibility = async () => {
      try {
        const response = await fetch('/api/portal-visibility');
        if (response.ok) {
          const data = await response.json();
          setPortalVisibility(data);
        }
      } catch (error) {
        console.error('Erro ao carregar visibilidade dos portais:', error);
      }
    };
    
    loadPortalVisibility();
  }, []);
  
  // Estados para modais
  const [showDriveConfigModal, setShowDriveConfigModal] = useState(false);
  const [showSheetsConfigModal, setShowSheetsConfigModal] = useState(false);
  const [showWhatsAppConfigModal, setShowWhatsAppConfigModal] = useState(false);
  const [showBackupConfigModal, setShowBackupConfigModal] = useState(false);
  const [showDriveManagementModal, setShowDriveManagementModal] = useState(false);
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [showEditDriveModal, setShowEditDriveModal] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Estado para notificações internas elegantes
  const [internalNotification, setInternalNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });
  
  // DESABILITAR TODAS AS NOTIFICAÇÕES DO RESTRICTED AREA PORTAL
  const [notifications, setNotifications] = useState([]);

  // Função para mostrar notificação interna elegante
  const showInternalNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setInternalNotification({
      show: true,
      message,
      type
    });
    
    // Auto-ocultar após 4 segundos
    setTimeout(() => {
      setInternalNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };
  
  // Estados para configurações de tempo - MOVIDOS PARA O NÍVEL PRINCIPAL
  const [timeConfigs, setTimeConfigs] = useState({
    googleDrive: { active: true, interval: '30s' },
    googleSheets: { active: true, interval: '1s' },
    googleForms: { active: true, interval: '10m' },
    googleDocs: { active: true, interval: '5m' },
    backupAuto: { active: true, interval: '24h' },
    apiRequests: { active: true, interval: '1s' }
  });
  
  const [allPaused, setAllPaused] = useState(false);
  
  useEffect(() => {
    // FORÇAR NOTIFICAÇÕES VAZIAS SEMPRE
    setNotifications([]);
    // Notificações removidas
  }, [user.name]);
  
  // Estados para configurações
  const [driveConfig, setDriveConfig] = useState({
    connected: true,
    folderStructure: 'Por Cliente',
    autoSync: true,
    backupFrequency: 'Diário'
  });
  
  const [sheetsConfig, setSheetsConfig] = useState({
    connected: true,
    sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    autoUpdate: true,
    syncFrequency: 'Tempo Real'
  });

  const savePortalVisibility = async (newVisibility: any) => {
    try {
      const response = await fetch('/api/portal-visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVisibility)
      });
      
      if (response.ok) {
        setPortalVisibility(newVisibility);
        
        // Múltiplas formas de notificar a mudança
        // 1. PostMessage para a janela principal
        window.parent.postMessage({ type: 'PORTAL_VISIBILITY_CHANGED' }, '*');
        
        // 2. PostMessage para todas as janelas abertas
        if (window.opener) {
          window.opener.postMessage({ type: 'PORTAL_VISIBILITY_CHANGED' }, '*');
        }
        
        // 3. Broadcast para todas as abas/janelas do mesmo domínio
        const bc = new BroadcastChannel('portal-changes');
        bc.postMessage({ type: 'PORTAL_VISIBILITY_CHANGED', data: newVisibility });
        
        // 4. Salvar no localStorage para detecção de mudanças
        localStorage.setItem('portal-visibility-timestamp', Date.now().toString());
        localStorage.setItem('portal-visibility', JSON.stringify(newVisibility));
        
        // 5. Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('portalVisibilityChanged', { 
          detail: newVisibility 
        }));
        
        // Notificação interna elegante
        showInternalNotification('Portal atualizado com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao salvar visibilidade dos portais:', error);
      showInternalNotification('Erro ao salvar configuração. Tente novamente.', 'error');
    }
  };

  const handleToggleClientPortal = () => {
    const newVisibility = {
      ...portalVisibility,
      showClientPortal: !portalVisibility.showClientPortal
    };
    savePortalVisibility(newVisibility);
  };

  const handleToggleVendorPortal = () => {
    const newVisibility = {
      ...portalVisibility,
      showVendorPortal: !portalVisibility.showVendorPortal
    };
    savePortalVisibility(newVisibility);
  };

  const handleToggleFinancialPortal = () => {
    const newVisibility = {
      ...portalVisibility,
      showFinancialPortal: !portalVisibility.showFinancialPortal
    };
    savePortalVisibility(newVisibility);
  };

  const handleToggleImplementationPortal = () => {
    const newVisibility = {
      ...portalVisibility,
      showImplementationPortal: !portalVisibility.showImplementationPortal
    };
    savePortalVisibility(newVisibility);
  };

  const handleToggleSupervisorPortal = () => {
    const newVisibility = {
      ...portalVisibility,
      showSupervisorPortal: !portalVisibility.showSupervisorPortal
    };
    savePortalVisibility(newVisibility);
  };

  const resetToDefault = () => {
    const defaultVisibility = {
      showClientPortal: true,
      showVendorPortal: true,
      showFinancialPortal: true,
      showImplementationPortal: true,
      showSupervisorPortal: true
    };
    savePortalVisibility(defaultVisibility);
  };

  // Estados para o sistema de anexos
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      nome: 'CNH João Silva.pdf',
      proposta: 'Soluções Tecnológicas Ltda',
      categoria: 'identificacao',
      tamanho: '1,95 MB',
      status: 'pendente',
      enviadoPor: 'cliente',
      data: '16/07/2025'
    },
    {
      id: 2,
      nome: 'Comprovante de Residência.pdf',
      proposta: 'Soluções Tecnológicas Ltda',
      categoria: 'comprovante',
      tamanho: '1000,75 KB',
      status: 'aprovado',
      enviadoPor: 'cliente',
      data: '16/07/2025'
    },
    {
      id: 3,
      nome: 'Contrato Plano Saúde.pdf',
      proposta: 'Consultoria Empresarial SA',
      categoria: 'contrato',
      tamanho: '2,93 MB',
      status: 'aprovado',
      enviadoPor: 'vendedor',
      data: '16/07/2025'
    }
  ]);

  const [filtros, setFiltros] = useState({
    pesquisa: '',
    categoria: 'todas',
    status: 'todos',
    proposta: 'todas',
    drive: 'todos'
  });

  // Estados para gerenciamento de drives
  const [drives, setDrives] = useState([
    { id: 1, nome: 'Drive Principal', url: 'https://drive.google.com/drive/folders/1FAIpQLScQKE8BjIZJ-abmix-proposals', status: 'ativo', espaco: '15 GB', usado: '8.2 GB', tipo: 'Google Drive', icon: 'HardDrive', cor: 'blue' },
    { id: 2, nome: 'Planilha Propostas', url: 'https://docs.google.com/spreadsheets/d/1def456', status: 'ativo', espaco: '2,847 linhas', usado: '47 planilhas', tipo: 'Google Sheets', icon: 'FileSpreadsheet', cor: 'green' },
    { id: 3, nome: 'Formulário Cliente', url: 'https://docs.google.com/forms/d/1ghi789', status: 'ativo', espaco: '1,247 respostas', usado: '23 forms', tipo: 'Google Forms', icon: 'FileText', cor: 'purple' },
    { id: 4, nome: 'Documentos Templates', url: 'https://docs.google.com/document/d/1jkl012', status: 'ativo', espaco: '12 templates', usado: '384 docs', tipo: 'Google Docs', icon: 'FileText', cor: 'orange' },
    { id: 5, nome: 'Backup Automático', url: 'https://drive.google.com/drive/folders/1mno345', status: 'ativo', espaco: '24.8 GB', usado: '847 backups', tipo: 'Backup', icon: 'Database', cor: 'red' }
  ]);
  const [novoDrive, setNovoDrive] = useState({ nome: '', url: '', observacao: '' });
  const [abaAtiva, setAbaAtiva] = useState('drive');

  // Dados dos status (conforme imagem fornecida)
  const statusOptions = [
    { value: 'todos', label: 'Todos os status', color: 'gray' },
    { value: 'OBSERVACAO', label: 'OBSERVAÇÃO', color: 'blue' },
    { value: 'ANALISAR', label: 'ANALISAR', color: 'green' },
    { value: 'ASSINATURA_DS', label: 'ASSINATURA DS', color: 'yellow' },
    { value: 'EXPIRADO', label: 'EXPIRADO', color: 'blue' },
    { value: 'IMPLANTADO', label: 'IMPLANTADO', color: 'blue' },
    { value: 'AGUAR_PAGAMENTO', label: 'AGUAR PAGAMENTO', color: 'pink' },
    { value: 'ASSINATURA_PROPOSTA', label: 'ASSINATURA PROPOSTA', color: 'yellow' },
    { value: 'AGUAR_SELECAO_VIGENCIA', label: 'AGUAR SELEÇÃO DE VIGÊNCIA', color: 'orange' },
    { value: 'PENDENCIA', label: 'PENDÊNCIA', color: 'red' },
    { value: 'DECLINADO', label: 'DECLINADO', color: 'purple' },
    { value: 'AGUAR_VIGENCIA', label: 'AGUAR VIGÊNCIA', color: 'cyan' }
  ];

  const categoriaOptions = [
    { value: 'todas', label: 'Todas as categorias', icon: Folder },
    { value: 'documentos', label: 'Documentos', icon: FileText },
    { value: 'imagem', label: 'Imagem', icon: Image },
    { value: 'contrato', label: 'Contrato', icon: FileText },
    { value: 'identificacao', label: 'Identificação', icon: FileSpreadsheet },
    { value: 'comprovante', label: 'Comprovante', icon: FileCheck },
    { value: 'cotacao', label: 'Cotação', icon: Tag }
  ];

  const driveOptions = [
    { value: 'todos', label: 'Todos os drives' },
    ...drives.map(drive => ({ value: drive.nome.toLowerCase().replace(' ', '-'), label: drive.nome }))
  ];

  const proposalOptions = [
    { value: 'todas', label: 'Todas as propostas' },
    { value: 'solucoes-tech', label: 'Soluções Tecnológicas Ltda' },
    { value: 'consultoria-sa', label: 'Consultoria Empresarial SA' }
  ];

  // Definição das abas do sistema
  const tabs = [
    { id: 'interface', label: 'Interface', icon: Eye },
    { id: 'usuarios', label: 'Gestão Usuários', icon: Users },
    { id: 'anexos', label: 'Gerenciar Anexos', icon: Paperclip },
    { id: 'google-sheets', label: 'Google Sheets', icon: FileSpreadsheet },
    { id: 'logs', label: 'Logs Sistema', icon: Monitor },
    { id: 'automacao', label: 'Automação', icon: Bot },
    { id: 'integracoes', label: 'Integrações', icon: Link },
    { id: 'drive', label: 'Google Drive', icon: HardDrive },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'tempo', label: 'Configurações do Tempo', icon: Clock },
    { id: 'sistema', label: 'Sistema', icon: Settings }
  ];

  // Função para filtrar anexos
  const anexosFiltrados = attachments.filter(anexo => {
    const matchPesquisa = anexo.nome.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
                         anexo.proposta.toLowerCase().includes(filtros.pesquisa.toLowerCase());
    const matchCategoria = filtros.categoria === 'todas' || anexo.categoria === filtros.categoria;
    const matchStatus = filtros.status === 'todos' || anexo.status === filtros.status.toLowerCase();
    const matchProposta = filtros.proposta === 'todas' || anexo.proposta.includes(filtros.proposta);
    
    return matchPesquisa && matchCategoria && matchStatus && matchProposta;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'aprovado': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'rejeitado': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'identificacao': return FileSpreadsheet;
      case 'comprovante': return FileCheck;
      case 'contrato': return FileText;
      case 'imagem': return Image;
      case 'documentos': return FileText;
      case 'cotacao': return Tag;
      default: return Folder;
    }
  };

  // Funções para abrir serviços reais
  const openGoogleSheets = () => {
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetsConfig.sheetId}/edit#gid=0`;
    window.open(sheetUrl, '_blank');
  };

  const openGoogleDrive = () => {
    window.open('https://drive.google.com/drive/folders/1FAIpQLScQKE8BjIZJ-abmix-proposals', '_blank');
  };

  const syncGoogleSheets = async () => {
    try {
      const response = await fetch('/api/sync-sheets', { method: 'POST' });
      const result = await response.json();
      
      if (response.ok) {
        showInternalNotification(`${result.message} - Última atualização: ${new Date(result.timestamp).toLocaleString('pt-BR')}`, 'success');
      } else {
        showInternalNotification(`Erro na sincronização: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      showInternalNotification('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
    }
  };

  const configureAutomation = (type: string) => {
    switch (type) {
      case 'drive':
        setShowDriveConfigModal(true);
        break;
      case 'sheets':
        setShowSheetsConfigModal(true);
        break;
      case 'whatsapp':
        setShowWhatsAppConfigModal(true);
        break;
      case 'backup':
        setShowBackupConfigModal(true);
        break;
    }
  };

  // Função para renderizar a seção de gerenciamento de anexos
  function renderAnexosSection() {
    return (
      <div className="space-y-6">
        {/* Header com estatísticas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Paperclip className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gerenciamento de Anexos</h3>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowDriveManagementModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
              >
                <HardDrive className="w-4 h-4 mr-2" />
                Gerenciar Drive
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Carregar arquivo
              </button>
            </div>
          </div>

          {/* Estatísticas de anexos */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Database className="w-8 h-8 text-gray-600 dark:text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">2</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Pingentes</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-200">3</div>
              <div className="text-sm text-green-600 dark:text-green-400">Aprovados</div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <X className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold text-red-900 dark:text-red-200">1</div>
              <div className="text-sm text-red-600 dark:text-red-400">Rejeitados</div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">6,72 MB</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Tamanho Total</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Pesquisa */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Pesquisar arquivos..."
                value={filtros.pesquisa}
                onChange={(e) => setFiltros({...filtros, pesquisa: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categoria */}
            <select
              value={filtros.categoria}
              onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categoriaOptions.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            {/* Propostas */}
            <select
              value={filtros.proposta}
              onChange={(e) => setFiltros({...filtros, proposta: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {proposalOptions.map(prop => (
                <option key={prop.value} value={prop.value}>{prop.label}</option>
              ))}
            </select>
          </div>

          {/* Drive Filter */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select
              value={filtros.drive}
              onChange={(e) => setFiltros({...filtros, drive: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {driveOptions.map(drive => (
                <option key={drive.value} value={drive.value}>{drive.label}</option>
              ))}
            </select>
            <div></div>
            <div></div>
            <div></div>
          </div>

          {/* Tabela de anexos */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">ARQUIVO</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">PROPOSTA</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">CATEGORIA</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">TAMANHO</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">STATUS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">ENVIADO POR</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">DADOS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {anexosFiltrados.map((anexo) => {
                  const CategoriaIcon = getCategoriaIcon(anexo.categoria);
                  return (
                    <tr key={anexo.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
                          <span className="text-sm text-gray-900 dark:text-white">{anexo.nome}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">{anexo.proposta}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: FKCP-{anexo.id}75262843668-oxfqpnv</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <CategoriaIcon className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm text-gray-900 dark:text-white capitalize">{anexo.categoria}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900 dark:text-white">{anexo.tamanho}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(anexo.status)}`}>
                          {anexo.status === 'pendente' ? 'Pendente' : anexo.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900 dark:text-white capitalize">{anexo.enviadoPor}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{anexo.data}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 dark:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {anexosFiltrados.length === 0 && (
            <div className="text-center py-8">
              <Folder className="w-12 h-12 text-gray-400 dark:text-gray-500 dark:text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum anexo encontrado</h3>
              <p className="text-gray-500 dark:text-gray-400">Tente ajustar os filtros para encontrar os anexos desejados.</p>
            </div>
          )}
        </div>
      </div>
    );
  }


  function renderInterfaceSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Interface</h3>
          </div>

          <div className="space-y-4">
            {/* Portal do Cliente */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">Portal do Cliente</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {portalVisibility.showClientPortal ? (
                      <>
                        <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Visível</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Oculto</span>
                      </>
                    )}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portalVisibility.showClientPortal}
                    onChange={handleToggleClientPortal}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 dark:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Portal Vendedor */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">Portal Vendedor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {portalVisibility.showVendorPortal ? (
                      <>
                        <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Visível</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Oculto</span>
                      </>
                    )}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portalVisibility.showVendorPortal}
                    onChange={handleToggleVendorPortal}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 dark:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            {/* Portal Financeiro */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-purple-600 dark:text-white mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">Portal Financeiro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {portalVisibility.showFinancialPortal ? (
                      <>
                        <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Visível</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Oculto</span>
                      </>
                    )}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portalVisibility.showFinancialPortal}
                    onChange={handleToggleFinancialPortal}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 dark:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            {/* Portal Implantação */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-teal-600 dark:text-white mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">Portal Implantação</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {portalVisibility.showImplementationPortal ? (
                      <>
                        <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Visível</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Oculto</span>
                      </>
                    )}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portalVisibility.showImplementationPortal}
                    onChange={handleToggleImplementationPortal}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 dark:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>

            {/* Portal Supervisor */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Crown className="w-5 h-5 text-gray-600 dark:text-white mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">Portal Supervisor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {portalVisibility.showSupervisorPortal ? (
                      <>
                        <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Visível</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Oculto</span>
                      </>
                    )}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portalVisibility.showSupervisorPortal}
                    onChange={handleToggleSupervisorPortal}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 dark:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600 mt-6">
            <button
              onClick={resetToDefault}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </button>
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
            <Bot className="w-6 h-6 text-purple-600 dark:text-white mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurar Automações</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Google Drive Automático</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Envio automático de propostas e documentos para pastas organizadas no Google Drive
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('drive')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>



            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Notificações WhatsApp</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Envio de notificações automáticas para vendedores e clientes
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('whatsapp')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Cloud className="w-5 h-5 text-orange-600 dark:text-white mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Backup Automático</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Backup diário de todos os dados do sistema
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('backup')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderIntegracoesSection() {
    return <IntegrationGuide />;
  }

  function renderGoogleSheetsSection() {
    return (
      <div className="space-y-6">
        {/* Cabeçalho Principal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Google Sheets - Central Unificada</h3>
            </div>
            <button 
              onClick={openGoogleSheets}
              className="flex items-center px-4 py-2 bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Google Sheets
            </button>
          </div>

          {/* Planilha Principal e Relatórios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Planilha Principal</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Planilha horizontal dinâmica com todos os dados dos clientes e propostas
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Sincronizada</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Última atualização:</span>
                  <span className="text-gray-600 dark:text-gray-300">2 min atrás</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Total de registros:</span>
                  <span className="text-gray-600 dark:text-gray-300">247</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={openGoogleSheets}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Abrir
                </button>
                <button 
                  onClick={syncGoogleSheets}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                >
                  Sync
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Database className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Relatórios</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Planilhas de relatórios e análises automatizadas
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Ativa</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Relatórios gerados:</span>
                  <span className="text-gray-600 dark:text-gray-300">15</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Frequência:</span>
                  <span className="text-gray-600 dark:text-gray-300">Diária</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=1', '_blank')}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white dark:bg-purple-600 dark:text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Ver Relatórios
                </button>
                <button 
                  onClick={() => configureAutomation('sheets')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                >
                  Config
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizador de Planilha Integrado */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Visualizador de Planilha</h3>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </button>
              <button 
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8,ID,EMPRESA,CNPJ,VENDEDOR,PLANO,VALOR,STATUS\n";
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "planilha_abmix.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </button>
            </div>
          </div>

          {/* Componente PlanilhaViewer integrado */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <PlanilhaViewer />
          </div>
        </div>
      </div>
    );
  }

  function renderDriveSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Google Drive - Gerenciamento</h3>
            </div>
            <button 
              onClick={() => setShowAddDriveModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Novo Drive
            </button>
          </div>

          {/* Lista de Drives Conectados */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Drives Conectados</h4>
            
            {drives.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum drive conectado</p>
                <p className="text-sm">Clique em "Adicionar Novo Drive" para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drives.map((drive) => (
                  <div key={drive.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className={`w-3 h-3 rounded-full mr-4 ${
                          drive.status === 'ativo' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h5 className="font-medium text-gray-900 dark:text-white text-lg mr-3">
                              {drive.nome}
                            </h5>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              drive.status === 'ativo' 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {drive.status}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Capacidade: {drive.usado} / {drive.espaco}
                          </div>
                          
                          {drive.observacao && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                              {drive.observacao}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button 
                          onClick={() => window.open(drive.url, '_blank')}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Abrir Drive"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Abrir
                        </button>
                        
                        <button 
                          onClick={() => {
                            setEditingDrive(drive);
                            setShowEditDriveModal(true);
                          }}
                          className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          title="Editar Nome"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Editar
                        </button>
                        
                        <button 
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja remover o drive "${drive.nome}"?`)) {
                              if (confirm(`ATENÇÃO: Esta ação é irreversível. Confirma a remoção do drive "${drive.nome}"?`)) {
                                setDrives(drives.filter(d => d.id !== drive.id));
                                showInternalNotification(`Drive "${drive.nome}" removido com sucesso!`, 'success');
                              }
                            }
                          }}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          title="Remover Drive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Funções para configurações de tempo - MOVIDAS PARA O NÍVEL PRINCIPAL
  const toggleModule = (module: string) => {
    setTimeConfigs(prev => ({
      ...prev,
      [module]: { ...prev[module], active: !prev[module].active }
    }));
  };

  const updateInterval = (module: string, interval: string) => {
    setTimeConfigs(prev => ({
      ...prev,
      [module]: { ...prev[module], interval }
    }));
  };

  const pauseAll = () => {
    setAllPaused(true);
    setTimeConfigs(prev => {
      const newConfigs = { ...prev };
      Object.keys(newConfigs).forEach(key => {
        newConfigs[key] = { ...newConfigs[key], active: false };
      });
      return newConfigs;
    });
  };

  const startAll = () => {
    setAllPaused(false);
    setTimeConfigs(prev => {
      const newConfigs = { ...prev };
      Object.keys(newConfigs).forEach(key => {
        newConfigs[key] = { ...newConfigs[key], active: true };
      });
      return newConfigs;
    });
  };

  const getModuleColor = (module: string) => {
    const colors = {
      googleDrive: 'bg-blue-500',
      googleSheets: 'bg-green-500',
      googleForms: 'bg-purple-500',
      googleDocs: 'bg-yellow-500',
      backupAuto: 'bg-red-500',
      apiRequests: 'bg-orange-500'
    };
    return colors[module] || 'bg-gray-500';
  };

  const getModuleName = (module: string) => {
    const names = {
      googleDrive: 'Google Drive',
      googleSheets: 'Google Sheets',
      googleForms: 'Google Forms',
      googleDocs: 'Google Docs',
      backupAuto: 'Backup Automático',
      apiRequests: 'Requisições API'
    };
    return names[module] || module;
  };

  const getIntervalOptions = (module: string) => {
    const options = {
      googleDrive: ['30s', '1m', '5m', 'manual'],
      googleSheets: ['1s', '5s', '30s', 'manual'],
      googleForms: ['5m', '10m', '30m', 'manual'],
      googleDocs: ['2m', '5m', '10m', 'manual'],
      backupAuto: ['1h', '6h', '24h', 'manual'],
      apiRequests: ['1s', '5s', '30s', 'manual']
    };
    return options[module] || ['1s', '5s', '30s', 'manual'];
  };



  function renderTempoSection() {
    const activeModules = Object.keys(timeConfigs).filter(module => timeConfigs[module].active).length;
    const totalModules = Object.keys(timeConfigs).length;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sistema de Controle de Tempo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Controle manual das requisições para módulos Google</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={pauseAll}
                disabled={allPaused}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Pause className="w-4 h-4 mr-2" />
                Parar Todos
              </button>
              
              <button
                onClick={startAll}
                disabled={!allPaused}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Todos
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalModules}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Módulos Totais</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-900 dark:text-white">{activeModules}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Módulos Ativos</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-900 dark:text-white">3</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Google Conectados</div>
            </div>
          </div>

          {/* Controles dos Módulos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(timeConfigs).map(([module, config]) => (
              <div key={module} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getModuleColor(module)} mr-3`}></div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{getModuleName(module)}</h4>
                  </div>
                  
                  <button
                    onClick={() => toggleModule(module)}
                    className={`p-2 rounded-lg transition-colors ${
                      config.active 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-400 text-white hover:bg-gray-500'
                    }`}
                    title={config.active ? 'Pausar módulo' : 'Iniciar módulo'}
                  >
                    {config.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Intervalo:</span>
                  <select
                    value={config.interval}
                    onChange={(e) => updateInterval(module, e.target.value)}
                    disabled={!config.active}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                  >
                    {getIntervalOptions(module).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`text-sm font-medium ${
                    config.active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {config.active ? 'Ativo' : 'Pausado'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Aviso sobre controle manual */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Controle Manual</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Este sistema permite pausar manualmente as requisições para os módulos Google quando necessário 
                  para manutenção ou controle de quotas da API. Use os controles individuais ou os botões 
                  "Parar Todos" / "Iniciar Todos" conforme necessário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderSistemaSection() {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações do Sistema</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Status do Sistema</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Servidor</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Banco de Dados</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">Conectado</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Google APIs</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">Funcionando</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Backup</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">Atualizado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Informações do Sistema</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Versão:</span>
                  <span className="text-gray-900 dark:text-white">v2.1.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Última atualização:</span>
                  <span className="text-gray-900 dark:text-white">16/01/2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Usuários ativos:</span>
                  <span className="text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Propostas totais:</span>
                  <span className="text-gray-900 dark:text-white">247</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
                Exportar Dados
              </button>
              <button className="px-4 py-2 bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors">
                Backup Manual
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors">
                Logs do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Área Restrita</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">Bem-vindo, {user.name}</span>
              
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
                >
                  {/* SINO REMOVIDO */}
                  {/* NOTIFICAÇÕES DESABILITADAS */}
                </button>
              </div>
              
              <button
                onClick={() => setShowInternalMessage(true)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {
                  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                  document.documentElement.classList.toggle('dark');
                  localStorage.setItem('theme', newTheme);
                }}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Sun className="w-5 h-5 dark:hidden" />
                <Moon className="w-5 h-5 hidden dark:block" />
              </button>
              
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <nav className="flex space-x-8 min-w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400'
                      : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'interface' && renderInterfaceSection()}
        {activeTab === 'usuarios' && <UnifiedUserManagement />}
        {activeTab === 'anexos' && renderAnexosSection()}
        {activeTab === 'google-sheets' && renderGoogleSheetsSection()}
        {activeTab === 'logs' && <LogsViewer />}
        {activeTab === 'backup' && <BackupManager />}
        {activeTab === 'automacao' && renderAutomacaoSection()}
        {activeTab === 'integracoes' && renderIntegracoesSection()}
        {activeTab === 'drive' && renderDriveSection()}
        {activeTab === 'tempo' && renderTempoSection()}
        {activeTab === 'sistema' && renderSistemaSection()}
      </main>

      {/* Modal de Gerenciamento de Drive */}
      {showDriveManagementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações das Integrações Google</h3>
              </div>
              <button
                onClick={() => setShowDriveManagementModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Abas de Configurações */}
            <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
              <nav className="flex space-x-8">
                <button 
                  onClick={() => setAbaAtiva('drive')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === 'drive' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Google Drive
                </button>
                <button 
                  onClick={() => setAbaAtiva('sheets')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === 'sheets' 
                      ? 'border-green-500 text-green-600 dark:text-green-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Google Sheets
                </button>
                <button 
                  onClick={() => setAbaAtiva('forms')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === 'forms' 
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Google Forms
                </button>
                <button 
                  onClick={() => setAbaAtiva('docs')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === 'docs' 
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Google Docs
                </button>
                <button 
                  onClick={() => setAbaAtiva('backup')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === 'backup' 
                      ? 'border-red-500 text-red-600 dark:text-red-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Backup
                </button>
                <button 
                  onClick={() => setAbaAtiva('api')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === 'api' 
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  API Config
                </button>
              </nav>
            </div>

            {/* Formulário para adicionar novo drive */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Adicionar Nova Integração</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Tipo de Integração</label>
                  <select 
                    value={novoDrive.tipo}
                    onChange={(e) => setNovoDrive({...novoDrive, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="drive">Google Drive</option>
                    <option value="sheets">Google Sheets</option>
                    <option value="forms">Google Forms</option>
                    <option value="docs">Google Docs</option>
                    <option value="backup">Backup</option>
                    <option value="api">API Config</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Nome da Integração</label>
                  <input
                    type="text"
                    value={novoDrive.nome}
                    onChange={(e) => setNovoDrive({...novoDrive, nome: e.target.value})}
                    placeholder="Ex: Planilha Propostas"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">URL/ID da Integração</label>
                  <input
                    type="url"
                    value={novoDrive.url}
                    onChange={(e) => setNovoDrive({...novoDrive, url: e.target.value})}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => {
                    if (novoDrive.nome && novoDrive.url) {
                      const tipoMap = {
                        drive: { tipo: 'Google Drive', icon: 'HardDrive', cor: 'blue' },
                        sheets: { tipo: 'Google Sheets', icon: 'FileSpreadsheet', cor: 'green' },
                        forms: { tipo: 'Google Forms', icon: 'FileText', cor: 'purple' },
                        docs: { tipo: 'Google Docs', icon: 'FileText', cor: 'orange' },
                        backup: { tipo: 'Backup', icon: 'Database', cor: 'red' },
                        api: { tipo: 'API Config', icon: 'Settings', cor: 'indigo' }
                      };

                      const tipoInfo = tipoMap[novoDrive.tipo] || tipoMap.drive;
                      
                      const newDrive = {
                        id: drives.length + 1,
                        nome: novoDrive.nome,
                        url: novoDrive.url,
                        status: 'ativo',
                        espaco: '15 GB',
                        usado: '0 GB',
                        tipo: tipoInfo.tipo,
                        icon: tipoInfo.icon,
                        cor: tipoInfo.cor
                      };
                      setDrives([...drives, newDrive]);
                      setNovoDrive({ nome: '', url: '', tipo: 'drive' });
                      showInternalNotification('Integração adicionada com sucesso!', 'success');
                    } else {
                      showInternalNotification('Preencha todos os campos obrigatórios.', 'error');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Adicionar Integração
                </button>
                <button className="px-4 py-2 bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors">
                  <CheckCircle className="w-4 h-4 mr-2 inline" />
                  Testar Conexão
                </button>
                <button className="px-4 py-2 bg-red-600 text-white dark:bg-red-600 dark:text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition-colors">
                  <Trash2 className="w-4 h-4 mr-2 inline" />
                  Remover Selecionados
                </button>
              </div>
            </div>

            {/* Lista de integrações existentes */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Integrações Configuradas ({drives.filter(drive => {
                  if (abaAtiva === 'drive') return drive.tipo === 'Google Drive';
                  if (abaAtiva === 'sheets') return drive.tipo === 'Google Sheets';
                  if (abaAtiva === 'forms') return drive.tipo === 'Google Forms';
                  if (abaAtiva === 'docs') return drive.tipo === 'Google Docs';
                  if (abaAtiva === 'backup') return drive.tipo === 'Backup';
                  if (abaAtiva === 'api') return drive.tipo === 'API Config';
                  return true;
                }).length})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">INTEGRAÇÃO</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">TIPO</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">STATUS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">DADOS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drives.filter(drive => {
                      if (abaAtiva === 'drive') return drive.tipo === 'Google Drive';
                      if (abaAtiva === 'sheets') return drive.tipo === 'Google Sheets';
                      if (abaAtiva === 'forms') return drive.tipo === 'Google Forms';
                      if (abaAtiva === 'docs') return drive.tipo === 'Google Docs';
                      if (abaAtiva === 'backup') return drive.tipo === 'Backup';
                      if (abaAtiva === 'api') return drive.tipo === 'API Config';
                      return true;
                    }).map((drive) => {
                      const IconComponent = drive.icon === 'HardDrive' ? HardDrive : 
                                           drive.icon === 'FileSpreadsheet' ? FileSpreadsheet :
                                           drive.icon === 'FileText' ? FileText :
                                           drive.icon === 'Database' ? Database : HardDrive;
                      
                      const colorClass = drive.cor === 'blue' ? 'text-blue-500 dark:text-blue-400' :
                                        drive.cor === 'green' ? 'text-green-500 dark:text-green-400' :
                                        drive.cor === 'purple' ? 'text-purple-500 dark:text-purple-400' :
                                        drive.cor === 'orange' ? 'text-orange-500 dark:text-orange-400' :
                                        drive.cor === 'red' ? 'text-red-500 dark:text-red-400' :
                                        'text-blue-500 dark:text-blue-400';
                      
                      const bgColorClass = drive.cor === 'blue' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                                          drive.cor === 'green' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                          drive.cor === 'purple' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                                          drive.cor === 'orange' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                                          drive.cor === 'red' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                          'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
                      
                      return (
                        <tr key={drive.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:bg-gray-600">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <IconComponent className={`w-5 h-5 ${colorClass} mr-2`} />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{drive.nome}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{drive.url}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${bgColorClass}`}>
                              {drive.tipo}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              drive.status === 'ativo' 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {drive.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-900 dark:text-white">{drive.usado} / {drive.espaco}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => window.open(drive.url, '_blank')}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                title="Abrir Integração"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const updatedDrives = drives.map(d => 
                                    d.id === drive.id 
                                      ? {...d, status: d.status === 'ativo' ? 'inativo' : 'ativo'}
                                      : d
                                  );
                                  setDrives(updatedDrives);
                                }}
                                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                                title={drive.status === 'ativo' ? 'Desativar' : 'Ativar'}
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja excluir a integração "${drive.nome}"?`)) {
                                    setDrives(drives.filter(d => d.id !== drive.id));
                                    showInternalNotification('Integração excluída com sucesso!', 'success');
                                  }
                                }}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                title="Excluir Integração"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estatísticas das integrações */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-900 dark:text-white">{drives.length}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total de Integrações</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-900 dark:text-white">{drives.filter(d => d.status === 'ativo').length}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Integrações Ativas</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-900 dark:text-white">{drives.filter(d => d.tipo.includes('Google')).length}</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Módulos Google</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-900 dark:text-white">{drives.filter(d => d.tipo === 'Backup').length}</div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">Backups Ativos</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDriveManagementModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modais de Configuração */}
      {showDriveConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Configurar Google Drive</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Estrutura de Pastas</label>
                <select 
                  value={driveConfig.folderStructure}
                  onChange={(e) => setDriveConfig({...driveConfig, folderStructure: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Por Cliente">Por Cliente</option>
                  <option value="Por Data">Por Data</option>
                  <option value="Por Vendedor">Por Vendedor</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-white">Sincronização Automática</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={driveConfig.autoSync}
                    onChange={(e) => setDriveConfig({...driveConfig, autoSync: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 dark:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Frequência de Backup</label>
                <select 
                  value={driveConfig.backupFrequency}
                  onChange={(e) => setDriveConfig({...driveConfig, backupFrequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tempo Real">Tempo Real</option>
                  <option value="Diário">Diário</option>
                  <option value="Semanal">Semanal</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDriveConfigModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  openGoogleDrive();
                  setShowDriveConfigModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar e Abrir Drive
              </button>
            </div>
          </div>
        </div>
      )}

      {showSheetsConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Configurar Google Sheets</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">ID da Planilha</label>
                <input
                  type="text"
                  value={sheetsConfig.sheetId}
                  onChange={(e) => setSheetsConfig({...sheetsConfig, sheetId: e.target.value})}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-white">Atualização Automática</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sheetsConfig.autoUpdate}
                    onChange={(e) => setSheetsConfig({...sheetsConfig, autoUpdate: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 dark:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Frequência de Sync</label>
                <select 
                  value={sheetsConfig.syncFrequency}
                  onChange={(e) => setSheetsConfig({...sheetsConfig, syncFrequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="Tempo Real">Tempo Real</option>
                  <option value="5 Minutos">A cada 5 minutos</option>
                  <option value="Horário">A cada hora</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSheetsConfigModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  syncGoogleSheets();
                  setShowSheetsConfigModal(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
              >
                Salvar e Sincronizar
              </button>
            </div>
          </div>
        </div>
      )}

      {showWhatsAppConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Configurar WhatsApp</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Token da API</label>
                <input
                  type="password"
                  placeholder="Token do WhatsApp Business API"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Número do WhatsApp</label>
                <input
                  type="text"
                  placeholder="+55 11 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Tipo de Notificações</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-white">Nova proposta criada</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-white">Cliente completou formulário</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-white">Status da proposta alterado</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowWhatsAppConfigModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  showInternalNotification('Configurações do WhatsApp salvas com sucesso!', 'success');
                  setShowWhatsAppConfigModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {showBackupConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <Cloud className="w-6 h-6 text-orange-600 dark:text-white mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Configurar Backup</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Frequência de Backup</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
                  <option value="diario">Diário (às 02:00)</option>
                  <option value="semanal">Semanal (Domingo)</option>
                  <option value="mensal">Mensal (1º dia do mês)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Retenção de Backups</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
                  <option value="7">7 dias</option>
                  <option value="30">30 dias</option>
                  <option value="90">90 dias</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Incluir nos Backups</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-white">Banco de dados</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-white">Arquivos de propostas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-white">Logs do sistema</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBackupConfigModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  showInternalNotification('Configurações de backup salvas! Próximo backup: hoje às 02:00', 'success');
                  setShowBackupConfigModal(false);
                }}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestão de Usuários */}
      {showUserManagementModal && (
        <UserManagementDashboard 
          onClose={() => setShowUserManagementModal(false)} 
        />
      )}
      
      {/* NOTIFICAÇÕES COMPLETAMENTE DESABILITADAS */}
      
      {/* Sistema de Mensagens Internas */}
      {showInternalMessage && (
        <InternalMessage 
          isOpen={true}
          onClose={() => setShowInternalMessage(false)}
          currentUser={{ name: user.name, role: 'admin' }}
        />
      )}
      
      {/* Notificação Interna Elegante */}
      {internalNotification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`
            flex items-center p-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-md
            ${internalNotification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200' 
              : internalNotification.type === 'error'
                ? 'bg-red-50 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200'
                : 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-800 dark:text-blue-200'
            }
          `}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {internalNotification.type === 'success' && (
                  <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
                )}
                {internalNotification.type === 'error' && (
                  <X className="w-6 h-6 text-red-500 dark:text-red-400" />
                )}
                {internalNotification.type === 'info' && (
                  <AlertTriangle className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {internalNotification.message}
                </p>
              </div>
              
              <button
                onClick={() => setInternalNotification(prev => ({ ...prev, show: false }))}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Novo Drive */}
      {showAddDriveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Adicionar Novo Drive</h3>
              </div>
              <button
                onClick={() => setShowAddDriveModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Drive *
                </label>
                <input
                  type="text"
                  value={novoDrive.nome}
                  onChange={(e) => setNovoDrive({...novoDrive, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Drive Principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL do Google Drive *
                </label>
                <input
                  type="url"
                  value={novoDrive.url}
                  onChange={(e) => setNovoDrive({...novoDrive, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://drive.google.com/drive/folders/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Observação (Opcional)
                </label>
                <input
                  type="text"
                  value={novoDrive.observacao}
                  onChange={(e) => setNovoDrive({...novoDrive, observacao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Drive para documentos principais"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddDriveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (novoDrive.nome && novoDrive.url) {
                    const newDrive = {
                      id: Date.now(),
                      nome: novoDrive.nome,
                      url: novoDrive.url,
                      status: 'ativo',
                      usado: '0 GB',
                      espaco: '15 GB',
                      observacao: novoDrive.observacao
                    };
                    setDrives([...drives, newDrive]);
                    setNovoDrive({ nome: '', url: '', observacao: '' });
                    setShowAddDriveModal(false);
                    showInternalNotification('Drive adicionado com sucesso!', 'success');
                  } else {
                    showInternalNotification('Preencha todos os campos obrigatórios.', 'error');
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar Drive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Drive */}
      {showEditDriveModal && editingDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Edit2 className="w-6 h-6 text-gray-600 dark:text-gray-400 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Drive</h3>
              </div>
              <button
                onClick={() => {
                  setShowEditDriveModal(false);
                  setEditingDrive(null);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Drive *
                </label>
                <input
                  type="text"
                  value={editingDrive.nome}
                  onChange={(e) => setEditingDrive({...editingDrive, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL do Google Drive *
                </label>
                <input
                  type="url"
                  value={editingDrive.url}
                  onChange={(e) => setEditingDrive({...editingDrive, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Observação (Opcional)
                </label>
                <input
                  type="text"
                  value={editingDrive.observacao || ''}
                  onChange={(e) => setEditingDrive({...editingDrive, observacao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditDriveModal(false);
                  setEditingDrive(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (editingDrive.nome && editingDrive.url) {
                    setDrives(drives.map(drive => 
                      drive.id === editingDrive.id ? editingDrive : drive
                    ));
                    setShowEditDriveModal(false);
                    setEditingDrive(null);
                    showInternalNotification('Drive editado com sucesso!', 'success');
                  } else {
                    showInternalNotification('Preencha todos os campos obrigatórios.', 'error');
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Footer */}
      <SystemFooter />
    </div>
  );
}
