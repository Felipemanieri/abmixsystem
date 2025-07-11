import React, { useState } from 'react';
import { ArrowLeft, Eye, Link, Clock, CheckCircle, AlertCircle, Users, BarChart3 } from 'lucide-react';

interface ProposalTrackerProps {
  onBack: () => void;
}

const ProposalTracker: React.FC<ProposalTrackerProps> = ({ onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const proposals = [
    {
      id: 'VEND001-PROP123',
      client: 'Empresa ABC Ltda',
      plan: 'Plano Empresarial Premium',
      status: 'client_filling',
      progress: 75,
      date: '2024-01-15',
      link: 'https://abmix.com/cliente/VEND001-PROP123',
      lastActivity: '2 horas atrás',
      daysOpen: 2,
    },
    {
      id: 'VEND001-PROP124',
      client: 'Tech Solutions SA',
      plan: 'Plano Família Básico',
      status: 'docs_pending',
      progress: 45,
      date: '2024-01-14',
      link: 'https://abmix.com/cliente/VEND001-PROP124',
      lastActivity: '1 dia atrás',
      daysOpen: 5,
    },
    {
      id: 'VEND001-PROP125',
      client: 'Consultoria XYZ',
      plan: 'Plano Individual',
      status: 'completed',
      progress: 100,
      date: '2024-01-13',
      link: 'https://abmix.com/cliente/VEND001-PROP125',
      lastActivity: '3 dias atrás',
      daysOpen: 1,
    },
    {
      id: 'VEND001-PROP126',
      client: 'Startup Inovadora',
      plan: 'Plano Empresarial',
      status: 'client_filling',
      progress: 25,
      date: '2024-01-12',
      link: 'https://abmix.com/cliente/VEND001-PROP126',
      lastActivity: '5 dias atrás',
      daysOpen: 15,
    },
    {
      id: 'VEND001-PROP127',
      client: 'Família Silva',
      plan: 'Plano Família Premium',
      status: 'docs_pending',
      progress: 80,
      date: '2024-01-10',
      link: 'https://abmix.com/cliente/VEND001-PROP127',
      lastActivity: '1 semana atrás',
      daysOpen: 25,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'client_filling':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'docs_pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDaysOpenColor = (days: number) => {
    if (days <= 3) return 'text-green-600';
    if (days <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProposals = proposals.filter(proposal => {
    if (selectedFilter === 'all') return true;
    return proposal.status === selectedFilter;
  });

  const stats = [
    {
      name: 'Total de Propostas',
      value: proposals.length.toString(),
      icon: BarChart3,
      color: 'blue',
    },
    {
      name: 'Em Preenchimento',
      value: proposals.filter(p => p.status === 'client_filling').length.toString(),
      icon: Users,
      color: 'blue',
    },
    {
      name: 'Docs Pendentes',
      value: proposals.filter(p => p.status === 'docs_pending').length.toString(),
      icon: Clock,
      color: 'yellow',
    },
    {
      name: 'Finalizadas',
      value: proposals.filter(p => p.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'green',
    },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Dashboard
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Acompanhamento de Propostas</h1>
        <p className="text-blue-100">Monitore o progresso de todas as suas propostas em tempo real</p>
      </div>

      {/* Stats */}
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
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filtrar Propostas</h2>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            <option value="client_filling">Cliente Preenchendo</option>
            <option value="docs_pending">Documentos Pendentes</option>
            <option value="completed">Finalizadas</option>
          </select>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Propostas ({filteredProposals.length})
          </h2>
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
                  Última Atividade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dias em Aberto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProposals.map((proposal) => (
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
                    <div className="flex items-center">
                      {getStatusIcon(proposal.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                        {getStatusText(proposal.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${proposal.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-0">{proposal.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proposal.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getDaysOpenColor(proposal.daysOpen)}`}>
                      {proposal.daysOpen} dias
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigator.clipboard.writeText(proposal.link)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Link className="w-4 h-4" />
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
};

export default ProposalTracker;