import { useState, useEffect } from 'react';
import { Monitor, Play, Pause, Trash2, Download, Filter, Search, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  module: string;
  message: string;
  details?: string;
}

export default function LogsViewer() {
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState({
    level: 'all',
    module: 'all',
    search: ''
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'System',
      message: 'Sistema iniciado com sucesso',
      details: 'Todas as conexões estabelecidas'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: 'success',
      module: 'Auth',
      message: 'Login realizado com sucesso',
      details: 'Usuário: felipe@abmix.com.br'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      level: 'warning',
      module: 'Drive',
      message: 'Taxa de sincronização abaixo do esperado',
      details: 'Velocidade: 85% da capacidade normal'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      level: 'error',
      module: 'Database',
      message: 'Tentativa de conexão falhada',
      details: 'Retry automático executado com sucesso'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      level: 'info',
      module: 'Proposals',
      message: 'Nova proposta criada',
      details: 'ID: ABM004, Cliente: TechCorp Ltda'
    }
  ]);

  // Simular logs em tempo real
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)] as LogEntry['level'],
        module: ['System', 'Auth', 'Drive', 'Database', 'Proposals'][Math.floor(Math.random() * 5)],
        message: [
          'Operação executada com sucesso',
          'Processamento de dados em andamento',
          'Sincronização com Google Drive concluída',
          'Backup automático realizado',
          'Nova proposta em análise'
        ][Math.floor(Math.random() * 5)],
        details: 'Detalhes do evento'
      };

      setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Manter apenas 100 logs
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredLogs = logs.filter(log => {
    const matchLevel = filter.level === 'all' || log.level === filter.level;
    const matchModule = filter.module === 'all' || log.module === filter.module;
    const matchSearch = filter.search === '' || 
      log.message.toLowerCase().includes(filter.search.toLowerCase()) ||
      log.module.toLowerCase().includes(filter.search.toLowerCase());
    
    return matchLevel && matchModule && matchSearch;
  });

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700';
      case 'success': return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700';
      default: return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logData = filteredLogs.map(log => ({
      timestamp: new Date(log.timestamp).toLocaleString('pt-BR'),
      level: log.level.toUpperCase(),
      module: log.module,
      message: log.message,
      details: log.details || ''
    }));

    const csvContent = [
      ['Timestamp', 'Level', 'Module', 'Message', 'Details'].join(','),
      ...logData.map(log => [
        `"${log.timestamp}"`,
        log.level,
        log.module,
        `"${log.message}"`,
        `"${log.details}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_abmix_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const logCounts = {
    total: logs.length,
    error: logs.filter(l => l.level === 'error').length,
    warning: logs.filter(l => l.level === 'warning').length,
    info: logs.filter(l => l.level === 'info').length,
    success: logs.filter(l => l.level === 'success').length
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Console de Logs do Sistema</h3>
            <div className="ml-4 flex items-center space-x-2">
              {isLive ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">LIVE</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">PAUSADO</span>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isLive 
                  ? 'bg-orange-600 text-white dark:bg-orange-600 dark:text-white hover:bg-orange-700'
                  : 'bg-green-600 text-white dark:bg-green-600 dark:text-white hover:bg-green-700'
              }`}
            >
              {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isLive ? 'Pausar' : 'Retomar'}
            </button>
            <button
              onClick={exportLogs}
              className="flex items-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={clearLogs}
              className="flex items-center px-4 py-2 bg-red-600 text-white dark:bg-red-600 dark:text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{logCounts.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-900 dark:text-red-200">{logCounts.error}</div>
            <div className="text-sm text-red-600 dark:text-red-400">Errors</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">{logCounts.warning}</div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Warnings</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{logCounts.info}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Info</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-900 dark:text-green-200">{logCounts.success}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Success</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar logs..."
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filter.level}
            onChange={(e) => setFilter({...filter, level: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Níveis</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
          </select>

          <select
            value={filter.module}
            onChange={(e) => setFilter({...filter, module: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Módulos</option>
            <option value="System">System</option>
            <option value="Auth">Auth</option>
            <option value="Drive">Drive</option>
            <option value="Database">Database</option>
            <option value="Proposals">Proposals</option>
          </select>
        </div>

        {/* Console de Logs */}
        <div className="bg-black dark:bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
          {filteredLogs.map((log) => (
            <div key={log.id} className={`mb-2 p-3 rounded border ${getLogColor(log.level)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getLogIcon(log.level)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    {log.module}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded font-medium ${
                    log.level === 'error' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                    log.level === 'warning' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                    log.level === 'success' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                    'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                  }`}>
                    {log.level.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-gray-800 dark:text-gray-200">{log.message}</div>
              {log.details && (
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{log.details}</div>
              )}
            </div>
          ))}
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Monitor className="w-12 h-12 mx-auto mb-4" />
              <p>Nenhum log encontrado com os filtros aplicados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}