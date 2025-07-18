import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface DiscreteNotificationProps {
  message: string;
  type?: 'success' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
  show?: boolean;
}

const DiscreteNotification: React.FC<DiscreteNotificationProps> = ({
  message,
  type = 'success',
  duration = 4000,
  onClose,
  show = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          if (onClose) onClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-slide-in-right">
      <div className={`${getColors()} border rounded-lg p-3 shadow-sm flex items-center space-x-2`}>
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DiscreteNotification;