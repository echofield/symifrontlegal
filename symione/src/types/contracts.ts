// API response types
export interface ContractTemplate {
  metadata: {
    title: string;
    jurisdiction: string;
    governing_law: string;
    version: string;
  };
  inputs: {
    key: string;
    label: string;
    type: string;
    required: boolean;
  }[];
  clauses: {
    id: string;
    title: string;
    body: string;
  }[];
  annotations?: {
    clause_id: string;
    tooltip: string;
  }[];
}

export interface ContractIndexEntry {
  id: string;
  title: string;
  category: 'business' | 'employment' | 'property' | 'freelance' | 'personal' | 'closure' | 'custom';
  path: string;
}

export interface GenerateResponse {
  contract_id: string;
  generated_text: string;
  timestamp: string;
  lawyer_mode: boolean;
}

export interface ReviewResponse {
  overall_risk: 'low' | 'medium' | 'high';
  red_flags: {
    clause: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
    suggestion: string;
  }[];
  summary: string;
  timestamp: string;
}

export interface ExplainResponse {
  explanation: string;
  timestamp: string;
}

export interface ApiError {
  error: true;
  message: string;
  code?: string;
  retryInSec?: number;
}
