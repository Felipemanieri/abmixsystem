// SISTEMA DE PLANILHA HORIZONTAL COM EXPANSÃO AUTOMÁTICA ILIMITADA
// 
// REGRA 1: UMA EMPRESA = UMA LINHA ÚNICA - Cada proposta ocupa apenas uma linha horizontal
// REGRA 2: CAMPOS CRIADOS AUTOMATICAMENTE - TITULAR1, TITULAR2... DEPENDENTE1, DEPENDENTE2... (SEM LIMITE)
// REGRA 3: CAMPOS VAZIOS PERMITIDOS - Campos não preenchidos ficam em branco
// REGRA 4: JAMAIS CRIAR NOVA LINHA PARA MESMA EMPRESA - Sempre atualizar linha existente
// REGRA 5: ESTRUTURA HORIZONTAL - Todos os dados lado a lado na mesma linha
// REGRA 6: CAMPOS AGRUPADOS - Titular1_Nome, Titular1_CPF ficam juntos
// 
// TITULARES E DEPENDENTES: SEM LIMITES - Sistema cria campos automaticamente conforme necessário

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
  // EXPANSÃO ILIMITADA - SEM LIMITES FIXOS
  let maxTitulares = 1; // Mínimo: pelo menos 1 titular sempre existe
  let maxDependentes = 0; // Mínimo: pode não ter dependentes
  
  // DETECÇÃO AUTOMÁTICA ILIMITADA - QUALQUER QUANTIDADE
  for (const proposal of proposals) {
    const titulares = proposal.titulares || [];
    const dependentes = proposal.dependentes || [];
    
    // Detectar máximo real de titulares (SEM LIMITE)
    if (titulares.length > maxTitulares) {
      maxTitulares = titulares.length;
    }
    
    // Detectar máximo real de dependentes (SEM LIMITE)
    if (dependentes.length > maxDependentes) {
      maxDependentes = dependentes.length;
    }
  }
  
  // Calcular total de colunas baseado na detecção automática
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
  
  // CAMPOS FIXOS OBRIGATÓRIOS - REGRA 5
  headers.push('ID', 'LINK_CLIENTE', 'EMPRESA', 'CNPJ', 'VENDEDOR', 'PLANO', 'VALOR', 'STATUS');
  
  // INFORMAÇÕES DO CONTRATO
  headers.push('ODONTO_CONJUGADO', 'LIVRE_ADESAO', 'COMPULSORIO', 'APROVEITAMENTO_CONGENERE', 'INICIO_VIGENCIA', 'PERIODO_MINIMO');
  
  // INFORMAÇÕES INTERNAS
  headers.push('REUNIAO_REALIZADA', 'NOME_REUNIAO', 'VENDA_DUPLA', 'VENDEDOR_DUPLA', 'DESCONTO_PERCENT', 'ORIGEM_VENDA', 'AUTORIZADOR_DESCONTO', 'OBS_FINANCEIRAS', 'OBS_CLIENTE');
  
  // TITULARES - REGRA 6 (CAMPOS AGRUPADOS) - EXPANSÃO ILIMITADA
  // Cria automaticamente quantos titulares forem necessários (1, 2, 5, 10, 50...)
  for (let i = 1; i <= maxTitulares; i++) {
    headers.push(
      `TITULAR${i}_NOME`,
      `TITULAR${i}_CPF`,
      `TITULAR${i}_RG`,
      `TITULAR${i}_EMAIL`,
      `TITULAR${i}_TELEFONE`
    );
  }
  
  // DEPENDENTES - REGRA 6 (CAMPOS AGRUPADOS) - EXPANSÃO ILIMITADA
  // Cria automaticamente quantos dependentes forem necessários (0, 1, 3, 20, 100...)
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
  
  // REGRA 1: UMA EMPRESA = UMA LINHA ÚNICA
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
  
  // INFORMAÇÕES DO CONTRATO (preenchidas pelo vendedor)
  row.push(
    contractData.odontoConjugado ? 'Sim' : 'Não',
    contractData.livreAdesao ? 'Sim' : 'Não',
    contractData.compulsorio ? 'Sim' : 'Não',
    contractData.aproveitamentoCongenere ? 'Sim' : 'Não',
    contractData.inicioVigencia || '',
    contractData.periodoMinimo || ''
  );
  
  // INFORMAÇÕES INTERNAS (preenchidas pelo vendedor - campos internos)
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
  
  // REGRA 3: CAMPOS VAZIOS PERMITIDOS
  // REGRA 6: CAMPOS AGRUPADOS - TITULARES
  for (let i = 0; i < maxTitulares; i++) {
    const titular = titulares[i];
    if (titular && titular.nomeCompleto) {
      // Titular existe - preencher dados
      row.push(
        titular.nomeCompleto || '',
        titular.cpf || '',
        titular.rg || '',
        titular.emailPessoal || '',
        titular.telefonePessoal || ''
      );
    } else {
      // REGRA 3: Titular não existe - campos ficam em branco
      row.push('', '', '', '', '');
    }
  }
  
  // REGRA 3: CAMPOS VAZIOS PERMITIDOS
  // REGRA 6: CAMPOS AGRUPADOS - DEPENDENTES
  for (let i = 0; i < maxDependentes; i++) {
    const dependente = dependentes[i];
    if (dependente && dependente.nomeCompleto) {
      // Dependente existe - preencher dados
      row.push(
        dependente.nomeCompleto || '',
        dependente.cpf || '',
        dependente.parentesco || ''
      );
    } else {
      // REGRA 3: Dependente não existe - campos ficam em branco
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