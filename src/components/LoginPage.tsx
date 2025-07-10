import React, { useState } from 'react';
import { ArrowLeft, Lock, User, Eye, EyeOff, Mail } from 'lucide-react';
import AbmixLogo from './AbmixLogo';

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
      subtitle: 'Acesse sua área para acompanhar propostas e documentos',
      color: 'blue',
      bgColor: 'from-blue-500 to-blue-600',
    },
    vendor: {
      title: 'Portal do Vendedor',
      subtitle: 'Gerencie propostas, clientes e acompanhe vendas',
      color: 'green',
      bgColor: 'from-green-500 to-green-600',
    },
    financial: {
      title: 'Portal Financeiro',
      subtitle: 'Validação, aprovação e análise financeira',
      color: 'purple',
      bgColor: 'from-purple-500 to-purple-600',
    },
    supervisor: {
      title: 'Portal Supervisor',
      subtitle: 'Supervisão, relatórios e gestão de equipe',
      color: 'orange',
      bgColor: 'from-orange-500 to-orange-600',
    },
    implantacao: {
      title: 'Portal de Implantação',
      subtitle: 'Gestão de implantação e automação de processos',
      color: 'indigo',
      bgColor: 'from-indigo-500 to-indigo-600',
    },
    restricted: {
      title: 'Área Restrita',
      subtitle: 'Acesso exclusivo para administradores do sistema',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 bg-pattern">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Portais
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.bgColor} p-8 text-white text-center relative overflow-hidden`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-pattern-dots"></div>
            </div>
            
            {/* Logo and content */}
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Lock className="w-10 h-10" />
              </div>
              <AbmixLogo size={50} className="mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2 text-shadow">{config.title}</h1>
              <p className="text-white text-opacity-90 max-w-xs mx-auto">{config.subtitle}</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full -mt-16 -mr-16 z-0"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-full -mb-12 -ml-12 z-0"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 hover:border-blue-300"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                  <span className="text-xs text-gray-500 ml-1">(mínimo 6 caracteres)</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 hover:border-blue-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${config.bgColor} text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 animate-pulse">
                {errorMessage}
              </div>
            )}

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-inner">
              {portal === 'supervisor' ? (
                <p className="text-xs text-gray-600 text-center flex items-center justify-center">
                  <User className="w-3 h-3 mr-1 text-orange-500" />
                  <strong className="text-orange-600">Acesso Supervisor:</strong> 
                  <span className="ml-1">felipe@abmix.com.br / 123456</span>
                </p>
              ) : (
                <p className="text-xs text-gray-600 text-center flex items-center justify-center">
                  <Info className="w-3 h-3 mr-1 text-blue-500" />
                  <strong className="text-blue-600">Demo:</strong> 
                  <span className="ml-1">Use qualquer email e senha para testar</span>
                </p>
              )}
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                &copy; 2024 Abmix. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;