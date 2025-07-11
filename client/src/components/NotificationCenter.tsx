import React, { useState } from 'react';
import { Bell, X, MessageSquare, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'document' | 'approval' | 'alert' | 'reminder';
  timestamp: Date;
  read: boolean;
  link?: string;
}

interface NotificationCenterProps {
  isOpen?: boolean;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
  userRole?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen = true,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  userRole
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    return true;
  });
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const formatTimeDifference = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notificações</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 text-sm font-medium ${
            filter === 'all'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-2 text-sm font-medium ${
            filter === 'unread'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Não lidas
        </button>
      </div>
      
      {/* Notification List */}
      <div className="overflow-y-auto flex-1">
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhuma notificação encontrada
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimeDifference(notification.timestamp)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onMarkAllAsRead}
          className="w-full py-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          Marcar todas como lidas
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;