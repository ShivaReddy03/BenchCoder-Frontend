import api from "./api";
export interface ApiSubmission {
  id: number;
  problem: number;
  problem_title: string;
  problem_difficulty: string;
  user_username: string;
  language: string;
  status: "queued" | "running" | "completed" | "failed";
  kind: "run" | "submit";
  verdict: string;
  passed_tests: number;
  total_tests: number;
  execution_time: number | null;
  memory_used: number | null;
  error_message: string;
  submitted_at: string;
  code?: string;
  sample_results?: {
    input: string;
    expected: string;
    output: string;
    passed: boolean;
  }[];
}
export interface CreateSubmissionData {
  problem: number;
  code: string;
  language: string;
}
export const isFinal = (s: ApiSubmission) =>
  s.status === "completed" || s.status === "failed";
export const verdictText: Record<string, string> = {
  P: "Pending",
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  MLE: "Memory Limit Exceeded",
  RE: "Runtime Error",
  CE: "Compilation Error",
  OT: "Execution Error",
};
export const submissionService = {
  listSubmissions: async (signal?: AbortSignal) =>
    (await api.get<ApiSubmission[]>("/submissions/", { signal })).data,
  createSubmission: async (data: CreateSubmissionData) =>
    (await api.post<ApiSubmission>("/submissions/create/", data)).data,
  runCode: async (data: CreateSubmissionData) =>
    (await api.post<ApiSubmission>("/submissions/run/", data)).data,
  getSubmission: async (id: number, signal?: AbortSignal) =>
    (await api.get<ApiSubmission>(`/submissions/${id}/`, { signal })).data,
};
