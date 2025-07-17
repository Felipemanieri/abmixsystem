import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Paperclip, 
  Download, 
  Trash2, 
  Eye,
  Upload,
  FileText,
  Image,
  File,
  Search,
  Filter,
  Plus,
  HardDrive,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  FolderOpen,
  Database,
  Cloud
} from 'lucide-react';

interface Attachment {
  id: number;
  proposalId: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  driveFileId?: string;
  driveUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface DriveConfig {
  id: string;
  name: string;
  email: string;
  folderId: string;
  isActive: boolean;
  createdAt: string;
}

export default function AttachmentManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState('all');
  const [selectedDrive, setSelectedDrive] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [newDrive, setNewDrive] = useState({ name: '', email: '', folderId: '' });
  
  const queryClient = useQueryClient();

  // Fetch attachments
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['/api/attachments'],
    queryFn: async () => {
      const response = await fetch('/api/attachments');
      if (!response.ok) throw new Error('Failed to fetch attachments');
      return response.json();
    },
    refetchInterval: 60000 // 60 segundos - otimizado
  });

  // Fetch Google Drive configs
  const { data: driveConfigs = [] } = useQuery({
    queryKey: ['/api/drive-configs'],
    queryFn: async () => {
      const response = await fetch('/api/drive-configs');
      if (!response.ok) throw new Error('Failed to fetch drive configs');
      return response.json();
    }
  });

  // Fetch proposals for filter
  const { data: proposals = [] } = useQuery({
    queryKey: ['/api/proposals'],
    queryFn: async () => {
      const response = await fetch('/api/proposals');
      if (!response.ok) throw new Error('Failed to fetch proposals');
      return response.json();
    }
  });

  // Mutations for attachment actions
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, approvedBy }: { id: number; status: string; approvedBy?: string }) => {
      const response = await fetch(`/api/attachments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, approvedBy })
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/attachments'] });
    }
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/attachments/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete attachment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/attachments'] });
    }
  });

  const addDriveConfigMutation = useMutation({
    mutationFn: async (config: { name: string; email: string; folderId: string }) => {
      const response = await fetch('/api/drive-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!response.ok) throw new Error('Failed to add drive config');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/drive-configs'] });
      setShowDriveModal(false);
      setNewDrive({ name: '', email: '', folderId: '' });
    }
  });

  // Filter attachments
  const filteredAttachments = attachments.filter((attachment: Attachment) => {
    const matchesSearch = attachment.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attachment.proposalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || attachment.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || attachment.status === selectedStatus;
    const matchesProposal = selectedProposal === 'all' || attachment.proposalId === selectedProposal;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesProposal;
  });

  // Statistics
  const totalAttachments = attachments.length;
  const pendingApproval = attachments.filter((a: Attachment) => a.status === 'pending').length;
  const approvedAttachments = attachments.filter((a: Attachment) => a.status === 'approved').length;
  const totalSize = attachments.reduce((sum: number, a: Attachment) => sum + a.fileSize, 0);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando anexos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Anexos</h1>
          <p className="text-gray-600">Gerencie documentos e arquivos do sistema</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDriveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configurar Drive
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Manual
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Anexos</p>
              <p className="text-xl font-bold text-gray-900">{totalAttachments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendente Aprovação</p>
              <p className="text-xl font-bold text-gray-900">{pendingApproval}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aprovados</p>
              <p className="text-xl font-bold text-gray-900">{approvedAttachments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Espaço Usado</p>
              <p className="text-xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nome do arquivo ou proposta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as categorias</option>
              <option value="identity">Documentos de Identidade</option>
              <option value="financial">Documentos Financeiros</option>
              <option value="proposal">Propostas</option>
              <option value="contract">Contratos</option>
              <option value="other">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposta</label>
            <select
              value={selectedProposal}
              onChange={(e) => setSelectedProposal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as propostas</option>
              {proposals.map((proposal: any) => (
                <option key={proposal.id} value={proposal.id}>
                  {proposal.id} - {proposal.contractData?.nomeEmpresa || 'Sem nome'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drive</label>
            <select
              value={selectedDrive}
              onChange={(e) => setSelectedDrive(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os drives</option>
              {driveConfigs.map((drive: DriveConfig) => (
                <option key={drive.id} value={drive.id}>
                  {drive.name} ({drive.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attachments Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arquivo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proposta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enviado por</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAttachments.map((attachment: Attachment) => (
                <tr key={attachment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(attachment.fileType)}
                      <div>
                        <p className="font-medium text-gray-900">{attachment.originalName}</p>
                        <p className="text-sm text-gray-500">{attachment.fileType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{attachment.proposalId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {attachment.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{formatFileSize(attachment.fileSize)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(attachment.status)}
                      <span className="text-sm capitalize">{attachment.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{attachment.uploadedBy}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">
                      {new Date(attachment.uploadedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {attachment.driveUrl && (
                        <button
                          onClick={() => window.open(attachment.driveUrl, '_blank')}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Abrir no Drive"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                      
                      {attachment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatusMutation.mutate({ 
                              id: attachment.id, 
                              status: 'approved',
                              approvedBy: 'Admin' // Em produção, use o usuário atual
                            })}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Aprovar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ 
                              id: attachment.id, 
                              status: 'rejected',
                              approvedBy: 'Admin'
                            })}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Rejeitar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => deleteAttachmentMutation.mutate(attachment.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                        title="Excluir"
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

        {filteredAttachments.length === 0 && (
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum anexo encontrado</h3>
            <p className="text-gray-500">
              {attachments.length === 0 
                ? 'Não há anexos no sistema ainda.'
                : 'Tente ajustar os filtros para encontrar o que procura.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Drive Configuration Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Configurar Google Drive</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Configuração</label>
                <input
                  type="text"
                  value={newDrive.name}
                  onChange={(e) => setNewDrive({ ...newDrive, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Drive Principal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email do Google</label>
                <input
                  type="email"
                  value={newDrive.email}
                  onChange={(e) => setNewDrive({ ...newDrive, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="usuario@gmail.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID da Pasta Drive</label>
                <input
                  type="text"
                  value={newDrive.folderId}
                  onChange={(e) => setNewDrive({ ...newDrive, folderId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDriveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => addDriveConfigMutation.mutate(newDrive)}
                disabled={!newDrive.name || !newDrive.email || !newDrive.folderId}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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