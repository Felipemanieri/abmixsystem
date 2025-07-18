import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Users, FileText, Link, Eye, BarChart3, Clock, CheckCircle, AlertCircle, Copy, ExternalLink, Download, Search, Filter, ArrowLeft, Home, Bell, Calculator, Target, TrendingUp, DollarSign, X, Mail, Image, MessageSquare, MessageCircle, Trash2, Camera, Upload, Paperclip } from 'lucide-react';
// import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import NotificationCenter from './NotificationCenter';
import ProposalGenerator from './ProposalGenerator';
import ProposalTracker from './ProposalTracker';
import QuotationPanel from './QuotationPanel';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import SystemFooter from './SystemFooter';
import ThemeToggle from './ThemeToggle';

import { showNotification } from '../utils/notifications';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { useVendorProposals, useRealTimeProposals, useDeleteProposal } from '../hooks/useProposals';
import StatusManager, { ProposalStatus } from '@shared/statusSystem';

interface VendorPortalProps {
  user: any;
  onLogout: () => void;
}

type VendorView = 'dashboard' | 'new-proposal' | 'tracker' | 'clients' | 'spreadsheet' | 'quotation' | 'cotacoes' | 'quotations';

interface Proposal {
  id: string;
  client: string;
  plan: string;
  status: string;
  progress: number;
  date: string;
  link: string;
  value: string;
  empresa: string;
  cnpj: string;
  vendedor: string;
  documents: number;
  lastActivity: string;
  email: string;
  phone: string;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
}

interface QuotationData {
  numeroVidas: number;
  operadora: string;
  idades: number[];
}

interface Cotacao {
  id: string;
  operadora: string;
  tipoplano: string;
  numeroVidas: number;
  valor: string;
  validade: string;
  dataEnvio: string;
  arquivos: File[];
  clienteId?: string;
  proposalId?: string;
}

const VendorPortal: React.FC<VendorPortalProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<VendorView>('dashboard');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Hook para propostas do vendedor
  const { proposals: realProposals, isLoading: proposalsLoading } = useVendorProposals(user?.id || 0);
  useRealTimeProposals(user?.id); // Ativa a atualização em tempo real para este vendedor
  
  // Hook para exclusão de propostas
  const deleteProposal = useDeleteProposal();

  // Função para confirmar e excluir proposta
  const handleDeleteProposal = async (proposalId: string, cliente: string) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a proposta de ${cliente}?\n\nEsta ação não pode ser desfeita e os valores deixarão de ser considerados nas estatísticas.`
    );
    
    if (confirmed) {
      try {
        await deleteProposal.mutateAsync(proposalId);
        showNotification('Proposta excluída com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir proposta:', error);
        showNotification('Erro ao excluir proposta. Tente novamente.', 'error');
      }
    }
  };
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [statusManager] = useState(() => StatusManager.getInstance());
  const [proposalStatuses, setProposalStatuses] = useState<Map<string, ProposalStatus>>(new Map());
  const [quotationData, setQuotationData] = useState<QuotationData>({
    numeroVidas: 1,
    operadora: '',
    idades: [25]
  });
  const [arquivosAnexados, setArquivosAnexados] = useState<File[]>([]);
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [novaCotacao, setNovaCotacao] = useState<Cotacao>({
    id: '',
    operadora: '',
    tipoplano: '',
    numeroVidas: 1,
    valor: '',
    validade: '',
    dataEnvio: new Date().toISOString().split('T')[0],
    arquivos: []
  });
  const [dragActive, setDragActive] = useState(false);
  const { getClientDocuments } = useGoogleDrive();

  // Funções corrigidas para upload de arquivos
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const novosArquivos = Array.from(e.dataTransfer.files);
      setNovaCotacao(prev => ({
        ...prev,
        arquivos: [...prev.arquivos, ...novosArquivos]
      }));
      showNotification(`${novosArquivos.length} arquivo(s) anexado(s) via drag & drop!`, 'success');
    }
  };

  const handleAnexarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const novosArquivos = Array.from(files);
      setNovaCotacao(prev => ({
        ...prev,
        arquivos: [...prev.arquivos, ...novosArquivos]
      }));
      showNotification(`${novosArquivos.length} arquivo(s) anexado(s)!`, 'success');
    }
  };

  // Resto das funções continuam iguais...
  const salvarCotacao = () => {
    if (!novaCotacao.operadora || !novaCotacao.tipoplano || !novaCotacao.valor) {
      showNotification('Preencha todos os campos obrigatórios da cotação', 'error');
      return;
    }

    const cotacao: Cotacao = {
      ...novaCotacao,
      id: Date.now().toString(),
    };

    setCotacoes(prev => [...prev, cotacao]);
    
    setNovaCotacao({
      id: '',
      operadora: '',
      tipoplano: '',
      numeroVidas: 1,
      valor: '',
      validade: '',
      dataEnvio: new Date().toISOString().split('T')[0],
      arquivos: []
    });
    showNotification('Cotação adicionada com sucesso!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Interface do VendorPortal com todas as funcionalidades */}
      <div className="p-4">
        <h1>Portal Vendedor - {user?.name}</h1>
        
        {/* Área de upload com drag & drop funcionando */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Anexar Cotação
          </label>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Arraste arquivos aqui ou escolha uma opção
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Suporte para PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <label htmlFor="escolher-arquivo" className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleAnexarArquivo}
                className="hidden"
                id="escolher-arquivo"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Escolher Arquivo</span>
            </label>
          </div>
        </div>

        {/* Lista de arquivos anexados */}
        {novaCotacao.arquivos.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Arquivos Anexados ({novaCotacao.arquivos.length})
            </p>
            <div className="space-y-2">
              {novaCotacao.arquivos.map((arquivo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{arquivo.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setNovaCotacao(prev => ({
                        ...prev,
                        arquivos: prev.arquivos.filter((_, i) => i !== index)
                      }));
                      showNotification('Arquivo removido!', 'success');
                    }}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <SystemFooter />
    </div>
  );
};

export default VendorPortal;