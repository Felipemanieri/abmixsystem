import { useState } from 'react';
import { Database, Download, Upload, RotateCw, Calendar, HardDrive, CheckCircle, AlertTriangle, Clock, FileCheck } from 'lucide-react';

interface BackupItem {
  id: string;
  nome: string;
  data: string;
  tamanho: string;
  tipo: 'completo' | 'incremental';
  status: 'sucesso' | 'processando' | 'erro';
  tempoExecucao: string;
}

export default function BackupManager() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('diario');
  const [retentionDays, setRetentionDays] = useState('30');

  const [backupHistory, setBackupHistory] = useState<BackupItem[]>([
    {
      id: '1',
      nome: 'backup_completo_20250117_040500.sql',
      data: '17/01/2025 04:05',
      tamanho: '2.8 GB',
      tipo: 'completo',
      status: 'sucesso',
      tempoExecucao: '12m 35s'
    },
    {
      id: '2',
      nome: 'backup_incremental_20250116_230000.sql',
      data: '16/01/2025 23:00',
      tamanho: '145 MB',
      tipo: 'incremental',
      status: 'sucesso',
      tempoExecucao: '2m 18s'
    },
    {
      id: '3',
      nome: 'backup_completo_20250115_040500.sql',
      data: '15/01/2025 04:05',
      tamanho: '2.7 GB',
      tipo: 'completo',
      status: 'sucesso',
      tempoExecucao: '11m 42s'
    },
    {
      id: '4',
      nome: 'backup_incremental_20250115_230000.sql',
      data: '15/01/2025 23:00',
      tamanho: '98 MB',
      tipo: 'incremental',
      status: 'erro',
      tempoExecucao: '0m 45s'
    }
  ]);

  const startBackup = async (type: 'completo' | 'incremental') => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simular progresso do backup
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setBackupProgress(i);
    }

    // Adicionar novo backup ao histórico
    const newBackup: BackupItem = {
      id: Date.now().toString(),
      nome: `backup_${type}_${new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_')}.sql`,
      data: new Date().toLocaleString('pt-BR'),
      tamanho: type === 'completo' ? '2.9 GB' : '156 MB',
      tipo: type,
      status: 'sucesso',
      tempoExecucao: type === 'completo' ? '13m 22s' : '2m 45s'
    };

    setBackupHistory(prev => [newBackup, ...prev]);
    setIsBackingUp(false);
    setBackupProgress(0);
  };

  const downloadBackup = (backup: BackupItem) => {
    // Simular download
    const link = document.createElement('a');
    link.href = '#';
    link.download = backup.nome;
    link.click();
    alert(`Download iniciado: ${backup.nome}`);
  };

  const restoreBackup = (backup: BackupItem) => {
    if (confirm(`Tem certeza que deseja restaurar o backup: ${backup.nome}?\n\nEsta ação irá sobrescrever todos os dados atuais.`)) {
      alert(`Processo de restauração iniciado para: ${backup.nome}`);
    }
  };

  const deleteBackup = (backupId: string) => {
    if (confirm('Tem certeza que deseja excluir este backup? Esta ação não pode ser desfeita.')) {
      setBackupHistory(prev => prev.filter(b => b.id !== backupId));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sucesso': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processando': return <RotateCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'erro': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processando': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'erro': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'completo' 
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const stats = {
    totalBackups: backupHistory.length,
    successfulBackups: backupHistory.filter(b => b.status === 'sucesso').length,
    totalSize: backupHistory.reduce((acc, backup) => {
      const size = parseFloat(backup.tamanho.replace(/[^0-9.]/g, ''));
      const unit = backup.tamanho.includes('GB') ? 1024 : 1;
      return acc + (size * unit);
    }, 0),
    lastBackup: backupHistory[0]?.data || 'Nenhum backup'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Database className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sistema de Backup & Restore</h3>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => startBackup('completo')}
              disabled={isBackingUp}
              className="flex items-center px-4 py-2 bg-purple-600 text-white dark:bg-purple-600 dark:text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors disabled:opacity-50"
            >
              <Database className="w-4 h-4 mr-2" />
              Backup Completo
            </button>
            <button
              onClick={() => startBackup('incremental')}
              disabled={isBackingUp}
              className="flex items-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Backup Incremental
            </button>
          </div>
        </div>

        {/* Progresso do Backup */}
        {isBackingUp && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Backup em andamento...</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">{backupProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${backupProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBackups}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Backups</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-900 dark:text-green-200">{stats.successfulBackups}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Bem-sucedidos</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">{stats.totalSize.toFixed(1)} MB</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Espaço Total</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-900 dark:text-blue-200">{stats.lastBackup}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Último Backup</div>
          </div>
        </div>

        {/* Configurações Automáticas */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Configurações de Backup Automático</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoBackup"
                checked={autoBackupEnabled}
                onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="autoBackup" className="text-sm text-gray-700 dark:text-gray-300">
                Backup Automático Habilitado
              </label>
            </div>
            
            <select
              value={backupFrequency}
              onChange={(e) => setBackupFrequency(e.target.value)}
              disabled={!autoBackupEnabled}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>

            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Manter por 7 dias</option>
              <option value="30">Manter por 30 dias</option>
              <option value="90">Manter por 90 dias</option>
              <option value="365">Manter por 1 ano</option>
            </select>
          </div>
        </div>

        {/* Histórico de Backups */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Histórico de Backups</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Nome do Arquivo</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Data/Hora</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Tipo</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Tamanho</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Tempo</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Ações</th>
                </tr>
              </thead>
              <tbody>
                {backupHistory.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(backup.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(backup.status)}`}>
                          {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                      {backup.nome}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {backup.data}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(backup.tipo)}`}>
                        {backup.tipo.charAt(0).toUpperCase() + backup.tipo.slice(1)}
                      </span>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {backup.tamanho}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {backup.tempoExecucao}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadBackup(backup)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => restoreBackup(backup)}
                          disabled={backup.status !== 'sucesso'}
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors disabled:opacity-50"
                          title="Restaurar"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBackup(backup.id)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                          title="Excluir"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {backupHistory.length === 0 && (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum backup encontrado</h3>
              <p className="text-gray-500 dark:text-gray-400">Execute um backup para ver o histórico aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}