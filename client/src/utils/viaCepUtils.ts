interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

interface EnderecoFields {
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  enderecoCompleto?: string;
}

/**
 * Busca dados do CEP na API ViaCEP e retorna as informações do endereço
 * @param cep - CEP a ser consultado (com ou sem máscara)
 * @returns Promise com os dados do endereço ou null se não encontrado
 */
export const buscarCEP = async (cep: string): Promise<EnderecoFields | null> => {
  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '');
  
  // Verifica se o CEP tem 8 dígitos
  if (cepLimpo.length !== 8) {
    return null;
  }
  
  try {
    console.log('Buscando CEP via ViaCEP direto:', cepLimpo);
    
    // Tentativa direta com ViaCEP usando fetch com configurações específicas
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Remove mode: 'cors' para permitir requisições CORS simples
    });
    
    console.log('Resposta ViaCEP:', response.status, response.ok);
    
    if (!response.ok) {
      console.error('Erro na resposta ViaCEP:', response.status, response.statusText);
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    const data: ViaCepResponse = await response.json();
    console.log('Dados ViaCEP recebidos:', data);
    
    // Verifica se houve erro na consulta
    if (data.erro) {
      console.warn('CEP não encontrado na ViaCEP:', cepLimpo);
      return null;
    }
    
    // Monta o endereço completo
    const enderecoCompleto = [
      data.logradouro,
      data.bairro,
      data.localidade,
      data.uf
    ].filter(Boolean).join(', ');
    
    console.log('Endereço montado:', enderecoCompleto);
    
    return {
      endereco: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      enderecoCompleto: enderecoCompleto
    };
    
  } catch (error) {
    console.error('Erro ao buscar CEP na ViaCEP:', {
      cep: cepLimpo,
      erro: error,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    return null;
  }
};

/**
 * Formata CEP com máscara (00000-000)
 * @param cep - CEP sem formatação
 * @returns CEP formatado
 */
export const formatarCEP = (cep: string): string => {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length <= 5) {
    return cepLimpo;
  }
  
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5, 8)}`;
};

/**
 * Função auxiliar para criar handler de busca de CEP
 * @param updateFunction - Função para atualizar os campos do formulário
 * @returns Handler para onBlur do campo CEP
 */
export const createCepHandler = (
  updateFunction: (field: string, value: string) => void
) => {
  return async (cep: string) => {
    const endereco = await buscarCEP(cep);
    
    if (endereco) {
      // Atualiza os campos com os dados encontrados
      if (endereco.enderecoCompleto) {
        updateFunction('enderecoCompleto', endereco.enderecoCompleto);
      }
      
      // Se houver campos separados, também atualiza
      if (endereco.endereco) {
        updateFunction('endereco', endereco.endereco);
      }
      if (endereco.bairro) {
        updateFunction('bairro', endereco.bairro);
      }
      if (endereco.cidade) {
        updateFunction('cidade', endereco.cidade);
      }
      if (endereco.estado) {
        updateFunction('estado', endereco.estado);
      }
    }
  };
};