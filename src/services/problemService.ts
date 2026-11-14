import api from "./api";
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
  ) =>
    (
      await api.get<ProblemListResponse>("/problems/", {
        params: { page, page_size, search, difficulty },
      })
    ).data,
  getProblem: async (id: number) =>
    (await api.get<Problem>(`/problems/${id}/`)).data,
  createProblem: async (data: CreateProblemData) =>
    (await api.post<Problem>("/problems/create/", data)).data,
  updateProblem: async (id: number, data: CreateProblemData) =>
    (await api.patch<Problem>(`/problems/${id}/`, data)).data,
  deleteProblem: async (id: number) => {
    await api.delete(`/problems/${id}/`);
  },
  listTestCases: async (id: number) =>
    (await api.get<TestCase[]>(`/problems/${id}/testcases/`)).data,
  addTestCase: async (id: number, data: Omit<TestCase, "id" | "problem">) =>
    (await api.post<TestCase>(`/problems/${id}/testcases/`, data)).data,
  updateTestCase: async (
    id: number,
    caseId: number,
    data: Omit<TestCase, "id" | "problem">,
  ) =>
    (await api.patch<TestCase>(`/problems/${id}/testcases/${caseId}/`, data))
      .data,
  deleteTestCase: async (id: number, caseId: number) => {
    await api.delete(`/problems/${id}/testcases/${caseId}/`);
  },
};
