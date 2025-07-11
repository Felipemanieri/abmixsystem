import React from 'react';
import { Eye, Link, MessageSquare, Mail, Download, FileText, Edit, Trash2, ExternalLink, Send, Copy, Share2, Zap, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface ActionButtonsProps {
  onView?: () => void;
  onCopyLink?: () => void;
  onWhatsApp?: () => void;
  onEmail?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onExternalLink?: () => void;
  onMessage?: () => void;
  onSend?: () => void;
  onAutomate?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onForward?: () => void;
  onShare?: () => void;
  userRole?: string;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onCopyLink,
  onWhatsApp,
  onEmail,
  onDownload,
  onEdit,
  onDelete,
  onExternalLink,
  onMessage,
  onSend,
  onAutomate,
  onApprove,
  onReject,
  onForward,
  onShare,
  userRole,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {onView && (
        <button 
          onClick={onView}
          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
          title="Visualizar"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      
      {onCopyLink && (
        <button 
          onClick={onCopyLink}
          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
          title="Copiar Link"
        >
          <Copy className="w-4 h-4" />
        </button>
      )}
      
      {onWhatsApp && (
        <button 
          onClick={onWhatsApp}
          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
          title="Enviar WhatsApp"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </button>
      )}
      
      {onEmail && (
        <button 
          onClick={onEmail}
          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
          title="Enviar Email"
        >
          <Mail className="w-4 h-4" />
        </button>
      )}
      
      {onDownload && (
        <button 
          onClick={onDownload}
          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
          title="Baixar"
        >
          <Download className="w-4 h-4" />
        </button>
      )}
      
      {onEdit && (
        <button 
          onClick={onEdit}
          className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50 transition-colors"
          title="Editar"
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
      
      {onDelete && (
        <button 
          onClick={onDelete}
          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {onExternalLink && (
        <button 
          onClick={onExternalLink}
          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
          title="Abrir Link"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      )}

      {onSend && (
        <button 
          onClick={onSend}
          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
          title="Enviar"
        >
          <Send className="w-4 h-4" />
        </button>
      )}

      {onAutomate && (
        <button 
          onClick={onAutomate}
          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
          title="Automatizar"
        >
          <Zap className="w-4 h-4" />
        </button>
      )}

      {onApprove && (
        <button 
          onClick={onApprove}
          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
          title="Aprovar"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      )}

      {onReject && (
        <button 
          onClick={onReject}
          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
          title="Rejeitar"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
      )}

      {onForward && (
        <button 
          onClick={onForward}
          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
          title="Encaminhar"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
      
      {onShare && (
        <button 
          onClick={onShare}
          className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
          title="Compartilhar"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
      
      {onMessage && (
        <button 
          onClick={onMessage}
          className={`text-teal-600 hover:text-teal-900 p-1 rounded hover:bg-teal-50 transition-colors ${userRole ? 'relative' : ''}`}
          title="Mensagem Interna"
        >
          <MessageSquare className="w-4 h-4" />
          {userRole && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;