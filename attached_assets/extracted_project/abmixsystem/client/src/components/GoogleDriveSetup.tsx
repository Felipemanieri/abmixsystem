import React, { useState } from 'react';
import { FileText, Check, AlertCircle, Info, Download, Upload, RefreshCw } from 'lucide-react';

const GoogleDriveSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnect = () => {
    // Simulação de conexão com o Google Drive
    setTimeout(() => {
      setIsConnected(true);
      setStep(3);
    }, 1500);
  };
  
  const handleCreateSpreadsheet = () => {
    // Simulação de criação de planilha
    setTimeout(() => {
      setStep(4);
    }, 1500);
  };
  
  const handleFinish = () => {
    // Finalizar configuração
    window.location.href = '/restricted';
  };
  
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Configuração do Google Drive</h1>
        <p className="text-yellow-100">Configure a integração para armazenar dados dos clientes</p>
      </div>
      
      {/* Passos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8 relative">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step > s ? 'bg-green-100 text-green-600' : 
                step === s ? 'bg-blue-100 text-blue-600' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{s}</span>
                )}
              </div>
              <span className={`text-xs mt-2 ${
                step >= s ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {s === 1 ? 'Preparação' : 
                 s === 2 ? 'Conexão' : 
                 s === 3 ? 'Configuração' : 'Finalização'}
              </span>
            </div>
          ))}
          
          <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-5"></div>
        </div>
        
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Preparação</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Antes de começar, você precisará:</p>
                  <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                    <li>Uma conta Google com acesso ao Google Drive</li>
                    <li>Permissões de administrador no sistema Abmix</li>
                    <li>Acesso à internet estável</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm">
              Esta configuração permitirá que o sistema Abmix armazene automaticamente os dados dos clientes em uma pasta organizada no Google Drive, além de manter uma planilha atualizada com todas as informações.
            </p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Conectar ao Google Drive</h2>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  Você será redirecionado para a página de autenticação do Google. Por favor, faça login com a conta que deseja usar para armazenar os dados.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/1200px-Google_Drive_icon_%282020%29.svg.png" 
                alt="Google Drive" 
                className="w-16 h-16 mx-auto mb-4"
              />
              <p className="text-gray-700 font-medium mb-4">Conectar ao Google Drive</p>
              <button
                onClick={handleConnect}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Autorizar Acesso
              </button>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Configuração da Estrutura</h2>
            
            {isConnected && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">
                    Conectado com sucesso ao Google Drive! Agora vamos configurar a estrutura de pastas e planilhas.
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Pasta Principal
                </label>
                <input
                  type="text"
                  defaultValue="Abmix - Propostas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Planilha Principal
                </label>
                <input
                  type="text"
                  defaultValue="Abmix - Dados de Clientes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="createFolderPerClient"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="createFolderPerClient" className="ml-2 text-sm text-gray-700">
                  Criar pasta separada para cada cliente
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="organizeDocs"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="organizeDocs" className="ml-2 text-sm text-gray-700">
                  Organizar documentos por tipo (pessoais, empresariais, etc.)
                </label>
              </div>
            </div>
            
            <button
              onClick={handleCreateSpreadsheet}
              className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Criar Estrutura no Google Drive
            </button>
            
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
        
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Configuração Concluída</h2>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-700 font-medium">Integração configurada com sucesso!</p>
                  <p className="text-sm text-green-700 mt-1">
                    A estrutura de pastas e planilhas foi criada no Google Drive. Agora os dados dos clientes serão automaticamente armazenados e organizados.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Detalhes da Configuração</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pasta Principal:</span>
                  <a href="#" className="text-blue-600 hover:underline">Abmix - Propostas</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Planilha Principal:</span>
                  <a href="#" className="text-blue-600 hover:underline">Abmix - Dados de Clientes</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conta Google:</span>
                  <span className="text-gray-900">admin@abmix.com.br</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sincronização:</span>
                  <span className="text-gray-900">Automática (tempo real)</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('https://drive.google.com', '_blank')}
                className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Abrir Google Drive
              </button>
              
              <button
                onClick={handleFinish}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Concluir Configuração
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Dicas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dicas e Informações</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Backup Automático:</span> Todos os dados são sincronizados automaticamente e mantidos seguros no Google Drive.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Compartilhamento:</span> Você pode compartilhar pastas específicas com vendedores ou clientes diretamente pelo Google Drive.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Análise de Dados:</span> Use o Google Sheets para criar gráficos e análises dos dados dos clientes.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Importante:</span> Não modifique a estrutura das pastas ou planilhas manualmente para evitar problemas de sincronização.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveSetup;