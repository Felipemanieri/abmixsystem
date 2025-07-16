import React from 'react';
import { CheckCircle, Clock, Wifi } from 'lucide-react';

const SystemFooter: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white h-8 flex items-center justify-between px-4 border-t border-slate-700 text-xs">
      {/* Logo e Versão */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {/* Logo Abmix exato da imagem */}
          <div className="flex items-center">
            <svg width="20" height="20" viewBox="0 0 40 40" className="mr-2">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e90ff" />
                  <stop offset="50%" stopColor="#00bcd4" />
                  <stop offset="100%" stopColor="#4caf50" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
              <path d="M12 16 L20 24 L28 16 L20 8 Z" fill="white" opacity="0.9" />
              <circle cx="20" cy="20" r="4" fill="white" />
            </svg>
            <span className="text-cyan-400 font-bold text-sm">Abmix</span>
          </div>
          <div className="text-xs text-gray-400">v2.1.0</div>
        </div>
      </div>

      {/* Links de Suporte */}
      <div className="flex items-center space-x-4 text-xs">
        <a href="mailto:suporte@abmix.com.br" className="text-gray-400 hover:text-cyan-400 transition-colors">
          Suporte
        </a>
        <a href="https://abmix.com.br" className="text-gray-400 hover:text-cyan-400 transition-colors">
          Site
        </a>
      </div>

      {/* Status da Sincronização */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className="text-gray-400">Online</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-blue-400" />
          <span className="text-gray-400">1s</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wifi className="w-3 h-3 text-green-400" />
          <span className="text-gray-400">OK</span>
        </div>
      </div>
    </footer>
  );
};

export default SystemFooter;