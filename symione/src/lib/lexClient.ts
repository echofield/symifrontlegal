import { apiGet, apiPost, apiPatch, downloadExport } from './apiHelpers';
import type {
  ContractIndexEntry,
  ContractTemplate,
  GenerateResponse,
  ReviewResponse,
  ExplainResponse,
} from '../types/contracts';

const JURISDICTION = ((import.meta as any).env?.VITE_JURISDICTION || 'FR') as string;

export const LexClient = {
  // Health check
  health: () =>
    apiGet<{ status: string; timestamp: string }>('/api/health'),

  // Contracts catalog
  listContracts: () =>
    apiGet<{ index: ContractIndexEntry[]; timestamp: string }>(
      `/api/contracts?jurisdiction=${encodeURIComponent(JURISDICTION)}`
    ),

  // Get specific template
  getTemplate: (id: string) =>
    apiGet<{ template: ContractTemplate; timestamp: string }>(`/api/contracts/${id}`),

  // Get clauses for a contract
  getClauses: (id: string) =>
    apiGet<{ contract_id: string; clauses: ContractTemplate['clauses']; timestamp: string }>(
      `/api/contracts/${id}/clauses`
    ),

  // Update clause (lawyer mode)
  updateClause: (id: string, clauseId: string, updates: { title?: string; body?: string }) =>
    apiPatch<{ contract_id: string; clause_id: string; updated: boolean; timestamp: string }>(
      `/api/contracts/${id}/clauses`,
      { id, clause_id: clauseId, ...updates }
    ),

  // Generate contract
  generate: (body: { contract_id: string; user_inputs: Record<string, any>; lawyer_mode?: boolean }) =>
    apiPost<GenerateResponse>('/api/generate', body),

  // Review contract
  review: (body: { contract_text: string }) =>
    apiPost<ReviewResponse>('/api/review', body),

  // Explain clause
  explain: (body: { text: string; context?: string }) =>
    apiPost<ExplainResponse>('/api/explain', body),

  // Export contract
  export: downloadExport,
};
