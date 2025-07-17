// Otimizador específico para conectividade móvel
import { queryClient } from '@/lib/queryClient';

class MobileOptimizer {
  private isOnline = navigator.onLine;
  private lastUpdate = Date.now();
  private refreshInterval: number | null = null;
  private connectionQuality: 'fast' | 'slow' | 'offline' = 'fast';

  constructor() {
    this.setupNetworkListeners();
    this.detectConnectionQuality();
    this.startIntelligentRefresh();
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('📱 Conexão restaurada - sincronizando dados');
      this.forceRefreshAll();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.connectionQuality = 'offline';
      console.log('📱 Offline detectado - usando cache local');
    });

    // Detectar mudanças na qualidade da conexão
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => {
        this.detectConnectionQuality();
      });
    }
  }

  private detectConnectionQuality() {
    if (!this.isOnline) {
      this.connectionQuality = 'offline';
      return;
    }

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const slowConnections = ['slow-2g', '2g', '3g'];
      
      if (slowConnections.includes(connection.effectiveType)) {
        this.connectionQuality = 'slow';
        console.log('📱 Conexão lenta detectada - otimizando requests');
      } else {
        this.connectionQuality = 'fast';
        console.log('📱 Conexão rápida detectada');
      }
    }
  }

  private startIntelligentRefresh() {
    // Limpar interval anterior se existir
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Definir frequência baseada na qualidade da conexão
    let refreshRate: number;
    switch (this.connectionQuality) {
      case 'offline':
        return; // Não fazer refresh offline
      case 'slow':
        refreshRate = 120000; // 2 minutos para conexões lentas
        break;
      case 'fast':
      default:
        refreshRate = 60000; // 1 minuto para conexões rápidas
        break;
    }

    this.refreshInterval = window.setInterval(() => {
      if (this.isOnline && document.visibilityState === 'visible') {
        this.smartRefresh();
      }
    }, refreshRate);
  }

  private smartRefresh() {
    const now = Date.now();
    
    // Só fazer refresh se passou tempo suficiente desde a última atualização
    if (now - this.lastUpdate < 30000) { // 30 segundos mínimo
      return;
    }

    console.log('📱 Refresh inteligente - atualizando dados críticos');
    
    // Invalidar apenas queries essenciais para economizar dados
    queryClient.invalidateQueries({ 
      queryKey: ['/api/proposals'],
      refetchType: 'active' // Só refetch se a query estiver ativa
    });
    
    // Para conexões lentas, só atualizar vendedores ocasionalmente
    if (this.connectionQuality === 'fast' || Math.random() > 0.7) {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/vendors'],
        refetchType: 'active'
      });
    }

    this.lastUpdate = now;
  }

  public forceRefreshAll() {
    console.log('📱 Força refresh completo - reconexão detectada');
    
    // Invalidar todas as queries quando reconectar
    queryClient.invalidateQueries();
    queryClient.refetchQueries({ type: 'active' });
    
    this.lastUpdate = Date.now();
  }

  public optimizeForMobile() {
    // Detectar se é dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log('📱 Dispositivo móvel detectado - aplicando otimizações');
      
      // Configurações específicas para mobile
      queryClient.setDefaultOptions({
        queries: {
          staleTime: 1000 * 60 * 15, // 15 minutos para mobile
          gcTime: 1000 * 60 * 60, // 1 hora no cache
          retry: 2, // Menos tentativas para economizar bateria
          retryDelay: 2000, // Delay maior entre tentativas
        }
      });
    }
  }

  public destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

// Instância global
export const mobileOptimizer = new MobileOptimizer();

// Auto-inicializar otimizações
export function initMobileOptimizations() {
  mobileOptimizer.optimizeForMobile();
  
  // Parar refresh quando a página não estiver visível (economizar bateria)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      console.log('📱 Página oculta - pausando atualizações');
    } else {
      console.log('📱 Página visível - retomando atualizações');
      mobileOptimizer.forceRefreshAll();
    }
  });
}