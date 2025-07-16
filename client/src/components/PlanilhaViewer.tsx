import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, RefreshCw, Eye, Clock, Users, Database } from 'lucide-react';

export default function PlanilhaViewer() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Buscar todas as propostas para gerar planilha
  const { data: proposals = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/proposals"],
    queryFn: async () => {
      const response = await fetch("/api/proposals");
      if (!response.ok) throw new Error("Erro ao buscar propostas");
      return response.json();
    },
    refetchInterval: 5000 // Atualiza a cada 5 segundos
  });

  // Buscar dados dos vendedores
  const { data: vendors = [] } = useQuery({
    queryKey: ["/api/vendors"],
    queryFn: async () => {
      const response = await fetch("/api/vendors");
      if (!response.ok) throw new Error("Erro ao buscar vendedores");
      return response.json();
    }
  });

  useEffect(() => {
    if (proposals.length > 0) {
      setLastUpdate(new Date());
    }
  }, [proposals.length]);

  const getVendorName = (vendorId: number) => {
    const vendor = vendors.find((v: any) => v.id === vendorId);
    return vendor ? vendor.name : 'Vendedor não encontrado';
  };

  // Função para detectar o número máximo de titulares e dependentes
  const getMaxCounts = () => {
    let maxTitulares = 3; // Mínimo 3 por padrão
    let maxDependentes = 5; // Mínimo 5 por padrão
    
    proposals.forEach((proposal: any) => {
      const titulares = proposal.titulares || [];
      const dependentes = proposal.dependentes || [];
      
      if (titulares.length > maxTitulares) {
        maxTitulares = titulares.length;
      }
      if (dependentes.length > maxDependentes) {
        maxDependentes = dependentes.length;
      }
    });
    
    return { maxTitulares, maxDependentes };
  };

  const { maxTitulares, maxDependentes } = getMaxCounts();

  const formatarDados = () => {
    return proposals.map((proposal: any) => {
      const contractData = proposal.contractData || {};
      const titulares = proposal.titulares || [];
      const dependentes = proposal.dependentes || [];
      const internalData = proposal.internalData || {};
      const vendorAttachments = proposal.vendorAttachments || [];
      const clientAttachments = proposal.clientAttachments || [];

      // ESTRUTURA HORIZONTAL FIXA - UMA EMPRESA = UMA LINHA
      const linhaUnica = {
        // === IDENTIFICAÇÃO ===
        ID: proposal.abmId || proposal.id?.substring(0, 8) || '',
        ID_COMPLETO: proposal.id || '',
        CLIENT_TOKEN: proposal.clientToken || '',
        
        // === DADOS EMPRESA ===
        EMPRESA: contractData.nomeEmpresa || '',
        CNPJ: contractData.cnpj || '',
        PLANO: contractData.planoContratado || '',
        VALOR: contractData.valor || '',
        
        // === CONTROLE ===
        VENDEDOR_ID: proposal.vendorId || '',
        VENDEDOR: getVendorName(proposal.vendorId),
        STATUS: proposal.status || '',
        PRIORIDADE: proposal.priority || '',
        
        // === DATAS ===
        DATA_CRIACAO: new Date(proposal.createdAt).toLocaleDateString('pt-BR'),
        DATA_ATUALIZACAO: new Date(proposal.updatedAt).toLocaleDateString('pt-BR'),
        INICIO_VIGENCIA: contractData.inicioVigencia || '',
        
        // === CONFIGURAÇÕES PLANO ===
        COMPULSORIO: contractData.compulsorio ? 'SIM' : 'NÃO',
        ODONTO_CONJUGADO: contractData.odontoConjugado ? 'SIM' : 'NÃO',
        LIVRE_ADESAO: contractData.livreAdesao ? 'SIM' : 'NÃO',
        PERIODO_MIN_VIGENCIA: contractData.periodoMinVigencia || '',
        
        // === DADOS INTERNOS VENDEDOR ===
        DATA_REUNIAO: internalData.dataReuniao || '',
        OBSERVACOES_VENDEDOR: internalData.observacoesVendedor || '',
        AUTORIZADOR_DESCONTO: internalData.autorizadorDesconto || '',
        NOTAS_FINANCEIRAS: internalData.notasFinanceiras || '',
        
        // === STATUS COMPLETUDE ===
        CLIENTE_COMPLETOU: proposal.clientCompleted ? 'SIM' : 'NÃO',
        PROGRESSO_PERCENT: proposal.progresso || 0,
        
        // === CONTADORES ===
        TOTAL_TITULARES: titulares.length,
        TOTAL_DEPENDENTES: dependentes.length,
        TOTAL_ANEXOS_VENDEDOR: vendorAttachments.length,
        TOTAL_ANEXOS_CLIENTE: clientAttachments.length,
        
        // === DADOS DE COTAÇÃO ===
        COTACAO_VIDAS: contractData.cotacao?.numeroVidas || '',
        COTACAO_OPERADORA: contractData.cotacao?.operadoraSeguro || '',
        COTACAO_ARQUIVO: contractData.cotacao?.arquivoCotacao || '',
        COTACAO_BENEFICIARIOS: contractData.cotacao?.beneficiarios ? JSON.stringify(contractData.cotacao.beneficiarios) : '',
        
        // === DADOS ADICIONAIS ===
        FORMA_PAGAMENTO: contractData.formaPagamento || '',
        OBSERVACOES_GERAIS: contractData.observacoesGerais || '',
        CONDICOES_ESPECIAIS: contractData.condicoesEspeciais || '',
        TIPO_CONTRATO: contractData.tipoContrato || '',
        DESCONTO_APLICADO: contractData.descontoAplicado || '',
        VALOR_ORIGINAL: contractData.valorOriginal || '',
        VALOR_FINAL: contractData.valorFinal || '',
        
        // === DADOS DE CONTROLE AVANÇADO ===
        SITUACAO_PROPOSTA: proposal.situacao || '',
        MOTIVO_PENDENCIA: proposal.motivoPendencia || '',
        DATA_APROVACAO: proposal.dataAprovacao || '',
        DATA_ASSINATURA: proposal.dataAssinatura || '',
        DATA_VIGENCIA_INICIO: proposal.dataVigenciaInicio || '',
        DATA_VIGENCIA_FIM: proposal.dataVigenciaFim || '',
        RESPONSAVEL_APROVACAO: proposal.responsavelAprovacao || '',
        
        // === ARQUIVOS E DOCUMENTOS ===
        LISTA_ARQUIVOS_VENDEDOR: vendorAttachments.map(a => a.name || a.fileName || '').join('; '),
        LISTA_ARQUIVOS_CLIENTE: clientAttachments.map(a => a.name || a.fileName || '').join('; '),
        DOCUMENTOS_PENDENTES: proposal.documentosPendentes ? JSON.stringify(proposal.documentosPendentes) : '',
        
        // === LOGS E HISTÓRICO ===
        HISTORICO_STATUS: proposal.historicoStatus ? JSON.stringify(proposal.historicoStatus) : '',
        ULTIMA_INTERACAO: proposal.ultimaInteracao || '',
        TOTAL_ALTERACOES: proposal.totalAlteracoes || 0,
      };

      // === TITULARES DINÂMICOS (CAMPOS BASEADOS NOS DADOS REAIS) ===
      for (let i = 1; i <= maxTitulares; i++) {
        const titular = titulares[i - 1] || {}; // Array começa em 0, mas numeração em 1
        Object.assign(linhaUnica, {
          [`TITULAR${i}_NOME_COMPLETO`]: titular.nomeCompleto || '',
          [`TITULAR${i}_CPF`]: titular.cpf || '',
          [`TITULAR${i}_RG`]: titular.rg || '',
          [`TITULAR${i}_DATA_NASCIMENTO`]: titular.dataNascimento || '',
          [`TITULAR${i}_NOME_MAE`]: titular.nomeMae || '',
          [`TITULAR${i}_SEXO`]: titular.sexo || '',
          [`TITULAR${i}_ESTADO_CIVIL`]: titular.estadoCivil || '',
          [`TITULAR${i}_PESO`]: titular.peso || '',
          [`TITULAR${i}_ALTURA`]: titular.altura || '',
          [`TITULAR${i}_EMAIL_PESSOAL`]: titular.emailPessoal || '',
          [`TITULAR${i}_TELEFONE_PESSOAL`]: titular.telefonePessoal || '',
          [`TITULAR${i}_EMAIL_EMPRESA`]: titular.emailEmpresa || '',
          [`TITULAR${i}_TELEFONE_EMPRESA`]: titular.telefoneEmpresa || '',
          [`TITULAR${i}_CEP`]: titular.cep || '',
          [`TITULAR${i}_ENDERECO_COMPLETO`]: titular.enderecoCompleto || '',
          [`TITULAR${i}_DADOS_REEMBOLSO`]: titular.dadosReembolso || '',
        });
      }

      // === DEPENDENTES DINÂMICOS (CAMPOS BASEADOS NOS DADOS REAIS) ===
      for (let i = 1; i <= maxDependentes; i++) {
        const dependente = dependentes[i - 1] || {}; // Array começa em 0, mas numeração em 1
        Object.assign(linhaUnica, {
          [`DEPENDENTE${i}_NOME_COMPLETO`]: dependente.nomeCompleto || '',
          [`DEPENDENTE${i}_CPF`]: dependente.cpf || '',
          [`DEPENDENTE${i}_RG`]: dependente.rg || '',
          [`DEPENDENTE${i}_DATA_NASCIMENTO`]: dependente.dataNascimento || '',
          [`DEPENDENTE${i}_PARENTESCO`]: dependente.parentesco || '',
          [`DEPENDENTE${i}_NOME_MAE`]: dependente.nomeMae || '',
          [`DEPENDENTE${i}_SEXO`]: dependente.sexo || '',
          [`DEPENDENTE${i}_ESTADO_CIVIL`]: dependente.estadoCivil || '',
          [`DEPENDENTE${i}_PESO`]: dependente.peso || '',
          [`DEPENDENTE${i}_ALTURA`]: dependente.altura || '',
          [`DEPENDENTE${i}_EMAIL_PESSOAL`]: dependente.emailPessoal || '',
          [`DEPENDENTE${i}_TELEFONE_PESSOAL`]: dependente.telefonePessoal || '',
          [`DEPENDENTE${i}_EMAIL_EMPRESA`]: dependente.emailEmpresa || '',
          [`DEPENDENTE${i}_TELEFONE_EMPRESA`]: dependente.telefoneEmpresa || '',
          [`DEPENDENTE${i}_CEP`]: dependente.cep || '',
          [`DEPENDENTE${i}_ENDERECO_COMPLETO`]: dependente.enderecoCompleto || '',
          [`DEPENDENTE${i}_DADOS_REEMBOLSO`]: dependente.dadosReembolso || '',
        });
      }

      // === CAMPOS EXTRAS DINÂMICOS ===
      // Tentar extrair qualquer campo adicional que possa estar no objeto proposal
      const extraFields = {};
      
      // Verificar se há dados adicionais no objeto principal
      Object.keys(proposal).forEach(key => {
        if (!['id', 'clientToken', 'contractData', 'vendorId', 'status', 'priority', 'createdAt', 'updatedAt', 'clientCompleted', 'progresso'].includes(key)) {
          const value = proposal[key];
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              extraFields[`EXTRA_${key.toUpperCase()}`] = JSON.stringify(value);
            } else {
              extraFields[`EXTRA_${key.toUpperCase()}`] = String(value);
            }
          }
        }
      });

      // Verificar se há dados adicionais no contractData
      Object.keys(contractData).forEach(key => {
        if (!['nomeEmpresa', 'cnpj', 'planoContratado', 'valor', 'inicioVigencia', 'compulsorio', 'odontoConjugado', 'livreAdesao', 'periodoMinVigencia', 'cotacao'].includes(key)) {
          const value = contractData[key];
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              extraFields[`CONTRACT_${key.toUpperCase()}`] = JSON.stringify(value);
            } else {
              extraFields[`CONTRACT_${key.toUpperCase()}`] = String(value);
            }
          }
        }
      });

      // Verificar se há dados adicionais no internalData
      Object.keys(internalData).forEach(key => {
        if (!['dataReuniao', 'observacoesVendedor', 'autorizadorDesconto', 'notasFinanceiras'].includes(key)) {
          const value = internalData[key];
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              extraFields[`INTERNAL_${key.toUpperCase()}`] = JSON.stringify(value);
            } else {
              extraFields[`INTERNAL_${key.toUpperCase()}`] = String(value);
            }
          }
        }
      });

      // Adicionar todos os campos extras encontrados
      Object.assign(linhaUnica, extraFields);

      return linhaUnica;
    });
  };

  const dadosFormatados = formatarDados();
  const colunas = dadosFormatados.length > 0 ? Object.keys(dadosFormatados[0]) : [];

  const exportarCSV = () => {
    if (dadosFormatados.length === 0) return;

    const csvContent = [
      colunas.join(','),
      ...dadosFormatados.map(linha => 
        colunas.map(coluna => `"${linha[coluna] || '[vazio]'}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `planilha_sistema_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const forcarAtualizacao = () => {
    refetch();
    setLastUpdate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Visualizador de Planilha em Tempo Real</h3>
              <p className="text-gray-600">Formato de dados antes da integração com Google Sheets</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={forcarAtualizacao}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button
              onClick={exportarCSV}
              disabled={dadosFormatados.length === 0}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar CSV
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-blue-700">Total de Propostas</p>
                <p className="text-2xl font-bold text-blue-900">{proposals.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-green-700">Colunas Geradas</p>
                <p className="text-2xl font-bold text-green-900">{colunas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-purple-700">Última Atualização</p>
                <p className="text-sm font-semibold text-purple-900">
                  {lastUpdate.toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações sobre estrutura dinâmica */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">📋 Estrutura Dinâmica - Uma Empresa = Uma Linha</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded p-3 border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Máximo Titulares</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{maxTitulares}</p>
              <p className="text-xs text-gray-600">campos criados dinamicamente</p>
            </div>

            <div className="bg-white rounded p-3 border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900">Máximo Dependentes</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{maxDependentes}</p>
              <p className="text-xs text-gray-600">campos criados dinamicamente</p>
            </div>

            <div className="bg-white rounded p-3 border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Total Colunas</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{colunas.length}</p>
              <p className="text-xs text-gray-600">campos por linha</p>
            </div>

            <div className="bg-white rounded p-3 border">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-900">Campos Dinâmicos</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">AUTO</p>
              <p className="text-xs text-gray-600">detectados automaticamente</p>
            </div>
          </div>
        </div>

        {/* Detalhamento Completo dos Campos */}
        <div className="bg-white border rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">🗂️ Campos Incluídos na Planilha (Total: {colunas.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-blue-800">📋 Campos Básicos (25)</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• ID_COMPLETO, CLIENT_TOKEN</div>
                <div>• EMPRESA, CNPJ, PLANO, VALOR</div>
                <div>• VENDEDOR_ID, VENDEDOR</div>
                <div>• STATUS, PRIORIDADE</div>
                <div>• DATAS (Criação, Atualização, Vigência)</div>
                <div>• CONFIGURAÇÕES (Compulsório, Odonto, etc.)</div>
                <div>• DADOS INTERNOS (Reunião, Observações)</div>
                <div>• STATUS COMPLETUDE, PROGRESSO</div>
                <div>• CONTADORES (Titulares, Dependentes, Anexos)</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-purple-800">👥 Pessoas ({maxTitulares * 16 + maxDependentes * 17})</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• <strong>Titulares ({maxTitulares} × 16 campos):</strong></div>
                <div>  Nome, CPF, RG, Data Nascimento</div>
                <div>  Nome Mãe, Sexo, Estado Civil</div>
                <div>  Peso, Altura, Emails, Telefones</div>
                <div>  CEP, Endereço, Dados Reembolso</div>
                <div className="mt-2">• <strong>Dependentes ({maxDependentes} × 17 campos):</strong></div>
                <div>  Todos os campos dos titulares +</div>
                <div>  Parentesco (específico para dependentes)</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-green-800">📊 Dados Extras (30+)</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• <strong>Cotação (4):</strong> Vidas, Operadora, Arquivo, Beneficiários</div>
                <div>• <strong>Financeiro (7):</strong> Forma Pagamento, Descontos, Valores</div>
                <div>• <strong>Controle (7):</strong> Situação, Aprovação, Assinatura</div>
                <div>• <strong>Documentos (3):</strong> Listas de Arquivos, Pendências</div>
                <div>• <strong>Histórico (3):</strong> Status, Interações, Alterações</div>
                <div>• <strong>Campos Dinâmicos:</strong> Detectados automaticamente</div>
                <div>  dos dados reais (EXTRA_, CONTRACT_, INTERNAL_)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview da Planilha */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Preview dos Dados da Planilha
          </h4>
          <p className="text-gray-600 mt-1">
            Visualização em tempo real dos dados formatados para Google Sheets
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados...</p>
          </div>
        ) : dadosFormatados.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma proposta encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {colunas.slice(0, 10).map((coluna) => (
                    <th key={coluna} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r">
                      {coluna}
                    </th>
                  ))}
                  {colunas.length > 10 && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                      ... e mais {colunas.length - 10} colunas
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dadosFormatados.map((linha, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {colunas.slice(0, 10).map((coluna) => (
                      <td key={coluna} className="px-4 py-3 text-sm text-gray-900 border-r max-w-32 truncate">
                        {linha[coluna] || '[vazio]'}
                      </td>
                    ))}
                    {colunas.length > 10 && (
                      <td className="px-4 py-3 text-sm text-gray-500">
                        ...
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Estrutura Completa das Colunas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold mb-4">📊 Estrutura Completa das Colunas</h4>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {colunas.map((coluna, index) => (
              <div key={coluna} className="flex items-center justify-between py-1 px-2 bg-white rounded border">
                <span className="font-mono text-gray-700">{coluna}</span>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Total de {colunas.length} colunas sendo geradas automaticamente
        </p>
      </div>
    </div>
  );
}