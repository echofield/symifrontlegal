// Enterprise-grade API Client with comprehensive error handling and monitoring
class APIClient {
  private baseURL: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;
  private requestTimeout: number = 30000; // 30 seconds
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createAbortController(): AbortController {
    return new AbortController();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = this.maxRetries
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = this.createAbortController();
    
    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
        mode: 'cors',
        credentials: 'omit',
      });

      clearTimeout(timeoutId);

      // Handle different response types
      if (!response.ok) {
        let errorData: any = {};
        try {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            errorData = await response.json();
          } else {
            errorData = { message: await response.text() };
          }
        } catch {
          errorData = { message: `HTTP ${response.status}` };
        }

        // Handle specific error types
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          throw new RateLimitError(
            errorData.message || 'Rate limit exceeded',
            retryAfter ? parseInt(retryAfter) : 60
          );
        }

        if (response.status >= 500) {
          throw new ServerError(
            errorData.message || 'Server error',
            response.status,
            errorData.code
          );
        }

        throw new APIError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code
        );
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text() as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError('Request timeout');
      }

      // Retry logic for network errors and 5xx
      if (retries > 0 && this.isRetryableError(error)) {
        await this.sleep(this.retryDelay * (this.maxRetries - retries + 1));
        return this.request<T>(endpoint, options, retries - 1);
      }
      
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Network errors, timeouts, or 5xx server errors
    return (
      error instanceof TimeoutError ||
      error instanceof ServerError ||
      (!error.status || error.status >= 500)
    );
  }

  // Enhanced utility methods with better error handling
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Enhanced error classes for better error handling
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

class RateLimitError extends APIError {
  constructor(message: string, public retryAfter: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

class ServerError extends APIError {
  constructor(message: string, status: number, code?: string) {
    super(message, status, code);
    this.name = 'ServerError';
  }
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Export instance configurée
export const apiClient = new APIClient(
  process.env.NEXT_PUBLIC_API_URL || 'https://symilegalback.vercel.app/api'
);

// Enhanced React hook for API calls with comprehensive state management
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  retry: () => Promise<void>;
  cancel: () => void;
}

interface UseAPIOptions {
  immediate?: boolean;
  retryOnError?: boolean;
  retryDelay?: number;
  maxRetries?: number;
}

export function useAPI<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAPIOptions = {}
): UseAPIState<T> {
  const {
    immediate = true,
    retryOnError = false,
    retryDelay = 1000,
    maxRetries = 3
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (isRetry = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    if (!isRetry) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await fetcher();
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(result);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // Auto-retry logic
      if (retryOnError && retryCount < maxRetries) {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        
        retryTimeoutRef.current = setTimeout(() => {
          fetchData(true);
        }, retryDelay * newRetryCount);
      }
      
      console.error('API Error:', error);
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  }, [fetcher, retryCount, retryOnError, retryDelay, maxRetries]);

  const retry = useCallback(async () => {
    setRetryCount(0);
    await fetchData();
  }, [fetchData]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(),
    retry,
    cancel,
  };
}

// Enhanced Bond API with comprehensive error handling
interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  roles: string[];
  milestones: any[];
  terms: string[];
  risks: string[];
  tags: string[];
  popular?: boolean;
}

interface BondContract {
  id: string;
  templateId: string;
  title: string;
  status: 'draft' | 'active' | 'completed' | 'disputed';
  parties: {
    client: string;
    provider: string;
  };
  milestones: any[];
  totalAmount: number;
  createdAt: string;
  progress: number;
}

interface BondQuestion {
  id: string;
  question: string;
  type: 'select' | 'multiselect' | 'text' | 'number' | 'date';
  options?: string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditions?: {
    dependsOn: string;
    showIf: any;
  };
  help?: string;
  legalImplication?: string;
}

// Enhanced Bond API with better error handling and type safety
export const BondAPI = {
  // Template management
  getTemplates: () => apiClient.get<{ ok: boolean; templates: Template[] }>('/contracts/templates'),
  
  // Question management
  getQuestions: (id?: string) => apiClient.get<{ ok: boolean; questions: BondQuestion[] | Record<string, BondQuestion[]> }>(
    id ? `/contracts/questions?id=${encodeURIComponent(id)}` : '/contracts/questions'
  ),
  
  // Contract generation
  suggest: (payload: { templateId: string; answers: Record<string, any> }) => 
    apiClient.post<{ success: boolean; contract: string; suggestions?: string[] }>('/contracts/suggest', payload),
  
  create: (payload: { templateId: string; answers: Record<string, any> }) => 
    apiClient.post<{ success: boolean; contractId: string }>('/contracts/create', payload),
  
  // Contract management
  getContracts: () => apiClient.get<{ success: boolean; contracts: BondContract[] }>('/escrow/contracts'),
  
  getContract: (id: string) => apiClient.get<{ ok: boolean; contract: BondContract }>(`/escrow/contracts/${id}`),
  
  // Payment management
  intentCreate: (payload: { contractId: string; milestoneId: string; amount: number }) => 
    apiClient.post<{ success: boolean; clientSecret: string; paymentIntentId: string }>('/escrow/intent/create', payload),
  
  // Milestone management
  submitMilestone: (payload: { milestoneId: string; proof: string; description?: string }) => 
    apiClient.post<{ success: boolean; milestone: any }>('/escrow/milestone/submit', payload),
  
  validateMilestone: (payload: { milestoneId: string; approved: boolean; feedback?: string }) => 
    apiClient.post<{ success: boolean; milestone: any }>('/escrow/milestone/validate', payload),
};

// Enhanced Conseiller API
export const ConseillerAPI = {
  analyze: (payload: { problem: string; city?: string }) => 
    apiClient.post<{
      audit: {
        summary: string;
        risks: string[];
        urgency: string;
        complexity: string;
        legalQualification?: string;
        financialAnalysis?: string;
        riskAssessment?: string;
        actionPlan?: string[];
        lawyerRecommendations?: any[];
      };
      recommendedTemplate?: {
        id: string | null;
        name: string | null;
        slug: string | null;
        available: boolean;
        reason?: string;
      };
      needsLawyer?: boolean;
      recommendedLawyers?: any[];
    }>('/conseiller/analyze', payload),
};

// Enhanced Contract API
export const ContractAPI = {
  getTemplates: () => apiClient.get<{ success: boolean; templates: any[] }>('/contracts'),
  getTemplate: (id: string) => apiClient.get<{ success: boolean; template: any }>(`/contracts/${id}`),
  generate: (payload: any) => apiClient.post<{ success: boolean; contract: string }>('/generate', payload),
  review: (payload: { contract: string }) => apiClient.post<{ success: boolean; review: any }>('/review', payload),
  explain: (payload: { text: string }) => apiClient.post<{ success: boolean; explanation: string }>('/explain', payload),
  export: (payload: { contract: string; format: 'pdf' | 'docx' }) => apiClient.post<{ success: boolean; url: string }>('/export', payload),
};

// Health check API
export const HealthAPI = {
  check: () => apiClient.get<{
    status: 'healthy' | 'unhealthy';
    services: {
      database: boolean;
      openai: boolean;
      perplexity: boolean;
      cache: boolean;
    };
    responseTime: number;
  }>('/health'),
};

// Export all error classes and API client
export { 
  APIError, 
  RateLimitError, 
  ServerError, 
  TimeoutError, 
  NetworkError
};
