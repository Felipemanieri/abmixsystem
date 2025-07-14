import { QueryClient } from '@tanstack/react-query';

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// API request function
export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
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
}