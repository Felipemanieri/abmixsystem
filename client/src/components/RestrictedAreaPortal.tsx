import { useState } from 'react';
import { 
  Settings, 
  LogOut, 
  Lock, 
  Users, 
  Eye, 
  EyeOff,
  Save,
  RotateCcw
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
  const [showClientPortal, setShowClientPortal] = useState(() => {
    return localStorage.getItem('showClientPortal') !== 'false';
  });

  const handleToggleClientPortal = () => {
    const newValue = !showClientPortal;
    setShowClientPortal(newValue);
    localStorage.setItem('showClientPortal', newValue.toString());
    
    // Forçar reload da página para aplicar mudanças
    window.location.reload();
  };

  const resetToDefault = () => {
    setShowClientPortal(true);
    localStorage.removeItem('showClientPortal');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Lock className="w-8 h-8 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">Área Restrita</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Bem-vindo, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Configurações de Interface */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-gray-700 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Configurações de Interface</h2>
            </div>

            {/* Toggle Portal do Cliente */}
            <div className="space-y-6">
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
                  
                  <div className="flex items-center space-x-3">
                    {/* Toggle Switch */}
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
                        Esta configuração apenas remove o card do Portal do Cliente da tela inicial para uma interface mais limpa para a equipe interna.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={resetToDefault}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restaurar Padrão
                </button>
                
                <div className="text-sm text-gray-500">
                  As alterações são aplicadas automaticamente
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Usuário:</span>
                <span className="ml-2 text-gray-600">{user.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-600">{user.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Nível de Acesso:</span>
                <span className="ml-2 text-gray-600">Administrador</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Último Acesso:</span>
                <span className="ml-2 text-gray-600">{new Date().toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Avisos Importantes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Avisos Importantes</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• Todas as configurações são aplicadas imediatamente</li>
              <li>• A página será recarregada automaticamente após mudanças</li>
              <li>• Ocultar o Portal do Cliente não afeta o acesso dos clientes via links diretos</li>
              <li>• Esta configuração é global para todos os usuários do sistema</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}