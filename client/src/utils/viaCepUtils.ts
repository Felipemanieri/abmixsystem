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
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    
    if (!response.ok) {
      console.error('Erro na resposta da API ViaCEP:', response.status);
      return null;
    }
    
    const data: ViaCepResponse = await response.json();
    
    // Verifica se houve erro na consulta
    if (data.erro) {
      console.warn('CEP não encontrado:', cepLimpo);
      return null;
    }
    
    // Monta o endereço completo
    const enderecoCompleto = [
      data.logradouro,
      data.bairro,
      data.localidade,
      data.uf
    ].filter(Boolean).join(', ');
    
    return {
      endereco: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      enderecoCompleto: enderecoCompleto
    };
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
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