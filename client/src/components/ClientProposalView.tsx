import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building, FileText, User, Upload, Camera, CheckCircle, Lock, Save, Download, Eye, EyeOff, Plus, Trash2, Users } from 'lucide-react';
import { showNotification } from '../utils/notifications';

interface ClientProposalViewProps {
  token: string;
}

interface ContractData {
  nomeEmpresa: string;
  cnpj: string;
  planoContratado: string;
  valor: string;
  periodoVigencia: {
    inicio: string;
    fim: string;
  };
  odontoConjugado: boolean;
  compulsorio: boolean;
  livreAdesao: boolean;
  inicioVigencia: string;
  periodoMinimo: string;
  aproveitamentoCongenere: boolean;
}

interface PersonData {
  id: string;
  nomeCompleto: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  parentesco?: string;
  nomeMae: string;
  sexo: 'masculino' | 'feminino' | '';
  estadoCivil: string;
  peso: string;
  altura: string;
  emailPessoal: string;
  telefonePessoal: string;
  emailEmpresa: string;
  telefoneEmpresa: string;
  cep: string;
  enderecoCompleto: string;
  dadosReembolso: string;
}

interface Proposal {
  id: string;
  contractData: ContractData;
  titulares: PersonData[];
  dependentes: PersonData[];
  attachments: any[];
  status: string;
}

const ClientProposalView: React.FC<ClientProposalViewProps> = ({ token }) => {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [titulares, setTitulares] = useState<PersonData[]>([]);
  const [dependentes, setDependentes] = useState<PersonData[]>([]);
  const [clientAttachments, setClientAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, [token]);

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/proposals/client/${token}`);
      
      if (!response.ok) {
        throw new Error('Proposta não encontrada');
      }

      const proposalData = await response.json();
      setProposal(proposalData);
      
      // Inicializar com dados existentes ou dados vazios para preenchimento
      if (proposalData.titulares && proposalData.titulares.length > 0) {
        setTitulares(proposalData.titulares);
      } else {
        setTitulares([createEmptyPerson('1')]);
      }
      
      if (proposalData.dependentes) {
        setDependentes(proposalData.dependentes);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar proposta:', error);
      showNotification('Erro ao carregar proposta', 'error');
      setLoading(false);
    }
  };

  const createEmptyPerson = (id: string, parentesco?: string): PersonData => ({
    id,
    nomeCompleto: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    parentesco,
    nomeMae: '',
    sexo: '',
    estadoCivil: '',
    peso: '',
    altura: '',
    emailPessoal: '',
    telefonePessoal: '',
    emailEmpresa: '',
    telefoneEmpresa: '',
    cep: '',
    enderecoCompleto: '',
    dadosReembolso: ''
  });

  const addTitular = () => {
    const newTitular = createEmptyPerson(`titular-${Date.now()}`);
    setTitulares([...titulares, newTitular]);
  };

  const removeTitular = (id: string) => {
    if (titulares.length > 1) {
      setTitulares(titulares.filter(titular => titular.id !== id));
    }
  };

  const addDependente = () => {
    const newDependente = createEmptyPerson(`dependente-${Date.now()}`, 'Cônjuge');
    setDependentes([...dependentes, newDependente]);
  };

  const removeDependente = (id: string) => {
    setDependentes(dependentes.filter(dep => dep.id !== id));
  };

  const updateTitular = (index: number, field: keyof PersonData, value: string) => {
    const newTitulares = [...titulares];
    newTitulares[index] = { ...newTitulares[index], [field]: value };
    setTitulares(newTitulares);
  };

  const updateDependente = (index: number, field: keyof PersonData, value: string) => {
    const newDependentes = [...dependentes];
    newDependentes[index] = { ...newDependentes[index], [field]: value };
    setDependentes(newDependentes);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setClientAttachments([...clientAttachments, ...newFiles]);
      showNotification(`${newFiles.length} arquivo(s) adicionado(s)`, 'success');
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...clientAttachments];
    newAttachments.splice(index, 1);
    setClientAttachments(newAttachments);
  };

  const handleSubmit = async () => {
    // Validar campos obrigatórios
    const firstTitular = titulares[0];
    if (!firstTitular.nomeCompleto || !firstTitular.cpf || !firstTitular.rg) {
      showNotification('Preencha todos os campos obrigatórios do primeiro titular', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        titulares,
        dependentes,
        clientAttachments: clientAttachments.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };

      const response = await fetch(`/api/proposals/client/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar proposta');
      }

      setIsCompleted(true);
      showNotification('Proposta enviada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      showNotification('Erro ao enviar proposta', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonForm = (person: PersonData, type: 'titular' | 'dependente', index: number) => (
    <div key={person.id} className="bg-gray-50 p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {type === 'titular' ? `Titular ${index + 1}` : `Dependente ${index + 1}`}
        </h3>
        {(type === 'titular' && titulares.length > 1) || type === 'dependente' ? (
          <button
            onClick={() => type === 'titular' ? removeTitular(person.id) : removeDependente(person.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {type === 'dependente' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parentesco *
            </label>
            <select
              value={person.parentesco || ''}
              onChange={(e) => type === 'titular' ? updateTitular(index, 'parentesco', e.target.value) : updateDependente(index, 'parentesco', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione o parentesco</option>
              <option value="Cônjuge">Cônjuge</option>
              <option value="Filho(a)">Filho(a)</option>
              <option value="Enteado(a)">Enteado(a)</option>
              <option value="Pai">Pai</option>
              <option value="Mãe">Mãe</option>
              <option value="Sogro(a)">Sogro(a)</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            value={person.nomeCompleto}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'nomeCompleto', e.target.value) : updateDependente(index, 'nomeCompleto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF *
          </label>
          <input
            type="text"
            value={person.cpf}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'cpf', e.target.value) : updateDependente(index, 'cpf', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RG *
          </label>
          <input
            type="text"
            value={person.rg}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'rg', e.target.value) : updateDependente(index, 'rg', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento *
          </label>
          <input
            type="date"
            value={person.dataNascimento}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'dataNascimento', e.target.value) : updateDependente(index, 'dataNascimento', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Mãe *
          </label>
          <input
            type="text"
            value={person.nomeMae}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'nomeMae', e.target.value) : updateDependente(index, 'nomeMae', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sexo *
          </label>
          <select
            value={person.sexo}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'sexo', e.target.value) : updateDependente(index, 'sexo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado Civil
          </label>
          <select
            value={person.estadoCivil}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'estadoCivil', e.target.value) : updateDependente(index, 'estadoCivil', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
            <option value="União Estável">União Estável</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail Pessoal *
          </label>
          <input
            type="email"
            value={person.emailPessoal}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'emailPessoal', e.target.value) : updateDependente(index, 'emailPessoal', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone Pessoal *
          </label>
          <input
            type="tel"
            value={person.telefonePessoal}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'telefonePessoal', e.target.value) : updateDependente(index, 'telefonePessoal', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(11) 99999-9999"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CEP *
          </label>
          <input
            type="text"
            value={person.cep}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'cep', e.target.value) : updateDependente(index, 'cep', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="00000-000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço Completo *
          </label>
          <input
            type="text"
            value={person.enderecoCompleto}
            onChange={(e) => type === 'titular' ? updateTitular(index, 'enderecoCompleto', e.target.value) : updateDependente(index, 'enderecoCompleto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rua, número, complemento, bairro, cidade, estado"
            required
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Proposta não encontrada</h1>
          <p className="text-gray-600">O link pode ter expirado ou ser inválido.</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-600 mb-2">Proposta Enviada!</h1>
          <p className="text-gray-600 mb-4">
            Sua proposta foi enviada com sucesso e está sendo processada por nossa equipe.
          </p>
          <p className="text-sm text-gray-500">
            Você receberá atualizações por e-mail sobre o status da sua proposta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">Completar Proposta de Plano de Saúde</h1>
            <p className="text-blue-100 mt-2">Preencha seus dados pessoais para finalizar a proposta</p>
          </div>

          {/* Contract Data - Read Only */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center mb-4">
              <Building className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Dados do Contrato</h2>
              <Lock className="h-4 w-4 text-gray-500 ml-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={proposal.contractData.nomeEmpresa}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input
                  type="text"
                  value={proposal.contractData.cnpj}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plano Contratado</label>
                <input
                  type="text"
                  value={proposal.contractData.planoContratado}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                <input
                  type="text"
                  value={`R$ ${proposal.contractData.valor}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Personal Data Form */}
          <div className="p-6">
            {/* Titulares */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Dados dos Titulares</h2>
                </div>
                <button
                  onClick={addTitular}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Titular
                </button>
              </div>
              
              <div className="space-y-6">
                {titulares.map((titular, index) => renderPersonForm(titular, 'titular', index))}
              </div>
            </div>

            {/* Dependentes */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Dependentes</h2>
                </div>
                <button
                  onClick={addDependente}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Dependente
                </button>
              </div>
              
              <div className="space-y-6">
                {dependentes.map((dependente, index) => renderPersonForm(dependente, 'dependente', index))}
              </div>
            </div>

            {/* Document Upload */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Documentos</h2>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">Envie seus documentos</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Aceitos: PDF, JPG, PNG (máx. 10MB cada)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                  >
                    Selecionar Arquivos
                  </label>
                </div>
                
                {clientAttachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Arquivos selecionados:</h4>
                    <ul className="space-y-2">
                      {clientAttachments.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Enviar Proposta
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProposalView;