import {
  ApiSubmission,
  isFinal,
  verdictText,
} from "@/services/submissionService";
export function SubmissionResult({
  submission: s,
}: {
  submission: ApiSubmission;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          className={`text-lg font-semibold ${s.verdict === "AC" ? "text-success" : isFinal(s) ? "text-destructive" : ""}`}
        >
          {isFinal(s)
            ? verdictText[s.verdict] || s.verdict
            : s.status === "running"
              ? "Running…"
              : "Queued…"}
        </h3>
        <span className="text-xs text-muted-foreground">
          {s.kind === "run" ? "Sample run" : "Submission"} #{s.id}
        </span>
      </div>

      <div className="flex flex-wrap gap-5 text-sm">
        <span>
          {s.passed_tests} / {s.total_tests} tests passed
        </span>
        <span>
          Runtime:{" "}
          {s.execution_time == null
            ? "—"
            : `${(s.execution_time * 1000).toFixed(1)} ms`}
        </span>
        <span>
          Memory:{" "}
          {s.memory_used == null ? "—" : `${s.memory_used.toFixed(1)} MB`}
        </span>
      </div>

      {s.error_message && (
        <pre className="whitespace-pre-wrap break-words rounded bg-muted p-3 text-xs text-destructive">
          {s.error_message}
        </pre>
      )}

      {s.sample_results?.map((test, i) => (
        <details key={i} className="rounded border p-3">
          <summary className="cursor-pointer text-sm">
            Sample {i + 1} ·{" "}
            <span className={test.passed ? "text-success" : "text-destructive"}>
              {test.passed ? "Passed" : "Failed"}
            </span>
          </summary>
          <div className="mt-3 grid gap-2 text-xs">
            {[
              ["Input", test.input],
              ["Expected", test.expected],
              ["Output", test.output],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-muted-foreground">{label}</p>
                <pre className="whitespace-pre-wrap break-words rounded bg-muted p-2">
                  {value || "(empty)"}
                </pre>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
