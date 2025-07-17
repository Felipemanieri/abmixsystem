import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutos - cache mais agressivo para mobile
      gcTime: 1000 * 60 * 30, // 30 minutos no cache
      retry: 3, // Tentar 3 vezes em caso de falha (importante para mobile)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
      refetchOnWindowFocus: false, // Evitar refetch desnecessário
      refetchOnReconnect: true, // Refetch quando reconectar (útil para mobile)
      networkMode: 'offlineFirst', // Tentar cache primeiro em conexões ruins
    },
    mutations: {
      retry: 2, // Tentar 2 vezes mutations
      retryDelay: 1000,
      networkMode: 'offlineFirst',
    },
  },
});

export async function apiRequest(url: string, options: RequestInit = {}) {
  const requestOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=300', // Cache de 5 minutos
      ...options.headers,
    },
    ...options,
  };

  // Serialize body to JSON if it's an object
  if (options.body && typeof options.body === 'object') {
    requestOptions.body = JSON.stringify(options.body);
  }

  // Timeout para conexões móveis lentas
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

  try {
    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Se foi timeout ou rede, tentar usar cache
    if (error.name === 'AbortError' || error.message.includes('fetch')) {
      console.warn('Conexão falhou, tentando cache local:', url);
      throw new Error('Conexão perdida. Tentando usar dados locais...');
    }
    
    throw error;
  }
}