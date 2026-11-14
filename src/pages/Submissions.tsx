import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ApiSubmission,
  submissionService,
  verdictText,
  isFinal,
} from "@/services/submissionService";
import { errorMessage } from "@/services/api";
import { Button } from "@/components/ui/button";
export default function Submissions() {
  const [rows, setRows] = useState<ApiSubmission[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let count = 0;
    const load = async () => {
      try {
        const data = await submissionService.listSubmissions(controller.signal);
        if (controller.signal.aborted) return;
        setRows(data);
        setError("");
        if (data.some((s) => !isFinal(s)) && ++count < 60)
          timer = setTimeout(load, Math.min(1000 + count * 250, 5000));
      } catch (e) {
        if (!controller.signal.aborted) setError(errorMessage(e));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [retry]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My submissions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review your solutions and execution results.
          </p>
        </div>
        <Button variant="outline" onClick={() => setRetry((v) => v + 1)}>
          Refresh
        </Button>
      </div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              {["Problem", "Result", "Language", "Runtime", "Submitted"].map(
                (h) => (
                  <th key={h} className="p-4">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  Loading submissions...
                </td>
              </tr>
            ) : !rows.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  No submissions yet.{" "}
                  <Link className="text-primary" to="/problems">
                    Browse problems
                  </Link>
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="p-4">
                    <Link
                      to={`/submissions/${s.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {s.problem_title}
                    </Link>
                  </td>
                  <td
                    className={`p-4 ${s.verdict === "AC" ? "text-success" : isFinal(s) ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    <Link to={`/submissions/${s.id}`}>
                      {isFinal(s)
                        ? verdictText[s.verdict] || s.verdict
                        : s.status}
                    </Link>
                  </td>
                  <td className="p-4">{s.language}</td>
                  <td className="p-4">
                    {s.execution_time == null
                      ? "—"
                      : `${(s.execution_time * 1000).toFixed(1)} ms`}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(s.submitted_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
