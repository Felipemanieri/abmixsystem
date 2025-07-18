import { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, RefreshCw, ExternalLink, Eye, Filter, Search, Database, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { generateDynamicSheet, type DynamicSheetData } from '@shared/dynamicSheetGenerator';
import { useRealTimeSheetSync } from '@shared/realTimeSheetSync';

export default function PlanilhaViewer() {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [dynamicSheetData, setDynamicSheetData] = useState<DynamicSheetData | null>(null);
  
  // Sistema de sincronização em tempo real
  const { triggerSync, getSyncStatus, registerCallback, unregisterCallback } = useRealTimeSheetSync();
  
  // BUSCAR DADOS REAIS DAS PROPOSTAS EM TEMPO REAL - ATUALIZAÇÃO RÁPIDA
  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['/api/proposals'],
    refetchInterval: 500, // Atualização em tempo real a cada 0.5 segundos
    refetchIntervalInBackground: true
  });
  
  const { data: vendors = [] } = useQuery({
    queryKey: ['/api/vendors'],
    refetchInterval: 2000 // Atualizar vendedores a cada 2 segundos
  });
  
  // GERAR PLANILHA DINÂMICA AUTOMATICAMENTE COM SINCRONIZAÇÃO
  useEffect(() => {
    if (proposals.length > 0) {
      // Adicionar nome do vendedor às propostas
      const proposalsWithVendor = proposals.map((proposal: any) => ({
        ...proposal,
        vendorName: vendors.find((v: any) => v.id === proposal.vendorId)?.name || 'Vendedor Não Identificado'
      }));
      
      // Gerar estrutura dinâmica
      const sheetData = generateDynamicSheet(proposalsWithVendor);
      setDynamicSheetData(sheetData);
      
      // Planilha dinâmica atualizada silenciosamente
    }
  }, [proposals, vendors]);

  // Registrar callback para sincronização automática
  useEffect(() => {
    const syncCallback = () => {
      // Forçar atualização dos dados
      window.location.reload();
    };
    
    registerCallback(syncCallback);
    
    return () => {
      unregisterCallback(syncCallback);
    };
  }, [registerCallback, unregisterCallback]);

  // Dados simulados da planilha principal - ESTRUTURA HORIZONTAL FIXA
  const planilhaData = [
    {
      // CAMPOS FIXOS OBRIGATÓRIOS
      id: 'ABM001',
      link_cliente: 'https://abmix.com/client-proposal/abc123',
      empresa: 'Soluções Tecnológicas Ltda',
      cnpj: '12.345.678/0001-90',
      vendedor: 'Fabiana Godinho',
      plano: 'Empresarial Pro',
      valor: 'R$ 2.850,00',
      status: 'IMPLANTADO',
      
      // INFORMAÇÕES DO CONTRATO
      odonto_conjugado: 'Sim',
      livre_adesao: 'Sim',
      compulsorio: 'Não',
      aproveitamento_congenere: 'Sim',
      inicio_vigencia: '01/02/2025',
      periodo_minimo: '24 meses',
      
      // INFORMAÇÕES INTERNAS
      reuniao_realizada: 'Sim',
      nome_reuniao: 'Reunião Matriz',
      venda_dupla: 'Não',
      vendedor_dupla: '',
      desconto_percent: '5%',
      origem_venda: 'Base Abmix',
      autorizador_desconto: 'Michelle Manieri',
      obs_financeiras: 'Desconto aprovado pela diretoria',
      obs_cliente: 'Cliente preferencial',
      
      // TITULARES FIXOS (máximo 3)
      titular1_nome: 'João Silva',
      titular1_cpf: '123.456.789-00',
      titular1_rg: '12.345.678-9',
      titular1_email: 'joao@empresa.com',
      titular1_telefone: '(11) 99999-9999',
      titular2_nome: 'Maria Silva',
      titular2_cpf: '987.654.321-00',
      titular2_rg: '98.765.432-1',
      titular2_email: 'maria@empresa.com',
      titular2_telefone: '(11) 88888-8888',
      titular3_nome: '', // VAZIO
      titular3_cpf: '', // VAZIO
      titular3_rg: '', // VAZIO
      titular3_email: '', // VAZIO
      titular3_telefone: '', // VAZIO
      
      // DEPENDENTES FIXOS (máximo 5)
      dependente1_nome: 'Ana Silva',
      dependente1_cpf: '111.222.333-44',
      dependente1_parentesco: 'Filha',
      dependente2_nome: 'Carlos Silva',
      dependente2_cpf: '444.555.666-77',
      dependente2_parentesco: 'Filho',
      dependente3_nome: '', // VAZIO
      dependente3_cpf: '', // VAZIO
      dependente3_parentesco: '', // VAZIO
      dependente4_nome: '', // VAZIO
      dependente4_cpf: '', // VAZIO
      dependente4_parentesco: '', // VAZIO
      dependente5_nome: '', // VAZIO
      dependente5_cpf: '', // VAZIO
      dependente5_parentesco: '', // VAZIO
      
      anexos: 8,
      dataContrato: '15/01/2025'
    },
    {
      // CAMPOS FIXOS OBRIGATÓRIOS
      id: 'ABM002',
      link_cliente: 'https://abmix.com/client-proposal/def456',
      empresa: 'Consultoria Empresarial SA',
      cnpj: '98.765.432/0001-10',
      vendedor: 'Monique Silva',
      plano: 'Premium Family',
      valor: 'R$ 4.200,00',
      status: 'ANALISAR',
      
      // INFORMAÇÕES DO CONTRATO
      odonto_conjugado: 'Não',
      livre_adesao: 'Não',
      compulsorio: 'Sim',
      aproveitamento_congenere: 'Não',
      inicio_vigencia: '15/02/2025',
      periodo_minimo: '12 meses',
      
      // INFORMAÇÕES INTERNAS
      reuniao_realizada: 'Sim',
      nome_reuniao: 'Reunião Comercial',
      venda_dupla: 'Sim',
      vendedor_dupla: 'Gabrielle Fernandes',
      desconto_percent: '8%',
      origem_venda: 'Lead Campanha',
      autorizador_desconto: 'Carol Almeida',
      obs_financeiras: 'Aguardando análise de crédito',
      obs_cliente: 'Empresa em expansão',
      
      // TITULARES FIXOS (máximo 3) - só 1 titular
      titular1_nome: 'Carlos Santos',
      titular1_cpf: '987.654.321-00',
      titular1_rg: '87.654.321-0',
      titular1_email: 'carlos@consultoria.com',
      titular1_telefone: '(11) 77777-7777',
      titular2_nome: '', // VAZIO
      titular2_cpf: '', // VAZIO
      titular2_rg: '', // VAZIO
      titular2_email: '', // VAZIO
      titular2_telefone: '', // VAZIO
      titular3_nome: '', // VAZIO
      titular3_cpf: '', // VAZIO
      titular3_rg: '', // VAZIO
      titular3_email: '', // VAZIO
      titular3_telefone: '', // VAZIO
      
      // DEPENDENTES FIXOS (máximo 5) - só 1 dependente
      dependente1_nome: 'Ana Santos',
      dependente1_cpf: '555.666.777-88',
      dependente1_parentesco: 'Filha',
      dependente2_nome: '', // VAZIO
      dependente2_cpf: '', // VAZIO
      dependente2_parentesco: '', // VAZIO
      dependente3_nome: '', // VAZIO
      dependente3_cpf: '', // VAZIO
      dependente3_parentesco: '', // VAZIO
      dependente4_nome: '', // VAZIO
      dependente4_cpf: '', // VAZIO
      dependente4_parentesco: '', // VAZIO
      dependente5_nome: '', // VAZIO
      dependente5_cpf: '', // VAZIO
      dependente5_parentesco: '', // VAZIO
      
      anexos: 12,
      dataContrato: '16/01/2025'
    },
    {
      // CAMPOS FIXOS OBRIGATÓRIOS
      id: 'ABM003',
      link_cliente: 'https://abmix.com/client-proposal/ghi789',
      empresa: 'Inovação Digital Corp',
      cnpj: '11.222.333/0001-44',
      vendedor: 'Gabrielle Fernandes',
      plano: 'Essencial Plus',
      valor: 'R$ 1.950,00',
      status: 'AGUAR VIGÊNCIA',
      
      // INFORMAÇÕES DO CONTRATO
      odonto_conjugado: 'Sim',
      livre_adesao: 'Sim',
      compulsorio: 'Sim',
      aproveitamento_congenere: 'Sim',
      inicio_vigencia: '20/02/2025',
      periodo_minimo: '36 meses',
      
      // INFORMAÇÕES INTERNAS
      reuniao_realizada: 'Não',
      nome_reuniao: '',
      venda_dupla: 'Não',
      vendedor_dupla: '',
      desconto_percent: '3%',
      origem_venda: 'Indicação Cliente',
      autorizador_desconto: 'Rod Ribas',
      obs_financeiras: 'Pagamento à vista negociado',
      obs_cliente: 'Cliente indicado por ABM001',
      
      // TITULARES FIXOS (máximo 3) - 3 titulares
      titular1_nome: 'Pedro Costa',
      titular1_cpf: '111.222.333-44',
      titular1_rg: '11.222.333-4',
      titular1_email: 'pedro@inovacao.com',
      titular1_telefone: '(11) 66666-6666',
      titular2_nome: 'Lucia Costa',
      titular2_cpf: '222.333.444-55',
      titular2_rg: '22.333.444-5',
      titular2_email: 'lucia@inovacao.com',
      titular2_telefone: '(11) 55555-5555',
      titular3_nome: 'Roberto Costa',
      titular3_cpf: '333.444.555-66',
      titular3_rg: '33.444.555-6',
      titular3_email: 'roberto@inovacao.com',
      titular3_telefone: '(11) 44444-4444',
      
      // DEPENDENTES FIXOS (máximo 5) - 5 dependentes
      dependente1_nome: 'João Costa Jr',
      dependente1_cpf: '666.777.888-99',
      dependente1_parentesco: 'Filho',
      dependente2_nome: 'Maria Costa',
      dependente2_cpf: '777.888.999-00',
      dependente2_parentesco: 'Filha',
      dependente3_nome: 'Ana Costa',
      dependente3_cpf: '888.999.000-11',
      dependente3_parentesco: 'Filha',
      dependente4_nome: 'Carlos Costa',
      dependente4_cpf: '999.000.111-22',
      dependente4_parentesco: 'Filho',
      dependente5_nome: 'Paula Costa',
      dependente5_cpf: '000.111.222-33',
      dependente5_parentesco: 'Filha',
      
      anexos: 6,
      dataContrato: '17/01/2025'
    }
  ];

  const statusColors: Record<string, string> = {
    'IMPLANTADO': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'ANALISAR': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'AGUAR VIGÊNCIA': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'PENDÊNCIA': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const filteredData = planilhaData.filter(item => {
    const matchStatus = filterStatus === 'todos' || item.status === filterStatus;
    const matchSearch = searchTerm === '' || 
      item.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const openGoogleSheets = () => {
    window.open('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0', '_blank');
  };

  const exportCSV = () => {
    if (!dynamicSheetData) {
      console.error('Dados da planilha não disponíveis');
      return;
    }
    
    const csvContent = [
      dynamicSheetData.headers.join(','),
      ...dynamicSheetData.data.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `planilha_dinamica_abmix_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* CABEÇALHO PRINCIPAL */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Planilha Principal - Sistema Abmix</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visualização em tempo real - Atualização a cada 0.5 segundos</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Tempo Real</span>
            </div>
            <button 
              onClick={openGoogleSheets}
              className="flex items-center px-4 py-2 bg-green-600 text-white dark:bg-green-600 dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Google Sheets
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Controles e Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar empresa, vendedor ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="IMPLANTADO">Implantado</option>
            <option value="ANALISAR">Analisar</option>
            <option value="AGUAR VIGÊNCIA">Aguardar Vigência</option>
            <option value="PENDÊNCIA">Pendência</option>
          </select>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoUpdate"
              checked={autoUpdate}
              onChange={(e) => setAutoUpdate(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="autoUpdate" className="text-sm text-gray-700 dark:text-gray-300">
              Auto-atualizar (0.5s)
            </label>
          </div>
        </div>

        {/* Estatísticas Dinâmicas em Tempo Real */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{filteredData.length}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Propostas Filtradas</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-200">
              {dynamicSheetData?.maxTitulares || 3}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Máx. Titulares</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileSpreadsheet className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {dynamicSheetData?.maxDependentes || 5}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Máx. Dependentes</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" />
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
              {dynamicSheetData?.totalColumns || 50}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Total Colunas</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <RefreshCw className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-200">
              {new Date().toLocaleTimeString('pt-BR')}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">Última Atualização</div>
          </div>
        </div>

        {/* TABELA HORIZONTAL - ESTRUTURA DINÂMICA AUTOMÁTICA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Database className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  📊 Planilha Horizontal - Estrutura Dinâmica Automática
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ✅ REGRA 1: Uma empresa = uma linha horizontal | ✅ REGRA 2: Colunas criadas automaticamente | ✅ REGRA 3: Campos vazios permitidos | ✅ REGRA 4: Tempo real
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Tempo Real
                </div>
                <button
                  onClick={() => triggerSync()}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Sincronizar
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">Carregando dados em tempo real...</span>
              </div>
            ) : dynamicSheetData ? (
              <table className="w-full border-collapse text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {dynamicSheetData.headers.map((header, index) => {
                      let colorClass = 'text-gray-900 dark:text-white';
                      
                      // Cores por tipo de campo
                      if (header.includes('TITULAR')) {
                        colorClass = 'text-green-600 dark:text-green-400';
                      } else if (header.includes('DEPENDENTE')) {
                        colorClass = 'text-purple-600 dark:text-purple-400';
                      } else if (['REUNIAO', 'NOME_REUNIAO', 'VENDA_DUPLA', 'VENDEDOR_DUPLA', 'DESCONTO_PERCENT', 'ORIGEM_VENDA', 'AUTORIZADOR_DESCONTO', 'OBS_FINANCEIRAS', 'OBS_CLIENTE'].includes(header)) {
                        colorClass = 'text-blue-600 dark:text-blue-400';
                      } else if (['ODONTO_CONJUGADO', 'LIVRE_ADESAO', 'COMPULSORIO', 'APROVEITAMENTO_CONGENERE', 'INICIO_VIGENCIA', 'PERIODO_MINIMO'].includes(header)) {
                        colorClass = 'text-orange-600 dark:text-orange-400';
                      }
                      
                      return (
                        <th
                          key={index}
                          className={`border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium ${colorClass}`}
                        >
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                
                <tbody>
                  {dynamicSheetData.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {row.map((cell, cellIndex) => {
                        let colorClass = 'text-gray-900 dark:text-white';
                        const header = dynamicSheetData.headers[cellIndex];
                        
                        // Cores por tipo de campo
                        if (header === 'ID') {
                          colorClass = 'text-blue-600 dark:text-blue-400 font-medium';
                        } else if (header === 'VALOR') {
                          colorClass = 'text-green-600 dark:text-green-400 font-medium';
                        } else if (header.includes('TITULAR')) {
                          colorClass = 'text-green-600 dark:text-green-400';
                        } else if (header.includes('DEPENDENTE')) {
                          colorClass = 'text-purple-600 dark:text-purple-400';
                        } else if (['REUNIAO_REALIZADA', 'NOME_REUNIAO', 'VENDA_DUPLA', 'VENDEDOR_DUPLA', 'DESCONTO_PERCENT', 'ORIGEM_VENDA', 'AUTORIZADOR_DESCONTO', 'OBS_FINANCEIRAS', 'OBS_CLIENTE'].includes(header)) {
                          colorClass = 'text-blue-600 dark:text-blue-400';
                        } else if (['ODONTO_CONJUGADO', 'LIVRE_ADESAO', 'COMPULSORIO', 'APROVEITAMENTO_CONGENERE', 'INICIO_VIGENCIA', 'PERIODO_MINIMO'].includes(header)) {
                          colorClass = 'text-orange-600 dark:text-orange-400';
                        }
                        
                        return (
                          <td
                            key={cellIndex}
                            className={`border border-gray-300 dark:border-gray-600 px-2 py-2 ${colorClass}`}
                          >
                            {header === 'STATUS' ? (
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[cell] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                {cell}
                              </span>
                            ) : (
                              cell || '-'
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center p-8">
                <Database className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum dado encontrado</h3>
                  <p className="text-gray-500 dark:text-gray-400">Aguardando dados das propostas...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informações de debug */}
        {dynamicSheetData && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">📊 Informações da Planilha Dinâmica</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Propostas:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{dynamicSheetData.data.length}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Máx. Titulares:</span>
                <span className="ml-2 font-medium text-green-600 dark:text-green-400">{dynamicSheetData.maxTitulares}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Máx. Dependentes:</span>
                <span className="ml-2 font-medium text-purple-600 dark:text-purple-400">{dynamicSheetData.maxDependentes}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Colunas:</span>
                <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">{dynamicSheetData.totalColumns}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}