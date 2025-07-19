import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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

  // Função para adicionar nova planilha
  const addNewSheet = (newSheet: any) => {
    const sheet = {
      id: Date.now(),
      name: newSheet.name || `Nova Planilha ${connectedSheets.length + 1}`,
      url: newSheet.url || 'https://docs.google.com/spreadsheets/new',
      status: 'Ativo',
      lastUpdate: new Date().toLocaleString('pt-BR')
    };
    setConnectedSheets(prev => [...prev, sheet]);
    showInternalNotification('Planilha adicionada com sucesso!', 'success');
  };

  // Função para remover planilha
  const removeSheet = (sheetId: number) => {
    if (confirm('Tem certeza que deseja remover esta planilha?')) {
      setConnectedSheets(prev => prev.filter(sheet => sheet.id !== sheetId));
      showInternalNotification('Planilha removida com sucesso!', 'success');
    }
  };
  
  // Estados para configurações de tempo - MOVIDOS PARA O NÍVEL PRINCIPAL
  const [timeConfigs, setTimeConfigs] = useState({
    googleDrive: { active: true, interval: '30s' },
    googleSheets: { active: true, interval: '1s' },
    googleForms: { active: true, interval: '10m' },
    googleDocs: { active: true, interval: '5m' },
    backupAuto: { active: true, interval: '24h' },
  });

  // Estados para Google Sheets - MOVIDOS PARA O TOPO
  const [updateInterval, setUpdateInterval] = useState('1s');
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);
  const [sheetName, setSheetName] = useState('Planilha Principal - Sistema Abmix');
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSheetModal, setShowAddSheetModal] = useState(false);
  const [connectedSheets, setConnectedSheets] = useState([
    {
      id: 1,
      name: 'Planilha Principal - Sistema Abmix',
      url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
      status: 'Ativo',
      lastUpdate: new Date().toLocaleString('pt-BR')
    }
  ]);
  
  const [allPaused, setAllPaused] = useState(false);
  
  // Hooks useQuery movidos para o nível superior para evitar conflitos de hooks
  const { data: realProposals = [] } = useQuery({
    queryKey: ['/api/proposals'],
    refetchInterval: 5000,
    enabled: activeTab === 'google-sheets'
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['/api/vendors'],
    enabled: activeTab === 'google-sheets'
  });
  
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
  const [drives, setDrives] = useState([]);
  const [novoDrive, setNovoDrive] = useState({ 
    nome: '', 
    url: '', 
    observacao: '',
    proprietario: '',
    linkCompartilhamento: ''
  });
  const [abaAtiva, setAbaAtiva] = useState('drive');
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [backupInProgress, setBackupInProgress] = useState(new Set());
  
  // Intervalos de backup disponíveis
  const intervalosBackup = [
    { value: '1s', label: '1 segundo' },
    { value: '5s', label: '5 segundos' },
    { value: '10s', label: '10 segundos' },
    { value: '30s', label: '30 segundos' },
    { value: '1m', label: '1 minuto' },
    { value: '5m', label: '5 minutos' },
    { value: '10m', label: '10 minutos' },
    { value: '15m', label: '15 minutos' },
    { value: '1h', label: '1 hora' },
    { value: '5h', label: '5 horas' },
    { value: '10h', label: '10 horas' },
    { value: '24h', label: '24 horas' },
    { value: 'manual', label: 'Manual (só com botão)' }
  ];

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
    const openGoogleSheets = () => {
      window.open(sheetUrl, '_blank');
    };

    const editSheet = () => {
      setShowEditModal(true);
    };

    const removeMainSheet = () => {
      if (confirm('Tem certeza que deseja remover a planilha conectada?')) {
        showInternalNotification('Planilha principal removida com sucesso!', 'success');
      }
    };

    const exportCSV = () => {
      // Exportar dados reais para CSV
      if (realSheetData.length > 0) {
        const csvContent = realSheetData.map(row => 
          row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `abmix-planilha-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    const manualUpdate = () => {
      // Atualização manual sem notificação
      window.location.reload();
    };

    // Usar dados já carregados no nível superior

    // Gerar estrutura real da planilha baseada nos dados do sistema
    const generateRealSheetData = () => {
      if (realProposals.length === 0) return [];
      
      // Cabeçalhos da planilha baseados na estrutura real do sistema
      const headers = [
        'ID', 'LINK_CLIENTE', 'EMPRESA', 'CNPJ', 'VENDEDOR', 'PLANO', 'VALOR', 'STATUS',
        'ODONTO_CONJUGADO', 'LIVRE_ADESAO', 'COMPULSORIO', 'APROVEITAMENTO_CARENCIA', 'INICIO_VIGENCIA', 'PERIODO_MINIMO',
        'REUNIAO_REALIZADA', 'NOME_REUNIAO', 'VENDA_DUPLA', 'VENDEDOR_DUPLA', 'DESCONTO_PERCENT', 'ORIGEM_VENDA', 'AUTORIZADOR_DESCONTO', 'OBS_FINANCEIRAS', 'OBS_CLIENTE'
      ];

      // Detectar máximo de titulares e dependentes nos dados reais
      let maxTitulares = 1;
      let maxDependentes = 0;
      
      realProposals.forEach(proposal => {
        const titulares = proposal.titulares || [];
        const dependentes = proposal.dependentes || [];
        if (titulares.length > maxTitulares) maxTitulares = titulares.length;
        if (dependentes.length > maxDependentes) maxDependentes = dependentes.length;
      });

      // Adicionar colunas dinâmicas baseadas nos dados reais
      for (let i = 1; i <= maxTitulares; i++) {
        headers.push(`TITULAR${i}_NOME`, `TITULAR${i}_CPF`, `TITULAR${i}_RG`, `TITULAR${i}_EMAIL`, `TITULAR${i}_TELEFONE`);
      }
      
      for (let i = 1; i <= maxDependentes; i++) {
        headers.push(`DEPENDENTE${i}_NOME`, `DEPENDENTE${i}_CPF`, `DEPENDENTE${i}_PARENTESCO`);
      }
      
      headers.push('ANEXOS', 'DATA_CONTRATO');

      // Gerar linhas de dados reais
      const rows = realProposals.map(proposal => {
        const contractData = proposal.contractData || {};
        const internalData = proposal.internalData || {};
        const titulares = proposal.titulares || [];
        const dependentes = proposal.dependentes || [];
        const vendorName = vendors.find(v => v.id === proposal.vendorId)?.name || 'Vendedor não identificado';

        const row = [
          proposal.abmId || `ABM${proposal.id?.slice(-3) || '001'}`,
          `https://abmix.com/client-proposal/${proposal.clientToken}`,
          contractData.nomeEmpresa || '',
          contractData.cnpj || '',
          vendorName,
          contractData.planoContratado || '',
          contractData.valor || '',
          proposal.status || 'observacao',
          contractData.incluiOdonto ? 'Sim' : 'Não',
          contractData.livreAdesao ? 'Sim' : 'Não',
          contractData.compulsorio ? 'Sim' : 'Não',
          contractData.aproveitamentoCarencia ? 'Sim' : 'Não',
          contractData.inicioVigencia || '',
          contractData.periodoMinimo || '',
          internalData.reuniao ? 'Sim' : 'Não',
          internalData.nomeReuniao || '',
          internalData.vendaDupla ? 'Sim' : 'Não',
          internalData.nomeVendaDupla || '',
          internalData.desconto || '',
          internalData.origemVenda || '',
          internalData.autorizadorDesconto || '',
          internalData.observacoesFinanceiras || '',
          internalData.observacoesCliente || ''
        ];

        // Adicionar dados dos titulares
        for (let i = 0; i < maxTitulares; i++) {
          const titular = titulares[i] || {};
          row.push(
            titular.nome || '',
            titular.cpf || '',
            titular.rg || '',
            titular.email || '',
            titular.telefone || ''
          );
        }

        // Adicionar dados dos dependentes
        for (let i = 0; i < maxDependentes; i++) {
          const dependente = dependentes[i] || {};
          row.push(
            dependente.nome || '',
            dependente.cpf || '',
            dependente.parentesco || ''
          );
        }

        // Campos extras
        row.push(
          proposal.vendorAttachments ? proposal.vendorAttachments.length.toString() : '0',
          proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString('pt-BR') : ''
        );

        return row;
      });

      return [headers, ...rows];
    };

    const realSheetData = generateRealSheetData();
    const totalProposals = realProposals.length;
    const totalColumns = realSheetData.length > 0 ? realSheetData[0].length : 0;

    return (
      <div className="space-y-6">
        {/* Visualizador de Planilha em Tempo Real - Seção Principal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                📊 Visualizador de Planilha em Tempo Real
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Formato de dados antes da integração com o Planilhas Google
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddSheetModal(true)}
                className="bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
              >
                ➕ Adicionar
              </button>
              <button
                onClick={removeMainSheet}
                className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
              >
                🗑️ Remover
              </button>
              <button
                onClick={openGoogleSheets}
                className="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
              >
                🔗 Abrir
              </button>
              <button
                onClick={editSheet}
                className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
              >
                ✏️ Editar
              </button>
              <button
                onClick={manualUpdate}
                className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
              >
                🔄 Atualizar
              </button>
              <button
                onClick={exportCSV}
                className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
              >
                💾 Baixar CSV
              </button>
            </div>
          </div>

          {/* Cards de Estatísticas Baseados nos Dados Reais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 dark:text-blue-400 text-sm">📋</span>
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium ml-2">Total de Propostas</span>
              </div>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{totalProposals}</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-2">
                <span className="text-green-600 dark:text-green-400 text-sm">📊</span>
                <span className="text-green-600 dark:text-green-400 text-sm font-medium ml-2">Colunas da Planilha</span>
              </div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-300">{totalColumns}</div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center mb-2">
                <span className="text-purple-600 dark:text-purple-400 text-sm">🕐</span>
                <span className="text-purple-600 dark:text-purple-400 text-sm font-medium ml-2">Última Atualização</span>
              </div>
              <div className="text-lg font-bold text-purple-800 dark:text-purple-300">
                {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center mb-2">
                <span className="text-orange-600 dark:text-orange-400 text-sm">🔄</span>
                <span className="text-orange-600 dark:text-orange-400 text-sm font-medium ml-2">Status do Sistema</span>
              </div>
              <div className="text-lg font-bold text-orange-800 dark:text-orange-300">ATIVO</div>
              <div className="text-xs text-orange-600 dark:text-orange-400">Sincronizando</div>
            </div>
          </div>

          {/* Estrutura Real da Planilha */}
          {totalProposals > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
              <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold text-sm mb-2">📋 Estrutura Real da Planilha - {totalProposals} Propostas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-yellow-700 dark:text-yellow-300">
                <div className="flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">👨‍💼</span>
                  <div>
                    <div className="font-medium">Máximo Titulares</div>
                    <div className="text-lg font-bold">{realProposals.reduce((max, p) => Math.max(max, (p.titulares || []).length), 1)}</div>
                    <div className="text-xs">Detectado automaticamente</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">👨‍👩‍👧‍👦</span>
                  <div>
                    <div className="font-medium">Máximo Dependentes</div>
                    <div className="text-lg font-bold">{realProposals.reduce((max, p) => Math.max(max, (p.dependentes || []).length), 0)}</div>
                    <div className="text-xs">Detectado automaticamente</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 dark:text-green-400 mr-2">📊</span>
                  <div>
                    <div className="font-medium">Campos Base</div>
                    <div className="text-lg font-bold">23</div>
                    <div className="text-xs">Campos fixos + internos</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 dark:text-orange-400 mr-2">🔄</span>
                  <div>
                    <div className="font-medium">Campos Dinâmicos</div>
                    <div className="text-lg font-bold">{totalColumns - 23}</div>
                    <div className="text-xs">Titulares + dependentes</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prévia dos Dados da Planilha - Seção como mostrado nas imagens */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">📊 Prévia dos Dados da Planilha</h3>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Visualização em tempo real dos dados formatados para Google Sheets
            </div>
          </div>
          
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-2 flex items-center space-x-4">
            <span>📜 Role horizontalmente para ver todos os {totalColumns} campos</span>
            <span>🔄 Atualização automática a cada 5 segundos</span>
            <span>📊 {totalProposals} propostas carregadas</span>
          </div>

          {/* Tabela de dados reais da planilha */}
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-lg">
            {realSheetData.length > 0 ? (
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {realSheetData[0].map((header, index) => (
                      <th key={index} className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {realSheetData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 border-r border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-200 whitespace-nowrap">
                          {cell || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="mb-4">📋</div>
                <div className="text-sm">Nenhuma proposta encontrada no sistema</div>
                <div className="text-xs mt-2">Aguardando propostas para gerar a estrutura da planilha</div>
              </div>
            )}
          </div>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            {totalColumns > 0 ? `Role horizontalmente para navegar pelos ${totalColumns} campos` : 'A estrutura da planilha será gerada automaticamente quando propostas forem criadas'}
          </div>
        </div>

        {/* Seção de Controle das Planilhas - Baseado no painel Drive */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Controle de Planilhas Conectadas</h3>
            <button
              onClick={() => setShowAddSheetModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Adicionar Nova Planilha
            </button>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{sheetName}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{sheetUrl}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Ativo
                    </span>
                    <span>{totalProposals} linhas</span>
                    <span>{totalColumns} colunas</span>
                    <span>Atualizada: {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'})}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={openGoogleSheets}
                  className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Abrir
                </button>
                <button
                  onClick={editSheet}
                  className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={removeMainSheet}
                  className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Remover
                </button>
                <button
                  onClick={exportCSV}
                  className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Exportar CSV
                </button>
                <button
                  onClick={manualUpdate}
                  className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Atualizar
                </button>
                <select
                  value={updateInterval}
                  onChange={(e) => setUpdateInterval(e.target.value)}
                  className="bg-gray-500 dark:bg-gray-600 text-white px-3 py-1 rounded text-sm border-none outline-none"
                >
                  <option value="0.5s">0.5s</option>
                  <option value="1s">1s</option>
                  <option value="5s">5s</option>
                  <option value="10s">10s</option>
                  <option value="30s">30s</option>
                  <option value="1min">1min</option>
                  <option value="5min">5min</option>
                  <option value="10min">10min</option>
                  <option value="15min">15min</option>
                  <option value="1h">1h</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>

            {/* Lista de Planilhas Conectadas */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Planilhas Conectadas ({connectedSheets.length})</h4>
              {connectedSheets.map((sheet) => (
                <div key={sheet.id} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-600 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{sheet.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Status: {sheet.status} • Última atualização: {sheet.lastUpdate}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => window.open(sheet.url, '_blank')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                    >
                      Abrir
                    </button>
                    <button
                      onClick={() => removeSheet(sheet.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal de Adição de Nova Planilha */}
        {showAddSheetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adicionar Nova Planilha</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newSheet = {
                  name: formData.get('name') as string,
                  url: formData.get('url') as string
                };
                addNewSheet(newSheet);
                setShowAddSheetModal(false);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Planilha</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Ex: Planilha Vendas 2025"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL da Planilha</label>
                    <input
                      type="url"
                      name="url"
                      required
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddSheetModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Adicionar Planilha
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Edição */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Editar Planilha</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                  <input
                    type="text"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    console.log('Planilha atualizada');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
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
              className="flex items-center px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
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
                  <div key={drive.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center flex-1">
                        <div className={`w-3 h-3 rounded-full mr-4 ${
                          drive.status === 'ativo' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h5 className="font-semibold text-gray-900 dark:text-white text-lg mr-3">
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
                        </div>
                      </div>
                    </div>

                    {/* Informações Detalhadas do Drive */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="space-y-2">
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Capacidade:</span> {drive.usado || '0 GB'} / {drive.espaco || '15 GB'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Proprietário:</span> {drive.proprietario || 'Felipe Manieri'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Criado em:</span> {drive.dataCriacao || '19/07/2025'}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Link Compartilhamento:</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(drive.linkCompartilhamento || drive.url);
                              showInternalNotification('Link copiado para a área de transferência!', 'success');
                            }}
                            className="ml-2 p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                            title="Copiar link"
                          >
                            🔗
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Última modificação:</span> {drive.ultimaModificacao || '19/07/2025 11:20'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Última sync:</span> {drive.ultimaSync || '19/07/2025 11:20'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Arquivos:</span> {drive.arquivos || '1.834'} | <span className="font-medium">Pastas:</span> {drive.pastas || '247'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Backup:</span> 
                          <span className="ml-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            {intervalosBackup.find(i => i.value === (drive.intervaloBackup || '5m'))?.label || '5 minutos'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {drive.observacao && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-4 p-2 bg-gray-100 dark:bg-gray-600 rounded">
                        <span className="font-medium">Observação:</span> {drive.observacao}
                      </div>
                    )}

                    {/* Botões de Ação - Todos na mesma linha */}
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => window.open(drive.url, '_blank')}
                        className="flex items-center px-3 py-2 bg-gray-500 dark:bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                        title="Abrir Drive no Navegador"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Abrir
                      </button>
                      
                      <button 
                        onClick={() => {
                          setEditingDrive(drive);
                          setShowEditDriveModal(true);
                        }}
                        className="flex items-center px-3 py-2 bg-gray-500 dark:bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                        title="Editar Nome e Configurações"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </button>
                      
                      <button 
                        onClick={() => {
                          if (pendingRemoval === drive.id) {
                            setDrives(drives.filter(d => d.id !== drive.id));
                            showInternalNotification(`Drive removido: "${drive.nome}" (URL: ${drive.url}) - ${drive.observacao ? 'Obs: ' + drive.observacao : 'Sem observação'}`, 'success');
                            setPendingRemoval(null);
                          } else {
                            setPendingRemoval(drive.id);
                            showInternalNotification(`Tem certeza? Clique novamente em "Remover" para confirmar a remoção do drive "${drive.nome}".`, 'info');
                            setTimeout(() => setPendingRemoval(null), 5000);
                          }
                        }}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          pendingRemoval === drive.id 
                            ? 'bg-gray-700 dark:bg-gray-800 text-white animate-pulse border-2 border-gray-400 dark:border-gray-500' 
                            : 'bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-700'
                        }`}
                        title="Remover Drive da Lista"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
                      </button>
                      
                      <button 
                        onClick={() => {
                          setBackupInProgress(prev => new Set(prev).add(drive.id));
                          showInternalNotification(`Iniciando backup manual do drive "${drive.nome}"...`, 'info');
                          
                          // Simular processo de backup
                          setTimeout(() => {
                            setBackupInProgress(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(drive.id);
                              return newSet;
                            });
                            
                            // Atualizar última sync
                            setDrives(prevDrives => prevDrives.map(d => 
                              d.id === drive.id 
                                ? { ...d, ultimaSync: new Date().toLocaleString('pt-BR') }
                                : d
                            ));
                            
                            showInternalNotification(`Backup concluído com sucesso para o drive "${drive.nome}"!`, 'success');
                          }, 3000);
                        }}
                        disabled={backupInProgress.has(drive.id)}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          backupInProgress.has(drive.id)
                            ? 'bg-gray-600 dark:bg-gray-700 text-white animate-pulse cursor-not-allowed'
                            : 'bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-700'
                        }`}
                        title="Executar Backup Manual Imediatamente"
                      >
                        <Database className="w-4 h-4 mr-1" />
                        {backupInProgress.has(drive.id) ? 'Fazendo Backup...' : 'Backup Manual'}
                      </button>
                      
                      <div className="relative">
                        <select
                          value={drive.intervaloBackup || '5m'}
                          onChange={(e) => {
                            const novoIntervalo = e.target.value;
                            setDrives(prevDrives => prevDrives.map(d => 
                              d.id === drive.id 
                                ? { ...d, intervaloBackup: novoIntervalo }
                                : d
                            ));
                            showInternalNotification(
                              `Intervalo de backup alterado para "${intervalosBackup.find(i => i.value === novoIntervalo)?.label}" no drive "${drive.nome}"`, 
                              'success'
                            );
                          }}
                          className="flex items-center px-3 py-2 bg-gray-500 dark:bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors cursor-pointer border-none outline-none"
                          title="Configurar Intervalo de Backup Automático"
                        >
                          {intervalosBackup.map(intervalo => (
                            <option key={intervalo.value} value={intervalo.value} className="bg-gray-500 dark:bg-gray-600 text-white">
                              {intervalo.label}
                            </option>
                          ))}
                        </select>
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

  const updateModuleInterval = (module: string, interval: string) => {
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
                    onChange={(e) => updateModuleInterval(module, e.target.value)}
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
                  Proprietário *
                </label>
                <input
                  type="text"
                  value={novoDrive.proprietario}
                  onChange={(e) => setNovoDrive({...novoDrive, proprietario: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Felipe Manieri"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link de Compartilhamento (Opcional)
                </label>
                <input
                  type="url"
                  value={novoDrive.linkCompartilhamento}
                  onChange={(e) => setNovoDrive({...novoDrive, linkCompartilhamento: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Link de compartilhamento do drive"
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
                  if (novoDrive.nome && novoDrive.url && novoDrive.proprietario) {
                    const now = new Date();
                    const dateString = now.toLocaleDateString('pt-BR');
                    const timeString = now.toLocaleString('pt-BR');
                    
                    const newDrive = {
                      id: Date.now(),
                      nome: novoDrive.nome,
                      url: novoDrive.url,
                      status: 'ativo',
                      usado: '0 GB',
                      espaco: '15 GB',
                      observacao: novoDrive.observacao,
                      proprietario: novoDrive.proprietario,
                      linkCompartilhamento: novoDrive.linkCompartilhamento || novoDrive.url,
                      dataCriacao: dateString,
                      ultimaModificacao: timeString,
                      ultimaSync: timeString,
                      arquivos: '0',
                      pastas: '0',
                      intervaloBackup: '5m'
                    };
                    setDrives([...drives, newDrive]);
                    setNovoDrive({ nome: '', url: '', observacao: '', proprietario: '', linkCompartilhamento: '' });
                    setShowAddDriveModal(false);
                    showInternalNotification('Drive adicionado com sucesso!', 'success');
                  } else {
                    showInternalNotification('Preencha todos os campos obrigatórios (Nome, URL e Proprietário).', 'error');
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
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
                className="flex-1 px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
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
