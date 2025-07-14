import React, { useState } from 'react';
import { Plus, X, Check, Copy, Mail, MessageCircle, ExternalLink, Eye, EyeOff, FileText, Building, Calendar, DollarSign } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
// Função para fazer requisições API
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${response.status}: ${error}`);
  }

  return response.json();
};

interface ProposalGeneratorProps {
  vendorId: number;
  vendorName: string;
}

interface ContractData {
  nomeEmpresa: string;
  cnpj: string;
  planoContratado: string;
  valor: string;
  odontoConjugado: boolean;
  compulsorio: boolean;
  livreAdesao: boolean;
  inicioVigencia: string;
  periodoMinimo: string;
  aproveitamentoCongenere: boolean;
}

interface VendorInternalData {
  reuniao: boolean;
  nomeReuniao: string;
  vendaDupla: boolean;
  nomeVendaDupla: string;
  desconto: string;
  autorizadorDesconto: string;
  observacoesVendedor: string;
}

interface ProposalData extends ContractData, VendorInternalData {
  vendorId: number;
}

export default function ProposalGenerator({ vendorId, vendorName }: ProposalGeneratorProps) {
  const [contractData, setContractData] = useState<ContractData>({
    nomeEmpresa: '',
    cnpj: '',
    planoContratado: '',
    valor: '',
    odontoConjugado: false,
    compulsorio: false,
    livreAdesao: false,
    inicioVigencia: '',
    periodoMinimo: '',
    aproveitamentoCongenere: false,
  });

  const [vendorData, setVendorData] = useState<VendorInternalData>({
    reuniao: false,
    nomeReuniao: '',
    vendaDupla: false,
    nomeVendaDupla: '',
    desconto: '',
    autorizadorDesconto: '',
    observacoesVendedor: '',
  });

  const [showInternalFields, setShowInternalFields] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const showNotification = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type}: ${title} - ${description}`);
  };

  const createProposalMutation = useMutation({
    mutationFn: async (data: ProposalData) => {
      return apiRequest('/api/proposals', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (proposal) => {
      setGeneratedProposal(proposal);
      showNotification("Proposta gerada com sucesso!", `ID: ${proposal.id} - Link único criado`, 'success');
    },
    onError: (error) => {
      showNotification("Erro ao gerar proposta", "Tente novamente em alguns momentos", 'error');
    },
  });

  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    try {
      const proposalData: ProposalData = {
        ...contractData,
        ...vendorData,
        vendorId,
      };
      
      await createProposalMutation.mutateAsync(proposalData);
    } catch (error) {
      console.error('Error generating proposal:', error);
    }
    setIsGenerating(false);
  };

  const copyClientLink = () => {
    if (generatedProposal) {
      const clientUrl = `${window.location.origin}/cliente/${generatedProposal.clientLink}`;
      navigator.clipboard.writeText(clientUrl);
      showNotification("Link copiado!", "Link do cliente copiado para a área de transferência", 'success');
    }
  };

  const sendByEmail = () => {
    if (generatedProposal) {
      const clientUrl = `${window.location.origin}/cliente/${generatedProposal.clientLink}`;
      const subject = `Proposta de Plano de Saúde - ${contractData.nomeEmpresa}`;
      const body = `Olá,\n\nSegue o link para completar os dados da sua proposta de plano de saúde:\n\n${clientUrl}\n\nAtenciosamente,\n${vendorName}`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const sendByWhatsApp = () => {
    if (generatedProposal) {
      const clientUrl = `${window.location.origin}/cliente/${generatedProposal.clientLink}`;
      const message = `Olá! Segue o link para completar os dados da sua proposta de plano de saúde: ${clientUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    }
  };

  const resetForm = () => {
    setContractData({
      nomeEmpresa: '',
      cnpj: '',
      planoContratado: '',
      valor: '',
      odontoConjugado: false,
      compulsorio: false,
      livreAdesao: false,
      inicioVigencia: '',
      periodoMinimo: '',
      aproveitamentoCongenere: false,
    });
    setVendorData({
      reuniao: false,
      nomeReuniao: '',
      vendaDupla: false,
      nomeVendaDupla: '',
      desconto: '',
      autorizadorDesconto: '',
      observacoesVendedor: '',
    });
    setGeneratedProposal(null);
  };

  // Success screen after proposal generation
  if (generatedProposal) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Proposta Gerada com Sucesso!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">ID da Proposta</p>
              <p className="text-xl font-bold text-gray-900">{generatedProposal.id}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-2">Link do Cliente</p>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <code className="text-sm text-gray-600 truncate flex-1">
                  {`${window.location.origin}/cliente/${generatedProposal.clientLink}`}
                </code>
                <Button variant="outline" size="sm" onClick={copyClientLink} className="ml-2">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={copyClientLink} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              
              <Button onClick={sendByEmail} variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Enviar por Email
              </Button>
              
              <Button onClick={sendByWhatsApp} variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar WhatsApp
              </Button>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={resetForm} variant="outline">
                Gerar Nova Proposta
              </Button>
              
              <Button 
                onClick={() => window.open(`${window.location.origin}/cliente/${generatedProposal.clientLink}`, '_blank')}
                variant="default"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visualizar Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nova Proposta</h1>
        <p className="text-gray-600">Preencha os dados do contrato para gerar o link único do cliente</p>
      </div>

      <div className="space-y-6">
        {/* Contract Data */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Dados do Contrato</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa *</label>
              <input
                type="text"
                value={contractData.nomeEmpresa}
                onChange={(e) => setContractData(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
                placeholder="Razão social da empresa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={contractData.cnpj}
                onChange={(e) => setContractData(prev => ({ ...prev, cnpj: e.target.value }))}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div>
              <Label htmlFor="plano">Plano Contratado *</Label>
              <Select onValueChange={(value) => setContractData(prev => ({ ...prev, planoContratado: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="executivo">Executivo</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valor">Valor *</Label>
              <Input
                id="valor"
                value={contractData.valor}
                onChange={(e) => setContractData(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <Label htmlFor="vigencia">Início de Vigência *</Label>
              <Input
                id="vigencia"
                type="date"
                value={contractData.inicioVigencia}
                onChange={(e) => setContractData(prev => ({ ...prev, inicioVigencia: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="periodo">Período Mínimo de Vigência</Label>
              <Select onValueChange={(value) => setContractData(prev => ({ ...prev, periodoMinimo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 meses</SelectItem>
                  <SelectItem value="24">24 meses</SelectItem>
                  <SelectItem value="36">36 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="odonto"
                  checked={contractData.odontoConjugado}
                  onCheckedChange={(checked) => setContractData(prev => ({ ...prev, odontoConjugado: checked as boolean }))}
                />
                <Label htmlFor="odonto">Odonto Conjugado</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compulsorio"
                  checked={contractData.compulsorio}
                  onCheckedChange={(checked) => setContractData(prev => ({ ...prev, compulsorio: checked as boolean }))}
                />
                <Label htmlFor="compulsorio">Compulsório</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="livre"
                  checked={contractData.livreAdesao}
                  onCheckedChange={(checked) => setContractData(prev => ({ ...prev, livreAdesao: checked as boolean }))}
                />
                <Label htmlFor="livre">Livre Adesão</Label>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aproveitamento"
                  checked={contractData.aproveitamentoCongenere}
                  onCheckedChange={(checked) => setContractData(prev => ({ ...prev, aproveitamentoCongenere: checked as boolean }))}
                />
                <Label htmlFor="aproveitamento">Aproveitamento Congênere</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Internal Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Controles Internos do Vendedor</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInternalFields(!showInternalFields)}
              >
                {showInternalFields ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          
          {showInternalFields && (
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reuniao"
                  checked={vendorData.reuniao}
                  onCheckedChange={(checked) => setVendorData(prev => ({ ...prev, reuniao: checked as boolean }))}
                />
                <Label htmlFor="reuniao">Reunião Realizada</Label>
              </div>

              <div>
                <Label htmlFor="nomeReuniao">Nome da Reunião</Label>
                <Input
                  id="nomeReuniao"
                  value={vendorData.nomeReuniao}
                  onChange={(e) => setVendorData(prev => ({ ...prev, nomeReuniao: e.target.value }))}
                  placeholder="Identificação da reunião"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vendaDupla"
                  checked={vendorData.vendaDupla}
                  onCheckedChange={(checked) => setVendorData(prev => ({ ...prev, vendaDupla: checked as boolean }))}
                />
                <Label htmlFor="vendaDupla">Venda Dupla</Label>
              </div>

              <div>
                <Label htmlFor="nomeVendaDupla">Nome da Venda Dupla</Label>
                <Input
                  id="nomeVendaDupla"
                  value={vendorData.nomeVendaDupla}
                  onChange={(e) => setVendorData(prev => ({ ...prev, nomeVendaDupla: e.target.value }))}
                  placeholder="Nome do segundo vendedor"
                />
              </div>

              <div>
                <Label htmlFor="desconto">Desconto (%)</Label>
                <Input
                  id="desconto"
                  value={vendorData.desconto}
                  onChange={(e) => setVendorData(prev => ({ ...prev, desconto: e.target.value }))}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="autorizador">Autorizador do Desconto</Label>
                <Input
                  id="autorizador"
                  value={vendorData.autorizadorDesconto}
                  onChange={(e) => setVendorData(prev => ({ ...prev, autorizadorDesconto: e.target.value }))}
                  placeholder="Nome do autorizador"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observacoes">Observações do Vendedor</Label>
                <Textarea
                  id="observacoes"
                  value={vendorData.observacoesVendedor}
                  onChange={(e) => setVendorData(prev => ({ ...prev, observacoesVendedor: e.target.value }))}
                  placeholder="Observações internas sobre a proposta"
                  rows={3}
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button variant="outline" onClick={resetForm}>
            <X className="w-4 h-4 mr-2" />
            Limpar Formulário
          </Button>
          
          <Button 
            onClick={handleGenerateProposal} 
            disabled={isGenerating || !contractData.nomeEmpresa || !contractData.cnpj}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gerando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Gerar Proposta
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}