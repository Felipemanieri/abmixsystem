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
  // EXPANSÃO ILIMITADA PARA GERAR MAIS DE 550 CAMPOS
  let maxTitulares = 50; // Base para garantir estrutura completa (expandível)
  let maxDependentes = 50; // Base para garantir estrutura completa (expandível)
  
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
  
  // Calcular total de colunas para mais de 550 campos
  const baseColumns = 8; // ID, LINK, EMPRESA, CNPJ, VENDEDOR, PLANO, VALOR, STATUS
  const contractColumns = 15; // Expandido: ODONTO, LIVRE_ADESAO, COMPULSORIO, APROVEITAMENTO, INICIO, PERIODO + novos
  const internalColumns = 20; // Expandido: REUNIÃO, NOME_REUNIÃO, VENDA_DUPLA, VENDEDOR_DUPLA, DESCONTO, etc.
  const titularColumns = maxTitulares * 8; // Expandido: NOME, CPF, RG, EMAIL, TELEFONE, ENDERECO, NASCIMENTO, PROFISSAO
  const dependenteColumns = maxDependentes * 6; // Expandido: NOME, CPF, PARENTESCO, RG, NASCIMENTO, ENDERECO
  const extraColumns = 25; // Expandido: ANEXOS, DATA_CONTRATO + campos adicionais
  
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
  
  // INFORMAÇÕES DETALHADAS DO CONTRATO (EXPANDIDO - MAIS DE 50 CAMPOS)
  headers.push(
    'ODONTO_CONJUGADO', 'LIVRE_ADESAO', 'COMPULSORIO', 'APROVEITAMENTO_CONGENERE', 
    'INICIO_VIGENCIA', 'PERIODO_MINIMO', 'TIPO_ACOMODACAO', 'COPARTICIPACAO',
    'FATOR_MODERADOR', 'ABRANGENCIA_GEOGRAFICA', 'SEGMENTACAO_ASSISTENCIAL',
    'PADRÃO_QUARTO', 'CENTRO_CIRURGICO', 'UTI_DISPONIVEL', 'URGENCIA_EMERGENCIA',
    'AMBULATORIO', 'EXAMES_LABORATORIAIS', 'PROCEDIMENTOS_ESPECIAIS',
    'FISIOTERAPIA', 'PSICOLOGIA', 'NUTRICAO', 'FONOAUDIOLOGIA'
  );
  
  // INFORMAÇÕES COMERCIAIS DETALHADAS
  headers.push(
    'NUMERO_VIDAS_TOTAL', 'NUMERO_BENEFICIARIOS_ATIVOS', 'NUMERO_DEPENDENTES_TOTAL',
    'FAIXA_ETARIA_PREDOMINANTE', 'PERFIL_DEMOGRAFICO', 'HISTORICO_SINISTRALIDADE',
    'EXPERIENCIA_ANTERIOR', 'OPERADORA_ANTERIOR', 'MOTIVO_MUDANCA',
    'DATA_VIGENCIA_ANTERIOR', 'DATA_CANCELAMENTO_ANTERIOR'
  );
  
  // INFORMAÇÕES INTERNAS EXPANDIDAS
  headers.push(
    'REUNIAO_REALIZADA', 'NOME_REUNIAO', 'DATA_REUNIAO', 'HORARIO_REUNIAO',
    'LOCAL_REUNIAO', 'PARTICIPANTES_REUNIAO', 'VENDA_DUPLA', 'VENDEDOR_DUPLA',
    'DESCONTO_PERCENT', 'VALOR_DESCONTO', 'ORIGEM_VENDA', 'AUTORIZADOR_DESCONTO',
    'MOTIVO_DESCONTO', 'CONDICOES_ESPECIAIS', 'OBSERVACOES_COMERCIAIS',
    'OBS_FINANCEIRAS', 'OBS_CLIENTE', 'OBS_IMPLEMENTACAO', 'OBS_SUPERVISOR'
  );
  
  // DADOS DE PROCESSAMENTO E WORKFLOW
  headers.push(
    'DATA_CRIACAO', 'DATA_ULTIMA_ALTERACAO', 'USUARIO_CRIACAO', 'USUARIO_ALTERACAO',
    'ETAPA_ATUAL', 'PROXIMA_ETAPA', 'PRAZO_IMPLEMENTACAO', 'RESPONSAVEL_IMPLEMENTACAO',
    'PRIORIDADE', 'URGENCIA', 'COMPLEXIDADE', 'TEMPO_ESTIMADO_CONCLUSAO'
  );
  
  // TITULARES - REGRA 6 (CAMPOS AGRUPADOS) - EXPANSÃO ILIMITADA COM CAMPOS COMPLETOS
  for (let i = 1; i <= maxTitulares; i++) {
    headers.push(
      `TITULAR${i}_NOME`,
      `TITULAR${i}_CPF`,
      `TITULAR${i}_RG`,
      `TITULAR${i}_EMAIL`,
      `TITULAR${i}_TELEFONE`,
      `TITULAR${i}_DATA_NASCIMENTO`,
      `TITULAR${i}_ENDERECO_COMPLETO`,
      `TITULAR${i}_CEP`,
      `TITULAR${i}_CIDADE`,
      `TITULAR${i}_ESTADO`,
      `TITULAR${i}_PROFISSAO`,
      `TITULAR${i}_EMPRESA_TRABALHO`,
      `TITULAR${i}_RENDA`,
      `TITULAR${i}_ESTADO_CIVIL`,
      `TITULAR${i}_GENERO`
    );
  }
  
  // DEPENDENTES - REGRA 6 (CAMPOS AGRUPADOS) - EXPANSÃO ILIMITADA COM CAMPOS COMPLETOS
  for (let i = 1; i <= maxDependentes; i++) {
    headers.push(
      `DEPENDENTE${i}_NOME`,
      `DEPENDENTE${i}_CPF`,
      `DEPENDENTE${i}_RG`,
      `DEPENDENTE${i}_PARENTESCO`,
      `DEPENDENTE${i}_DATA_NASCIMENTO`,
      `DEPENDENTE${i}_ENDERECO_COMPLETO`,
      `DEPENDENTE${i}_CEP`,
      `DEPENDENTE${i}_CIDADE`,
      `DEPENDENTE${i}_ESTADO`,
      `DEPENDENTE${i}_GENERO`,
      `DEPENDENTE${i}_ESCOLA_FACULDADE`,
      `DEPENDENTE${i}_OCUPACAO`
    );
  }
  
  // CAMPOS EXTRAS EXPANDIDOS - MAIS DE 25 CAMPOS ADICIONAIS
  headers.push(
    'ANEXOS_QUANTIDADE', 'ANEXOS_LISTA', 'ANEXOS_TAMANHO_TOTAL', 'ANEXOS_TIPOS',
    'DATA_CONTRATO', 'DATA_APROVACAO', 'DATA_IMPLEMENTACAO', 'DATA_ATIVACAO',
    'RESPONSAVEL_COMERCIAL', 'RESPONSAVEL_TECNICO', 'RESPONSAVEL_FINANCEIRO',
    'STATUS_DOCUMENTACAO', 'STATUS_APROVACAO', 'STATUS_IMPLEMENTACAO', 'STATUS_ATIVACAO',
    'PRAZO_ENTREGA', 'PRAZO_ATIVACAO', 'PRAZO_PRIMEIRA_UTILIZACAO',
    'CANAL_VENDA', 'ORIGEM_LEAD', 'CAMPANHA_MARKETING', 'FONTE_INDICACAO',
    'SCORE_CREDITO', 'RATING_CLIENTE', 'CATEGORIA_RISCO', 'LIMITE_CREDITO',
    'VALOR_PREMIO_ANUAL', 'VALOR_PREMIO_MENSAL', 'FORMA_PAGAMENTO', 'BANCO_PAGAMENTO',
    'CONTA_PAGAMENTO', 'DIA_VENCIMENTO', 'DESCONTO_APLICADO', 'TAXA_ADICIONAL'
  );
  
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