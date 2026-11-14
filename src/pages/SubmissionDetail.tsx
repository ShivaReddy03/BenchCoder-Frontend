import { Link, useParams } from "react-router-dom";
import { useSubmission } from "@/hooks/use-submission";
import { SubmissionResult } from "@/components/SubmissionResult";
import { Button } from "@/components/ui/button";
export default function SubmissionDetail() {
  const { id } = useParams();
  const { submission, error, paused, resume } = useSubmission(Number(id));
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link to="/submissions" className="text-sm text-muted-foreground">
        Back to submissions
      </Link>
      <h1 className="text-2xl font-semibold">
        {submission?.problem_title ?? "Submission results"}
      </h1>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {paused && (
        <p className="text-sm text-muted-foreground">
          Automatic checking paused. Execution continues on the server.
        </p>
      )}
      {(error || paused) && (
        <Button variant="outline" onClick={resume}>
          Resume checking
        </Button>
      )}
      {submission ? (
        <>
          <div className="rounded border bg-card p-5">
            <SubmissionResult submission={submission} />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {submission.language} ·{" "}
              {new Date(submission.submitted_at).toLocaleString()}
            </span>
            <Link
              className="text-primary"
              to={`/problem/${submission.problem}`}
            >
              Open problem
            </Link>
          </div>
          <h2 className="font-semibold">Submitted code</h2>
          <pre className="overflow-x-auto rounded border bg-card p-5 text-sm">
            <code>{submission.code}</code>
          </pre>
        </>
      ) : (
        !error && <p>Loading results...</p>
      )}
    </div>
  );
}
