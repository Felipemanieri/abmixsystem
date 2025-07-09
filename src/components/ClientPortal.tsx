import React, { useState } from 'react';
import { LogOut, Upload, Camera, FileText, Check, User, Phone, Mail, MapPin, Calendar, Plus, Trash2, MessageCircle, Send, Bot, X, Info, AlertCircle, CheckCircle2, Clock, Download, Home, Eye, Edit, Bell } from 'lucide-react';

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

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface InternalMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'empresa' | 'titular' | 'dependente' | 'plano';
  examples: string[];
  formats: string[];
  maxSize: string;
  uploaded?: boolean;
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
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual da Abmix. Como posso ajudá-lo com sua proposta de plano de saúde?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showDocumentGuide, setShowDocumentGuide] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [internalMessages, setInternalMessages] = useState<InternalMessage[]>([
    {
      id: '1',
      from: 'Sistema ABMIX',
      to: 'cliente',
      message: 'Sua proposta PROP-001 foi recebida e está em análise.',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '2',
      from: 'Carlos Vendedor',
      to: 'cliente',
      message: 'Olá! Recebi seus documentos. Vou organizar e enviar para aprovação.',
      timestamp: new Date(Date.now() - 1800000),
      read: false
    }
  ]);
  const [newInternalMessage, setNewInternalMessage] = useState('');

  // Dados do contrato (simulados)
  const contractInfo = {
    nomeEmpresa: 'Empresa ABC Ltda',
    cnpj: '12.345.678/0001-90',
    planoContratado: 'Plano Empresarial Premium',
    valor: 'R$ 1.250,00',
    odontoConjugado: true,
    inicioVigencia: '01/02/2024',
  };

  const documentRequirements: DocumentRequirement[] = [
    {
      id: 'cnpj',
      name: 'CNPJ da Empresa',
      description: 'Cartão CNPJ atualizado da empresa contratante',
      required: true,
      category: 'empresa',
      examples: ['Cartão CNPJ da Receita Federal', 'Comprovante de Inscrição CNPJ'],
      formats: ['PDF', 'JPG', 'PNG'],
      maxSize: '5MB'
    },
    {
      id: 'contrato_social',
      name: 'Contrato Social',
      description: 'Contrato social da empresa ou última alteração contratual',
      required: true,
      category: 'empresa',
      examples: ['Contrato Social registrado na Junta Comercial', 'Última alteração contratual'],
      formats: ['PDF'],
      maxSize: '10MB'
    },
    {
      id: 'rg_titular',
      name: 'RG do Titular',
      description: 'Documento de identidade (RG) do titular do plano',
      required: true,
      category: 'titular',
      examples: ['RG (frente e verso)', 'CNH', 'Carteira de Trabalho (página da foto)'],
      formats: ['JPG', 'PNG', 'PDF'],
      maxSize: '3MB'
    },
    {
      id: 'cpf_titular',
      name: 'CPF do Titular',
      description: 'Comprovante de CPF do titular',
      required: true,
      category: 'titular',
      examples: ['Cartão CPF', 'Comprovante de situação cadastral da Receita Federal'],
      formats: ['JPG', 'PNG', 'PDF'],
      maxSize: '2MB'
    },
    {
      id: 'comprovante_residencia',
      name: 'Comprovante de Residência',
      description: 'Comprovante de endereço atualizado (últimos 3 meses)',
      required: true,
      category: 'titular',
      examples: ['Conta de luz', 'Conta de água', 'Conta de telefone', 'Extrato bancário'],
      formats: ['JPG', 'PNG', 'PDF'],
      maxSize: '3MB'
    },
    {
      id: 'carteirinha_atual',
      name: 'Carteirinha do Plano Atual',
      description: 'Carteirinha do plano de saúde atual (se houver)',
      required: false,
      category: 'plano',
      examples: ['Carteirinha frente e verso', 'Comprovante de plano atual'],
      formats: ['JPG', 'PNG', 'PDF'],
      maxSize: '2MB'
    },
    {
      id: 'analitico_atual',
      name: 'Analítico do Plano Atual',
      description: 'Demonstrativo analítico do plano de saúde atual',
      required: true,
      category: 'plano',
      examples: ['Demonstrativo de utilização', 'Extrato do plano atual'],
      formats: ['PDF', 'JPG', 'PNG'],
      maxSize: '5MB'
    },
    {
      id: 'rg_dependentes',
      name: 'RG dos Dependentes',
      description: 'Documento de identidade de todos os dependentes',
      required: false,
      category: 'dependente',
      examples: ['RG (frente e verso)', 'Certidão de nascimento (menores de 16 anos)'],
      formats: ['JPG', 'PNG', 'PDF'],
      maxSize: '3MB'
    },
    {
      id: 'certidao_casamento',
      name: 'Certidão de Casamento',
      description: 'Certidão de casamento (para cônjuge como dependente)',
      required: false,
      category: 'dependente',
      examples: ['Certidão de casamento atualizada', 'Declaração de união estável'],
      formats: ['PDF', 'JPG', 'PNG'],
      maxSize: '3MB'
    },
    {
      id: 'declaracao_ir',
      name: 'Declaração de Imposto de Renda',
      description: 'Última declaração de IR do titular (se aplicável)',
      required: false,
      category: 'titular',
      examples: ['Declaração de IR completa', 'Recibo de entrega da declaração'],
      formats: ['PDF'],
      maxSize: '10MB'
    }
  ];

  const botResponses = [
    {
      keywords: ['documento', 'anexo', 'enviar', 'upload'],
      response: 'Para anexar documentos, você pode usar a área de upload na seção "Documentos". Aceito PDF, JPG, PNG e DOC. Precisa de ajuda com algum documento específico?'
    },
    {
      keywords: ['cpf', 'rg', 'identidade'],
      response: 'Para documentos pessoais, você precisa enviar RG (frente e verso) e CPF. Pode ser foto clara ou scan. Tem alguma dúvida sobre estes documentos?'
    },
    {
      keywords: ['empresa', 'cnpj', 'contrato'],
      response: 'Para documentos da empresa, preciso do CNPJ atualizado e contrato social. Estes são obrigatórios para a contratação do plano empresarial.'
    },
    {
      keywords: ['dependente', 'família', 'cônjuge'],
      response: 'Para dependentes, você precisa enviar RG de cada um e certidão de casamento (para cônjuge). Menores de 16 anos podem usar certidão de nascimento.'
    },
    {
      keywords: ['plano', 'atual', 'carteirinha'],
      response: 'Se você já tem plano de saúde, envie a carteirinha atual e o demonstrativo analítico. Isso ajuda na análise da proposta.'
    },
    {
      keywords: ['ajuda', 'dúvida', 'como'],
      response: 'Estou aqui para ajudar! Você pode perguntar sobre documentos, preenchimento de dados ou qualquer dúvida sobre sua proposta.'
    },
    {
      keywords: ['obrigado', 'valeu', 'thanks'],
      response: 'Por nada! Estou sempre aqui para ajudar. Se tiver mais dúvidas, é só perguntar! 😊'
    }
  ];

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

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Bot response
    setTimeout(() => {
      const response = getBotResponse(newMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setNewMessage('');
  };

  const sendInternalMessage = () => {
    if (!newInternalMessage.trim()) return;

    const message: InternalMessage = {
      id: Date.now().toString(),
      from: user.name,
      to: 'vendedor',
      message: newInternalMessage,
      timestamp: new Date(),
      read: false
    };

    setInternalMessages(prev => [...prev, message]);
    setNewInternalMessage('');
    showNotification('Mensagem enviada para o vendedor!', 'success');
  };

  const markMessagesAsRead = () => {
    setInternalMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  const unreadCount = internalMessages.filter(msg => !msg.read).length;

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    for (const response of botResponses) {
      if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response.response;
      }
    }
    
    return 'Entendi sua pergunta! Para dúvidas específicas, recomendo entrar em contato com nosso suporte pelo WhatsApp ou telefone. Posso ajudar com informações sobre documentos e preenchimento da proposta.';
  };

  const calculateProgress = () => {
    const totalFields = titulares.length * 13 + dependentes.length * 14;
    const filledFields = titulares.reduce((acc, titular) => {
      return acc + Object.values(titular).filter(value => value !== '').length;
    }, 0) + dependentes.reduce((acc, dep) => {
      return acc + Object.values(dep).filter(value => value !== '').length;
    }, 0);
    
    const documentsProgress = Math.min(uploadedFiles.length * 5, 20);
    const formProgress = totalFields > 0 ? (filledFields / totalFields) * 80 : 0;
    
    return Math.min(Math.round(formProgress + documentsProgress), 100);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">🎉 Parabéns!</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Proposta Enviada com Sucesso!</h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Seus dados foram enviados para análise. Nossa equipe organizará os documentos e enviará para aprovação.
              </p>
              
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl mb-6 border border-teal-200">
                <div className="flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="font-semibold text-teal-800">Protocolo Gerado</span>
                </div>
                <p className="text-lg font-mono text-teal-700 bg-white px-4 py-2 rounded-lg border">
                  #ABMIX-2024-{Math.floor(Math.random() * 10000)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">Análise: 24-48h</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">Dados Validados</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-purple-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-purple-800">Notificação Enviada</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onLogout}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Finalizar
                </button>
                <button
                  onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Acabei de enviar minha proposta de plano de saúde.', '_blank')}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Contato WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderPersonForm = (person: PersonData, type: 'titular' | 'dependente', index: number) => (
    <div key={person.id} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            type === 'titular' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          }`}>
            <User className="w-5 h-5" />
          </div>
          {type === 'titular' ? `Titular ${index + 1}` : `Dependente ${index + 1}`}
        </h3>
        {((type === 'titular' && titulares.length > 1) || type === 'dependente') && (
          <button
            type="button"
            onClick={() => type === 'titular' ? removeTitular(person.id) : removeDependente(person.id)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Nome Completo *</label>
          <input
            type="text"
            required
            value={person.nome}
            onChange={(e) => updatePerson(type, person.id, 'nome', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Digite o nome completo"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">CPF *</label>
          <input
            type="text"
            required
            value={person.cpf}
            onChange={(e) => updatePerson(type, person.id, 'cpf', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="000.000.000-00"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">RG *</label>
          <input
            type="text"
            required
            value={person.rg}
            onChange={(e) => updatePerson(type, person.id, 'rg', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Digite o RG"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Data de Nascimento *</label>
          <input
            type="date"
            required
            value={person.dataNascimento}
            onChange={(e) => updatePerson(type, person.id, 'dataNascimento', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {type === 'dependente' && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Parentesco *</label>
            <select
              required
              value={person.parentesco || ''}
              onChange={(e) => updatePerson(type, person.id, 'parentesco', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Selecione o parentesco</option>
              <option value="conjuge">Cônjuge</option>
              <option value="filho">Filho(a)</option>
              <option value="enteado">Enteado(a)</option>
              <option value="pai">Pai</option>
              <option value="mae">Mãe</option>
              <option value="sogro">Sogro(a)</option>
            </select>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Nome da Mãe *</label>
          <input
            type="text"
            required
            value={person.nomeMae}
            onChange={(e) => updatePerson(type, person.id, 'nomeMae', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Nome completo da mãe"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Sexo *</label>
          <select
            required
            value={person.sexo}
            onChange={(e) => updatePerson(type, person.id, 'sexo', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Estado Civil *</label>
          <select
            required
            value={person.estadoCivil}
            onChange={(e) => updatePerson(type, person.id, 'estadoCivil', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Selecione</option>
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viuvo">Viúvo(a)</option>
            <option value="uniao_estavel">União Estável</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Email Pessoal *</label>
          <input
            type="email"
            required
            value={person.emailPessoal}
            onChange={(e) => updatePerson(type, person.id, 'emailPessoal', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="email@exemplo.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Telefone Pessoal *</label>
          <input
            type="tel"
            required
            value={person.telefonePessoal}
            onChange={(e) => updatePerson(type, person.id, 'telefonePessoal', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">CEP *</label>
          <input
            type="text"
            required
            value={person.cep}
            onChange={(e) => updatePerson(type, person.id, 'cep', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="00000-000"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Endereço Completo *</label>
          <input
            type="text"
            required
            value={person.endereco}
            onChange={(e) => updatePerson(type, person.id, 'endereco', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Rua, número, bairro, cidade, estado"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-bold text-gray-900">Portal do Cliente</h1>
                  <p className="text-sm text-gray-600">Bem-vindo, {user.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Progress Indicator */}
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowInternalChat(true);
                    markMessagesAsRead();
                  }}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                </button>
                
                <span className="text-sm font-medium text-gray-600">Progresso:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900">{calculateProgress()}%</span>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-3">Formulário de Proposta</h1>
            <p className="text-blue-100 text-lg">Preencha seus dados e anexe os documentos necessários</p>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full"></div>
        </div>

        {/* Contract Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">Dados do Contrato</h2>
              <p className="text-gray-600">Informações do plano contratado</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <span className="text-sm font-medium text-blue-700">Empresa</span>
              <p className="text-lg font-bold text-blue-900">{contractInfo.nomeEmpresa}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <span className="text-sm font-medium text-green-700">Plano</span>
              <p className="text-lg font-bold text-green-900">{contractInfo.planoContratado}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <span className="text-sm font-medium text-purple-700">Valor</span>
              <p className="text-lg font-bold text-purple-900">{contractInfo.valor}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Preencher Dados</h3>
                <p className="text-sm text-gray-500">Formulário</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Enviar Documentos</h3>
                <p className="text-sm text-gray-500">Anexos</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Acompanhar Status</h3>
                <p className="text-sm text-gray-500">Progresso</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Suporte</h3>
                <p className="text-sm text-gray-500">Ajuda</p>
              </div>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-gradient-to-r from-blue-600 to-teal-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Titulares */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">Titulares do Plano</h2>
                  <p className="text-gray-600">Adicione os dados dos titulares</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addTitular}
                className="flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Titular
              </button>
            </div>
            
            {titulares.map((titular, index) => renderPersonForm(titular, 'titular', index))}
          </div>

          {/* Dependentes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">Dependentes</h2>
                  <p className="text-gray-600">Adicione os dependentes do plano</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addDependente}
                className="flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Dependente
              </button>
            </div>
            
            {dependentes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Nenhum dependente adicionado</p>
                <p className="text-gray-400 text-sm">Clique em "Adicionar Dependente" para incluir</p>
              </div>
            ) : (
              dependentes.map((dependente, index) => renderPersonForm(dependente, 'dependente', index))
            )}
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">Documentos Necessários</h2>
                  <p className="text-gray-600">Anexe todos os documentos listados abaixo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDocumentGuide(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <Info className="w-4 h-4 mr-2" />
                Guia de Documentos
              </button>
            </div>

            {/* Document Requirements List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {documentRequirements.map((doc) => (
                <div key={doc.id} className={`p-6 rounded-xl border-2 ${
                  doc.required 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`font-bold ${
                      doc.required ? 'text-red-800' : 'text-blue-800'
                    }`}>
                      {doc.name}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      doc.required 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {doc.required ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Exemplos:</span>
                      <ul className="text-xs text-gray-600 ml-2">
                        {doc.examples.map((example, idx) => (
                          <li key={idx}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Formatos: {doc.formats.join(', ')}</span>
                      <span>Máx: {doc.maxSize}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors bg-gradient-to-br from-gray-50 to-white">
              <div className="space-y-6">
                <div className="flex justify-center space-x-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                
                <div>
                  <label className="cursor-pointer">
                    <span className="text-xl font-semibold text-blue-600 hover:text-blue-700">
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
                  <p className="text-gray-500 mt-2">ou arraste e solte aqui</p>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block">
                  <p className="text-sm text-gray-600">
                    <strong>Formatos aceitos:</strong> PDF, JPG, PNG, DOC, DOCX
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Tamanho máximo:</strong> 10MB por arquivo
                  </p>
                </div>
              </div>
            </div>
            
            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Arquivos Anexados ({uploadedFiles.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
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
              className="px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl hover:from-blue-700 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Enviar Proposta
            </button>
          </div>
        </form>
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente Abmix</h3>
                  <p className="text-xs text-blue-100">Online agora</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Internal Chat Modal */}
      {showInternalChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Mensagens Internas
              </h3>
              <button 
                onClick={() => setShowInternalChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {internalMessages.map((message) => (
                <div key={message.id} className={`flex ${message.from === user.name ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.from === user.name
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="text-xs font-medium mb-1 opacity-75">
                      {message.from}
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 opacity-75`}>
                      {message.timestamp.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newInternalMessage}
                  onChange={(e) => setNewInternalMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendInternalMessage()}
                  placeholder="Digite sua mensagem para o vendedor..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendInternalMessage}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Guide Modal */}
      {showDocumentGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Guia Completo de Documentos
                </h3>
                <button 
                  onClick={() => setShowDocumentGuide(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-8">
                {['empresa', 'titular', 'dependente', 'plano'].map((category) => (
                  <div key={category}>
                    <h4 className="text-xl font-bold text-gray-800 mb-4 capitalize">
                      Documentos - {category === 'empresa' ? 'Empresa' : category === 'titular' ? 'Titular' : category === 'dependente' ? 'Dependentes' : 'Plano Atual'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documentRequirements
                        .filter(doc => doc.category === category)
                        .map((doc) => (
                          <div key={doc.id} className="p-6 border border-gray-200 rounded-xl">
                            <div className="flex items-start justify-between mb-3">
                              <h5 className="font-bold text-gray-900">{doc.name}</h5>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                doc.required 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {doc.required ? 'Obrigatório' : 'Opcional'}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                            
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm font-medium text-gray-700">Exemplos aceitos:</span>
                                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                  {doc.examples.map((example, idx) => (
                                    <li key={idx} className="flex items-center">
                                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                                      {example}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  <strong>Formatos:</strong> {doc.formats.join(', ')}
                                </span>
                                <span className="text-gray-600">
                                  <strong>Máx:</strong> {doc.maxSize}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2">💡 Dicas Importantes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Certifique-se de que todos os documentos estejam legíveis</li>
                  <li>• Fotos devem ter boa iluminação e foco</li>
                  <li>• Documentos em PDF são preferíveis quando possível</li>
                  <li>• Mantenha os arquivos dentro do limite de tamanho</li>
                  <li>• Em caso de dúvidas, use o chat para ajuda</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;