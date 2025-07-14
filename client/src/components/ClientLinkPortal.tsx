import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, User, Users, FileText, Phone, Mail, MapPin, Calendar, Scale, Heart, AlertCircle, CheckCircle, Lock, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { useToast } from '../hooks/use-toast';
import AbmixLogo from './AbmixLogo';

interface ClientLinkPortalProps {
  clientLink: string;
}

interface PersonData {
  id?: string;
  nomeCompleto: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  parentesco?: string;
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
  enderecoCompleto: string;
  dadosReembolso: string;
}

export default function ClientLinkPortal({ clientLink }: ClientLinkPortalProps) {
  const { toast } = useToast();
  const [titulares, setTitulares] = useState<PersonData[]>([]);
  const [dependentes, setDependentes] = useState<PersonData[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch proposal data using client link
  const { data: proposal, isLoading, error } = useQuery({
    queryKey: ['/api/proposals/link', clientLink],
    queryFn: async () => {
      const response = await fetch(`/api/proposals/link/${clientLink}`);
      if (!response.ok) {
        throw new Error('Proposta não encontrada');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (!titulares.length) {
      setTitulares([createEmptyPerson()]);
    }
  }, []);

  const createEmptyPerson = (): PersonData => ({
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
    dadosReembolso: '',
  });

  const addTitular = () => {
    setTitulares([...titulares, createEmptyPerson()]);
  };

  const removeTitular = (index: number) => {
    if (titulares.length > 1) {
      setTitulares(titulares.filter((_, i) => i !== index));
    }
  };

  const updateTitular = (index: number, field: string, value: string | boolean) => {
    const updated = [...titulares];
    updated[index] = { ...updated[index], [field]: value };
    setTitulares(updated);
  };

  const addDependente = () => {
    const newDependente = { ...createEmptyPerson(), parentesco: '' };
    setDependentes([...dependentes, newDependente]);
  };

  const removeDependente = (index: number) => {
    setDependentes(dependentes.filter((_, i) => i !== index));
  };

  const updateDependente = (index: number, field: string, value: string | boolean) => {
    const updated = [...dependentes];
    updated[index] = { ...updated[index], [field]: value };
    setDependentes(updated);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit titular data
      for (const titular of titulares) {
        await fetch(`/api/proposals/${proposal.id}/people`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...titular, type: 'titular' }),
        });
      }

      // Submit dependente data
      for (const dependente of dependentes) {
        await fetch(`/api/proposals/${proposal.id}/people`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...dependente, type: 'dependente' }),
        });
      }

      // Mark proposal as completed by client
      await fetch(`/api/proposals/${proposal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clientCompleted: true,
          completedAt: new Date().toISOString()
        }),
      });

      toast({
        title: "Proposta enviada com sucesso!",
        description: "Seus dados foram registrados e a proposta está sendo processada.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar proposta",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const renderPersonForm = (person: PersonData, type: 'titular' | 'dependente', index: number) => (
    <Card key={`${type}-${index}`} className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {type === 'titular' ? (
              <>
                <User className="w-5 h-5 mr-2 text-blue-600" />
                {titulares.length > 1 ? `Titular ${index + 1}` : 'Titular'}
              </>
            ) : (
              <>
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Dependente {index + 1}
              </>
            )}
          </CardTitle>
          
          {((type === 'titular' && titulares.length > 1) || type === 'dependente') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => type === 'titular' ? removeTitular(index) : removeDependente(index)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${type}-nome-${index}`}>Nome Completo *</Label>
          <Input
            id={`${type}-nome-${index}`}
            value={person.nomeCompleto}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'nomeCompleto', e.target.value) : 
              updateDependente(index, 'nomeCompleto', e.target.value)
            }
            placeholder="Nome completo"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-cpf-${index}`}>CPF *</Label>
          <Input
            id={`${type}-cpf-${index}`}
            value={person.cpf}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'cpf', e.target.value) : 
              updateDependente(index, 'cpf', e.target.value)
            }
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-rg-${index}`}>RG *</Label>
          <Input
            id={`${type}-rg-${index}`}
            value={person.rg}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'rg', e.target.value) : 
              updateDependente(index, 'rg', e.target.value)
            }
            placeholder="00.000.000-0"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-nascimento-${index}`}>Data de Nascimento *</Label>
          <Input
            id={`${type}-nascimento-${index}`}
            type="date"
            value={person.dataNascimento}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'dataNascimento', e.target.value) : 
              updateDependente(index, 'dataNascimento', e.target.value)
            }
          />
        </div>

        {type === 'dependente' && (
          <div>
            <Label htmlFor={`dependente-parentesco-${index}`}>Parentesco *</Label>
            <Input
              id={`dependente-parentesco-${index}`}
              value={person.parentesco || ''}
              onChange={(e) => updateDependente(index, 'parentesco', e.target.value)}
              placeholder="Ex: Cônjuge, Filho(a), etc."
            />
          </div>
        )}

        <div>
          <Label htmlFor={`${type}-mae-${index}`}>Nome da Mãe *</Label>
          <Input
            id={`${type}-mae-${index}`}
            value={person.nomeMae}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'nomeMae', e.target.value) : 
              updateDependente(index, 'nomeMae', e.target.value)
            }
            placeholder="Nome completo da mãe"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-sexo-${index}`}>Sexo *</Label>
          <select
            id={`${type}-sexo-${index}`}
            value={person.sexo}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'sexo', e.target.value) : 
              updateDependente(index, 'sexo', e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>

        <div>
          <Label htmlFor={`${type}-civil-${index}`}>Estado Civil *</Label>
          <select
            id={`${type}-civil-${index}`}
            value={person.estadoCivil}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'estadoCivil', e.target.value) : 
              updateDependente(index, 'estadoCivil', e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md"
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
          <Label htmlFor={`${type}-peso-${index}`}>Peso (kg) *</Label>
          <Input
            id={`${type}-peso-${index}`}
            value={person.peso}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'peso', e.target.value) : 
              updateDependente(index, 'peso', e.target.value)
            }
            placeholder="70"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-altura-${index}`}>Altura (cm) *</Label>
          <Input
            id={`${type}-altura-${index}`}
            value={person.altura}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'altura', e.target.value) : 
              updateDependente(index, 'altura', e.target.value)
            }
            placeholder="170"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-email-pessoal-${index}`}>Email Pessoal *</Label>
          <Input
            id={`${type}-email-pessoal-${index}`}
            type="email"
            value={person.emailPessoal}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'emailPessoal', e.target.value) : 
              updateDependente(index, 'emailPessoal', e.target.value)
            }
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-telefone-pessoal-${index}`}>Telefone Pessoal *</Label>
          <Input
            id={`${type}-telefone-pessoal-${index}`}
            value={person.telefonePessoal}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'telefonePessoal', e.target.value) : 
              updateDependente(index, 'telefonePessoal', e.target.value)
            }
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-email-empresa-${index}`}>Email Empresa</Label>
          <Input
            id={`${type}-email-empresa-${index}`}
            type="email"
            value={person.emailEmpresa}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'emailEmpresa', e.target.value) : 
              updateDependente(index, 'emailEmpresa', e.target.value)
            }
            placeholder="email@empresa.com"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-telefone-empresa-${index}`}>Telefone Empresa</Label>
          <Input
            id={`${type}-telefone-empresa-${index}`}
            value={person.telefoneEmpresa}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'telefoneEmpresa', e.target.value) : 
              updateDependente(index, 'telefoneEmpresa', e.target.value)
            }
            placeholder="(11) 3333-3333"
          />
        </div>

        <div>
          <Label htmlFor={`${type}-cep-${index}`}>CEP *</Label>
          <Input
            id={`${type}-cep-${index}`}
            value={person.cep}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'cep', e.target.value) : 
              updateDependente(index, 'cep', e.target.value)
            }
            placeholder="00000-000"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor={`${type}-endereco-${index}`}>Endereço Completo *</Label>
          <Textarea
            id={`${type}-endereco-${index}`}
            value={person.enderecoCompleto}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'enderecoCompleto', e.target.value) : 
              updateDependente(index, 'enderecoCompleto', e.target.value)
            }
            placeholder="Rua, número, complemento, bairro, cidade, estado"
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor={`${type}-reembolso-${index}`}>Dados para Reembolso</Label>
          <Textarea
            id={`${type}-reembolso-${index}`}
            value={person.dadosReembolso}
            onChange={(e) => type === 'titular' ? 
              updateTitular(index, 'dadosReembolso', e.target.value) : 
              updateDependente(index, 'dadosReembolso', e.target.value)
            }
            placeholder="Banco, agência, conta, titular da conta"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link não encontrado</h1>
          <p className="text-gray-600 mb-4">
            O link da proposta não foi encontrado ou expirou. Entre em contato com seu vendedor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AbmixLogo size={40} className="mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Portal do Cliente</h1>
                <p className="text-sm text-gray-600">Complete seus dados da proposta</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contract Info (Read-only) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Dados do Contrato
              <Lock className="w-4 h-4 ml-2 text-gray-400" />
            </CardTitle>
            <p className="text-sm text-gray-600">Informações preenchidas pelo vendedor</p>
          </CardHeader>
          
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome da Empresa</Label>
              <Input value={proposal?.nomeEmpresa || ''} disabled />
            </div>
            <div>
              <Label>CNPJ</Label>
              <Input value={proposal?.cnpj || ''} disabled />
            </div>
            <div>
              <Label>Plano Contratado</Label>
              <Input value={proposal?.planoContratado || ''} disabled />
            </div>
            <div>
              <Label>Valor</Label>
              <Input value={proposal?.valor || ''} disabled />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox checked={proposal?.odontoConjugado || false} disabled />
                <Label>Odonto Conjugado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox checked={proposal?.compulsorio || false} disabled />
                <Label>Compulsório</Label>
              </div>
            </div>
            <div>
              <Label>Início de Vigência</Label>
              <Input value={proposal?.inicioVigencia || ''} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Personal Data Forms */}
        <div className="space-y-6">
          {/* Titulares */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dados dos Titulares</h2>
              <Button onClick={addTitular} variant="outline">
                <User className="w-4 h-4 mr-2" />
                Adicionar Titular
              </Button>
            </div>
            
            {titulares.map((titular, index) => 
              renderPersonForm(titular, 'titular', index)
            )}
          </div>

          {/* Dependentes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dependentes</h2>
              <Button onClick={addDependente} variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Adicionar Dependente
              </Button>
            </div>
            
            {dependentes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum dependente adicionado</p>
                  <Button onClick={addDependente} variant="outline" className="mt-4">
                    Adicionar Primeiro Dependente
                  </Button>
                </CardContent>
              </Card>
            ) : (
              dependentes.map((dependente, index) => 
                renderPersonForm(dependente, 'dependente', index)
              )
            )}
          </div>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Anexar Documentos
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Clique para selecionar arquivos
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, JPG, PNG até 10MB cada
                  </p>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Arquivos Anexados ({attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || titulares.some(t => !t.nomeCompleto || !t.cpf)}
              size="lg"
              className="px-12 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Enviar Proposta
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}