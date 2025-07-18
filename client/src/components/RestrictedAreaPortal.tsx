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
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // DESABILITAR TODAS AS NOTIFICAÇÕES DO RESTRICTED AREA PORTAL
  const [notifications, setNotifications] = useState([]);
  
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
        // Força recarregamento da página principal
        window.parent.postMessage({ type: 'PORTAL_VISIBILITY_CHANGED' }, '*');
      }
    } catch (error) {
      console.error('Erro ao salvar visibilidade dos portais:', error);
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
    { id: 1, nome: 'Drive Principal', url: 'https://drive.google.com/drive/folders/1FAIpQLScQKE8BjIZJ-abmix-proposals', status: 'ativo', espaco: '15 GB', usado: '8.2 GB' },
    { id: 2, nome: 'Drive Backup', url: 'https://drive.google.com/drive/folders/1FAIpQLScQKE8BjIZJ-backup', status: 'ativo', espaco: '15 GB', usado: '3.1 GB' },
    { id: 3, nome: 'Drive Arquivo', url: 'https://drive.google.com/drive/folders/1FAIpQLScQKE8BjIZJ-arquivo', status: 'inativo', espaco: '15 GB', usado: '12.8 GB' }
  ]);
  const [novoDrive, setNovoDrive] = useState({ nome: '', url: '' });

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
    { id: 'planilha', label: 'Visualizar Planilha', icon: FileSpreadsheet },
    { id: 'logs', label: 'Logs Sistema', icon: Monitor },
    { id: 'tempo', label: 'Configurações Tempo', icon: Clock },
    { id: 'automacao', label: 'Automação', icon: Bot },
    { id: 'integracoes', label: 'Integrações', icon: Link },
    { id: 'planilhas', label: 'Config Planilhas', icon: BarChart3 },
    { id: 'drive', label: 'Google Drive', icon: HardDrive },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
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
        alert(`✅ ${result.message}\n\nÚltima atualização: ${new Date(result.timestamp).toLocaleString('pt-BR')}`);
      } else {
        alert(`❌ Erro na sincronização: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      alert('❌ Erro de conexão. Verifique sua internet e tente novamente.');
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

  // Função para renderizar a seção de configurações de tempo
  function renderTempoSection() {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Tempo de Atualização</h3>
                <p className="text-gray-600 dark:text-gray-300">Controle completo dos intervalos de sincronização do sistema</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => alert('Todas as atualizações foram desabilitadas temporariamente!')}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Desabilitar Todas
              </button>
              <button
                onClick={() => alert('Todas as atualizações foram habilitadas!')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Habilitar Todas
              </button>
            </div>
          </div>

          {/* Configurações de Atualizações de Dados */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Atualizações de Dados</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Propostas (Consulta React)</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="1">1 segundo</option>
                  <option value="5">5 segundos</option>
                  <option value="10">10 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="180">3 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="18000">5 horas</option>
                  <option value="36000">10 horas</option>
                  <option value="54000">15 horas</option>
                  <option value="86400">24 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Usuários e Vendedores</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="180">3 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="18000">5 horas</option>
                  <option value="36000">10 horas</option>
                  <option value="54000">15 horas</option>
                  <option value="86400">24 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Anexos</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="60">1 minuto</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora (atual)</option>
                  <option value="10800">3 horas</option>
                  <option value="18000">5 horas</option>
                  <option value="36000">10 horas</option>
                  <option value="54000">15 horas</option>
                  <option value="86400">24 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cache e Sincronização */}
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <RefreshCw className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Cache e Sincronização</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Atualização automática do celular</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                  <option value="30">30 segundos (atual)</option>
                  <option value="60">1 minuto</option>
                  <option value="180">3 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="18000">5 horas</option>
                  <option value="36000">10 horas</option>
                  <option value="54000">15 horas</option>
                  <option value="86400">24 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Cache do Navegador</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                  <option value="600">10 minutos (atual)</option>
                  <option value="300">5 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="18000">5 horas</option>
                  <option value="36000">10 horas</option>
                  <option value="54000">15 horas</option>
                  <option value="86400">24 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Limpeza de Cache Automática</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                  <option value="enabled">Habilitada (atual)</option>
                  <option value="disabled">Desabilitada</option>
                </select>
              </div>
            </div>
          </div>

          {/* APIs do Google */}
          <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Cloud className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">APIs do Google</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Folhas de Sincronização</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
                  <option value="manual">Manual (atual)</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="18000">5 horas</option>
                  <option value="36000">10 horas</option>
                  <option value="54000">15 horas</option>
                  <option value="86400">24 horas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Carregar no Google Drive</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
                  <option value="realtime">Tempo Real (atual)</option>
                  <option value="60">1 minuto</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="18000">5 horas</option>
                  <option value="36000">10 horas</option>
                  <option value="54000">15 horas</option>
                  <option value="86400">24 horas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Limitação de taxa</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
                  <option value="2">2 segundos (atual)</option>
                  <option value="1">1 segundo</option>
                  <option value="5">5 segundos</option>
                  <option value="10">10 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sistema Geral */}
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Sistema Geral</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Timeout de Sessão</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500">
                  <option value="3600">1 hora (atual)</option>
                  <option value="1800">30 minutos</option>
                  <option value="7200">2 horas</option>
                  <option value="10800">3 horas</option>
                  <option value="18000">5 horas</option>
                  <option value="36000">10 horas</option>
                  <option value="54000">15 horas</option>
                  <option value="86400">24 horas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Formulários de salvamento automático</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500">
                  <option value="realtime">Tempo Real (atual)</option>
                  <option value="5">5 segundos</option>
                  <option value="10">10 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="300">5 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Logs de Depuração</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500">
                  <option value="info">Informações, Avisos e Erros (atuais)</option>
                  <option value="debug">Debug Completo</option>
                  <option value="error">Apenas Erros</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notificações e Alertas */}
          <div className="bg-red-50 dark:bg-red-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Notificações e Alertas</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Notificações Push</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500">
                  <option value="realtime">Tempo Real (atual)</option>
                  <option value="5">5 segundos</option>
                  <option value="10">10 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Alertas de Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500">
                  <option value="30">30 segundos (atual)</option>
                  <option value="60">1 minuto</option>
                  <option value="180">3 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Verificação de Email</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500">
                  <option value="600">10 minutos (atual)</option>
                  <option value="300">5 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="21600">6 horas</option>
                  <option value="43200">12 horas</option>
                  <option value="86400">24 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Backup e Segurança */}
          <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Backup e Segurança</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Backup Automático</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                  <option value="86400">24 horas (atual)</option>
                  <option value="43200">12 horas</option>
                  <option value="21600">6 horas</option>
                  <option value="10800">3 horas</option>
                  <option value="3600">1 hora</option>
                  <option value="1800">30 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Verificação de Segurança</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                  <option value="3600">1 hora (atual)</option>
                  <option value="1800">30 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="10800">3 horas</option>
                  <option value="21600">6 horas</option>
                  <option value="43200">12 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Log de Auditoria</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                  <option value="realtime">Tempo Real (atual)</option>
                  <option value="60">1 minuto</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configurações Múltiplas Google APIs */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Configurações Múltiplas Google APIs</h4>
            </div>
            
            {/* 3 Google Drives */}
            <div className="mb-6">
              <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                <HardDrive className="w-4 h-4 mr-2" />
                Google Drive - Múltiplas Instâncias
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Google Drive 1 - Principal</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="realtime">Tempo Real (atual)</option>
                    <option value="5">5 segundos</option>
                    <option value="10">10 segundos</option>
                    <option value="30">30 segundos</option>
                    <option value="60">1 minuto</option>
                    <option value="300">5 minutos</option>
                    <option value="600">10 minutos</option>
                    <option value="900">15 minutos</option>
                    <option value="1800">30 minutos</option>
                    <option value="3600">1 hora</option>
                    <option value="disabled">Desabilitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Google Drive 2 - Backup</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="300">5 minutos (atual)</option>
                    <option value="60">1 minuto</option>
                    <option value="600">10 minutos</option>
                    <option value="900">15 minutos</option>
                    <option value="1800">30 minutos</option>
                    <option value="3600">1 hora</option>
                    <option value="10800">3 horas</option>
                    <option value="21600">6 horas</option>
                    <option value="43200">12 horas</option>
                    <option value="86400">24 horas</option>
                    <option value="disabled">Desabilitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Google Drive 3 - Arquivo</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="86400">24 horas (atual)</option>
                    <option value="43200">12 horas</option>
                    <option value="21600">6 horas</option>
                    <option value="10800">3 horas</option>
                    <option value="3600">1 hora</option>
                    <option value="1800">30 minutos</option>
                    <option value="604800">7 dias</option>
                    <option value="disabled">Desabilitado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3 Google Sheets */}
            <div className="mb-6">
              <h5 className="font-medium text-green-700 dark:text-green-300 mb-3 flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Google Sheets - Múltiplas Planilhas
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Planilha 1 - Operacional</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                    <option value="manual">Manual (atual)</option>
                    <option value="realtime">Tempo Real</option>
                    <option value="30">30 segundos</option>
                    <option value="60">1 minuto</option>
                    <option value="180">3 minutos</option>
                    <option value="300">5 minutos</option>
                    <option value="600">10 minutos</option>
                    <option value="900">15 minutos</option>
                    <option value="1800">30 minutos</option>
                    <option value="3600">1 hora</option>
                    <option value="disabled">Desabilitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Planilha 2 - Financeiro</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                    <option value="3600">1 hora (atual)</option>
                    <option value="1800">30 minutos</option>
                    <option value="900">15 minutos</option>
                    <option value="600">10 minutos</option>
                    <option value="300">5 minutos</option>
                    <option value="7200">2 horas</option>
                    <option value="10800">3 horas</option>
                    <option value="21600">6 horas</option>
                    <option value="43200">12 horas</option>
                    <option value="86400">24 horas</option>
                    <option value="disabled">Desabilitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Planilha 3 - Relatórios</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
                    <option value="86400">24 horas (atual)</option>
                    <option value="43200">12 horas</option>
                    <option value="21600">6 horas</option>
                    <option value="10800">3 horas</option>
                    <option value="7200">2 horas</option>
                    <option value="3600">1 hora</option>
                    <option value="604800">7 dias</option>
                    <option value="disabled">Desabilitado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Google Forms e Google Docs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-purple-700 dark:text-purple-300 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Google Forms
                </h5>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Coleta de Respostas</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500">
                    <option value="300">5 minutos (atual)</option>
                    <option value="60">1 minuto</option>
                    <option value="600">10 minutos</option>
                    <option value="900">15 minutos</option>
                    <option value="1800">30 minutos</option>
                    <option value="3600">1 hora</option>
                    <option value="10800">3 horas</option>
                    <option value="21600">6 horas</option>
                    <option value="disabled">Desabilitado</option>
                  </select>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-orange-700 dark:text-orange-300 mb-3 flex items-center">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Google Docs
                </h5>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Geração de Documentos</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500">
                    <option value="manual">Manual (atual)</option>
                    <option value="realtime">Tempo Real</option>
                    <option value="60">1 minuto</option>
                    <option value="300">5 minutos</option>
                    <option value="600">10 minutos</option>
                    <option value="900">15 minutos</option>
                    <option value="1800">30 minutos</option>
                    <option value="3600">1 hora</option>
                    <option value="disabled">Desabilitado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Integrações Externas */}
          <div className="bg-teal-50 dark:bg-teal-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Link className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Integrações Externas</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Webhooks Make.com</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500">
                  <option value="realtime">Tempo Real (atual)</option>
                  <option value="5">5 segundos</option>
                  <option value="10">10 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">APIs Terceiros</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500">
                  <option value="600">10 minutos (atual)</option>
                  <option value="300">5 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="21600">6 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Sincronização WhatsApp</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500">
                  <option value="manual">Manual (atual)</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Monitoramento e Performance */}
          <div className="bg-cyan-50 dark:bg-cyan-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Monitor className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Monitoramento e Performance</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Verificação de Status dos Portais</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500">
                  <option value="30">30 segundos (atual)</option>
                  <option value="60">1 minuto</option>
                  <option value="180">3 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Análise de Performance</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500">
                  <option value="300">5 minutos (atual)</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="3600">1 hora</option>
                  <option value="10800">3 horas</option>
                  <option value="21600">6 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Métricas do Sistema</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500">
                  <option value="60">1 minuto (atual)</option>
                  <option value="30">30 segundos</option>
                  <option value="180">3 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="1800">30 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Automação e Tarefas */}
          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Bot className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Automação e Tarefas</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Tarefas Agendadas</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                  <option value="3600">1 hora (atual)</option>
                  <option value="1800">30 minutos</option>
                  <option value="900">15 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="10800">3 horas</option>
                  <option value="21600">6 horas</option>
                  <option value="43200">12 horas</option>
                  <option value="86400">24 horas</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Processamento de Filas</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                  <option value="10">10 segundos (atual)</option>
                  <option value="5">5 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="180">3 minutos</option>
                  <option value="300">5 minutos</option>
                  <option value="600">10 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Limpeza Automática</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500">
                  <option value="86400">24 horas (atual)</option>
                  <option value="43200">12 horas</option>
                  <option value="21600">6 horas</option>
                  <option value="10800">3 horas</option>
                  <option value="3600">1 hora</option>
                  <option value="1800">30 minutos</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => alert('Configurações aplicadas com sucesso!')}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5 mr-2" />
              Aplicar Configurações
            </button>
            <button
              onClick={() => alert('Sistema otimizado para produção!')}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Zap className="w-5 h-5 mr-2" />
              Otimizar para Produção
            </button>
            <button
              onClick={() => alert('Modo de desenvolvimento ativado!')}
              className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              <Code className="w-5 h-5 mr-2" />
              Modo Desenvolvimento
            </button>
            <button
              onClick={() => alert('Configurações padrão restauradas!')}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Restaurar Padrão
            </button>
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Google Drive Principal</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Envio automático de propostas para pasta principal - Propostas/Ativas
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('drive1')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <HardDrive className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Google Drive Backup</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Backup automático de documentos - Pasta Backup/Diario
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('drive2')}
                  className="px-3 py-1 text-xs bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Archive className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Google Drive Arquivo</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Arquivamento de propostas finalizadas - Pasta Arquivo/Historico
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">⚠ Manual</span>
                <button 
                  onClick={() => configureAutomation('drive3')}
                  className="px-3 py-1 text-xs bg-purple-600 text-white dark:bg-purple-600 dark:text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Planilha Operacional</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Sincronização tempo real - Aba Propostas_Ativas
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('sheet1')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Planilha Financeiro</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Sincronização a cada hora - Aba Financeiro_Consolidado
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('sheet2')}
                  className="px-3 py-1 text-xs bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Planilha Relatórios</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Sincronização diária - Aba Relatorios_Gerenciais
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">🔄 Diário</span>
                <button 
                  onClick={() => configureAutomation('sheet3')}
                  className="px-3 py-1 text-xs bg-purple-600 text-white dark:bg-purple-600 dark:text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Google Forms</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Coleta automática de respostas e integração com sistema
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('forms')}
                  className="px-3 py-1 text-xs bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileCheck className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Google Docs</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-white mb-4">
                Geração automática de documentos e contratos
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">⚠ Manual</span>
                <button 
                  onClick={() => configureAutomation('docs')}
                  className="px-3 py-1 text-xs bg-orange-600 text-white dark:bg-orange-600 dark:text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Tarefas Automáticas</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Agendamento e execução de tarefas programadas
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('tasks')}
                  className="px-3 py-1 text-xs bg-cyan-600 text-white dark:bg-cyan-600 dark:text-white rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Webhook className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Integrações Externas</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Webhooks, Make.com e APIs de terceiros
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('external')}
                  className="px-3 py-1 text-xs bg-red-600 text-white dark:bg-red-600 dark:text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Notificações WhatsApp</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Envio automático para vendedores e clientes
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('whatsapp')}
                  className="px-3 py-1 text-xs bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Cloud className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Backup Automático</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Backup diário de todos os dados do sistema
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                <button 
                  onClick={() => configureAutomation('backup')}
                  className="px-3 py-1 text-xs bg-gray-600 text-white dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
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
    return (
      <div className="space-y-6">
        {/* Automação com Make e Zapier */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Webhook className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Plataformas de Automação</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Make.com */}
            <div className="border border-blue-200 dark:border-blue-600 rounded-lg p-6 bg-blue-50 dark:bg-blue-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Make.com (Integromat)</h4>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-blue-700 dark:text-blue-300 mb-1">Webhook URL</label>
                  <input 
                    type="text" 
                    placeholder="https://hook.eu1.make.com/..."
                    className="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-blue-700 dark:text-blue-300 mb-1">API Key</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-blue-700 dark:text-blue-300 mb-1">Cenários Ativos</label>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    • Propostas → Google Drive<br/>
                    • Notificações WhatsApp<br/>
                    • Sync Planilhas<br/>
                    • Backup Automático
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Configurar Make.com
                </button>
              </div>
            </div>

            {/* Zapier */}
            <div className="border border-orange-200 dark:border-orange-600 rounded-lg p-6 bg-orange-50 dark:bg-orange-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bot className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">Zapier</h4>
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-orange-700 dark:text-orange-300 mb-1">Webhook URL</label>
                  <input 
                    type="text" 
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="w-full px-3 py-2 text-sm border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-orange-700 dark:text-orange-300 mb-1">API Key</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-2 text-sm border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-orange-700 dark:text-orange-300 mb-1">Zaps Configurados</label>
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    • Email Automático<br/>
                    • CRM Integration<br/>
                    • Slack Notifications<br/>
                    • Calendar Events
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Configurar Zapier
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* APIs Externas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Code className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Integrações API</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* WhatsApp Business API */}
            <div className="border border-green-200 dark:border-green-600 rounded-lg p-4 bg-green-50 dark:bg-green-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-green-800 dark:text-green-200">WhatsApp Business</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Phone Number ID"
                  className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Access Token"
                  className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* SendGrid Email */}
            <div className="border border-blue-200 dark:border-blue-600 rounded-lg p-4 bg-blue-50 dark:bg-blue-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-blue-800 dark:text-blue-200">SendGrid Email</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="From Email"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Twilio SMS */}
            <div className="border border-purple-200 dark:border-purple-600 rounded-lg p-4 bg-purple-50 dark:bg-purple-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-purple-800 dark:text-purple-200">Twilio SMS</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Account SID"
                  className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Auth Token"
                  className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Slack API */}
            <div className="border border-indigo-200 dark:border-indigo-600 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-indigo-800 dark:text-indigo-200">Slack</h5>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Workspace URL"
                  className="w-full px-2 py-1 text-xs border border-indigo-300 dark:border-indigo-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Bot Token"
                  className="w-full px-2 py-1 text-xs border border-indigo-300 dark:border-indigo-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Pipedrive CRM */}
            <div className="border border-orange-200 dark:border-orange-600 rounded-lg p-4 bg-orange-50 dark:bg-orange-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-orange-800 dark:text-orange-200">Pipedrive CRM</h5>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Company Domain"
                  className="w-full px-2 py-1 text-xs border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Token"
                  className="w-full px-2 py-1 text-xs border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* HubSpot */}
            <div className="border border-cyan-200 dark:border-cyan-600 rounded-lg p-4 bg-cyan-50 dark:bg-cyan-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-cyan-800 dark:text-cyan-200">HubSpot</h5>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Portal ID"
                  className="w-full px-2 py-1 text-xs border border-cyan-300 dark:border-cyan-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Private App Token"
                  className="w-full px-2 py-1 text-xs border border-cyan-300 dark:border-cyan-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Telegram Bot */}
            <div className="border border-teal-200 dark:border-teal-600 rounded-lg p-4 bg-teal-50 dark:bg-teal-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-teal-800 dark:text-teal-200">Telegram Bot</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Bot Username"
                  className="w-full px-2 py-1 text-xs border border-teal-300 dark:border-teal-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Bot Token"
                  className="w-full px-2 py-1 text-xs border border-teal-300 dark:border-teal-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Microsoft Teams */}
            <div className="border border-blue-200 dark:border-blue-600 rounded-lg p-4 bg-blue-50 dark:bg-blue-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-blue-800 dark:text-blue-200">Microsoft Teams</h5>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Tenant ID"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Client Secret"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Discord Webhook */}
            <div className="border border-purple-200 dark:border-purple-600 rounded-lg p-4 bg-purple-50 dark:bg-purple-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-purple-800 dark:text-purple-200">Discord</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Server ID"
                  className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Webhook URL"
                  className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Mailchimp */}
            <div className="border border-yellow-200 dark:border-yellow-600 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-200">Mailchimp</h5>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Audience ID"
                  className="w-full px-2 py-1 text-xs border border-yellow-300 dark:border-yellow-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-yellow-300 dark:border-yellow-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* AWS S3 */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-800 dark:text-gray-200">AWS S3</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Bucket Name"
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Access Key"
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Notion API */}
            <div className="border border-black dark:border-white rounded-lg p-4 bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-black dark:text-white">Notion</h5>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Database ID"
                  className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Integration Token"
                  className="w-full px-2 py-1 text-xs border border-gray-400 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="w-full px-3 py-2 bg-black dark:bg-white text-white dark:text-black text-xs rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </div>

          {/* Botões Globais */}
          <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button 
              onClick={() => alert('Testando todas as APIs...')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Testar Todas APIs
            </button>
            <button 
              onClick={() => alert('Exportando configurações...')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Config
            </button>
            <button 
              onClick={() => alert('Importando configurações...')}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar Config
            </button>
            <button 
              onClick={() => alert('Configurações salvas!')}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Tudo
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderPlanilhasSection() {
    return (
      <div className="space-y-6">
        {/* Configurações de Tempo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Tempo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sincronização Tempo Real */}
            <div className="border border-green-200 dark:border-green-600 rounded-lg p-4 bg-green-50 dark:bg-green-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-green-800 dark:text-green-200">Tempo Real</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-green-700 dark:text-green-300 mb-1">Intervalo (segundos)</label>
                <input 
                  type="number" 
                  defaultValue="5"
                  className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-green-700 dark:text-green-300">
                  Planilhas Operacionais<br/>
                  Status: Ativo
                </div>
                <button className="w-full px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Sincronização de 5 Minutos */}
            <div className="border border-blue-200 dark:border-blue-600 rounded-lg p-4 bg-blue-50 dark:bg-blue-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-blue-800 dark:text-blue-200">5 Minutos</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-blue-700 dark:text-blue-300 mb-1">Ativa às (minutos)</label>
                <input 
                  type="text" 
                  defaultValue="0,5,10,15,20,25"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Backup Incremental<br/>
                  Status: Ativo
                </div>
                <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Sincronização Horária */}
            <div className="border border-purple-200 dark:border-purple-600 rounded-lg p-4 bg-purple-50 dark:bg-purple-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-purple-800 dark:text-purple-200">A Cada Hora</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-purple-700 dark:text-purple-300 mb-1">Horários</label>
                <select className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="full">Todas as horas</option>
                  <option value="business">Horário comercial</option>
                  <option value="custom">Personalizado</option>
                </select>
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  Planilhas Financeiras<br/>
                  Status: Ativo
                </div>
                <button className="w-full px-3 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Sincronização Diária */}
            <div className="border border-orange-200 dark:border-orange-600 rounded-lg p-4 bg-orange-50 dark:bg-orange-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-orange-800 dark:text-orange-200">Diário</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-orange-700 dark:text-orange-300 mb-1">Horário</label>
                <input 
                  type="time" 
                  defaultValue="02:00"
                  className="w-full px-2 py-1 text-xs border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  Relatórios Gerenciais<br/>
                  Status: Ativo
                </div>
                <button className="w-full px-3 py-2 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações Make.com */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações Make.com</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cenário 1 - Propostas */}
            <div className="border border-blue-200 dark:border-blue-600 rounded-lg p-4 bg-blue-50 dark:bg-blue-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-blue-800 dark:text-blue-200">Cenário: Propostas</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Webhook URL"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Trigger: Nova Proposta<br/>
                  Ação: Google Drive + Planilha
                </div>
                <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Cenário 2 - Notificações */}
            <div className="border border-green-200 dark:border-green-600 rounded-lg p-4 bg-green-50 dark:bg-green-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-green-800 dark:text-green-200">Cenário: Notificações</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Webhook URL"
                  className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-green-700 dark:text-green-300">
                  Trigger: Status Change<br/>
                  Ação: WhatsApp + Email
                </div>
                <button className="w-full px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Cenário 3 - Backup */}
            <div className="border border-purple-200 dark:border-purple-600 rounded-lg p-4 bg-purple-50 dark:bg-purple-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-purple-800 dark:text-purple-200">Cenário: Backup</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Webhook URL"
                  className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  Trigger: Agenda<br/>
                  Ação: Export + Storage
                </div>
                <button className="w-full px-3 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações Zapier */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Bot className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações Zapier</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Zap 1 - Email Automático */}
            <div className="border border-orange-200 dark:border-orange-600 rounded-lg p-4 bg-orange-50 dark:bg-orange-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-orange-800 dark:text-orange-200">Zap: Email Automático</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Webhook URL"
                  className="w-full px-2 py-1 text-xs border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  Trigger: Proposta Aprovada<br/>
                  Ação: Envio Automático
                </div>
                <button className="w-full px-3 py-2 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Zap 2 - CRM Integration */}
            <div className="border border-cyan-200 dark:border-cyan-600 rounded-lg p-4 bg-cyan-50 dark:bg-cyan-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-cyan-800 dark:text-cyan-200">Zap: CRM Integration</h5>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Webhook URL"
                  className="w-full px-2 py-1 text-xs border border-cyan-300 dark:border-cyan-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-cyan-300 dark:border-cyan-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-cyan-700 dark:text-cyan-300">
                  Trigger: Cliente Criado<br/>
                  Ação: Sync Pipedrive/HubSpot
                </div>
                <button className="w-full px-3 py-2 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Zap 3 - Slack Notifications */}
            <div className="border border-indigo-200 dark:border-indigo-600 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-indigo-800 dark:text-indigo-200">Zap: Slack Notifications</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Webhook URL"
                  className="w-full px-2 py-1 text-xs border border-indigo-300 dark:border-indigo-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-indigo-300 dark:border-indigo-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-indigo-700 dark:text-indigo-300">
                  Trigger: Meta Atingida<br/>
                  Ação: Mensagem no Canal
                </div>
                <button className="w-full px-3 py-2 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* APIs Específicas para Planilhas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Code className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">APIs para Planilhas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Google Sheets API */}
            <div className="border border-green-200 dark:border-green-600 rounded-lg p-4 bg-green-50 dark:bg-green-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-green-800 dark:text-green-200">Google Sheets API</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Spreadsheet ID"
                  className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Service Account Key"
                  className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-green-700 dark:text-green-300">
                  Operações: Read/Write<br/>
                  Range: A1:ZZ1000
                </div>
                <button className="w-full px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Excel Online API */}
            <div className="border border-blue-200 dark:border-blue-600 rounded-lg p-4 bg-blue-50 dark:bg-blue-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-blue-800 dark:text-blue-200">Excel Online API</h5>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Workbook ID"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Access Token"
                  className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Operações: Read Only<br/>
                  Worksheet: Dados
                </div>
                <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Airtable API */}
            <div className="border border-yellow-200 dark:border-yellow-600 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-200">Airtable API</h5>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Base ID"
                  className="w-full px-2 py-1 text-xs border border-yellow-300 dark:border-yellow-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="API Key"
                  className="w-full px-2 py-1 text-xs border border-yellow-300 dark:border-yellow-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  Table: Propostas<br/>
                  View: Grid View
                </div>
                <button className="w-full px-3 py-2 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* CSV Export API */}
            <div className="border border-purple-200 dark:border-purple-600 rounded-lg p-4 bg-purple-50 dark:bg-purple-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-purple-800 dark:text-purple-200">CSV Export API</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Export Endpoint"
                  className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Auth Token"
                  className="w-full px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  Format: UTF-8 CSV<br/>
                  Delimiter: Comma
                </div>
                <button className="w-full px-3 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* Database Sync API */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-800 dark:text-gray-200">Database Sync API</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Database URL"
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Connection String"
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  Type: PostgreSQL<br/>
                  Sync: Bidirectional
                </div>
                <button className="w-full px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            {/* REST API Webhook */}
            <div className="border border-red-200 dark:border-red-600 rounded-lg p-4 bg-red-50 dark:bg-red-900">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-red-800 dark:text-red-200">REST API Webhook</h5>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Webhook URL"
                  className="w-full px-2 py-1 text-xs border border-red-300 dark:border-red-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input 
                  type="password" 
                  placeholder="Secret Key"
                  className="w-full px-2 py-1 text-xs border border-red-300 dark:border-red-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-xs text-red-700 dark:text-red-300">
                  Method: POST<br/>
                  Content-Type: JSON
                </div>
                <button className="w-full px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </div>

          {/* Botões Globais Config Planilhas */}
          <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button 
              onClick={() => alert('Sincronizando todas as planilhas...')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar Tudo
            </button>
            <button 
              onClick={() => alert('Testando APIs...')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Testar APIs
            </button>
            <button 
              onClick={() => alert('Exportando configurações...')}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Config
            </button>
            <button 
              onClick={() => alert('Configurações salvas!')}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Tudo
            </button>
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gerenciamento do Google Drive</h3>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={openGoogleDrive}
                className="flex items-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Drive
              </button>
              <button 
                onClick={() => setShowDriveManagementModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </button>
            </div>
          </div>

          {/* Estatísticas do Drive */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">247</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Pastas Criadas</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-200">1,834</div>
              <div className="text-sm text-green-600 dark:text-green-400">Documentos</div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Cloud className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">8.2 GB</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Armazenamento</div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-200">99.1%</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Sync Rate</div>
            </div>
          </div>

          {/* Lista de Drives Configurados */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Drives Configurados</h4>
            <div className="space-y-3">
              {drives.map((drive) => (
                <div key={drive.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${drive.status === 'ativo' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{drive.nome}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{drive.usado} / {drive.espaco}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => window.open(drive.url, '_blank')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                    >
                      Abrir
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-600 text-white dark:bg-gray-600 dark:text-white rounded hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
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
        {activeTab === 'planilha' && <PlanilhaViewer />}
        {activeTab === 'logs' && <LogsViewer />}
        {activeTab === 'tempo' && renderTempoSection()}
        {activeTab === 'backup' && <BackupManager />}
        {activeTab === 'automacao' && renderAutomacaoSection()}
        {activeTab === 'integracoes' && renderIntegracoesSection()}
        {activeTab === 'planilhas' && renderPlanilhasSection()}
        {activeTab === 'drive' && renderDriveSection()}
        {activeTab === 'sistema' && renderSistemaSection()}
      </main>

      {/* Modal de Gerenciamento de Drive */}
      {showDriveManagementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gerenciar Drive</h3>
              </div>
              <button
                onClick={() => setShowDriveManagementModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Formulário para adicionar novo drive */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Adicionar Novo Drive</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Nome do Drive</label>
                  <input
                    type="text"
                    value={novoDrive.nome}
                    onChange={(e) => setNovoDrive({...novoDrive, nome: e.target.value})}
                    placeholder="Ex: Drive Documentos"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">URL do Drive</label>
                  <input
                    type="url"
                    value={novoDrive.url}
                    onChange={(e) => setNovoDrive({...novoDrive, url: e.target.value})}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (novoDrive.nome && novoDrive.url) {
                      const newDrive = {
                        id: drives.length + 1,
                        nome: novoDrive.nome,
                        url: novoDrive.url,
                        status: 'ativo',
                        espaco: '15 GB',
                        usado: '0 GB'
                      };
                      setDrives([...drives, newDrive]);
                      setNovoDrive({ nome: '', url: '' });
                      alert('Drive adicionado com sucesso!');
                    } else {
                      alert('Preencha todos os campos obrigatórios.');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Adicionar Drive
                </button>
              </div>
            </div>

            {/* Lista de drives existentes */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Drives Configurados ({drives.length})</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">NOME</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">STATUS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">ESPAÇO USADO</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">ESPAÇO TOTAL</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drives.map((drive) => (
                      <tr key={drive.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:bg-gray-600">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <HardDrive className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{drive.nome}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{drive.url}</div>
                            </div>
                          </div>
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
                          <span className="text-sm text-gray-900 dark:text-white">{drive.usado}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900 dark:text-white">{drive.espaco}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(drive.url, '_blank')}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              title="Abrir Drive"
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
                                if (confirm(`Tem certeza que deseja excluir o drive "${drive.nome}"?`)) {
                                  setDrives(drives.filter(d => d.id !== drive.id));
                                  alert('Drive excluído com sucesso!');
                                }
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Excluir Drive"
                            >
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

            {/* Estatísticas dos drives */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-900 dark:text-white">{drives.length}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total de Drives</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-900 dark:text-white">{drives.filter(d => d.status === 'ativo').length}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Drives Ativos</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-900 dark:text-white">{drives.filter(d => d.status === 'inativo').length}</div>
                  <div className="text-sm text-red-600 dark:text-red-400">Drives Inativos</div>
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
                  alert('Configurações do WhatsApp salvas com sucesso!');
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
                  alert('Configurações de backup salvas! Próximo backup: hoje às 02:00');
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
      
      {/* System Footer */}
      <SystemFooter />
    </div>
  );
}