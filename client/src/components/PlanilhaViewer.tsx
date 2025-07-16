import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, RefreshCw, Eye, Clock, Users } from 'lucide-react';

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
      };

      // === TITULAR 1 (CAMPOS FIXOS PRÉ-DEFINIDOS) ===
      const titular1 = titulares[0] || {};
      Object.assign(linhaUnica, {
        TITULAR1_NOME_COMPLETO: titular1.nomeCompleto || '',
        TITULAR1_CPF: titular1.cpf || '',
        TITULAR1_RG: titular1.rg || '',
        TITULAR1_DATA_NASCIMENTO: titular1.dataNascimento || '',
        TITULAR1_NOME_MAE: titular1.nomeMae || '',
        TITULAR1_SEXO: titular1.sexo || '',
        TITULAR1_ESTADO_CIVIL: titular1.estadoCivil || '',
        TITULAR1_PESO: titular1.peso || '',
        TITULAR1_ALTURA: titular1.altura || '',
        TITULAR1_EMAIL_PESSOAL: titular1.emailPessoal || '',
        TITULAR1_TELEFONE_PESSOAL: titular1.telefonePessoal || '',
        TITULAR1_EMAIL_EMPRESA: titular1.emailEmpresa || '',
        TITULAR1_TELEFONE_EMPRESA: titular1.telefoneEmpresa || '',
        TITULAR1_CEP: titular1.cep || '',
        TITULAR1_ENDERECO_COMPLETO: titular1.enderecoCompleto || '',
        TITULAR1_DADOS_REEMBOLSO: titular1.dadosReembolso || '',
      });

      // === TITULAR 2 (CAMPOS FIXOS PRÉ-DEFINIDOS) ===
      const titular2 = titulares[1] || {};
      Object.assign(linhaUnica, {
        TITULAR2_NOME_COMPLETO: titular2.nomeCompleto || '',
        TITULAR2_CPF: titular2.cpf || '',
        TITULAR2_RG: titular2.rg || '',
        TITULAR2_DATA_NASCIMENTO: titular2.dataNascimento || '',
        TITULAR2_NOME_MAE: titular2.nomeMae || '',
        TITULAR2_SEXO: titular2.sexo || '',
        TITULAR2_ESTADO_CIVIL: titular2.estadoCivil || '',
        TITULAR2_PESO: titular2.peso || '',
        TITULAR2_ALTURA: titular2.altura || '',
        TITULAR2_EMAIL_PESSOAL: titular2.emailPessoal || '',
        TITULAR2_TELEFONE_PESSOAL: titular2.telefonePessoal || '',
        TITULAR2_EMAIL_EMPRESA: titular2.emailEmpresa || '',
        TITULAR2_TELEFONE_EMPRESA: titular2.telefoneEmpresa || '',
        TITULAR2_CEP: titular2.cep || '',
        TITULAR2_ENDERECO_COMPLETO: titular2.enderecoCompleto || '',
        TITULAR2_DADOS_REEMBOLSO: titular2.dadosReembolso || '',
      });

      // === TITULAR 3 (CAMPOS FIXOS PRÉ-DEFINIDOS) ===
      const titular3 = titulares[2] || {};
      Object.assign(linhaUnica, {
        TITULAR3_NOME_COMPLETO: titular3.nomeCompleto || '',
        TITULAR3_CPF: titular3.cpf || '',
        TITULAR3_RG: titular3.rg || '',
        TITULAR3_DATA_NASCIMENTO: titular3.dataNascimento || '',
        TITULAR3_NOME_MAE: titular3.nomeMae || '',
        TITULAR3_SEXO: titular3.sexo || '',
        TITULAR3_ESTADO_CIVIL: titular3.estadoCivil || '',
        TITULAR3_PESO: titular3.peso || '',
        TITULAR3_ALTURA: titular3.altura || '',
        TITULAR3_EMAIL_PESSOAL: titular3.emailPessoal || '',
        TITULAR3_TELEFONE_PESSOAL: titular3.telefonePessoal || '',
        TITULAR3_EMAIL_EMPRESA: titular3.emailEmpresa || '',
        TITULAR3_TELEFONE_EMPRESA: titular3.telefoneEmpresa || '',
        TITULAR3_CEP: titular3.cep || '',
        TITULAR3_ENDERECO_COMPLETO: titular3.enderecoCompleto || '',
        TITULAR3_DADOS_REEMBOLSO: titular3.dadosReembolso || '',
      });

      // === DEPENDENTE 1 (CAMPOS FIXOS PRÉ-DEFINIDOS) ===
      const dependente1 = dependentes[0] || {};
      Object.assign(linhaUnica, {
        DEPENDENTE1_NOME_COMPLETO: dependente1.nomeCompleto || '',
        DEPENDENTE1_CPF: dependente1.cpf || '',
        DEPENDENTE1_RG: dependente1.rg || '',
        DEPENDENTE1_DATA_NASCIMENTO: dependente1.dataNascimento || '',
        DEPENDENTE1_PARENTESCO: dependente1.parentesco || '',
        DEPENDENTE1_NOME_MAE: dependente1.nomeMae || '',
        DEPENDENTE1_SEXO: dependente1.sexo || '',
        DEPENDENTE1_ESTADO_CIVIL: dependente1.estadoCivil || '',
        DEPENDENTE1_PESO: dependente1.peso || '',
        DEPENDENTE1_ALTURA: dependente1.altura || '',
        DEPENDENTE1_EMAIL_PESSOAL: dependente1.emailPessoal || '',
        DEPENDENTE1_TELEFONE_PESSOAL: dependente1.telefonePessoal || '',
        DEPENDENTE1_EMAIL_EMPRESA: dependente1.emailEmpresa || '',
        DEPENDENTE1_TELEFONE_EMPRESA: dependente1.telefoneEmpresa || '',
        DEPENDENTE1_CEP: dependente1.cep || '',
        DEPENDENTE1_ENDERECO_COMPLETO: dependente1.enderecoCompleto || '',
        DEPENDENTE1_DADOS_REEMBOLSO: dependente1.dadosReembolso || '',
      });

      // === DEPENDENTE 2 (CAMPOS FIXOS PRÉ-DEFINIDOS) ===
      const dependente2 = dependentes[1] || {};
      Object.assign(linhaUnica, {
        DEPENDENTE2_NOME_COMPLETO: dependente2.nomeCompleto || '',
        DEPENDENTE2_CPF: dependente2.cpf || '',
        DEPENDENTE2_RG: dependente2.rg || '',
        DEPENDENTE2_DATA_NASCIMENTO: dependente2.dataNascimento || '',
        DEPENDENTE2_PARENTESCO: dependente2.parentesco || '',
        DEPENDENTE2_NOME_MAE: dependente2.nomeMae || '',
        DEPENDENTE2_SEXO: dependente2.sexo || '',
        DEPENDENTE2_ESTADO_CIVIL: dependente2.estadoCivil || '',
        DEPENDENTE2_PESO: dependente2.peso || '',
        DEPENDENTE2_ALTURA: dependente2.altura || '',
        DEPENDENTE2_EMAIL_PESSOAL: dependente2.emailPessoal || '',
        DEPENDENTE2_TELEFONE_PESSOAL: dependente2.telefonePessoal || '',
        DEPENDENTE2_EMAIL_EMPRESA: dependente2.emailEmpresa || '',
        DEPENDENTE2_TELEFONE_EMPRESA: dependente2.telefoneEmpresa || '',
        DEPENDENTE2_CEP: dependente2.cep || '',
        DEPENDENTE2_ENDERECO_COMPLETO: dependente2.enderecoCompleto || '',
        DEPENDENTE2_DADOS_REEMBOLSO: dependente2.dadosReembolso || '',
      });

      // === DEPENDENTE 3 (CAMPOS FIXOS PRÉ-DEFINIDOS) ===
      const dependente3 = dependentes[2] || {};
      Object.assign(linhaUnica, {
        DEPENDENTE3_NOME_COMPLETO: dependente3.nomeCompleto || '',
        DEPENDENTE3_CPF: dependente3.cpf || '',
        DEPENDENTE3_RG: dependente3.rg || '',
        DEPENDENTE3_DATA_NASCIMENTO: dependente3.dataNascimento || '',
        DEPENDENTE3_PARENTESCO: dependente3.parentesco || '',
        DEPENDENTE3_NOME_MAE: dependente3.nomeMae || '',
        DEPENDENTE3_SEXO: dependente3.sexo || '',
        DEPENDENTE3_ESTADO_CIVIL: dependente3.estadoCivil || '',
        DEPENDENTE3_PESO: dependente3.peso || '',
        DEPENDENTE3_ALTURA: dependente3.altura || '',
        DEPENDENTE3_EMAIL_PESSOAL: dependente3.emailPessoal || '',
        DEPENDENTE3_TELEFONE_PESSOAL: dependente3.telefonePessoal || '',
        DEPENDENTE3_EMAIL_EMPRESA: dependente3.emailEmpresa || '',
        DEPENDENTE3_TELEFONE_EMPRESA: dependente3.telefoneEmpresa || '',
        DEPENDENTE3_CEP: dependente3.cep || '',
        DEPENDENTE3_ENDERECO_COMPLETO: dependente3.enderecoCompleto || '',
        DEPENDENTE3_DADOS_REEMBOLSO: dependente3.dadosReembolso || '',
      });

      // === DEPENDENTE 4 (CAMPOS FIXOS PRÉ-DEFINIDOS) ===
      const dependente4 = dependentes[3] || {};
      Object.assign(linhaUnica, {
        DEPENDENTE4_NOME_COMPLETO: dependente4.nomeCompleto || '',
        DEPENDENTE4_CPF: dependente4.cpf || '',
        DEPENDENTE4_RG: dependente4.rg || '',
        DEPENDENTE4_DATA_NASCIMENTO: dependente4.dataNascimento || '',
        DEPENDENTE4_PARENTESCO: dependente4.parentesco || '',
        DEPENDENTE4_NOME_MAE: dependente4.nomeMae || '',
        DEPENDENTE4_SEXO: dependente4.sexo || '',
        DEPENDENTE4_ESTADO_CIVIL: dependente4.estadoCivil || '',
        DEPENDENTE4_PESO: dependente4.peso || '',
        DEPENDENTE4_ALTURA: dependente4.altura || '',
        DEPENDENTE4_EMAIL_PESSOAL: dependente4.emailPessoal || '',
        DEPENDENTE4_TELEFONE_PESSOAL: dependente4.telefonePessoal || '',
        DEPENDENTE4_EMAIL_EMPRESA: dependente4.emailEmpresa || '',
        DEPENDENTE4_TELEFONE_EMPRESA: dependente4.telefoneEmpresa || '',
        DEPENDENTE4_CEP: dependente4.cep || '',
        DEPENDENTE4_ENDERECO_COMPLETO: dependente4.enderecoCompleto || '',
        DEPENDENTE4_DADOS_REEMBOLSO: dependente4.dadosReembolso || '',
      });

      // === DEPENDENTE 5 (CAMPOS FIXOS PRÉ-DEFINIDOS) ===
      const dependente5 = dependentes[4] || {};
      Object.assign(linhaUnica, {
        DEPENDENTE5_NOME_COMPLETO: dependente5.nomeCompleto || '',
        DEPENDENTE5_CPF: dependente5.cpf || '',
        DEPENDENTE5_RG: dependente5.rg || '',
        DEPENDENTE5_DATA_NASCIMENTO: dependente5.dataNascimento || '',
        DEPENDENTE5_PARENTESCO: dependente5.parentesco || '',
        DEPENDENTE5_NOME_MAE: dependente5.nomeMae || '',
        DEPENDENTE5_SEXO: dependente5.sexo || '',
        DEPENDENTE5_ESTADO_CIVIL: dependente5.estadoCivil || '',
        DEPENDENTE5_PESO: dependente5.peso || '',
        DEPENDENTE5_ALTURA: dependente5.altura || '',
        DEPENDENTE5_EMAIL_PESSOAL: dependente5.emailPessoal || '',
        DEPENDENTE5_TELEFONE_PESSOAL: dependente5.telefonePessoal || '',
        DEPENDENTE5_EMAIL_EMPRESA: dependente5.emailEmpresa || '',
        DEPENDENTE5_TELEFONE_EMPRESA: dependente5.telefoneEmpresa || '',
        DEPENDENTE5_CEP: dependente5.cep || '',
        DEPENDENTE5_ENDERECO_COMPLETO: dependente5.enderecoCompleto || '',
        DEPENDENTE5_DADOS_REEMBOLSO: dependente5.dadosReembolso || '',
      });

      return linhaBase;
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

        {/* Informações sobre estrutura */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">📋 Estrutura da Planilha Única Horizontal</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              • <strong>Uma empresa = Uma linha</strong>
              <br />• Campos para múltiplos titulares (TITULAR1_, TITULAR2_, etc.)
              <br />• Campos para múltiplos dependentes (DEPENDENTE1_, DEPENDENTE2_, etc.)
            </div>
            <div>
              • <strong>Campos vazios = [vazio]</strong>
              <br />• Estrutura expansível horizontalmente
              <br />• Compatível com Google Sheets
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