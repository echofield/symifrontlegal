// API Client robuste avec retry et error handling
class APIClient {
  private baseURL: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = this.maxRetries
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        // CORS configuration importante
        mode: 'cors',
        credentials: 'include',
      });

      // Gestion des erreurs HTTP
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new APIError(
          error.message || `HTTP ${response.status}`,
          response.status,
          error.code
        );
      }

      return await response.json();
    } catch (error) {
      // Retry logic pour les erreurs réseau
      if (retries > 0 && this.isRetryableError(error)) {
        await this.sleep(this.retryDelay);
        return this.request<T>(endpoint, options, retries - 1);
      }
      
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Erreurs réseau ou 5xx
    return !error.status || error.status >= 500;
  }

  // Méthodes utilitaires
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Export instance configurée
export const apiClient = new APIClient(
  process.env.NEXT_PUBLIC_API_URL || 'https://symilegalback.vercel.app/api'
);

// Hook React pour gérer les appels API avec état de chargement
import { useState, useEffect, useCallback } from 'react';

interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAPI<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
): UseAPIState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Types pour Bond
interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  popular?: boolean;
}

interface BondContract {
  id: string;
  templateId: string;
  status: 'draft' | 'active' | 'completed' | 'disputed';
  parties: any[];
  milestones: any[];
  createdAt: string;
}

// API spécifique pour Bond
export const BondAPI = {
  getTemplates: () => apiClient.get<{ ok: boolean; templates: Template[] }>('/contracts/templates'),
  getQuestions: (id?: string) => apiClient.get<{ ok: boolean; questions: any }>(
    id ? `/contracts/questions?id=${encodeURIComponent(id)}` : '/contracts/questions'
  ),
  suggest: (payload: any) => apiClient.post('/contracts/suggest', payload),
  create: (payload: any) => apiClient.post('/contracts/create', payload),
  getContracts: () => apiClient.get<{ success: boolean; contracts: BondContract[] }>('/escrow/contracts'),
  getContract: (id: string) => apiClient.get<{ ok: boolean; contract: BondContract }>(`/escrow/contracts/${id}`),
  intentCreate: (payload: any) => apiClient.post('/escrow/intent/create', payload),
  submitMilestone: (payload: any) => apiClient.post('/escrow/milestone/submit', payload),
  validateMilestone: (payload: any) => apiClient.post('/escrow/milestone/validate', payload),
};

export { APIError };
