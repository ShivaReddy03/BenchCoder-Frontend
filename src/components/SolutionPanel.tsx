import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import api, { errorMessage } from "@/services/api";
interface SolutionJob {
  id: number;
  problem: number;
  language: string;
  status: "queued" | "running" | "completed" | "failed";
  explanation: string;
  solution_code: string;
  time_complexity: string;
  space_complexity: string;
  error_message: string;
  created_at: string;
  finished_at: string | null;
}
export function SolutionPanel({
  problem,
  code,
  language,
  onLoad,
}: {
  problem: number;
  code: string;
  language: string;
  onLoad: (code: string, language: string) => void;
}) {
  const { user } = useAuth();
  const key = `solution:${user?.id}:${problem}`;
  const [acknowledged, setAcknowledged] = useState(false);
  const [job, setJob] = useState<SolutionJob | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cached, setCached] = useState(false);
  const [pollVersion, setPollVersion] = useState(0);
  const [snapshot, setSnapshot] = useState<{
    code: string;
    language: string;
  } | null>(null);
  const [copyNotice, setCopyNotice] = useState("");
  const [hadPrevious] = useState(() => !!localStorage.getItem(key));
  const requestController = useRef<AbortController | null>(null);
  useEffect(() => () => requestController.current?.abort(), []);
  const request = async () => {
    const controller = new AbortController();
    requestController.current = controller;
    setAcknowledged(true);
    setBusy(true);
    setError("");
    setPaused(false);
    setJob(null);
    setSnapshot({ code, language });
    try {
      const config = (
        await api.get<{ enabled: boolean; model: string }>(
          "/solutions/config/",
          { signal: controller.signal },
        )
      ).data;
      if (!config.enabled)
        throw new Error(
          "AI solutions are unavailable because the provider is not configured.",
        );
      const response = await api.post<SolutionJob>(
        "/solutions/",
        { problem, code, language },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setCached(response.status === 200);
      setJob(response.data);
      localStorage.setItem(key, String(response.data.id));
    } catch (e) {
      if (!controller.signal.aborted) setError(errorMessage(e));
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  };
  const activeId =
    job && ["queued", "running"].includes(job.status) ? job.id : null;
  useEffect(() => {
    if (!activeId || !acknowledged) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let count = 0;
    const poll = async () => {
      try {
        const result = (
          await api.get<SolutionJob>(`/solutions/${activeId}/`, {
            signal: controller.signal,
          })
        ).data;
        if (controller.signal.aborted) return;
        setJob(result);
        setError("");
        if (result.status === "completed" || result.status === "failed") return;
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(errorMessage(e));
      }
      if (++count >= 40) {
        setPaused(true);
        return;
      }
      timer = setTimeout(poll, Math.min(1000 + count * 300, 5000));
    };
    setPaused(false);
    poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [activeId, acknowledged, pollVersion]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(job?.solution_code || "");
      setCopyNotice("Solution code copied.");
    } catch {
      setCopyNotice("Clipboard unavailable. Select the code below to copy it.");
    }
  };
  if (!acknowledged)
    return (
      <div className="space-y-4">
        <h2 className="font-semibold">Try the problem first</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          A solution reveals the approach and full code. Consider using a hint
          or testing another idea before continuing.
        </p>
        <p className="text-xs leading-5 text-muted-foreground">
          Continuing sends this problem and your current code to the AI provider
          when a new solution is needed. AI solutions may be incorrect and are
          not verified or automatically executed.
        </p>
        {hadPrevious && (
          <p className="text-xs text-muted-foreground">
            A previous request is saved. Continue to check the server for an
            existing solution or active request.
          </p>
        )}
        <Button onClick={request} disabled={code.length > 12000}>
          I give up—show solution
        </Button>
        {code.length > 12000 && (
          <p className="text-sm text-destructive">
            Shorten your code to 12,000 characters before requesting a solution.
          </p>
        )}
      </div>
    );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-semibold">AI solution</h2>
        <span className="rounded border px-2 py-1 text-xs text-muted-foreground">
          Unverified
        </span>
        {cached && (
          <span className="text-xs text-muted-foreground">Cached response</span>
        )}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Review this answer carefully. AI output may be incorrect. Loading code
        only changes the editor; execution requires Run or Submit.
      </p>
      {snapshot && (
        <details className="rounded border p-3">
          <summary className="cursor-pointer text-xs">
            Request snapshot · {snapshot.language}
          </summary>
          <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words text-xs">
            {snapshot.code || "(empty code)"}
          </pre>
        </details>
      )}
      {busy && (
        <p role="status" className="text-sm">
          Checking for a saved solution or starting generation...
        </p>
      )}
      {job && ["queued", "running"].includes(job.status) && (
        <p role="status" className="text-sm text-muted-foreground">
          {job.status === "queued"
            ? "Solution queued."
            : "Generating solution..."}{" "}
          You can keep coding.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {job?.status === "failed" && (
        <p role="alert" className="text-sm text-destructive">
          {job.error_message || "Solution generation failed."}
        </p>
      )}
      {paused && (
        <p className="text-sm text-muted-foreground">
          Automatic checking paused. The server may still be processing this
          request.
        </p>
      )}
      {(paused || error) && activeId && (
        <Button variant="outline" onClick={() => setPollVersion((v) => v + 1)}>
          Resume solution checking
        </Button>
      )}
      {!busy && !activeId && (error || job?.status === "failed") && (
        <Button variant="outline" onClick={request}>
          Retry solution request
        </Button>
      )}
      {job?.status === "completed" && (
        <div className="space-y-4">
          <p className="whitespace-pre-wrap break-words text-sm leading-7">
            {job.explanation}
          </p>
          <div className="grid gap-2 text-sm">
            <p>Time complexity: {job.time_complexity || "Not provided"}</p>
            <p>Space complexity: {job.space_complexity || "Not provided"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={copy}>
              Copy code
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLoad(job.solution_code, job.language)}
            >
              Load into editor
            </Button>
          </div>
          {copyNotice && (
            <p role="status" className="text-xs text-muted-foreground">
              {copyNotice}
            </p>
          )}
          <pre className="max-h-[480px] overflow-auto rounded border bg-card p-4 text-xs">
            <code>{job.solution_code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
