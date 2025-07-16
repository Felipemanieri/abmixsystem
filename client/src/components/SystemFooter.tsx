import React, { useState, useEffect } from 'react';

const SystemFooter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [proposalsToday] = useState(45); // This could be dynamic from API
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-3 px-6">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between text-xs text-gray-600">
          
          {/* Seção Esquerda - Logo e Info do Sistema */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* Logo Abmix exato da imagem */}
              <svg width="24" height="24" viewBox="0 0 100 100" className="flex-shrink-0">
                <defs>
                  <linearGradient id="abmixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00bcd4" />
                    <stop offset="100%" stopColor="#4caf50" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#abmixGradient)" />
                <path d="M30 40 L50 60 L70 40 L50 20 Z" fill="white" opacity="0.9" />
                <circle cx="50" cy="50" r="8" fill="white" />
              </svg>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">Sistema Interno v2.0</span>
                <span className="text-gray-500">© 2025 Abmix Consultoria</span>
              </div>
            </div>
          </div>

          {/* Seção Centro - Suporte e Links */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1">
              <span>Suporte:</span>
              <a 
                href="mailto:suporte@abmix.com.br" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                suporte@abmix.com.br
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Manual do Sistema
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                FAQ
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Configurações
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span>Status:</span>
              <span className="text-green-600 font-medium">🟢 Online</span>
            </div>
          </div>

          {/* Seção Direita - Informações do Sistema */}
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-4">
              <span>Última Sync: <span className="font-medium">{formatTime(currentTime)}</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Propostas Hoje: <span className="font-medium text-blue-600">{proposalsToday}</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Backup: <span className="font-medium text-green-600">Ativo</span></span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default SystemFooter;