import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function SystemStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/proposals', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        setIsOnline(response.ok);
        setLastCheck(new Date());
      } catch {
        setIsOnline(false);
        setLastCheck(new Date());
      }
    };

    // Verificação inicial
    checkStatus();

    // Verificação a cada 10 segundos
    const interval = setInterval(checkStatus, 10000);

    // Listeners para eventos de rede
    const handleOnline = () => {
      setIsOnline(true);
      setLastCheck(new Date());
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastCheck(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center px-3 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline 
          ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-700' 
          : 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
      }`}>
        {isOnline ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Online</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xs font-medium text-red-700 dark:text-red-300">Offline</span>
          </>
        )}
      </div>
    </div>
  );
}