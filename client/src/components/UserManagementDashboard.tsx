import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Shield,
  UserPlus,
  Mail,
  Key,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { SystemUser, InsertSystemUser } from "@shared/schema";

interface UserManagementDashboardProps {
  onClose: () => void;
}

export default function UserManagementDashboard({ onClose }: UserManagementDashboardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertSystemUser>>({
    name: "",
    email: "",
    password: "",
    role: "",
    panel: "",
    active: true
  });

  const queryClient = useQueryClient();

  // Buscar todos os usuários do sistema
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/system-users"],
    queryFn: async () => {
      const response = await fetch("/api/system-users");
      if (!response.ok) throw new Error("Erro ao buscar usuários");
      return response.json();
    }
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertSystemUser) => {
      const response = await fetch("/api/system-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error("Erro ao criar usuário");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system-users"] });
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        panel: "",
        active: true
      });
      alert("Usuário criado com sucesso!");
    },
    onError: () => {
      alert("Erro ao criar usuário.");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: Partial<InsertSystemUser> }) => {
      const response = await fetch(`/api/system-users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error("Erro ao atualizar usuário");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system-users"] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      alert("Usuário atualizado com sucesso!");
    },
    onError: () => {
      alert("Erro ao atualizar usuário.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/system-users/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao deletar usuário");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system-users"] });
      alert("Usuário removido com sucesso!");
    },
    onError: () => {
      alert("Erro ao remover usuário.");
    },
  });

  const handleCreateUser = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role || !formData.panel) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    createUserMutation.mutate(formData as InsertSystemUser);
  };

  const handleEditUser = (user: SystemUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      panel: user.panel,
      active: user.active
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser || !formData.name || !formData.email || !formData.password || !formData.role || !formData.panel) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    updateUserMutation.mutate({
      id: selectedUser.id,
      userData: formData as InsertSystemUser
    });
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const getPanelBadgeColor = (panel: string) => {
    switch (panel) {
      case 'restricted': return 'bg-red-500 text-white';
      case 'supervisor': return 'bg-purple-500 text-white';
      case 'financial': return 'bg-green-500 text-white';
      case 'implementation': return 'bg-blue-500 text-white';
      case 'vendor': return 'bg-orange-500 text-white';
      case 'client': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600 text-white';
      case 'supervisor': return 'bg-purple-600 text-white';
      case 'financial': return 'bg-green-600 text-white';
      case 'implementation': return 'bg-blue-600 text-white';
      case 'vendor': return 'bg-orange-600 text-white';
      case 'client': return 'bg-gray-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Nunca";
    return new Date(lastLogin).toLocaleString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
                <p className="text-blue-100">Controle de acesso para todos os painéis</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                {showPasswords ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPasswords ? "Ocultar" : "Mostrar"} Senhas
              </button>
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </button>
              <button
                onClick={onClose}
                className="flex items-center px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold">{users.filter((u: SystemUser) => u.active).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Usuários Inativos</p>
                  <p className="text-2xl font-bold">{users.filter((u: SystemUser) => !u.active).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Usuários */}
          <div className="bg-white border rounded-lg">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Lista de Usuários do Sistema
              </h3>
              <p className="text-gray-600 mt-1">
                Gerencie usuários com acesso a diferentes painéis do sistema
              </p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando usuários...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Nome</th>
                        <th className="text-left p-3 font-semibold">Email</th>
                        {showPasswords && <th className="text-left p-3 font-semibold">Senha</th>}
                        <th className="text-left p-3 font-semibold">Função</th>
                        <th className="text-left p-3 font-semibold">Painel</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Último Login</th>
                        <th className="text-left p-3 font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: SystemUser) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{user.name}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {user.email}
                            </div>
                          </td>
                          {showPasswords && (
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Key className="h-4 w-4 text-gray-400" />
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {user.password}
                                </code>
                              </div>
                            </td>
                          )}
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPanelBadgeColor(user.panel)}`}>
                              {user.panel}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {user.active ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {formatLastLogin(user.lastLogin)}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-1 border rounded hover:bg-gray-50"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1 border rounded hover:bg-red-50 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para Adicionar Usuário */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Adicionar Novo Usuário</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite o nome completo"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Digite o email"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Digite a senha"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Função</label>
                <select 
                  value={formData.role || ""} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Selecione a função</option>
                  <option value="admin">Administrador</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="financial">Financeiro</option>
                  <option value="implementation">Implantação</option>
                  <option value="vendor">Vendedor</option>
                  <option value="client">Cliente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Painel de Acesso</label>
                <select 
                  value={formData.panel || ""} 
                  onChange={(e) => setFormData({ ...formData, panel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Selecione o painel</option>
                  <option value="restricted">Área Restrita</option>
                  <option value="supervisor">Portal Supervisor</option>
                  <option value="financial">Portal Financeiro</option>
                  <option value="implementation">Portal Implantação</option>
                  <option value="vendor">Portal Vendedor</option>
                  <option value="client">Portal Cliente</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {createUserMutation.isPending ? "Criando..." : "Criar Usuário"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog para Editar Usuário */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Usuário</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite o nome completo"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Digite o email"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Digite a senha"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Função</label>
                <select 
                  value={formData.role || ""} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Selecione a função</option>
                  <option value="admin">Administrador</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="financial">Financeiro</option>
                  <option value="implementation">Implantação</option>
                  <option value="vendor">Vendedor</option>
                  <option value="client">Cliente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Painel de Acesso</label>
                <select 
                  value={formData.panel || ""} 
                  onChange={(e) => setFormData({ ...formData, panel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Selecione o painel</option>
                  <option value="restricted">Área Restrita</option>
                  <option value="supervisor">Portal Supervisor</option>
                  <option value="financial">Portal Financeiro</option>
                  <option value="implementation">Portal Implantação</option>
                  <option value="vendor">Portal Vendedor</option>
                  <option value="client">Portal Cliente</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={formData.active || false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="edit-active" className="text-sm">Usuário ativo</label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updateUserMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updateUserMutation.isPending ? "Atualizando..." : "Atualizar Usuário"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}