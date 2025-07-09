import React, { useState } from 'react';
import { LogOut, Upload, Camera, FileText, Check, User, Phone, Mail, MapPin, Calendar, Plus, Trash2, Info, AlertCircle, CheckCircle2, Clock, Download, MessageCircle } from 'lucide-react';

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
  const [showChat, setShowChat] = useState(false);

  // Rest of the component code...

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Existing JSX */}
      
      {/* Chatbot */}
      <div className="chatbot-container">
        {showChat && (
          <div className="chat-window">
            {/* Chat content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;