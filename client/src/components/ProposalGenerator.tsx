import React, { useState } from 'react';
import { ArrowLeft, Building, FileText, DollarSign, Check, Copy, Plus, Trash2, Upload, Camera, User, Eye, EyeOff, Settings, Save, Send, Users, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { showNotification } from '../utils/notifications';

interface ProposalGeneratorProps {
  onBack: () => void;
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
  inicioVigencia: string;
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

interface InternalData {
  reuniao: boolean;
  nomeReuniao: string;
  vendaDupla: boolean;
  nomeVendaDupla: string;
  desconto: string;
  autorizadorDesconto: string;
  observacoesFinanceiras: string;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({ onBack }) => {
  const [contractData, setContractData] = useState<ContractData>({
    nomeEmpresa: '',
    cnpj: '',
    planoContratado: '',
    valor: '',
    periodoVigencia: { inicio: '', fim: '' },
    odontoConjugado: false,
    compulsorio: false,
    inicioVigencia: '',
    aproveitamentoCongenere: false,
  });

  const [titulares, setTitulares] = useState<PersonData[]>([{
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
  }]);

  const [dependentes, setDependentes] = useState<PersonData[]>([]);

  const [internalData, setInternalData] = useState<InternalData>({
    reuniao: false,
    nomeReuniao: '',
    vendaDupla: false,
    nomeVendaDupla: '',
    desconto: '',
    autorizadorDesconto: '',
    observacoesFinanceiras: ''
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [showInternalFields, setShowInternalFields] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

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

  const adicionarTitular = () => {
    const newTitular: PersonData = {
      id: `tit_${Date.now()}`,
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
    };
    setTitulares([...titulares, newTitular]);
  };

  const removerTitular = (id: string) => {
    if (titulares.length > 1) {
      setTitulares(titulares.filter(tit => tit.id !== id));
    }
  };

  const adicionarDependente = () => {
    const newDependente: PersonData = {
      id: `dep_${Date.now()}`,
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

  const removerDependente = (id: string) => {
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
      setAttachments(prev => [...prev, ...newFiles]);
      showNotification(`${newFiles.length} arquivo(s) adicionado(s)`, 'success');
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    showNotification('Proposta salva como rascunho', 'success');
  };

  const handleSend = () => {
    if (!contractData.nomeEmpresa || !contractData.cnpj || !contractData.planoContratado) {
      showNotification('Preencha os campos obrigatórios do contrato', 'error');
      return;
    }

    const proposalId = `PROP${Date.now()}`;
    const link = `${window.location.origin}/cliente/proposta/${proposalId}`;
    
    setGeneratedLink(link);
    setIsSubmitted(true);
    showNotification('Link da proposta gerado com sucesso!', 'success');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    showNotification('Link copiado para a área de transferência', 'success');
  };

  const resetForm = () => {
    setContractData({
      nomeEmpresa: '',
      cnpj: '',
      planoContratado: '',
      valor: '',
      periodoVigencia: { inicio: '', fim: '' },
      odontoConjugado: false,
      compulsorio: false,
      inicioVigencia: '',
      aproveitamentoCongenere: false,
    });
    setTitulares([{
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
    }]);
    setDependentes([]);
    setInternalData({
      reuniao: false,
      nomeReuniao: '',
      vendaDupla: false,
      nomeVendaDupla: '',
      desconto: '',
      autorizadorDesconto: '',
      observacoesFinanceiras: ''
    });
    setAttachments([]);
    setIsSubmitted(false);
    setGeneratedLink('');
  };

  const renderPersonForm = (person: PersonData, type: 'titular' | 'dependente', index: number) => (
    <div key={person.id} className="bg-gray-50 p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2" />
          {type === 'titular' ? `Titular ${index + 1}` : `Dependente ${index + 1}`}
        </h3>
        {(type === 'dependente' || (type === 'titular' && titulares.length > 1)) && (
          <button
            onClick={() => type === 'titular' ? removerTitular(person.id) : removerDependente(person.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            value={person.nomeCompleto}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'nomeCompleto', e.target.value);
              } else {
                updateDependente(index, 'nomeCompleto', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome completo sem abreviações"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF *
          </label>
          <input
            type="text"
            value={person.cpf}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'cpf', e.target.value);
              } else {
                updateDependente(index, 'cpf', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RG *
          </label>
          <input
            type="text"
            value={person.rg}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'rg', e.target.value);
              } else {
                updateDependente(index, 'rg', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="00.000.000-0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento *
          </label>
          <input
            type="date"
            value={person.dataNascimento}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'dataNascimento', e.target.value);
              } else {
                updateDependente(index, 'dataNascimento', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {type === 'dependente' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parentesco *
            </label>
            <select
              value={person.parentesco || ''}
              onChange={(e) => updateDependente(index, 'parentesco', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione</option>
              <option value="cônjuge">Cônjuge</option>
              <option value="filho(a)">Filho(a)</option>
              <option value="pai">Pai</option>
              <option value="mãe">Mãe</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        )}

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Mãe *
          </label>
          <input
            type="text"
            value={person.nomeMae}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'nomeMae', e.target.value);
              } else {
                updateDependente(index, 'nomeMae', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome completo da mãe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sexo *
          </label>
          <select
            value={person.sexo}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'sexo', e.target.value);
              } else {
                updateDependente(index, 'sexo', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado Civil *
          </label>
          <select
            value={person.estadoCivil}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'estadoCivil', e.target.value);
              } else {
                updateDependente(index, 'estadoCivil', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione</option>
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viuvo">Viúvo(a)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="text"
            value={person.peso}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'peso', e.target.value);
              } else {
                updateDependente(index, 'peso', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 70"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Altura (cm)
          </label>
          <input
            type="text"
            value={person.altura}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'altura', e.target.value);
              } else {
                updateDependente(index, 'altura', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 170"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Pessoal *
          </label>
          <input
            type="email"
            value={person.emailPessoal}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'emailPessoal', e.target.value);
              } else {
                updateDependente(index, 'emailPessoal', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone Pessoal *
          </label>
          <input
            type="tel"
            value={person.telefonePessoal}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'telefonePessoal', e.target.value);
              } else {
                updateDependente(index, 'telefonePessoal', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(00) 00000-0000"
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
                updateTitular(index, 'emailEmpresa', e.target.value);
              } else {
                updateDependente(index, 'emailEmpresa', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                updateTitular(index, 'telefoneEmpresa', e.target.value);
              } else {
                updateDependente(index, 'telefoneEmpresa', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(00) 0000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CEP *
          </label>
          <input
            type="text"
            value={person.cep}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'cep', e.target.value);
              } else {
                updateDependente(index, 'cep', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="00000-000"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço Completo *
          </label>
          <input
            type="text"
            value={person.enderecoCompleto}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'enderecoCompleto', e.target.value);
              } else {
                updateDependente(index, 'enderecoCompleto', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rua, número, complemento, bairro, cidade, estado"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dados para Reembolso
          </label>
          <textarea
            value={person.dadosReembolso}
            onChange={(e) => {
              if (type === 'titular') {
                updateTitular(index, 'dadosReembolso', e.target.value);
              } else {
                updateDependente(index, 'dadosReembolso', e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Banco, agência, conta, PIX..."
          />
        </div>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposta Criada com Sucesso!</h2>
          <p className="text-gray-600 mb-6">
            Link único gerado para o cliente preencher os dados pessoais.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Empresa:</strong> {contractData.nomeEmpresa}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Plano:</strong> {contractData.planoContratado}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Valor:</strong> R$ {contractData.valor}
            </p>
          </div>

          <div className="bg-teal-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-teal-700 mb-2">
              <strong>Link para o Cliente:</strong>
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm bg-white"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={resetForm}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Nova Proposta
            </button>
            <button
              onClick={onBack}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nova Proposta de Plano de Saúde
          </h1>
          <p className="text-gray-600">
            Preencha todos os dados para gerar uma proposta completa
          </p>
        </div>

        <div className="space-y-8">
          {/* Dados do Contrato */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Building className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Dados do Contrato
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={contractData.nomeEmpresa}
                  onChange={(e) => setContractData(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Empresa ABC Ltda"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={contractData.cnpj}
                  onChange={(e) => setContractData(prev => ({ ...prev, cnpj: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plano Contratado *
                </label>
                <select
                  value={contractData.planoContratado}
                  onChange={(e) => setContractData(prev => ({ ...prev, planoContratado: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um plano</option>
                  {planosDisponiveis.map((plano) => (
                    <option key={plano} value={plano}>
                      {plano}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Mensal (R$) *
                </label>
                <input
                  type="text"
                  value={contractData.valor}
                  onChange={(e) => setContractData(prev => ({ ...prev, valor: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Início da Vigência *
                </label>
                <input
                  type="date"
                  value={contractData.inicioVigencia}
                  onChange={(e) => setContractData(prev => ({ ...prev, inicioVigencia: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vigência - Início *
                </label>
                <input
                  type="date"
                  value={contractData.periodoVigencia.inicio}
                  onChange={(e) => setContractData(prev => ({ 
                    ...prev, 
                    periodoVigencia: { ...prev.periodoVigencia, inicio: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vigência - Fim *
                </label>
                <input
                  type="date"
                  value={contractData.periodoVigencia.fim}
                  onChange={(e) => setContractData(prev => ({ 
                    ...prev, 
                    periodoVigencia: { ...prev.periodoVigencia, fim: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="odontoConjugado"
                    checked={contractData.odontoConjugado}
                    onChange={(e) => setContractData(prev => ({ ...prev, odontoConjugado: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="odontoConjugado" className="ml-2 text-sm text-gray-700">
                    Inclui cobertura odontológica
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="compulsorio"
                    checked={contractData.compulsorio}
                    onChange={(e) => setContractData(prev => ({ ...prev, compulsorio: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="compulsorio" className="ml-2 text-sm text-gray-700">
                    Adesão compulsória
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aproveitamentoCongenere"
                    checked={contractData.aproveitamentoCongenere}
                    onChange={(e) => setContractData(prev => ({ ...prev, aproveitamentoCongenere: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="aproveitamentoCongenere" className="ml-2 text-sm text-gray-700">
                    Aproveitamento de carência congênere
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Dados dos Titulares */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Dados dos Titulares
                </h2>
              </div>
              <button
                onClick={adicionarTitular}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Titular
              </button>
            </div>
            
            <div className="space-y-4">
              {titulares.map((titular, index) => 
                renderPersonForm(titular, 'titular', index)
              )}
            </div>
          </div>

          {/* Dependentes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Dependentes
                </h2>
              </div>
              <button
                onClick={adicionarDependente}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Dependente
              </button>
            </div>
            
            {dependentes.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">Nenhum dependente adicionado</p>
                <p className="text-sm text-gray-400 mt-1">
                  Clique em "Adicionar Dependente" para incluir familiares
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dependentes.map((dependente, index) => 
                  renderPersonForm(dependente, 'dependente', index)
                )}
              </div>
            )}
          </div>

          {/* Controles Internos do Vendedor */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Settings className="w-5 h-5 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Controles Internos
                </h2>
              </div>
              <button
                onClick={() => setShowInternalFields(!showInternalFields)}
                className="flex items-center text-orange-600 hover:text-orange-800 transition-colors"
              >
                {showInternalFields ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Mostrar
                  </>
                )}
              </button>
            </div>

            {showInternalFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reuniao"
                    checked={internalData.reuniao}
                    onChange={(e) => setInternalData(prev => ({ ...prev, reuniao: e.target.checked }))}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="reuniao" className="ml-2 text-sm text-gray-700">
                    Venda em reunião
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nome da reunião"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="vendaDupla"
                    checked={internalData.vendaDupla}
                    onChange={(e) => setInternalData(prev => ({ ...prev, vendaDupla: e.target.checked }))}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="vendaDupla" className="ml-2 text-sm text-gray-700">
                    Venda dupla
                  </label>
                </div>

                {internalData.vendaDupla && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Parceiro
                    </label>
                    <input
                      type="text"
                      value={internalData.nomeVendaDupla}
                      onChange={(e) => setInternalData(prev => ({ ...prev, nomeVendaDupla: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nome do vendedor parceiro"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="text"
                    value={internalData.desconto}
                    onChange={(e) => setInternalData(prev => ({ ...prev, desconto: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="Observações para o setor financeiro..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upload de Documentos */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Documentos
              </h2>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Clique para adicionar documentos
                  </p>
                  <p className="text-sm text-gray-500">
                    ou arraste e solte os arquivos aqui
                  </p>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label htmlFor="camera-upload" className="flex items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="camera-upload"
                  />
                  <Camera className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Tirar Foto</span>
                </label>

                <label htmlFor="file-browse" className="flex items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-browse"
                  />
                  <FileText className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Buscar Arquivos</span>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Arquivos Anexados ({attachments.length})
                  </p>
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </button>

            <button
              onClick={handleSend}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              Gerar Link para Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;