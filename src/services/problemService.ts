import api from "./api";
import { invalidateProblems } from "@/lib/queryCache";
export type Difficulty = "easy" | "medium" | "hard";
export interface TestCase {
  id?: number;
  problem: number;
  input: string;
  expected_output: string;
  is_public: boolean;
}
export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  sample_test_cases?: TestCase[];
  test_cases?: TestCase[];
  supported_languages?: string[];
}
export interface CreateProblemData {
  title: string;
  description: string;
  difficulty: Difficulty;
  points: number;
}
export interface ProblemListResponse {
  results: Problem[];
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}
export const problemService = {
  listProblems: async (
    page = 1,
    page_size = 20,
    search = "",
    difficulty = "",
    signal?: AbortSignal,
  ) =>
    (
      await api.get<ProblemListResponse>("/problems/", {
        params: { page, page_size, search, difficulty },
        signal,
      })
    ).data,
  getProblem: async (id: number, signal?: AbortSignal) =>
    (await api.get<Problem>(`/problems/${id}/`, { signal })).data,
  createProblem: async (data: CreateProblemData) => {
    const result = (await api.post<Problem>("/problems/create/", data)).data;
    await invalidateProblems();
    return result;
  },
  updateProblem: async (id: number, data: CreateProblemData) => {
    const result = (await api.patch<Problem>(`/problems/${id}/`, data)).data;
    await invalidateProblems();
    return result;
  },
  deleteProblem: async (id: number) => {
    await api.delete(`/problems/${id}/`);
    await invalidateProblems();
  },
  listTestCases: async (id: number) =>
    (await api.get<TestCase[]>(`/problems/${id}/testcases/`)).data,
  addTestCase: async (id: number, data: Omit<TestCase, "id" | "problem">) => {
    const result = (
      await api.post<TestCase>(`/problems/${id}/testcases/`, data)
    ).data;
    await invalidateProblems();
    return result;
  },
  updateTestCase: async (
    id: number,
    caseId: number,
    data: Omit<TestCase, "id" | "problem">,
  ) => {
    const result = (
      await api.patch<TestCase>(`/problems/${id}/testcases/${caseId}/`, data)
    ).data;
    await invalidateProblems();
    return result;
  },
  deleteTestCase: async (id: number, caseId: number) => {
    await api.delete(`/problems/${id}/testcases/${caseId}/`);
    await invalidateProblems();
  },
};
