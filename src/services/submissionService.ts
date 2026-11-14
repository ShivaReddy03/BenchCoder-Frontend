import api, { withFallback } from './api';
import { ENDPOINTS } from './endpoints';
import { MOCK_SUBMISSIONS } from './mock/submissions';
import { MOCK_PROBLEMS } from './mock/problems';

export interface ApiSubmission {
  id: number;
  problem?: number;
  problem_title: string;
  problem_difficulty: string;
  user_username: string;
  language: string;
  verdict: string;
  execution_time: number | null; // seconds
  memory?: number | null; // MB
  submitted_at: string;
  code?: string;
}

export interface CreateSubmissionData { problem: number; code: string; language: string }
export interface AIAnalysis { analysis: string; suggestions?: string[]; complexity?: string }

let mockStore = [...MOCK_SUBMISSIONS];

export const submissionService = {
  listSubmissions: () =>
    withFallback(ENDPOINTS.submissions.list, async () => (await api.get<ApiSubmission[]>(ENDPOINTS.submissions.list)).data, () => mockStore),

  createSubmission: (data: CreateSubmissionData) =>
    withFallback(ENDPOINTS.submissions.create, async () => (await api.post<ApiSubmission>(ENDPOINTS.submissions.create, data)).data, async () => {
      await new Promise((r) => setTimeout(r, 900));
      const p = MOCK_PROBLEMS.find((x) => x.id === data.problem);
      const sub: ApiSubmission = {
        id: Math.max(...mockStore.map((s) => s.id)) + 1, problem: data.problem, problem_title: p?.title ?? 'Problem', problem_difficulty: p?.difficulty ?? 'easy',
        user_username: 'you', language: data.language, verdict: Math.random() > 0.3 ? 'Accepted' : 'Wrong Answer',
        execution_time: +(Math.random() * 0.08 + 0.02).toFixed(3), memory: +(Math.random() * 10 + 15).toFixed(1), submitted_at: new Date().toISOString(), code: data.code,
      };
      mockStore = [sub, ...mockStore];
      return sub;
    }),

  getSubmission: (id: number) =>
    withFallback(ENDPOINTS.submissions.detail, async () => (await api.get<ApiSubmission>(ENDPOINTS.submissions.detail(id))).data, () => {
      const s = mockStore.find((x) => x.id === id);
      if (!s) throw new Error('Submission not found');
      return s;
    }),

  analyzeSubmission: (id: number) =>
    withFallback(ENDPOINTS.submissions.analyze, async () => (await api.post<AIAnalysis>(ENDPOINTS.submissions.analyze(id))).data,
      () => ({ analysis: 'Sample analysis: solution is correct and readable.', complexity: 'O(n) time, O(n) space', suggestions: ['Use early return', 'Add edge-case checks'] })),
};
