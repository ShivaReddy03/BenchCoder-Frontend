import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { hintService, HintConfig, HintLevel } from "@/services/hintService";
import { errorMessage } from "@/services/api";
import { useHint } from "@/hooks/use-hint";
const levels: { value: HintLevel; title: string; description: string }[] = [
  {
    value: "concept",
    title: "Concept",
    description: "Review the ideas that apply to this problem.",
  },
  {
    value: "approach",
    title: "Approach",
    description: "Get guidance on how to structure your solution.",
  },
  {
    value: "debugging",
    title: "Debugging",
    description: "Look for issues in your current code.",
  },
];
export function HintPanel({
  problem,
  code,
  language,
}: {
  problem: number;
  code: string;
  language: string;
}) {
  const { user } = useAuth();
  const storageKey = `hint:${user?.id}:${problem}`;
  const [job, setJob] = useState<number | null>(
    () => Number(localStorage.getItem(storageKey)) || null,
  );
  const [level, setLevel] = useState<HintLevel>("concept");
  const [config, setConfig] = useState<HintConfig | null>(null);
  const [configError, setConfigError] = useState("");
  const [configVersion, setConfigVersion] = useState(0);
  const [requestError, setRequestError] = useState("");
  const [sending, setSending] = useState(false);
  const requestController = useRef<AbortController | null>(null);
  const { hint, error: pollError, paused, resume } = useHint(job);
  useEffect(() => {
    const controller = new AbortController();
    setConfigError("");
    hintService
      .config(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setConfig(result);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setConfigError(errorMessage(e));
      });
    return () => controller.abort();
  }, [configVersion]);
  useEffect(() => () => requestController.current?.abort(), []);
  const pending =
    !!job &&
    !paused &&
    !pollError &&
    (!hint || hint.status === "queued" || hint.status === "running");
  const tooLong = code.length > 12000;
  const request = async () => {
    const controller = new AbortController();
    requestController.current = controller;
    setSending(true);
    setRequestError("");
    try {
      const result = await hintService.request(
        { problem, code, language, level },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      localStorage.setItem(storageKey, String(result.id));
      if (job === result.id) resume();
      else setJob(result.id);
    } catch (e) {
      if (!controller.signal.aborted) setRequestError(errorMessage(e));
    } finally {
      if (!controller.signal.aborted) setSending(false);
    }
  };
  return (
    <section aria-labelledby="hint-heading" className="space-y-4 border-t p-5">
      <div>
        <h2 id="hint-heading" className="font-semibold">
          AI hints
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Get guidance while you work. AI responses may be imperfect; check
          suggestions against the problem and your tests.
        </p>
      </div>
      <label className="block space-y-2 text-sm">
        <span>Hint type</span>
        <select
          className="w-full rounded border bg-card p-2 sm:w-auto"
          value={level}
          onChange={(e) => setLevel(e.target.value as HintLevel)}
          disabled={sending || pending}
        >
          {levels.map((item) => (
            <option key={item.value} value={item.value}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-muted-foreground">
        {levels.find((item) => item.value === level)?.description}
      </p>
      <p
        id="hint-sharing-notice"
        className="text-xs leading-5 text-muted-foreground"
      >
        Clicking Request hint sends your current code and selected problem
        context to the configured AI provider. Editing or running code does not
        request a hint.
        {config?.retrieval_backend === "pinecone" && (
          <>
            {" "}
            Problem knowledge and retrieval queries are processed by Pinecone.
            Your code is not sent to Pinecone.
          </>
        )}
      </p>
      {configError && (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-destructive">
            {configError}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfigVersion((v) => v + 1)}
          >
            Retry hint availability
          </Button>
        </div>
      )}
      {config && !config.enabled && (
        <p role="status" className="text-sm text-muted-foreground">
          AI hints are unavailable because the provider is not configured. Core
          code execution still works.
        </p>
      )}
      {tooLong && (
        <p role="alert" className="text-sm text-destructive">
          Hints support up to 12,000 code characters. Shorten your code before
          requesting a hint.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {config?.retrieval_backend === "pinecone" && (
          <span className="text-xs text-muted-foreground">
            Retrieval: Pinecone
          </span>
        )}
        <Button
          variant="outline"
          aria-describedby="hint-sharing-notice"
          disabled={
            !config?.enabled ||
            sending ||
            pending ||
            tooLong ||
            (level === "debugging" && !code.trim())
          }
          onClick={request}
        >
          {sending
            ? "Requesting hint..."
            : pending
              ? "Generating hint..."
              : "Request hint"}
        </Button>
        {!config && !configError && (
          <span className="text-xs text-muted-foreground">
            Checking availability...
          </span>
        )}
        {config?.enabled && (
          <span className="text-xs text-muted-foreground">
            Up to {config.daily_limit} requests per day; one active request at a
            time.
          </span>
        )}
      </div>
      {requestError && (
        <p role="alert" className="text-sm text-destructive">
          {requestError}
        </p>
      )}
      {pollError && (
        <p role="alert" className="text-sm text-destructive">
          {pollError}
        </p>
      )}
      {paused && (
        <p className="text-sm text-muted-foreground">
          Automatic checking paused. The hint request may still be processing on
          the server.
        </p>
      )}
      {(paused || pollError) && (
        <Button size="sm" variant="outline" onClick={resume}>
          Resume hint checking
        </Button>
      )}
      <div aria-live="polite" aria-busy={sending || pending}>
        {hint?.status === "queued" && (
          <p className="text-sm text-muted-foreground">
            Hint queued. You can keep coding while it processes.
          </p>
        )}
        {hint?.status === "running" && (
          <p className="text-sm text-muted-foreground">
            Preparing your hint...
          </p>
        )}
        {hint?.status === "failed" && (
          <p role="alert" className="text-sm text-destructive">
            {hint.error_message ||
              "Hint generation failed. Please try again later."}
          </p>
        )}
        {hint?.status === "completed" && (
          <div className="space-y-4 rounded border bg-card p-4">
            <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{hint.level} hint</span>
              <span>Based on code when requested</span>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm leading-7">
              {hint.hint}
            </p>
            {hint.retrieved_sources?.length ? (
              <div className="space-y-2 border-t pt-3">
                <h3 className="text-sm font-medium">
                  Connections to your solved problems
                </h3>
                <p className="text-xs text-muted-foreground">
                  These problems from your solved history were retrieved as
                  context for this hint.
                </p>
                <ul className="space-y-2">
                  {hint.retrieved_sources.map((source) => (
                    <li key={source.problem_id} className="text-sm">
                      <Link
                        className="text-primary hover:underline"
                        to={`/problem/${source.problem_id}`}
                      >
                        {source.title}
                      </Link>
                      {source.concepts?.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {source.concepts.join(" · ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="border-t pt-3 text-xs text-muted-foreground">
                No solved-history examples were retrieved. This is general
                guidance for the current problem.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
