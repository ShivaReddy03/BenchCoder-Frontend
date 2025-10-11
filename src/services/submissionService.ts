import api from './api';

export interface Submission {
  id: number;
  problem: number;
  user?: number;
  code: string;
  language: string;
  status?: 'pending' | 'accepted' | 'wrong_answer' | 'error' | 'time_limit_exceeded';
  score?: number;
  output?: string;
  error_message?: string;
  execution_time?: number;
  created_at?: string;
}

export interface ApiSubmission {
  id: number;
  problem_title: string;
  problem_difficulty: string;
  user_username: string;
  language: string;
  verdict: string;
  execution_time: number | null;
  submitted_at: string;
}

export interface CreateSubmissionData {
  problem: number;
  code: string;
  language: string;
}

export interface AIAnalysis {
  analysis: string;
  suggestions?: string[];
  complexity?: string;
}

export const submissionService = {
  createSubmission: async (data: CreateSubmissionData): Promise<Submission> => {
    const response = await api.post('/submissions/create/', data);
    return response.data;
  },

  listSubmissions: async (): Promise<ApiSubmission[]> => {
    const response = await api.get('/submissions/');
    return response.data;
  },

  getSubmission: async (id: number): Promise<Submission> => {
    const response = await api.get(`/submissions/${id}/`);
    return response.data;
  },

  analyzeSubmission: async (id: number): Promise<AIAnalysis> => {
    const response = await api.post(`/submissions/${id}/analyze/`);
    return response.data;
  },
};
