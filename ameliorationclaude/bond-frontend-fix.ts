// bond-frontend-architecture.tsx

// 1. API Client robuste avec retry et error handling
// utils/api-client.ts

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

// 2. Hook React pour gérer les appels API avec état de chargement
// hooks/useAPI.ts

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

// 3. Composant Bond corrigé avec gestion d'erreur
// pages/bond/index.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api-client';
import { useAPI } from '@/hooks/useAPI';
import { IntelligentQAManager } from '@/lib/bond-qa-intelligent';

// Types
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

// Composant principal Bond
export default function BondPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [qaManager, setQAManager] = useState<IntelligentQAManager | null>(null);
  
  // Chargement des templates avec gestion d'erreur
  const { 
    data: templates, 
    loading: templatesLoading, 
    error: templatesError,
    refetch: refetchTemplates
  } = useAPI<Template[]>(
    () => apiClient.get<Template[]>('/bond/templates'),
    []
  );

  // Chargement des contrats existants
  const { 
    data: contracts, 
    loading: contractsLoading, 
    error: contractsError 
  } = useAPI<BondContract[]>(
    () => apiClient.get<BondContract[]>('/bond/contracts'),
    []
  );

  // État de débogage pour le développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bond Page State:', {
        templates,
        contracts,
        templatesError,
        contractsError,
        apiUrl: process.env.NEXT_PUBLIC_API_URL
      });
    }
  }, [templates, contracts, templatesError, contractsError]);

  // Gestion du template sélectionné
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setQAManager(new IntelligentQAManager(templateId));
  };

  // Affichage conditionnel avec gestion des états
  if (templatesLoading || contractsLoading) {
    return <LoadingState />;
  }

  if (templatesError || contractsError) {
    return (
      <ErrorState 
        error={templatesError || contractsError} 
        onRetry={refetchTemplates}
      />
    );
  }

  // Interface principale
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contrats Sécurisés avec Jalons de Paiement
          </h1>
          <p className="text-xl text-gray-600">
            Créez des contrats intelligents avec paiements par étapes sécurisés
          </p>
        </header>

        {/* Contrats existants */}
        {contracts && contracts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Vos contrats</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contracts.map(contract => (
                <ContractCard 
                  key={contract.id} 
                  contract={contract}
                  onClick={() => router.push(`/bond/contract/${contract.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Templates disponibles */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Créer un nouveau contrat</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates?.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleTemplateSelect(template.id)}
                selected={selectedTemplate === template.id}
              />
            ))}
          </div>
        </section>

        {/* Processus Q&A si template sélectionné */}
        {qaManager && selectedTemplate && (
          <QAProcess
            qaManager={qaManager}
            templateId={selectedTemplate}
            onComplete={(answers) => handleContractCreation(answers)}
            onCancel={() => {
              setSelectedTemplate(null);
              setQAManager(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Composant Template Card
function TemplateCard({ 
  template, 
  onClick, 
  selected 
}: { 
  template: Template; 
  onClick: () => void; 
  selected: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-6 rounded-xl border-2 cursor-pointer transition-all
        ${selected 
          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      {template.popular && (
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          Populaire
        </span>
      )}
      <div className="text-3xl mb-3">{template.icon}</div>
      <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
      <p className="text-gray-600 text-sm">{template.description}</p>
    </div>
  );
}

// Composant Contract Card
function ContractCard({ 
  contract, 
  onClick 
}: { 
  contract: BondContract; 
  onClick: () => void;
}) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    disputed: 'bg-red-100 text-red-700',
  };

  return (
    <div
      onClick={onClick}
      className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">
          Contrat #{contract.id.slice(0, 8)}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[contract.status]}`}>
          {contract.status}
        </span>
      </div>
      <p className="text-gray-600 mb-2">
        {contract.parties.length} parties • {contract.milestones.length} jalons
      </p>
      <p className="text-sm text-gray-500">
        Créé le {new Date(contract.createdAt).toLocaleDateString('fr-FR')}
      </p>
    </div>
  );
}

// Composant Q&A Process
function QAProcess({ 
  qaManager, 
  templateId,
  onComplete, 
  onCancel 
}: {
  qaManager: IntelligentQAManager;
  templateId: string;
  onComplete: (answers: any) => void;
  onCancel: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const currentSection = qaManager.getCurrentSection();
  const visibleQuestions = qaManager.getVisibleQuestions();
  const progress = qaManager.getProgress();

  const handleAnswerChange = (questionId: string, value: any) => {
    const error = qaManager.validateAnswer(questionId, value);
    
    if (error) {
      setErrors({ ...errors, [questionId]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[questionId];
      setErrors(newErrors);
      qaManager.setAnswer(questionId, value);
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const handleNext = () => {
    if (qaManager.canMoveToNextSection()) {
      if (qaManager.isComplete()) {
        const validation = qaManager.validateAllRules();
        if (validation.valid) {
          onComplete(qaManager.getAnswers());
        } else {
          alert(validation.errors.join('\n'));
        }
      } else {
        qaManager.moveToNextSection();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header avec progression */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{currentSection.title}</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Math.round(progress)}% complété
          </p>
        </div>

        {/* Questions */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentSection.description && (
            <p className="text-gray-600 mb-6">{currentSection.description}</p>
          )}
          
          {visibleQuestions.map(question => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              error={errors[question.id]}
              onChange={(value) => handleAnswerChange(question.id, value)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={() => qaManager.moveToPreviousSection()}
            disabled={qaManager.currentSectionIndex === 0}
            className="px-6 py-2 border rounded-lg disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={!qaManager.canMoveToNextSection()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {qaManager.isComplete() ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant Question Field
function QuestionField({ 
  question, 
  value, 
  error, 
  onChange 
}: {
  question: any;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {question.question}
        {question.validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {question.help && (
        <p className="text-xs text-gray-500 mb-2">{question.help}</p>
      )}

      {/* Rendu conditionnel selon le type */}
      {question.type === 'select' && (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Sélectionnez...</option>
          {question.options?.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}

      {question.type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      )}

      {question.type === 'number' && (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      )}

      {question.type === 'date' && (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      )}

      {question.type === 'multiselect' && (
        <div className="space-y-2">
          {question.options?.map((option: string) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={(value || []).includes(option)}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...(value || []), option]
                    : (value || []).filter((v: string) => v !== option);
                  onChange(newValue);
                }}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {question.legalImplication && (
        <p className="text-xs text-blue-600 mt-1 italic">
          ℹ️ {question.legalImplication}
        </p>
      )}
    </div>
  );
}

// États de chargement et erreur
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
        <p className="text-gray-600 mb-6">
          {error?.message || 'Impossible de charger les données'}
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Réessayer
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">Détails techniques</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Fonction pour créer un contrat
async function handleContractCreation(answers: Record<string, any>) {
  try {
    const contract = await apiClient.post('/bond/contracts', {
      answers,
      templateId: answers.templateId,
    });
    
    // Redirection vers le contrat créé
    window.location.href = `/bond/contract/${contract.id}`;
  } catch (error) {
    console.error('Erreur création contrat:', error);
    alert('Erreur lors de la création du contrat');
  }
}