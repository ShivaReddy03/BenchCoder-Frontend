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

export interface ProblemListResponse {
  results: Problem[];
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
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

  listProblems: async (page: number = 1, limit: number = 9, search?: string, difficulty?: string): Promise<ProblemListResponse> => {
    let url = `/problems/?page=${page}&limit=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (difficulty) {
      url += `&difficulty=${encodeURIComponent(difficulty)}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  getProblem: async (id: number): Promise<Problem> => {
    const response = await api.get(`/problems/${id}/`);
    return response.data;
  },
};
