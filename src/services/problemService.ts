import api from './api';

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProblemData {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface TestCase {
  id?: number;
  problem: number;
  input: string;
  expected_output: string;
  is_public: boolean;
}

export const problemService = {
  createProblem: async (data: CreateProblemData): Promise<Problem> => {
    const response = await api.post('/problems/create/', data);
    return response.data;
  },

  addTestCase: async (problemId: number, testCase: Omit<TestCase, 'id'>): Promise<TestCase> => {
    const response = await api.post(`/problems/${problemId}/testcases/`, testCase);
    return response.data;
  },

  listProblems: async (): Promise<Problem[]> => {
    const response = await api.get('/problems/');
    return response.data;
  },

  getProblem: async (id: number): Promise<Problem> => {
    const response = await api.get(`/problems/${id}/`);
    return response.data;
  },
};
