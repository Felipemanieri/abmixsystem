import { useState } from 'react';
import { FileSpreadsheet, Download, RefreshCw, ExternalLink, Eye, Filter, Search } from 'lucide-react';

export default function PlanilhaViewer() {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

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
    const headers = [
      // CAMPOS FIXOS
      'ID', 'LINK_CLIENTE', 'EMPRESA', 'CNPJ', 'VENDEDOR', 'PLANO', 'VALOR', 'STATUS',
      // INFORMAÇÕES DO CONTRATO
      'ODONTO_CONJUGADO', 'LIVRE_ADESAO', 'COMPULSORIO', 'APROVEITAMENTO_CONGENERE', 'INICIO_VIGENCIA', 'PERIODO_MINIMO',
      // INFORMAÇÕES INTERNAS
      'REUNIAO_REALIZADA', 'NOME_REUNIAO', 'VENDA_DUPLA', 'VENDEDOR_DUPLA', 'DESCONTO_PERCENT', 'ORIGEM_VENDA', 'AUTORIZADOR_DESCONTO', 'OBS_FINANCEIRAS', 'OBS_CLIENTE',
      // TITULARES FIXOS (3)
      'TITULAR1_NOME', 'TITULAR1_CPF', 'TITULAR1_RG', 'TITULAR1_EMAIL', 'TITULAR1_TELEFONE',
      'TITULAR2_NOME', 'TITULAR2_CPF', 'TITULAR2_RG', 'TITULAR2_EMAIL', 'TITULAR2_TELEFONE',
      'TITULAR3_NOME', 'TITULAR3_CPF', 'TITULAR3_RG', 'TITULAR3_EMAIL', 'TITULAR3_TELEFONE',
      // DEPENDENTES FIXOS (5)
      'DEPENDENTE1_NOME', 'DEPENDENTE1_CPF', 'DEPENDENTE1_PARENTESCO',
      'DEPENDENTE2_NOME', 'DEPENDENTE2_CPF', 'DEPENDENTE2_PARENTESCO',
      'DEPENDENTE3_NOME', 'DEPENDENTE3_CPF', 'DEPENDENTE3_PARENTESCO',
      'DEPENDENTE4_NOME', 'DEPENDENTE4_CPF', 'DEPENDENTE4_PARENTESCO',
      'DEPENDENTE5_NOME', 'DEPENDENTE5_CPF', 'DEPENDENTE5_PARENTESCO',
      // EXTRAS
      'ANEXOS', 'DATA_CONTRATO'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        // CAMPOS FIXOS
        item.id, `"${item.link_cliente}"`, `"${item.empresa}"`, item.cnpj, `"${item.vendedor}"`, `"${item.plano}"`, item.valor, item.status,
        // INFORMAÇÕES DO CONTRATO
        item.odonto_conjugado, item.livre_adesao, item.compulsorio, item.aproveitamento_congenere, item.inicio_vigencia, item.periodo_minimo,
        // INFORMAÇÕES INTERNAS
        item.reuniao_realizada, `"${item.nome_reuniao}"`, item.venda_dupla, `"${item.vendedor_dupla}"`, item.desconto_percent, item.origem_venda, item.autorizador_desconto, `"${item.obs_financeiras}"`, `"${item.obs_cliente}"`,
        // TITULARES FIXOS
        `"${item.titular1_nome}"`, item.titular1_cpf, item.titular1_rg, `"${item.titular1_email}"`, item.titular1_telefone,
        `"${item.titular2_nome}"`, item.titular2_cpf, item.titular2_rg, `"${item.titular2_email}"`, item.titular2_telefone,
        `"${item.titular3_nome}"`, item.titular3_cpf, item.titular3_rg, `"${item.titular3_email}"`, item.titular3_telefone,
        // DEPENDENTES FIXOS
        `"${item.dependente1_nome}"`, item.dependente1_cpf, item.dependente1_parentesco,
        `"${item.dependente2_nome}"`, item.dependente2_cpf, item.dependente2_parentesco,
        `"${item.dependente3_nome}"`, item.dependente3_cpf, item.dependente3_parentesco,
        `"${item.dependente4_nome}"`, item.dependente4_cpf, item.dependente4_parentesco,
        `"${item.dependente5_nome}"`, item.dependente5_cpf, item.dependente5_parentesco,
        // EXTRAS
        item.anexos, item.dataContrato
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `planilha_horizontal_abmix_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Visualizar Planilha Principal</h3>
          </div>
          <div className="flex space-x-3">
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
              Auto-atualizar (5s)
            </label>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{planilhaData.length}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Propostas</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-900 dark:text-green-200">
              {planilhaData.filter(p => p.status === 'IMPLANTADO').length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Implantadas</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
              {planilhaData.filter(p => p.status === 'ANALISAR').length}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Em Análise</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {planilhaData.reduce((acc, p) => acc + p.anexos, 0)}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Total Anexos</div>
          </div>
        </div>

        {/* TABELA HORIZONTAL - ESTRUTURA FIXA COMPLETA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              📊 Planilha Horizontal - Estrutura Fixa
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ✅ REGRA 1: Uma empresa = uma linha horizontal | ✅ REGRA 2: Colunas fixas para 3 titulares e 5 dependentes | ✅ REGRA 3: Campos vazios permitidos
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {/* CAMPOS FIXOS */}
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">ID</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">LINK_CLIENTE</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">EMPRESA</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">CNPJ</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">VENDEDOR</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">PLANO</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">VALOR</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">STATUS</th>
                  
                  {/* INFORMAÇÕES INTERNAS */}
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-blue-600 dark:text-blue-400">REUNIÃO</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-blue-600 dark:text-blue-400">NOME_REUNIÃO</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-blue-600 dark:text-blue-400">VENDA_DUPLA</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-blue-600 dark:text-blue-400">VENDEDOR_DUPLA</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-blue-600 dark:text-blue-400">DESCONTO%</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-blue-600 dark:text-blue-400">ORIGEM_VENDA</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-blue-600 dark:text-blue-400">AUTORIZADOR</th>
                  
                  {/* TITULARES FIXOS (3) */}
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR1_NOME</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR1_CPF</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR1_EMAIL</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR2_NOME</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR2_CPF</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR2_EMAIL</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR3_NOME</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR3_CPF</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-green-600 dark:text-green-400">TITULAR3_EMAIL</th>
                  
                  {/* DEPENDENTES FIXOS (5) */}
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE1_NOME</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE1_CPF</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE1_PARENTESCO</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE2_NOME</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE2_CPF</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE2_PARENTESCO</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE3_NOME</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE3_CPF</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE3_PARENTESCO</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE4_NOME</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE4_CPF</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE4_PARENTESCO</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE5_NOME</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE5_CPF</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-purple-600 dark:text-purple-400">DEPENDENTE5_PARENTESCO</th>
                  
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-gray-900 dark:text-white">ANEXOS</th>
                </tr>
              </thead>
              
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {/* CAMPOS FIXOS */}
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 font-medium text-blue-600 dark:text-blue-400">{item.id}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-gray-600 dark:text-gray-300 truncate max-w-32" title={item.link_cliente}>
                      {item.link_cliente.length > 20 ? item.link_cliente.substring(0, 20) + '...' : item.link_cliente}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-gray-900 dark:text-white truncate max-w-32" title={item.empresa}>
                      {item.empresa.length > 20 ? item.empresa.substring(0, 20) + '...' : item.empresa}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-gray-600 dark:text-gray-300">{item.cnpj}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-gray-900 dark:text-white">{item.vendedor}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-gray-900 dark:text-white">{item.plano}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400 font-medium">{item.valor}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {item.status}
                      </span>
                    </td>
                    
                    {/* INFORMAÇÕES INTERNAS */}
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-blue-600 dark:text-blue-400">{item.reuniao_realizada}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-blue-600 dark:text-blue-400">{item.nome_reuniao || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-blue-600 dark:text-blue-400">{item.venda_dupla}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-blue-600 dark:text-blue-400">{item.vendedor_dupla || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-blue-600 dark:text-blue-400">{item.desconto_percent}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-blue-600 dark:text-blue-400">{item.origem_venda}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-blue-600 dark:text-blue-400">{item.autorizador_desconto}</td>
                    
                    {/* TITULARES FIXOS (3) */}
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular1_nome}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular1_cpf}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular1_email}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular2_nome || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular2_cpf || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular2_email || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular3_nome || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular3_cpf || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-green-600 dark:text-green-400">{item.titular3_email || '-'}</td>
                    
                    {/* DEPENDENTES FIXOS (5) */}
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente1_nome}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente1_cpf}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente1_parentesco}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente2_nome || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente2_cpf || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente2_parentesco || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente3_nome || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente3_cpf || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente3_parentesco || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente4_nome || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente4_cpf || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente4_parentesco || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente5_nome || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente5_cpf || '-'}</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-purple-600 dark:text-purple-400">{item.dependente5_parentesco || '-'}</td>
                    
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center text-gray-600 dark:text-gray-300">{item.anexos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <FileSpreadsheet className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum registro encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400">Tente ajustar os filtros para encontrar os registros desejados.</p>
          </div>
        )}
      </div>
    </div>
  );
}