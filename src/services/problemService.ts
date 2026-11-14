import api, { withFallback } from './api';
import { ENDPOINTS } from './endpoints';
import { MOCK_PROBLEMS } from './mock/problems';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Example { input: string; output: string; explanation?: string }

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  created_at?: string;
  // optional extras (shown when provided by backend, sample data fills them)
  acceptance?: number;
  tags?: string[];
  status?: 'solved' | 'attempted' | null;
  examples?: Example[];
  constraints?: string[];
}

export interface ProblemListResponse {
  results: Problem[];
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

export interface CreateProblemData { title: string; description: string; difficulty: Difficulty; points: number }
export interface TestCase { id?: number; problem: number; input: string; expected_output: string; is_public: boolean }

export interface RunResult {
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error';
  runtime_ms: number;
  cases: { input: string; expected: string; output: string; passed: boolean }[];
}

const mockList = (page: number, limit: number, search?: string, difficulty?: string): ProblemListResponse => {
  let r = MOCK_PROBLEMS;
  if (search?.trim()) r = r.filter((p) => p.title.toLowerCase().includes(search.trim().toLowerCase()) || String(p.id) === search.trim());
  if (difficulty) r = r.filter((p) => p.difficulty === difficulty);
  const total_pages = Math.max(1, Math.ceil(r.length / limit));
  return { results: r.slice((page - 1) * limit, page * limit), total_count: r.length, total_pages, current_page: page, page_size: limit };
};

export const problemService = {
  listProblems: (page = 1, limit = 20, search?: string, difficulty?: string) =>
    withFallback(ENDPOINTS.problems.list, async () => {
      const params: Record<string, string | number> = { page, limit };
      if (search?.trim()) params.search = search.trim();
      if (difficulty) params.difficulty = difficulty;
      const { data } = await api.get<ProblemListResponse>(ENDPOINTS.problems.list, { params });
      return data;
    }, () => mockList(page, limit, search, difficulty)),

  getProblem: (id: number) =>
    withFallback(ENDPOINTS.problems.detail, async () => (await api.get<Problem>(ENDPOINTS.problems.detail(id))).data, () => {
      const p = MOCK_PROBLEMS.find((x) => x.id === id);
      if (!p) throw new Error('Problem not found');
      return p;
    }),

  createProblem: (data: CreateProblemData) =>
    withFallback(ENDPOINTS.problems.create, async () => (await api.post<Problem>(ENDPOINTS.problems.create, data)).data,
      () => ({ ...data, id: Math.floor(Math.random() * 900) + 100 })),

  addTestCase: (problemId: number, tc: Omit<TestCase, 'id'>) =>
    withFallback(ENDPOINTS.problems.addTestCase, async () => (await api.post<TestCase>(ENDPOINTS.problems.addTestCase(problemId), tc)).data,
      () => ({ ...tc, id: Date.now() })),

  /** Run code against sample tests (no backend endpoint yet → simulated). */
  runCode: (problem: Problem, _code: string, _language: string, inputs: string[]) =>
    withFallback(ENDPOINTS.problems.run, async () => (await api.post<RunResult>(ENDPOINTS.problems.run!(problem.id), { code: _code, language: _language, inputs })).data,
      async () => {
        await new Promise((r) => setTimeout(r, 700));
        const ex = problem.examples ?? [];
        return {
          status: 'Accepted' as const, runtime_ms: Math.floor(Math.random() * 40) + 20,
          cases: inputs.map((input, i) => ({ input, expected: ex[i]?.output ?? '—', output: ex[i]?.output ?? '—', passed: true })),
        };
      }),
};
