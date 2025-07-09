import React, { useState } from 'react';
import { LogOut, Plus, Users, FileText, Link, Eye, BarChart3, Clock, CheckCircle, AlertCircle, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import ProposalGenerator from './ProposalGenerator';
import ProposalTracker from './ProposalTracker';

interface VendorPortalProps {
  user: any;
  onLogout: () => void;
}

type VendorView = 'dashboard' | 'new-proposal' | 'tracker' | 'clients';

interface Proposal {
  id: string;
  client: string;
  plan: string;
  status: string;
  progress: number;
  date: string;
  link: string;
  value: string;
  empresa: string;
  cnpj: string;
  vendedor: string;
  documents: number;
  lastActivity: string;
}

const VendorPortal: React.FC<VendorPortalProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<VendorView>('dashboard');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);

  const stats = [
    {
      name: 'Propostas Ativas',
      value: '23',
      change: '+3 hoje',
      changeType: 'positive',
      icon: FileText,
      color: 'blue',
    },
    {
      name: 'Clientes Preenchendo',
      value: '8',
      change: 'Em andamento',
      changeType: 'neutral',
      icon: Users,
      color: 'yellow',
    },
    {
      name: 'Aguardando Documentos',
      value: '5',
      change: 'Pendente',
      changeType: 'warning',
      icon: Clock,
      color: 'orange',
    },
    {
      name: 'Finalizadas',
      value: '12',
      change: '+2 hoje',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green',
    },
  ];

  const recentProposals: Proposal[] = [
    {
      id: 'VEND001-PROP123',
      client: 'Empresa ABC Ltda',
      plan: 'Plano Empresarial Premium',
      status: 'client_filling',
      progress: 75,
      date: '2024-01-15',
      link: `${window.location.origin}/cliente/VEND001-PROP123`,
      value: 'R$ 1.250,00',
      empresa: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      vendedor: user.name,
      documents: 8,
      lastActivity: '2 horas atrás',
    },
    {
      id: 'VEND001-PROP124',
      client: 'Tech Solutions SA',
      plan: 'Plano Família Básico',
      status: 'docs_pending',
      progress: 45,
      date: '2024-01-14',
      link: `${window.location.origin}/cliente/VEND001-PROP124`,
      value: 'R$ 650,00',
      empresa: 'Tech Solutions SA',
      cnpj: '98.765.432/0001-10',
      vendedor: user.name,
      documents: 6,
      lastActivity: '1 dia atrás',
    },
    {
      id: 'VEND001-PROP125',
      client: 'Consultoria XYZ',
      plan: 'Plano Individual',
      status: 'completed',
      progress: 100,
      date: '2024-01-13',
      link: `${window.location.origin}/cliente/VEND001-PROP125`,
      value: 'R$ 320,00',
      empresa: 'Consultoria XYZ',
      cnpj: '11.222.333/0001-44',
      vendedor: user.name,
      documents: 5,
      lastActivity: '3 dias atrás',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client_filling':
        return 'bg-blue-100 text-blue-800';
      case 'docs_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'client_filling':
        return 'Cliente Preenchendo';
      case 'docs_pending':
        return 'Documentos Pendentes';
      case 'completed':
        return 'Finalizada';
      default:
        return 'Desconhecido';
    }
  };

  const handleViewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      alert('Erro ao copiar link. Tente novamente.');
    }
  };

  const handleGenerateLinks = () => {
    // Simular geração de links únicos
    const newLinks = [
      `${window.location.origin}/cliente/VEND001-PROP${Math.floor(Math.random() * 10000)}`,
      `${window.location.origin}/cliente/VEND001-PROP${Math.floor(Math.random() * 10000)}`,
      `${window.location.origin}/cliente/VEND001-PROP${Math.floor(Math.random() * 10000)}`,
    ];
    setGeneratedLinks(newLinks);
    setShowLinkModal(true);
  };

  const handleSendWhatsApp = (link: string, clientName: string) => {
    const message = `Olá! Segue o link para preenchimento da proposta de plano de saúde da ${clientName}: ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'new-proposal':
        return <ProposalGenerator onBack={() => setActiveView('dashboard')} />;
      case 'tracker':
        return <ProposalTracker onBack={() => setActiveView('dashboard')} />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveView('new-proposal')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Nova Proposta</h3>
                    <p className="text-sm text-gray-500">Criar proposta para cliente</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleGenerateLinks}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <Link className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Gerar Links</h3>
                    <p className="text-sm text-gray-500">Links únicos para clientes</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('tracker')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Acompanhar</h3>
                    <p className="text-sm text-gray-500">Status das propostas</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Recent Proposals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Propostas Recentes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plano
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progresso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentProposals.map((proposal) => (
                      <tr key={proposal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{proposal.client}</div>
                            <div className="text-sm text-gray-500">{proposal.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{proposal.plan}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                            {getStatusText(proposal.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${proposal.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{proposal.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(proposal.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewProposal(proposal)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Visualizar proposta"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleCopyLink(proposal.link)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Copiar link"
                            >
                              <Link className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleSendWhatsApp(proposal.link, proposal.client)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Enviar por WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/Logo Abmix.jpg" 
                  alt="Abmix" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal Vendedor</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
        {activeView === 'dashboard' && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard do Vendedor</h1>
            <p className="text-gray-600">Gerencie suas propostas e acompanhe o progresso dos clientes</p>
          </div>
        )}
        
        {renderContent()}
      </main>

      {/* Modal de Visualização da Proposta */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes da Proposta
                </h3>
                <button 
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">ID:</span>
                    <span className="ml-2">{selectedProposal.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Cliente:</span>
                    <span className="ml-2">{selectedProposal.client}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">CNPJ:</span>
                    <span className="ml-2">{selectedProposal.cnpj}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Plano:</span>
                    <span className="ml-2">{selectedProposal.plan}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Valor:</span>
                    <span className="ml-2">{selectedProposal.value}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Progresso:</span>
                    <span className="ml-2">{selectedProposal.progress}%</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Documentos:</span>
                    <span className="ml-2">{selectedProposal.documents}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Última Atividade:</span>
                    <span className="ml-2">{selectedProposal.lastActivity}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-700">Link do Cliente:</span>
                  <div className="flex items-center mt-2 space-x-2">
                    <input
                      type="text"
                      value={selectedProposal.link}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                    />
                    <button
                      onClick={() => handleCopyLink(selectedProposal.link)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => handleSendWhatsApp(selectedProposal.link, selectedProposal.client)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar WhatsApp
                  </button>
                  <button
                    onClick={() => window.open(selectedProposal.link, '_blank')}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Links Gerados */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Links Únicos Gerados
                </h3>
                <button 
                  onClick={() => setShowLinkModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Links únicos prontos para enviar aos clientes:
                </p>
                
                {generatedLinks.map((link, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Link {index + 1}:</span>
                      <span className="text-xs text-gray-500">Gerado agora</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={link}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                      />
                      <button
                        onClick={() => handleCopyLink(link)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        title="Copiar link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendWhatsApp(link, 'Cliente')}
                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        title="Enviar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={handleGenerateLinks}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Gerar Mais Links
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPortal;