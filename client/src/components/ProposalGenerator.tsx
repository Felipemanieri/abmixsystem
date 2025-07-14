import React, { useState } from 'react';
import { Plus, Copy, Mail, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react';

interface ProposalGeneratorProps {
  vendorId: number;
  vendorName: string;
}

export default function ProposalGenerator({ vendorId, vendorName }: ProposalGeneratorProps) {
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [plano, setPlano] = useState('');
  const [valor, setValor] = useState('');
  const [generatedProposal, setGeneratedProposal] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProposal = async () => {
    if (!nomeEmpresa || !cnpj) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          nomeEmpresa,
          cnpj,
          planoContratado: plano,
          valor,
          clientLink: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }),
      });
      
      if (response.ok) {
        const proposal = await response.json();
        setGeneratedProposal(proposal);
      }
    } catch (error) {
      console.error('Erro ao gerar proposta:', error);
    }
    
    setIsGenerating(false);
  };

  const copyClientLink = () => {
    if (generatedProposal) {
      const clientUrl = `${window.location.origin}/cliente/${generatedProposal.clientLink}`;
      navigator.clipboard.writeText(clientUrl);
      alert('Link copiado!');
    }
  };

  const sendByWhatsApp = () => {
    if (generatedProposal) {
      const clientUrl = `${window.location.origin}/cliente/${generatedProposal.clientLink}`;
      const message = `Olá! Segue o link para completar os dados da sua proposta: ${clientUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    }
  };

  const resetForm = () => {
    setNomeEmpresa('');
    setCnpj('');
    setPlano('');
    setValor('');
    setGeneratedProposal(null);
  };

  // Tela de sucesso
  if (generatedProposal) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Proposta Gerada com Sucesso!</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-2">ID da Proposta</p>
          <p className="text-xl font-bold text-gray-900">{generatedProposal.id}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-600 mb-2">Link do Cliente</p>
          <div className="flex items-center justify-between bg-white p-3 rounded border">
            <code className="text-sm text-gray-600 truncate flex-1">
              {`${window.location.origin}/cliente/${generatedProposal.clientLink}`}
            </code>
            <button 
              onClick={copyClientLink}
              className="ml-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button 
            onClick={copyClientLink}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Link
          </button>
          
          <button 
            onClick={sendByWhatsApp}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </button>
          
          <button 
            onClick={() => window.open(`${window.location.origin}/cliente/${generatedProposal.clientLink}`, '_blank')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visualizar
          </button>
        </div>

        <button 
          onClick={resetForm}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Gerar Nova Proposta
        </button>
      </div>
    );
  }

  // Formulário principal
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Nova Proposta</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Empresa *
          </label>
          <input
            type="text"
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
            placeholder="Razão social da empresa"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CNPJ *
          </label>
          <input
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plano Contratado
          </label>
          <select
            value={plano}
            onChange={(e) => setPlano(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o plano</option>
            <option value="basico">Básico</option>
            <option value="premium">Premium</option>
            <option value="executivo">Executivo</option>
            <option value="master">Master</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor
          </label>
          <input
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="R$ 0,00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button 
          onClick={resetForm}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Limpar
        </button>
        
        <button 
          onClick={generateProposal}
          disabled={isGenerating || !nomeEmpresa || !cnpj}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Gerando...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Gerar Proposta
            </>
          )}
        </button>
      </div>
    </div>
  );
}