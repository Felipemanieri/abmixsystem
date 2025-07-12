import React, { useState } from 'react';
import { Save, Send, Plus, Trash2, Upload, Camera, FileText, Calendar, DollarSign, Building, Users, User, Phone, Mail, MapPin, Eye, EyeOff, Settings } from 'lucide-react';
import { showNotification } from '../utils/notifications';

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
  inicioVigencia: string;
  aproveitamentoCongenere: boolean;
}

interface PersonData {
  id: string;
  nomeCompleto: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  parentesco?: string; // Apenas para dependentes
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

interface InternalData {
  reuniao: boolean;
  nomeReuniao: string;
  vendaDupla: boolean;
  nomeVendaDupla: string;
  desconto: string;
  autorizadorDesconto: string;
  observacoesFinanceiras: string;
}

interface ProposalFormProps {
  isVendor: boolean; // Define se é vendedor ou cliente
  proposalId?: string; // ID da proposta para carregar dados existentes
  onSave?: (data: any) => void;
  onSend?: (data: any) => void;
  prefilledData?: any; // Dados pré-preenchidos para o cliente
}

const ProposalForm: React.FC<ProposalFormProps> = ({ 
  isVendor, 
  proposalId, 
  onSave, 
  onSend, 
  prefilledData 
}) => {
  const [contractData, setContractData] = useState<ContractData>(prefilledData?.contract || {
    nomeEmpresa: '',
    cnpj: '',
    planoContratado: '',
    valor: '',
    periodoVigencia: { inicio: '', fim: '' },
    odontoConjugado: false,
    compulsorio: false,
    inicioVigencia: '',
    aproveitamentoCongenere: false
  });

  const [titular, setTitular] = useState<PersonData>(prefilledData?.titular || {
    id: '1',
    nomeCompleto: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
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

  const [dependentes, setDependentes] = useState<PersonData[]>(prefilledData?.dependentes || []);

  const [internalData, setInternalData] = useState<InternalData>(prefilledData?.internal || {
    reuniao: false,
    nomeReuniao: '',
    vendaDupla: false,
    nomeVendaDupla: '',
    desconto: '',
    autorizadorDesconto: '',
    observacoesFinanceiras: ''
  });

  const [attachments, setAttachments] = useState<File[]>(prefilledData?.attachments || []);
  const [showInternalFields, setShowInternalFields] = useState(false);

  const planosDisponiveis = [
    'Plano Básico Ambulatorial',
    'Plano Hospitalar com Obstetrícia',
    'Plano Referência',
    'Plano Master',
    'Plano Executivo',
    'Plano Premium',
    'Plano Empresarial',
    'Plano Individual',
    'Plano Familiar'
  ];

  const handleAddDependente = () => {
    const newDependente: PersonData = {
      id: Date.now().toString(),
      nomeCompleto: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      parentesco: '',
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
    };
    setDependentes([...dependentes, newDependente]);
  };

  const handleRemoveDependente = (id: string) => {
    setDependentes(dependentes.filter(dep => dep.id !== id));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      showNotification(`${newFiles.length} arquivo(s) adicionado(s)`, 'success');
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    showNotification('Arquivo removido', 'info');
  };

  const handleSave = () => {
    const formData = {
      contract: contractData,
      titular,
      dependentes,
      internal: isVendor ? internalData : undefined,
      attachments
    };
    
    if (onSave) {
      onSave(formData);
    }
    showNotification('Proposta salva com sucesso!', 'success');
  };

  const handleSendToClient = () => {
    if (!isVendor) return;
    
    const formData = {
      contract: contractData,
      titular,
      dependentes,
      internal: internalData,
      attachments
    };
    
    if (onSend) {
      onSend(formData);
    }
    
    // Simular geração de link único
    const uniqueLink = `${window.location.origin}/proposta/${Date.now()}`;
    navigator.clipboard.writeText(uniqueLink);
    showNotification('Link da proposta copiado! Envie para o cliente.', 'success');
  };

  const renderContractSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Building className="w-5 h-5 mr-2 text-blue-600" />
        Dados do Contrato
        {!isVendor && <span className="ml-2 text-sm text-gray-500">(somente leitura)</span>}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Empresa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={contractData.nomeEmpresa}
            onChange={(e) => setContractData(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
            disabled={!isVendor}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              !isVendor ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
            placeholder="Nome da empresa contratante"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CNPJ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={contractData.cnpj}
            onChange={(e) => setContractData(prev => ({ ...prev, cnpj: e.target.value }))}
            disabled={!isVendor}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              !isVendor ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plano Contratado <span className="text-red-500">*</span>
          </label>
          <select
            value={contractData.planoContratado}
            onChange={(e) => setContractData(prev => ({ ...prev, planoContratado: e.target.value }))}
            disabled={!isVendor}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              !isVendor ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            <option value="">Selecione um plano</option>
            {planosDisponiveis.map(plano => (
              <option key={plano} value={plano}>{plano}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={contractData.valor}
              onChange={(e) => setContractData(prev => ({ ...prev, valor: e.target.value }))}
              disabled={!isVendor}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${
                !isVendor ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="0,00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Início da Vigência <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={contractData.inicioVigencia}
            onChange={(e) => setContractData(prev => ({ ...prev, inicioVigencia: e.target.value }))}
            disabled={!isVendor}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              !isVendor ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fim da Vigência <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={contractData.periodoVigencia.fim}
            onChange={(e) => setContractData(prev => ({ 
              ...prev, 
              periodoVigencia: { ...prev.periodoVigencia, fim: e.target.value }
            }))}
            disabled={!isVendor}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              !isVendor ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="odontoConjugado"
            checked={contractData.odontoConjugado}
            onChange={(e) => setContractData(prev => ({ ...prev, odontoConjugado: e.target.checked }))}
            disabled={!isVendor}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="odontoConjugado" className="ml-2 text-sm text-gray-700">
            Odonto Conjugado
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="compulsorio"
            checked={contractData.compulsorio}
            onChange={(e) => setContractData(prev => ({ ...prev, compulsorio: e.target.checked }))}
            disabled={!isVendor}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="compulsorio" className="ml-2 text-sm text-gray-700">
            Compulsório
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="aproveitamentoCongenere"
            checked={contractData.aproveitamentoCongenere}
            onChange={(e) => setContractData(prev => ({ ...prev, aproveitamentoCongenere: e.target.checked }))}
            disabled={!isVendor}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="aproveitamentoCongenere" className="ml-2 text-sm text-gray-700">
            Aproveitamento Congênere
          </label>
        </div>
      </div>
    </div>
  );

  const renderPersonForm = (person: PersonData, type: 'titular' | 'dependente', index?: number) => (
    <div key={person.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2 text-green-600" />
          {type === 'titular' ? 'Dados do Titular' : `Dependente ${(index || 0) + 1}`}
          <span className="ml-2 text-sm text-red-500">* Campos obrigatórios</span>
        </h3>
        {type === 'dependente' && (
          <button
            onClick={() => handleRemoveDependente(person.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={person.nomeCompleto}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, nomeCompleto: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, nomeCompleto: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome completo"
          />
        </div>

        {type === 'dependente' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parentesco <span className="text-red-500">*</span>
            </label>
            <select
              value={person.parentesco || ''}
              onChange={(e) => {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, parentesco: e.target.value } : dep
                ));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="conjuge">Cônjuge</option>
              <option value="filho">Filho(a)</option>
              <option value="pai">Pai</option>
              <option value="mae">Mãe</option>
              <option value="sogro">Sogro(a)</option>
              <option value="neto">Neto(a)</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={person.cpf}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, cpf: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, cpf: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RG <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={person.rg}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, rg: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, rg: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="00.000.000-0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={person.dataNascimento}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, dataNascimento: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, dataNascimento: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Mãe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={person.nomeMae}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, nomeMae: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, nomeMae: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome completo da mãe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sexo <span className="text-red-500">*</span>
          </label>
          <select
            value={person.sexo}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, sexo: e.target.value as 'masculino' | 'feminino' }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, sexo: e.target.value as 'masculino' | 'feminino' } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, estadoCivil: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, estadoCivil: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viuvo">Viúvo(a)</option>
            <option value="uniao_estavel">União Estável</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            value={person.peso}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, peso: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, peso: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="70"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Altura (cm)
          </label>
          <input
            type="number"
            value={person.altura}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, altura: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, altura: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="170"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Pessoal <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={person.emailPessoal}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, emailPessoal: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, emailPessoal: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone Pessoal <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={person.telefonePessoal}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, telefonePessoal: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, telefonePessoal: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Empresa
          </label>
          <input
            type="email"
            value={person.emailEmpresa}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, emailEmpresa: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, emailEmpresa: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@empresa.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone Empresa
          </label>
          <input
            type="tel"
            value={person.telefoneEmpresa}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, telefoneEmpresa: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, telefoneEmpresa: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(11) 3333-3333"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CEP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={person.cep}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, cep: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, cep: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="00000-000"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={person.enderecoCompleto}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, enderecoCompleto: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, enderecoCompleto: e.target.value } : dep
                ));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rua, número, complemento, bairro, cidade, estado"
          />
        </div>

        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dados para Reembolso
          </label>
          <textarea
            value={person.dadosReembolso}
            onChange={(e) => {
              if (type === 'titular') {
                setTitular(prev => ({ ...prev, dadosReembolso: e.target.value }));
              } else {
                setDependentes(prev => prev.map(dep => 
                  dep.id === person.id ? { ...dep, dadosReembolso: e.target.value } : dep
                ));
              }
            }}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Banco, agência, conta corrente, PIX, etc."
          />
        </div>
      </div>
    </div>
  );

  const renderAttachmentsSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2 text-purple-600" />
        Documentos e Anexos
      </h3>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Adicionar Documentos</h4>
        <p className="text-gray-600 mb-4">Arraste e solte arquivos aqui ou use as opções abaixo</p>
        
        <div className="flex flex-wrap justify-center gap-3">
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            Buscar Arquivos
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
          
          <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
            <Camera className="w-4 h-4 mr-2" />
            Tirar Foto
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {attachments.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Arquivos Anexados ({attachments.length})</h4>
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderInternalSection = () => {
    if (!isVendor) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-orange-600" />
            Campos Internos do Vendedor
          </h3>
          <button
            onClick={() => setShowInternalFields(!showInternalFields)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            {showInternalFields ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showInternalFields ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {showInternalFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reuniao"
                checked={internalData.reuniao}
                onChange={(e) => setInternalData(prev => ({ ...prev, reuniao: e.target.checked }))}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="reuniao" className="ml-2 text-sm text-gray-700">
                Reunião
              </label>
            </div>

            {internalData.reuniao && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Reunião
                </label>
                <input
                  type="text"
                  value={internalData.nomeReuniao}
                  onChange={(e) => setInternalData(prev => ({ ...prev, nomeReuniao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome ou descrição da reunião"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="vendaDupla"
                checked={internalData.vendaDupla}
                onChange={(e) => setInternalData(prev => ({ ...prev, vendaDupla: e.target.checked }))}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="vendaDupla" className="ml-2 text-sm text-gray-700">
                Venda Dupla
              </label>
            </div>

            {internalData.vendaDupla && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Venda Dupla
                </label>
                <input
                  type="text"
                  value={internalData.nomeVendaDupla}
                  onChange={(e) => setInternalData(prev => ({ ...prev, nomeVendaDupla: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do segundo vendedor"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desconto (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={internalData.desconto}
                onChange={(e) => setInternalData(prev => ({ ...prev, desconto: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autorizador do Desconto
              </label>
              <input
                type="text"
                value={internalData.autorizadorDesconto}
                onChange={(e) => setInternalData(prev => ({ ...prev, autorizadorDesconto: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do autorizador"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações Financeiras
              </label>
              <textarea
                value={internalData.observacoesFinanceiras}
                onChange={(e) => setInternalData(prev => ({ ...prev, observacoesFinanceiras: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações internas sobre a proposta"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isVendor ? 'Nova Proposta de Plano de Saúde' : 'Revisar Proposta de Plano de Saúde'}
        </h1>
        <p className="text-gray-600">
          {isVendor 
            ? 'Preencha todos os campos e envie para o cliente revisar e anexar documentos'
            : 'Revise os dados pré-preenchidos, complete as informações que faltam e anexe os documentos necessários'
          }
        </p>
      </div>

      {renderContractSection()}
      
      {renderPersonForm(titular, 'titular')}

      {dependentes.map((dependente, index) => 
        renderPersonForm(dependente, 'dependente', index)
      )}

      <div className="flex justify-center mb-6">
        <button
          onClick={handleAddDependente}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Dependente
        </button>
      </div>

      {renderAttachmentsSection()}

      {renderInternalSection()}

      <div className="flex flex-wrap gap-4 justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar {isVendor ? 'Proposta' : 'Alterações'}
        </button>

        {isVendor && (
          <button
            onClick={handleSendToClient}
            className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar para Cliente
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalForm;