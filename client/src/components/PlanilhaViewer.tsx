import { useState } from 'react';
import { FileSpreadsheet, Download, RefreshCw, ExternalLink, Eye, Filter, Search } from 'lucide-react';

export default function PlanilhaViewer() {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados simulados da planilha principal
  const planilhaData = [
    {
      id: 'ABM001',
      empresa: 'Soluções Tecnológicas Ltda',
      cnpj: '12.345.678/0001-90',
      vendedor: 'Fabiana Godinho',
      plano: 'Empresarial Pro',
      valor: 'R$ 2.850,00',
      status: 'IMPLANTADO',
      titular1_nome: 'João Silva',
      titular1_cpf: '123.456.789-00',
      dependente1_nome: 'Maria Silva',
      dependente1_parentesco: 'Esposa',
      anexos: 8,
      dataContrato: '15/01/2025'
    },
    {
      id: 'ABM002',
      empresa: 'Consultoria Empresarial SA',
      cnpj: '98.765.432/0001-10',
      vendedor: 'Monique Silva',
      plano: 'Premium Family',
      valor: 'R$ 4.200,00',
      status: 'ANALISAR',
      titular1_nome: 'Carlos Santos',
      titular1_cpf: '987.654.321-00',
      dependente1_nome: 'Ana Santos',
      dependente1_parentesco: 'Filha',
      anexos: 12,
      dataContrato: '16/01/2025'
    },
    {
      id: 'ABM003',
      empresa: 'Inovação Digital Corp',
      cnpj: '11.222.333/0001-44',
      vendedor: 'Gabrielle Fernandes',
      plano: 'Essencial Plus',
      valor: 'R$ 1.950,00',
      status: 'AGUAR VIGÊNCIA',
      titular1_nome: 'Pedro Costa',
      titular1_cpf: '111.222.333-44',
      dependente1_nome: 'Lucia Costa',
      dependente1_parentesco: 'Esposa',
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
    const headers = ['ID', 'Empresa', 'CNPJ', 'Vendedor', 'Plano', 'Valor', 'Status', 'Titular 1', 'CPF Titular', 'Dependente 1', 'Parentesco', 'Anexos', 'Data Contrato'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.id,
        `"${item.empresa}"`,
        item.cnpj,
        `"${item.vendedor}"`,
        `"${item.plano}"`,
        item.valor,
        item.status,
        `"${item.titular1_nome}"`,
        item.titular1_cpf,
        `"${item.dependente1_nome}"`,
        item.dependente1_parentesco,
        item.anexos,
        item.dataContrato
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `planilha_abmix_${new Date().toISOString().slice(0, 10)}.csv`);
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

        {/* Tabela de Dados */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">ID</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Empresa</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Vendedor</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Plano</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Valor</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Titular 1</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Anexos</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {item.empresa}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {item.vendedor}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {item.plano}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                    {item.valor}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {item.titular1_nome}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">
                    {item.anexos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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