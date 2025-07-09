import React, { useState } from 'react';
import { LogOut, Upload, Camera, FileText, Check, User, Phone, Mail, MapPin, Calendar, Plus, Trash2 } from 'lucide-react';

interface ClientPortalProps {
  user: any;
  onLogout: () => void;
}

interface PersonData {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  nomeMae: string;
  sexo: string;
  estadoCivil: string;
  peso: string;
  altura: string;
  emailPessoal: string;
  telefonePessoal: string;
  emailEmpresa: string;
  telefoneEmpresa: string;
  cep: string;
  endereco: string;
  dadosReembolso: string;
  parentesco?: string;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ user, onLogout }) => {
  const [titulares, setTitulares] = useState<PersonData[]>([{
    id: '1',
    nome: '',
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
    endereco: '',
    dadosReembolso: '',
  }]);

  const [dependentes, setDependentes] = useState<PersonData[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dados do contrato (simulados)
  const contractInfo = {
    nomeEmpresa: 'Empresa ABC Ltda',
    cnpj: '12.345.678/0001-90',
    planoContratado: 'Plano Empresarial Premium',
    valor: 'R$ 1.250,00',
    odontoConjugado: true,
    inicioVigencia: '01/02/2024',
  };

  const addTitular = () => {
    const newTitular: PersonData = {
      id: Date.now().toString(),
      nome: '',
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
      endereco: '',
      dadosReembolso: '',
    };
    setTitulares([...titulares, newTitular]);
  };

  const removeTitular = (id: string) => {
    if (titulares.length > 1) {
      setTitulares(titulares.filter(titular => titular.id !== id));
    }
  };

  const addDependente = () => {
    const newDependente: PersonData = {
      id: Date.now().toString(),
      nome: '',
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
      endereco: '',
      dadosReembolso: '',
      parentesco: '',
    };
    setDependentes([...dependentes, newDependente]);
  };

  const removeDependente = (id: string) => {
    setDependentes(dependentes.filter(dep => dep.id !== id));
  };

  const updatePerson = (type: 'titular' | 'dependente', id: string, field: keyof PersonData, value: string) => {
    if (type === 'titular') {
      setTitulares(prev => prev.map(person => 
        person.id === id ? { ...person, [field]: value } : person
      ));
    } else {
      setDependentes(prev => prev.map(person => 
        person.id === id ? { ...person, [field]: value } : person
      ));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const calculateProgress = () => {
    const totalFields = titulares.length * 13 + dependentes.length * 14; // Todos os campos
    const filledFields = titulares.reduce((acc, titular) => {
      return acc + Object.values(titular).filter(value => value !== '').length;
    }, 0) + dependentes.reduce((acc, dep) => {
      return acc + Object.values(dep).filter(value => value !== '').length;
    }, 0);
    
    const documentsProgress = Math.min(uploadedFiles.length * 5, 20); // Max 20% para documentos
    const formProgress = totalFields > 0 ? (filledFields / totalFields) * 80 : 0; // Max 80% para formulário
    
    return Math.min(Math.round(formProgress + documentsProgress), 100);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Parabéns! Dados Enviados com Sucesso! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Seus dados foram enviados para análise. O vendedor organizará os documentos e enviará para aprovação.
            </p>
            <div className="bg-teal-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-teal-700">
                <strong>Protocolo:</strong> #ABMIX-2024-{Math.floor(Math.random() * 10000)}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderPersonForm = (person: PersonData, type: 'titular' | 'dependente', index: number) => (
    <div key={person.id} className="bg-gray-50 p-6 rounded-lg mb-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2" />
          {type === 'titular' ? `Titular ${index + 1}` : `Dependente ${index + 1}`}
        </h3>
        {((type === 'titular' && titulares.length > 1) || type === 'dependente') && (
          <button
            type="button"
            onClick={() => type === 'titular' ? removeTitular(person.id) : removeDependente(person.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
          <input
            type="text"
            required
            value={person.nome}
            onChange={(e) => updatePerson(type, person.id, 'nome', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
          <input
            type="text"
            required
            value={person.cpf}
            onChange={(e) => updatePerson(type, person.id, 'cpf', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="000.000.000-00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">RG *</label>
          <input
            type="text"
            required
            value={person.rg}
            onChange={(e) => updatePerson(type, person.id, 'rg', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
          <input
            type="date"
            required
            value={person.dataNascimento}
            onChange={(e) => updatePerson(type, person.id, 'dataNascimento', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {type === 'dependente' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco *</label>
            <select
              required
              value={person.parentesco || ''}
              onChange={(e) => updatePerson(type, person.id, 'parentesco', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Selecione</option>
              <option value="conjuge">Cônjuge</option>
              <option value="filho">Filho(a)</option>
              <option value="enteado">Enteado(a)</option>
              <option value="pai">Pai</option>
              <option value="mae">Mãe</option>
              <option value="sogro">Sogro(a)</option>
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Mãe *</label>
          <input
            type="text"
            required
            value={person.nomeMae}
            onChange={(e) => updatePerson(type, person.id, 'nomeMae', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
          <select
            required
            value={person.sexo}
            onChange={(e) => updatePerson(type, person.id, 'sexo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil *</label>
          <select
            required
            value={person.estadoCivil}
            onChange={(e) => updatePerson(type, person.id, 'estadoCivil', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
          <input
            type="text"
            value={person.peso}
            onChange={(e) => updatePerson(type, person.id, 'peso', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Ex: 70"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Altura (m)</label>
          <input
            type="text"
            value={person.altura}
            onChange={(e) => updatePerson(type, person.id, 'altura', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Ex: 1.75"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Pessoal *</label>
          <input
            type="email"
            required
            value={person.emailPessoal}
            onChange={(e) => updatePerson(type, person.id, 'emailPessoal', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Pessoal *</label>
          <input
            type="tel"
            required
            value={person.telefonePessoal}
            onChange={(e) => updatePerson(type, person.id, 'telefonePessoal', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Empresa</label>
          <input
            type="email"
            value={person.emailEmpresa}
            onChange={(e) => updatePerson(type, person.id, 'emailEmpresa', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Empresa</label>
          <input
            type="tel"
            value={person.telefoneEmpresa}
            onChange={(e) => updatePerson(type, person.id, 'telefoneEmpresa', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="(11) 3333-3333"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
          <input
            type="text"
            required
            value={person.cep}
            onChange={(e) => updatePerson(type, person.id, 'cep', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="00000-000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo *</label>
          <input
            type="text"
            required
            value={person.endereco}
            onChange={(e) => updatePerson(type, person.id, 'endereco', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Rua, número, bairro, cidade, estado"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dados para Reembolso</label>
          <textarea
            value={person.dadosReembolso}
            onChange={(e) => updatePerson(type, person.id, 'dadosReembolso', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Banco, agência, conta, PIX, etc."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/Logo Abmix.jpg" 
                  alt="Abmix" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal do Cliente</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Progress Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Progresso:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{calculateProgress()}%</span>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-2xl font-bold mb-2">Formulário do Cliente</h1>
          <p className="text-blue-100">Preencha seus dados pessoais e anexe os documentos</p>
        </div>

        {/* Contract Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Contrato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Empresa:</span>
              <span className="ml-2 text-gray-900">{contractInfo.nomeEmpresa}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">CNPJ:</span>
              <span className="ml-2 text-gray-900">{contractInfo.cnpj}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Plano:</span>
              <span className="ml-2 text-gray-900">{contractInfo.planoContratado}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Valor:</span>
              <span className="ml-2 text-gray-900">{contractInfo.valor}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titulares */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Titulares</h2>
              <button
                type="button"
                onClick={addTitular}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Titular
              </button>
            </div>
            {titulares.map((titular, index) => renderPersonForm(titular, 'titular', index))}
          </div>

          {/* Dependentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Dependentes</h2>
              <button
                type="button"
                onClick={addDependente}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Dependente
              </button>
            </div>
            
            {dependentes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum dependente adicionado</p>
            ) : (
              dependentes.map((dependente, index) => renderPersonForm(dependente, 'dependente', index))
            )}
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h2>
            <p className="text-sm text-gray-600 mb-4">
              Anexe todos os documentos necessários. Você pode tirar fotos, fazer upload ou arrastar arquivos.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <Camera className="w-8 h-8 text-gray-400" />
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                
                <div>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Clique para selecionar arquivos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-500"> ou arraste e solte aqui</span>
                </div>
                
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG, DOC, DOCX até 10MB cada
                </p>
              </div>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Arquivos Anexados ({uploadedFiles.length})
                </h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enviar Dados
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ClientPortal;