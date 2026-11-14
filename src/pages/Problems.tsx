import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { problemService, ProblemListResponse } from "@/services/problemService";
import { errorMessage } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function Problems() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [data, setData] = useState<ProblemListResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    problemService
      .listProblems(page, 20, term, difficulty)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, term, difficulty, retry]);
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
          <Button variant="outline" onClick={() => setRetry((v) => v + 1)}>
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
              disabled={loading || page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span>
              {page} / {Math.max(1, data.total_pages)}
            </span>
            <Button
              variant="outline"
              disabled={loading || page >= data.total_pages}
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
