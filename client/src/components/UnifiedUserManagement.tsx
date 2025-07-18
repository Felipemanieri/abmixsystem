import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  Shield,
  Settings,
  Monitor,
  Briefcase,
  UserCheck,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  panel: string;
  active: boolean;
  userType: 'system' | 'vendor';
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  panel: string;
  active: boolean;
}

export default function UnifiedUserManagement() {
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState('supervisor');
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    panel: '',
    active: true
  });

  // Configuração dos painéis
  const panels = {
    supervisor: {
      name: 'Supervisão',
      icon: Shield,
      color: 'gray',
      description: 'Gestão de equipe e relatórios'
    },
    financial: {
      name: 'Financeiro',
      icon: Briefcase,
      color: 'gray',
      description: 'Validação e análises financeiras'
    },
    implementation: {
      name: 'Implementação',
      icon: Settings,
      color: 'gray',
      description: 'Processamento e implementação'
    },
    vendor: {
      name: 'Comercial',
      icon: UserCheck,
      color: 'gray',
      description: 'Criação de propostas'
    },
    client: {
      name: 'Cliente',
      icon: Users,
      color: 'gray',
      description: 'Portal do cliente'
    },
    restricted: {
      name: 'Área Restrita',
      icon: Monitor,
      color: 'gray',
      description: 'Administração do sistema'
    }
  };

  // Fetch all users using unified API com atualização em tempo real
  const { data: allCombinedUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/users'],
    queryFn: async () => {
      const response = await fetch('/api/auth/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    refetchInterval: 1000, // Atualiza a cada 1 segundo para resposta instantânea
    refetchOnWindowFocus: true,
    staleTime: 0 // Sempre considera os dados como desatualizados
  });

  const filteredUsers = allCombinedUsers.filter((user: User) => {
    const matchesPanel = user.panel === activePanel;
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPanel && matchesSearch;
  });

  // Calculate user counts for each panel
  const getUserCountByPanel = (panelKey: string) => {
    return allCombinedUsers.filter(user => user.panel === panelKey).length;
  };

  // Debug: Only log when data is loading
  if (isLoading) {
    console.log('Loading user data...');
  }

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      return apiRequest('/api/auth/users', {
        method: 'POST',
        body: { ...userData, userType: userData.panel === 'vendor' ? 'vendor' : 'system' }
      });
    },
    onSuccess: () => {
      // Sincronização instantânea com múltiplas invalidações
      queryClient.invalidateQueries({ queryKey: ['/api/auth/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/system-users'] });
      queryClient.refetchQueries({ queryKey: ['/api/auth/users'] });
      queryClient.refetchQueries({ queryKey: ['/api/system-users'] });
      
      setShowUserModal(false);
      resetForm();
      console.log("🚀 Usuário criado e todos os painéis sincronizados instantaneamente!");
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: Partial<UserFormData> }) => {
      const userToUpdate = allCombinedUsers.find(u => u.id === id);
      if (!userToUpdate) throw new Error('User not found');
      
      console.log("Enviando atualização:", { id, userData, userType: userToUpdate.userType });
      
      return apiRequest(`/api/auth/users/${id}`, {
        method: 'PATCH',
        body: { 
          userType: userToUpdate.userType,
          userData: userData
        }
      });
    },
    onSuccess: () => {
      // Sincronização instantânea com múltiplas invalidações
      queryClient.invalidateQueries({ queryKey: ['/api/auth/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/system-users'] });
      queryClient.refetchQueries({ queryKey: ['/api/auth/users'] });
      queryClient.refetchQueries({ queryKey: ['/api/system-users'] });
      
      setShowUserModal(false);
      setEditingUser(null);
      resetForm();
      console.log("🚀 Usuário atualizado e todos os painéis sincronizados instantaneamente!");
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const userToDelete = allCombinedUsers.find(u => u.id === id);
      if (!userToDelete) throw new Error('User not found');
      
      return apiRequest(`/api/auth/users/${id}?userType=${userToDelete.userType}`, { 
        method: 'DELETE' 
      });
    },
    onSuccess: () => {
      // Sincronização instantânea com múltiplas invalidações e refetch forçado
      queryClient.invalidateQueries({ queryKey: ['/api/auth/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/system-users'] });
      queryClient.refetchQueries({ queryKey: ['/api/auth/users'] });
      queryClient.refetchQueries({ queryKey: ['/api/system-users'] });
      refetch(); // Force immediate UI update
      
      console.log("🚀 Usuário removido e todos os painéis sincronizados instantaneamente!");
    }
  });

  // Update password mutation using unified API
  const updatePasswordMutation = useMutation({
    mutationFn: async ({ id, password, userType }: { id: number; password: string; userType: 'system' | 'vendor' }) => {
      return apiRequest(`/api/auth/users/${id}/password`, {
        method: 'PATCH',
        body: { password, userType }
      });
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['/api/auth/users'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      panel: activePanel,
      active: true
    });
  };

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Função para traduzir roles para português
  const translateRole = (role: string) => {
    switch (role) {
      case 'financial': return 'Financeiro';
      case 'supervisor': return 'Supervisão';
      case 'implementation': return 'Implementação';
      case 'vendor': return 'Comercial';
      case 'client': return 'Cliente';
      case 'restricted': return 'Área Restrita';
      default: return role;
    }
  };

  // Handle password editing for specific user
  const handleEditPassword = (user: User) => {
    const newPassword = generatePassword();
    updatePasswordMutation.mutate({
      id: user.id,
      password: newPassword,
      userType: user.userType
    });
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '120784', // Default password
      role: activePanel === 'vendor' ? 'vendor' : activePanel === 'financial' ? 'financeiro' : activePanel,
      panel: activePanel,
      active: true
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: user.password || '120784',
      role: user.role || activePanel,
      panel: user.panel || activePanel,
      active: user.active !== undefined ? user.active : true
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      console.log("Salvando alterações do usuário:", { id: editingUser.id, formData });
      updateUserMutation.mutate({ id: editingUser.id, userData: formData });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const exportUsers = () => {
    const csvContent = [
      'Nome,Email,Senha,Painel,Status,Criado em',
      ...filteredUsers.map(user => 
        `"${user.name}","${user.email}","${user.password}","${user.panel}","${user.active ? 'Ativo' : 'Inativo'}","${new Date(user.createdAt).toLocaleDateString('pt-BR')}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${activePanel}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const currentPanel = panels[activePanel as keyof typeof panels];
  const PanelIcon = currentPanel.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gestão Unificada de Usuários</h3>
              <p className="text-gray-600 dark:text-gray-300">Gerenciar usuários de todos os painéis do sistema</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button
              onClick={exportUsers}
              className="flex items-center px-4 py-2 bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        {/* Panel Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
          {Object.entries(panels).map(([key, panel]) => {
            const Icon = panel.icon;
            const isActive = activePanel === key;
            return (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isActive
                    ? panel.color === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : panel.color === 'green' ? 'border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200'
                    : panel.color === 'purple' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                    : panel.color === 'orange' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-200'
                    : panel.color === 'pink' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900 text-pink-700 dark:text-pink-200'
                    : panel.color === 'red' ? 'border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200'
                    : 'border-gray-500 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm font-medium">{panel.name}</div>
                <div className="text-xs opacity-75">{getUserCountByPanel(key)}</div>
              </button>
            );
          })}
        </div>

        {/* Current Panel Info */}
        <div className={`rounded-lg p-4 mb-6 ${
          currentPanel.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200'
          : currentPanel.color === 'green' ? 'bg-green-50 dark:bg-green-900 border border-green-200'
          : currentPanel.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900 border border-purple-200'
          : currentPanel.color === 'orange' ? 'bg-orange-50 border border-orange-200'
          : currentPanel.color === 'pink' ? 'bg-pink-50 border border-pink-200'
          : currentPanel.color === 'red' ? 'bg-red-50 dark:bg-red-900 border border-red-200'
          : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center">
            <PanelIcon className={`w-5 h-5 mr-3 ${
              currentPanel.color === 'blue' ? 'text-blue-600 dark:text-blue-400'
              : currentPanel.color === 'green' ? 'text-green-600 dark:text-green-400'
              : currentPanel.color === 'purple' ? 'text-purple-600 dark:text-purple-400'
              : currentPanel.color === 'orange' ? 'text-orange-600 dark:text-orange-400'
              : currentPanel.color === 'pink' ? 'text-pink-600 dark:text-pink-400'
              : currentPanel.color === 'red' ? 'text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-400'
            }`} />
            <div>
              <h4 className={`font-semibold ${
                currentPanel.color === 'blue' ? 'text-blue-900 dark:text-blue-100'
                : currentPanel.color === 'green' ? 'text-green-900 dark:text-green-100'
                : currentPanel.color === 'purple' ? 'text-purple-900 dark:text-purple-100'
                : currentPanel.color === 'orange' ? 'text-orange-900 dark:text-orange-100'
                : currentPanel.color === 'pink' ? 'text-pink-900 dark:text-pink-100'
                : currentPanel.color === 'red' ? 'text-red-900 dark:text-red-100'
                : 'text-gray-900 dark:text-gray-100'
              }`}>
                Painel {currentPanel.name}
              </h4>
              <p className={`text-sm ${
                currentPanel.color === 'blue' ? 'text-blue-700 dark:text-blue-300'
                : currentPanel.color === 'green' ? 'text-green-700 dark:text-green-300'
                : currentPanel.color === 'purple' ? 'text-purple-700 dark:text-purple-300'
                : currentPanel.color === 'orange' ? 'text-orange-700 dark:text-orange-300'
                : currentPanel.color === 'pink' ? 'text-pink-700 dark:text-pink-300'
                : currentPanel.color === 'red' ? 'text-red-700 dark:text-red-300'
                : 'text-gray-700 dark:text-gray-300'
              }`}>
                {currentPanel.description} • {filteredUsers.length} usuários
              </p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                showPasswords
                  ? 'border-orange-300 bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-200'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {showPasswords ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPasswords ? 'Ocultar' : 'Mostrar'} Senhas
            </button>
            <button
              onClick={handleCreateUser}
              className="flex items-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Senha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Carregando usuários...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                    Nenhum usuário encontrado para este painel
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          currentPanel.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' 
                          : currentPanel.color === 'green' ? 'bg-green-100 dark:bg-green-900'
                          : currentPanel.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900'
                          : currentPanel.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900'
                          : currentPanel.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900'
                          : currentPanel.color === 'red' ? 'bg-red-100 dark:bg-red-900'
                          : 'bg-gray-100 dark:bg-gray-900'
                        }`}>
                          <PanelIcon className={`w-4 h-4 ${
                            currentPanel.color === 'blue' ? 'text-blue-600 dark:text-blue-400'
                            : currentPanel.color === 'green' ? 'text-green-600 dark:text-green-400'
                            : currentPanel.color === 'purple' ? 'text-purple-600 dark:text-purple-400'
                            : currentPanel.color === 'orange' ? 'text-orange-600 dark:text-orange-400'
                            : currentPanel.color === 'pink' ? 'text-pink-600 dark:text-pink-400'
                            : currentPanel.color === 'red' ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{translateRole(user.role)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {showPasswords ? (
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {user.password || (user.role === 'vendor' ? '120784' : 'N/A')}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">••••••••</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.active
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {user.active ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Inativo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, name: value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, email: value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Senha
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, password: value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Painel
                  </label>
                  <select
                    value={formData.panel}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, panel: value, role: value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  >
                    {Object.entries(panels).map(([key, panel]) => (
                      <option key={key} value={key}>
                        {panel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData(prev => ({ ...prev, active: checked }));
                    }}
                    className="w-4 h-4 text-gray-600 border-gray-300 dark:border-gray-600 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    Usuário ativo
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createUserMutation.isPending || updateUserMutation.isPending}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white dark:bg-gray-50 dark:bg-gray-900 dark:text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    {editingUser ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}