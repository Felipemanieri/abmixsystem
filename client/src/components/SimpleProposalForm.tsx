import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Copy, Mail, MessageCircle } from 'lucide-react';
import { showNotification } from '../utils/notifications';

interface SimpleProposalFormProps {
  onBack: () => void;
  currentVendor?: {
    id: number;
    name: string;
    email: string;
  };
}

const SimpleProposalForm: React.FC<SimpleProposalFormProps> = ({ onBack, currentVendor }) => {
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [planoContratado, setPlanoContratado] = useState('');
  const [valor, setValor] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleSubmit = async () => {
    if (!nomeEmpresa || !cnpj || !planoContratado || !valor) {
      showNotification('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (!currentVendor) {
      showNotification('Erro: Vendedor não identificado', 'error');
      return;
    }

    try {
      const proposalData = {
        vendorId: currentVendor.id,
        contractData: {
          nomeEmpresa,
          cnpj,
          planoContratado,
          valor
        },
        titulares: [],
        dependentes: [],
        internalData: {},
        attachments: []
      };

      console.log('Enviando dados da proposta:', proposalData);

      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proposalData)
      });

      console.log('Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta:', errorData);
        throw new Error(`Erro ao criar proposta: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resultado recebido:', result);
      
      setGeneratedLink(result.clientLink);
      setIsSubmitted(true);
      showNotification('Link exclusivo da proposta gerado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao gerar proposta:', error);
      showNotification(`Erro ao gerar link da proposta: ${error.message}`, 'error');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    showNotification('Link copiado para a área de transferência', 'success');
  };

  const shareByEmail = () => {
    const subject = `Proposta de Plano de Saúde - ${nomeEmpresa}`;
    const body = `Olá!\n\nSegue o link para preenchimento da proposta de plano de saúde:\n\nEmpresa: ${nomeEmpresa}\nPlano: ${planoContratado}\nValor: R$ ${valor}\n\nLink: ${generatedLink}\n\nPor favor, acesse o link e preencha todos os dados solicitados.\n\nQualquer dúvida, estou à disposição.\n\nAtenciosamente,`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    showNotification('Abrindo cliente de e-mail...', 'success');
  };

  const shareByWhatsApp = () => {
    const mensagem = `🏥 *Proposta de Plano de Saúde*\n\n📋 *Empresa:* ${nomeEmpresa}\n📊 *Plano:* ${planoContratado}\n💰 *Valor:* R$ ${valor}\n\n🔗 *Link para preenchimento:*\n${generatedLink}\n\nPor favor, acesse o link e preencha todos os dados solicitados. Qualquer dúvida, estou aqui para ajudar! 😊`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    showNotification('Abrindo WhatsApp...', 'success');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-50 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Proposta Criada com Sucesso!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Link único gerado para o cliente preencher os dados pessoais.
              </p>

              <div className="space-y-2 text-left max-w-md mx-auto mb-6">
                <p><strong>Empresa:</strong> {nomeEmpresa}</p>
                <p><strong>Plano:</strong> {planoContratado}</p>
                <p><strong>Valor:</strong> R$ {valor}</p>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg mb-6">
                <h3 className="text-teal-800 font-semibold mb-2">Link para o Cliente:</h3>
                <div className="bg-white p-3 rounded border text-sm font-mono break-all">
                  {generatedLink}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Link
                </button>
                
                <button
                  onClick={shareByEmail}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  E-mail
                </button>
                
                <button
                  onClick={shareByWhatsApp}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setNomeEmpresa('');
                    setCnpj('');
                    setPlanoContratado('');
                    setValor('');
                    setGeneratedLink('');
                  }}
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Nova Proposta
                </button>
                
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setGeneratedLink('');
                  }}
                  className="w-full py-3 px-6 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                >
                  Gerar Proposta para o Mesmo Link
                </button>
                
                <button
                  onClick={onBack}
                  className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar ao Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold">Nova Proposta</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o nome da empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plano Contratado *
                </label>
                <select
                  value={planoContratado}
                  onChange={(e) => setPlanoContratado(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione o plano</option>
                  <option value="Plano Básico">Plano Básico</option>
                  <option value="Plano Intermediário">Plano Intermediário</option>
                  <option value="Plano Premium">Plano Premium</option>
                  <option value="Plano Master">Plano Master</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (R$) *
                </label>
                <input
                  type="text"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleSubmit}
                className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Gerar Link Exclusivo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProposalForm;