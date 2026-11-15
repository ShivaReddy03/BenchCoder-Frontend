import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  submissionService,
  isFinal,
  verdictText,
} from "@/services/submissionService";
import { errorMessage } from "@/services/api";
import { Button } from "@/components/ui/button";
export function ProblemSubmissions({
  problem,
  onLoad,
}: {
  problem: number;
  onLoad: (code: string, language: string) => void;
}) {
  const { user } = useAuth();
  const [polls, setPolls] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const query = useQuery({
    queryKey: ["submissions", user?.id, problem],
    queryFn: ({ signal }) => submissionService.listSubmissions(signal, problem),
    staleTime: 0,
    refetchInterval: (query) =>
      polls < 40 && query.state.data?.some((s) => !isFinal(s))
        ? Math.min(1000 + polls * 300, 5000)
        : false,
  });
  useEffect(() => {
    if (query.dataUpdatedAt) setPolls((v) => v + 1);
  }, [query.dataUpdatedAt]);
  const load = async (id: number) => {
    setLoadingId(id);
    setLoadError("");
    try {
      const s = await submissionService.getSubmission(id);
      if (s.code != null) onLoad(s.code, s.language);
    } catch (e) {
      setLoadError(errorMessage(e));
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Your submissions</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setPolls(0);
            void query.refetch();
          }}
        >
          Refresh
        </Button>
      </div>
      {query.error && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(query.error)}
        </p>
      )}
      {loadError && (
        <p role="alert" className="text-sm text-destructive">
          {loadError}
        </p>
      )}
      {query.isPending ? (
        <p className="text-sm text-muted-foreground">Loading submissions...</p>
      ) : !query.data?.length ? (
        <p className="text-sm text-muted-foreground">
          No submissions for this problem yet.
        </p>
      ) : (
        <div className="space-y-3">
          {query.data.map((s) => (
            <div key={s.id} className="space-y-3 rounded border bg-card p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <Link
                  className={`text-sm font-medium hover:underline ${s.verdict === "AC" ? "text-success" : isFinal(s) ? "text-destructive" : ""}`}
                  to={`/submissions/${s.id}`}
                >
                  {isFinal(s) ? verdictText[s.verdict] || s.verdict : s.status}
                </Link>
                <span className="text-xs text-muted-foreground">
                  #{s.id} · {s.language}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(s.submitted_at).toLocaleString()} · {s.passed_tests}/
                {s.total_tests} passed
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="text-xs text-primary"
                  to={`/submissions/${s.id}`}
                >
                  Results and code
                </Link>
                <button
                  disabled={loadingId !== null}
                  className="text-xs text-primary hover:underline disabled:opacity-50"
                  onClick={() => load(s.id)}
                >
                  {loadingId === s.id ? "Loading..." : "Load code into editor"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {polls >= 40 && query.data?.some((s) => !isFinal(s)) && (
        <p className="text-xs text-muted-foreground">
          Automatic checking paused. Use Refresh to continue.
        </p>
      )}
    </div>
  );
}
