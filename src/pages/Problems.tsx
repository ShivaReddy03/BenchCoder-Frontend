import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { problemService } from "@/services/problemService";
import { errorMessage } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { publicListOptions } from "@/lib/queryCache";
export default function Problems() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const { user } = useAuth();
  const client = useQueryClient();
  const options = (targetPage: number) =>
    publicListOptions(
      [
        "problems",
        user?.id,
        !!user?.is_staff,
        "list",
        targetPage,
        20,
        term,
        difficulty,
      ],
      (signal) =>
        problemService.listProblems(targetPage, 20, term, difficulty, signal),
    );
  const query = useQuery({
    ...options(page),
    placeholderData: keepPreviousData,
  });
  const data = query.data;
  const error = query.error ? errorMessage(query.error) : "";
  const loading = query.isPending;
  useEffect(() => {
    if (
      data &&
      !query.isPlaceholderData &&
      data.current_page < data.total_pages
    )
      void client.prefetchQuery(options(page + 1));
    // The options are determined by these primitives, not the render-time closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    query.isPlaceholderData,
    client,
    page,
    term,
    difficulty,
    user?.id,
    user?.is_staff,
  ]);
  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Problems</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a challenge and build your problem-solving skills.
      </p>
      <div className="my-6 flex flex-wrap gap-3">
        <Input
          aria-label="Search problems"
          className="max-w-sm"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Difficulty"
          className="rounded border bg-card px-3 py-2 text-sm"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All difficulties</option>
          {["easy", "medium", "hard"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>
      {error ? (
        <div role="alert" className="space-y-3 rounded border p-5">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => query.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded border bg-card"
          aria-busy={loading}
        >
          <table className="w-full text-left text-sm">
            <thead className="border-b text-muted-foreground">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    Loading problems...
                  </td>
                </tr>
              ) : !data?.results.length ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No problems found.
                  </td>
                </tr>
              ) : (
                data.results.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <Link
                        className="font-medium hover:text-primary"
                        to={`/problem/${p.id}`}
                      >
                        {p.id}. {p.title}
                      </Link>
                    </td>
                    <td
                      className={`p-4 capitalize ${p.difficulty === "easy" ? "text-success" : p.difficulty === "hard" ? "text-destructive" : "text-warning"}`}
                    >
                      {p.difficulty}
                    </td>
                    <td className="p-4 text-right">{p.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {data && !error && (
        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {data.total_count} problems
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={query.isFetching || page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span>
              {page} / {Math.max(1, data.total_pages)}
            </span>
            <Button
              variant="outline"
              disabled={
                query.isFetching ||
                query.isPlaceholderData ||
                page >= data.total_pages
              }
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
