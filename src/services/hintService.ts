import api from "./api";
export type HintLevel = "concept" | "approach" | "debugging";
export interface HintSource {
  problem_id: number;
  title: string;
  concepts: string[];
  similarity: number;
}
export interface HintJob {
  id: number;
  problem: number;
  level: HintLevel;
  status: "queued" | "running" | "completed" | "failed";
  hint: string;
  retrieved_sources: HintSource[];
  error_message: string;
  created_at: string;
  finished_at: string | null;
}
export interface HintConfig {
  retrieval_backend?: "local" | "pinecone";
  enabled: boolean;
  hint_model: string;
  embedding_model: string;
  daily_limit: number;
  global_daily_limit: number;
  active_limit: number;
}
export const hintService = {
  config: async (signal?: AbortSignal) =>
    (await api.get<HintConfig>("/hints/config/", { signal })).data,
  request: async (
    payload: {
      problem: number;
      code: string;
      language: string;
      level: HintLevel;
    },
    signal?: AbortSignal,
  ) => (await api.post<HintJob>("/hints/", payload, { signal })).data,
  get: async (id: number, signal?: AbortSignal) =>
    (await api.get<HintJob>(`/hints/${id}/`, { signal })).data,
};
