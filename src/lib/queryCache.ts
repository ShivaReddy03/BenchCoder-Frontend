import { QueryClient, queryOptions } from "@tanstack/react-query";
import type { Problem, ProblemListResponse } from "@/services/problemService";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
      gcTime: 1800000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const PREFIX = "benchcoder:public:v2:";
const TTL = 300000;
export function clearProblemPersistence() {
  try {
    for (const key of Object.keys(sessionStorage))
      if (key.startsWith(PREFIX)) sessionStorage.removeItem(key);
  } catch {
    /* Storage may be unavailable. */
  }
}
export function clearQueryCache() {
  void queryClient.cancelQueries();
  queryClient.clear();
  clearProblemPersistence();
}
export function invalidateProblems() {
  clearProblemPersistence();
  return queryClient.invalidateQueries({ queryKey: ["problems"] });
}
export function publicProblem(p: Problem): Problem {
  if (
    !p ||
    !Number.isFinite(p.id) ||
    typeof p.title !== "string" ||
    typeof p.description !== "string" ||
    !["easy", "medium", "hard"].includes(p.difficulty) ||
    !Number.isFinite(p.points)
  )
    throw new Error("Invalid problem response.");
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    difficulty: p.difficulty,
    points: p.points,
    supported_languages: p.supported_languages?.filter((l) =>
      ["python", "javascript", "java", "cpp"].includes(l),
    ),
    sample_test_cases: p.sample_test_cases
      ?.filter((t) => t.is_public === true)
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        problem: p.id,
        input: t.input,
        expected_output: t.expected_output,
        is_public: true,
      })),
  };
}
function storageKey(key: readonly unknown[]) {
  return PREFIX + JSON.stringify(key);
}
function read<T>(
  key: readonly unknown[],
  sanitize: (data: T) => T,
): { data: T; at: number } | undefined {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey(key)) || "null");
    if (
      value &&
      value.version === 1 &&
      typeof value.at === "number" &&
      value.at <= Date.now() &&
      Date.now() - value.at < TTL
    )
      return { at: value.at, data: sanitize(value.data) };
    sessionStorage.removeItem(storageKey(key));
  } catch {
    /* Ignore invalid caches. */
  }
}
function write(key: readonly unknown[], data: unknown) {
  try {
    const entries = Object.keys(sessionStorage).filter((k) =>
      k.startsWith(PREFIX),
    );
    for (const key of entries) {
      const v = JSON.parse(sessionStorage.getItem(key) || "null");
      if (!v || Date.now() - v.at >= TTL) sessionStorage.removeItem(key);
    }
    const remaining = Object.keys(sessionStorage).filter((k) =>
      k.startsWith(PREFIX),
    );
    while (remaining.length >= 50)
      sessionStorage.removeItem(remaining.shift()!);
    sessionStorage.setItem(
      storageKey(key),
      JSON.stringify({ version: 1, at: Date.now(), data }),
    );
  } catch {
    /* A full or disabled cache must not break navigation. */
  }
}
export function publicListOptions(
  key: readonly unknown[],
  fetcher: (signal: AbortSignal) => Promise<ProblemListResponse>,
) {
  const cached = read<ProblemListResponse>(key, (result) => ({
    results: result.results.map(publicProblem),
    total_count: result.total_count,
    total_pages: result.total_pages,
    current_page: result.current_page,
    page_size: result.page_size,
  }));
  return queryOptions({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const result = await fetcher(signal);
      const data = {
        results: result.results.map(publicProblem),
        total_count: result.total_count,
        total_pages: result.total_pages,
        current_page: result.current_page,
        page_size: result.page_size,
      };
      if (!signal.aborted) write(key, data);
      return data;
    },
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.at,
  });
}
export function publicDetailOptions(
  key: readonly unknown[],
  fetcher: (signal: AbortSignal) => Promise<Problem>,
) {
  const cached = read<Problem>(key, publicProblem);
  return queryOptions({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const data = publicProblem(await fetcher(signal));
      if (!signal.aborted) write(key, data);
      return data;
    },
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.at,
  });
}
