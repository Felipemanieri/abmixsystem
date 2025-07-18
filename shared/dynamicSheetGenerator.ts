// SISTEMA DE DETECÇÃO AUTOMÁTICA DINÂMICA
// Cria colunas automaticamente baseado nos dados reais das propostas

export interface DynamicSheetData {
  headers: string[];
  data: any[][];
  maxTitulares: number;
  maxDependentes: number;
  totalColumns: number;
  lastUpdated: Date;
}

export function analyzeDynamicStructure(proposals: any[]): {
  maxTitulares: number;
  maxDependentes: number;
  totalColumns: number;
} {
  let maxTitulares = 3; // Mínimo garantido
  let maxDependentes = 5; // Mínimo garantido
  
  // ANÁLISE AUTOMÁTICA DOS DADOS REAIS
  for (const proposal of proposals) {
    const titulares = proposal.titulares || [];
    const dependentes = proposal.dependentes || [];
    
    // Detectar quantos titulares existem
    if (titulares.length > maxTitulares) {
      maxTitulares = titulares.length;
    }
    
    // Detectar quantos dependentes existem
    if (dependentes.length > maxDependentes) {
      maxDependentes = dependentes.length;
    }
  }
  
  // Calcular total de colunas
  const baseColumns = 8; // ID, LINK, EMPRESA, CNPJ, VENDEDOR, PLANO, VALOR, STATUS
  const contractColumns = 6; // ODONTO, LIVRE_ADESAO, COMPULSORIO, APROVEITAMENTO, INICIO, PERIODO
  const internalColumns = 9; // REUNIÃO, NOME_REUNIÃO, VENDA_DUPLA, VENDEDOR_DUPLA, DESCONTO, ORIGEM, AUTORIZADOR, OBS_FINANCEIRAS, OBS_CLIENTE
  const titularColumns = maxTitulares * 5; // NOME, CPF, RG, EMAIL, TELEFONE para cada titular
  const dependenteColumns = maxDependentes * 3; // NOME, CPF, PARENTESCO para cada dependente
  const extraColumns = 2; // ANEXOS, DATA_CONTRATO
  
  const totalColumns = baseColumns + contractColumns + internalColumns + titularColumns + dependenteColumns + extraColumns;
  
  return {
    maxTitulares,
    maxDependentes,
    totalColumns
  };
}

export function generateDynamicHeaders(maxTitulares: number, maxDependentes: number): string[] {
  const headers = [];
  
  // CAMPOS FIXOS OBRIGATÓRIOS
  headers.push('ID', 'LINK_CLIENTE', 'EMPRESA', 'CNPJ', 'VENDEDOR', 'PLANO', 'VALOR', 'STATUS');
  
  // INFORMAÇÕES DO CONTRATO
  headers.push('ODONTO_CONJUGADO', 'LIVRE_ADESAO', 'COMPULSORIO', 'APROVEITAMENTO_CONGENERE', 'INICIO_VIGENCIA', 'PERIODO_MINIMO');
  
  // INFORMAÇÕES INTERNAS
  headers.push('REUNIAO_REALIZADA', 'NOME_REUNIAO', 'VENDA_DUPLA', 'VENDEDOR_DUPLA', 'DESCONTO_PERCENT', 'ORIGEM_VENDA', 'AUTORIZADOR_DESCONTO', 'OBS_FINANCEIRAS', 'OBS_CLIENTE');
  
  // TITULARES DINÂMICOS (baseado no máximo detectado)
  for (let i = 1; i <= maxTitulares; i++) {
    headers.push(
      `TITULAR${i}_NOME`,
      `TITULAR${i}_CPF`,
      `TITULAR${i}_RG`,
      `TITULAR${i}_EMAIL`,
      `TITULAR${i}_TELEFONE`
    );
  }
  
  // DEPENDENTES DINÂMICOS (baseado no máximo detectado)
  for (let i = 1; i <= maxDependentes; i++) {
    headers.push(
      `DEPENDENTE${i}_NOME`,
      `DEPENDENTE${i}_CPF`,
      `DEPENDENTE${i}_PARENTESCO`
    );
  }
  
  // CAMPOS EXTRAS
  headers.push('ANEXOS', 'DATA_CONTRATO');
  
  return headers;
}

export function formatProposalToDynamicRow(proposal: any, maxTitulares: number, maxDependentes: number): any[] {
  const row = [];
  const contractData = proposal.contractData || {};
  const internalData = proposal.internalData || {};
  const titulares = proposal.titulares || [];
  const dependentes = proposal.dependentes || [];
  
  // CAMPOS FIXOS OBRIGATÓRIOS
  row.push(
    proposal.abmId || `ABM${proposal.id?.slice(-3) || '001'}`,
    `https://abmix.com/client-proposal/${proposal.clientToken}`,
    contractData.nomeEmpresa || '',
    contractData.cnpj || '',
    proposal.vendorName || '',
    contractData.planoContratado || '',
    contractData.valor || '',
    proposal.status || 'observacao'
  );
  
  // INFORMAÇÕES DO CONTRATO
  row.push(
    contractData.incluiOdonto ? 'Sim' : 'Não',
    contractData.livreAdesao ? 'Sim' : 'Não',
    contractData.compulsorio ? 'Sim' : 'Não',
    contractData.aproveitamentoCarencia ? 'Sim' : 'Não',
    contractData.inicioVigencia || '',
    contractData.periodoMinimo || ''
  );
  
  // INFORMAÇÕES INTERNAS
  row.push(
    internalData.reuniao ? 'Sim' : 'Não',
    internalData.nomeReuniao || '',
    internalData.vendaDupla ? 'Sim' : 'Não',
    internalData.nomeVendaDupla || '',
    internalData.desconto || '',
    internalData.origemVenda || '',
    internalData.autorizadorDesconto || '',
    internalData.observacoesFinanceiras || '',
    internalData.observacoesCliente || ''
  );
  
  // TITULARES DINÂMICOS
  for (let i = 0; i < maxTitulares; i++) {
    const titular = titulares[i];
    if (titular) {
      row.push(
        titular.nome || '',
        titular.cpf || '',
        titular.rg || '',
        titular.emailPessoal || '',
        titular.telefonePessoal || ''
      );
    } else {
      // Campos vazios para titulares não existentes
      row.push('', '', '', '', '');
    }
  }
  
  // DEPENDENTES DINÂMICOS
  for (let i = 0; i < maxDependentes; i++) {
    const dependente = dependentes[i];
    if (dependente) {
      row.push(
        dependente.nome || '',
        dependente.cpf || '',
        dependente.parentesco || ''
      );
    } else {
      // Campos vazios para dependentes não existentes
      row.push('', '', '');
    }
  }
  
  // CAMPOS EXTRAS
  row.push(
    (proposal.vendorAttachments?.length || 0) + (proposal.clientAttachments?.length || 0),
    proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')
  );
  
  return row;
}

export function generateDynamicSheet(proposals: any[]): DynamicSheetData {
  // ANÁLISE AUTOMÁTICA DA ESTRUTURA
  const { maxTitulares, maxDependentes, totalColumns } = analyzeDynamicStructure(proposals);
  
  // GERAR CABEÇALHOS DINÂMICOS
  const headers = generateDynamicHeaders(maxTitulares, maxDependentes);
  
  // GERAR DADOS DINÂMICOS
  const data = proposals.map(proposal => 
    formatProposalToDynamicRow(proposal, maxTitulares, maxDependentes)
  );
  
  return {
    headers,
    data,
    maxTitulares,
    maxDependentes,
    totalColumns,
    lastUpdated: new Date()
  };
}

// FUNÇÃO PARA EXPORTAR PARA GOOGLE SHEETS
export function formatForGoogleSheets(sheetData: DynamicSheetData): any[][] {
  return [
    sheetData.headers,
    ...sheetData.data
  ];
}