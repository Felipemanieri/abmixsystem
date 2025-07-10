import React, { useState } from 'react';
import { ArrowLeft, Lock, User, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  portal: 'client' | 'vendor' | 'financial' | 'supervisor' | 'implantacao' | 'restricted';
  onLogin: (user: any) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ portal, onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const portalConfig = {
    client: {
      title: 'Portal do Cliente',
      subtitle: 'Acesse sua área para acompanhar propostas',
      color: 'blue',
      bgColor: 'from-blue-500 to-blue-600',
    },
    vendor: {
      title: 'Portal do Vendedor',
      subtitle: 'Gerencie suas propostas e clientes',
      color: 'green',
      bgColor: 'from-green-500 to-green-600',
    },
    financial: {
      title: 'Portal Financeiro',
      subtitle: 'Validação e aprovação de propostas',
      color: 'purple',
      bgColor: 'from-purple-500 to-purple-600',
    },
    supervisor: {
      title: 'Portal Supervisor',
      subtitle: 'Supervisão e relatórios gerenciais',
      color: 'orange',
      bgColor: 'from-orange-500 to-orange-600',
    },
    implantacao: {
      title: 'Portal de Implantação',
      subtitle: 'Gestão de implantação de sistemas',
      color: 'indigo',
      bgColor: 'from-indigo-500 to-indigo-600',
    },
    restricted: {
      title: 'Área Restrita',
      subtitle: 'Acesso exclusivo para usuários autorizados',
      color: 'red',
      bgColor: 'from-red-500 to-red-600',
    },
  };

  const config = portalConfig[portal];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Verificar credenciais para o supervisor - agora aceita o email felipe@abmix.com.br
    if (portal === 'supervisor' && 
        ((email === 'supervisao@abmix.com.br' && password === '123456') || 
         (email === 'felipe@abmix.com.br' && password === '123456'))) {
      setTimeout(() => {
        const user = {
          id: '1',
          name: 'Felipe Abmix',
          email,
          role: portal,
        };
        onLogin(user);
        setIsLoading(false);
      }, 1000);
    } else {
      // Para fins de demonstração, permitir qualquer login para outros portais
      setTimeout(() => {
        if (portal === 'supervisor') {
          setErrorMessage('Credenciais inválidas para o portal do supervisor');
          setIsLoading(false);
        } else {
          const user = {
            id: '1',
            name: 'Usuário Teste',
            email,
            role: portal,
          };
          onLogin(user);
          setIsLoading(false);
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Portais
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.bgColor} p-8 text-white text-center`}>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
            <p className="text-white text-opacity-90">{config.subtitle}</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-sm text-teal-600 hover:text-teal-700">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${config.bgColor} text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50`}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              {portal === 'supervisor' ? (
                <p className="text-xs text-gray-600 text-center">
                  <strong>Acesso Supervisor:</strong> felipe@abmix.com.br / 123456
                </p>
              ) : (
                <p className="text-xs text-gray-600 text-center">
                  <strong>Demo:</strong> Use qualquer email e senha para testar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;