import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { problemService, Problem } from "@/services/problemService";
import { isFinal, submissionService } from "@/services/submissionService";
import { errorMessage } from "@/services/api";
import { useSubmission } from "@/hooks/use-submission";
import { SubmissionResult } from "@/components/SubmissionResult";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
const starters: Record<string, string> = {
  python:
    "# Read stdin and print your answer.\nimport sys\ndata = sys.stdin.read()\n",
  javascript:
    '// Read stdin and print your answer.\nconst fs = require("fs");\nconst input = fs.readFileSync(0, "utf8");\n',
};
export default function ProblemDetail() {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const jobKey = `job:${user?.id}:${id}`;
  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starters.python);
  const [job, setJob] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const { submission, error: pollError, paused, resume } = useSubmission(job);
  useEffect(() => {
    let active = true;
    setProblem(null);
    setError("");
    setJob(Number(localStorage.getItem(jobKey)) || null);
    problemService
      .getProblem(Number(id))
      .then((p) => {
        if (active) setProblem(p);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      });
    return () => {
      active = false;
    };
  }, [id, jobKey]);
  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`draft:${user?.id}:${id}:${language}`);
    setCode(saved ?? starters[language]);
  }, [id, language, user?.id]);
  const changeCode = (value: string) => {
    setCode(value);
    localStorage.setItem(`draft:${user?.id}:${id}:${language}`, value);
  };
  const execute = async (kind: "run" | "submit") => {
    setSending(true);
    setError("");
    try {
      const payload = { problem: Number(id), code, language };
      const result = await (kind === "run"
        ? submissionService.runCode(payload)
        : submissionService.createSubmission(payload));
      localStorage.setItem(jobKey, String(result.id));
      setJob(result.id);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSending(false);
    }
  };
  const busy =
    sending ||
    (!!job && !paused && (!submission || !isFinal(submission)) && !pollError);
  if (!problem)
    return (
      <div className="p-8 text-center">
        {error || "Loading problem..."}{" "}
        {error && (
          <Link className="text-primary" to="/problems">
            Back to problems
          </Link>
        )}
      </div>
    );
  return (
    <div className="grid min-h-full lg:grid-cols-2">
      <section className="min-w-0 border-b p-5 lg:border-b-0 lg:border-r lg:p-7">
        <Link
          to="/problems"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to problems
        </Link>
        <h1 className="mb-3 mt-5 text-2xl font-semibold">
          {problem.id}. {problem.title}
        </h1>
        <div className="mb-6 flex gap-4 text-sm">
          <span
            className={
              problem.difficulty === "easy"
                ? "text-success"
                : problem.difficulty === "hard"
                  ? "text-destructive"
                  : "text-warning"
            }
          >
            {problem.difficulty}
          </span>
          <span className="text-muted-foreground">{problem.points} points</span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-7">
          {problem.description}
        </p>
        <h2 className="mb-3 mt-8 font-semibold">Sample test cases</h2>
        {problem.sample_test_cases?.length ? (
          problem.sample_test_cases.map((test, i) => (
            <div key={test.id ?? i} className="mb-4 rounded border bg-card p-4">
              <h3 className="mb-2 text-sm font-medium">Example {i + 1}</h3>
              <p className="text-xs text-muted-foreground">Input</p>
              <pre className="my-2 whitespace-pre-wrap break-words text-sm">
                {test.input || "(empty)"}
              </pre>
              <p className="text-xs text-muted-foreground">Expected output</p>
              <pre className="mt-2 whitespace-pre-wrap break-words text-sm">
                {test.expected_output}
              </pre>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No public samples are available.
          </p>
        )}
        <p className="mt-6 text-xs text-muted-foreground">
          Read standard input and write the answer to standard output. Submit
          evaluates all tests; Run evaluates the displayed public samples.
        </p>
      </section>
      <section className="min-w-0">
        <div className="flex items-center justify-between border-b bg-card p-3">
          <label className="text-sm">
            Language{" "}
            <select
              aria-label="Language"
              className="ml-2 rounded border bg-background p-2"
              value={language}
              disabled={busy}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {(problem.supported_languages ?? ["python", "javascript"]).map(
                (l) => (
                  <option key={l} value={l}>
                    {l === "python" ? "Python 3" : "JavaScript"}
                  </option>
                ),
              )}
            </select>
          </label>
          <span className="text-xs text-muted-foreground">Saved locally</span>
        </div>
        <CodeMirror
          value={code}
          height="420px"
          theme={resolvedTheme === "dark" ? vscodeDark : vscodeLight}
          extensions={[language === "python" ? python() : javascript()]}
          onChange={changeCode}
          editable={!sending}
          aria-label="Solution code"
        />
        <div className="flex justify-end gap-3 border-y bg-card p-3">
          <Button
            variant="outline"
            disabled={
              busy || !code.trim() || !problem.sample_test_cases?.length
            }
            onClick={() => execute("run")}
          >
            Run
          </Button>
          <Button
            disabled={busy || !code.trim()}
            onClick={() => execute("submit")}
          >
            {busy ? "Processing..." : "Submit"}
          </Button>
        </div>
        <div className="space-y-4 p-5">
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {pollError && (
            <p role="alert" className="text-sm text-destructive">
              {pollError}
            </p>
          )}
          {paused && (
            <p className="text-sm text-muted-foreground">
              Automatic checking paused. Your execution continues on the server.
            </p>
          )}
          {(paused || pollError) && (
            <Button variant="outline" onClick={resume}>
              Resume checking
            </Button>
          )}
          {submission ? (
            <div className="space-y-4">
              <SubmissionResult submission={submission} />
              <Link
                className="text-sm text-primary"
                to={`/submissions/${submission.id}`}
              >
                View execution details
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Run or submit your solution to see results.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
