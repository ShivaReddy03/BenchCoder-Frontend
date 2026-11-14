import { useCallback, useEffect, useState } from "react";
import {
  ApiSubmission,
  isFinal,
  submissionService,
} from "@/services/submissionService";
import { errorMessage } from "@/services/api";
export function useSubmission(id: number | null) {
  const [submission, setSubmission] = useState<ApiSubmission | null>(null);
  const [error, setError] = useState("");
  const [paused, setPaused] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!id) {
      setSubmission(null);
      return;
    }
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let count = 0;
    const poll = async () => {
      try {
        const result = await submissionService.getSubmission(
          id,
          controller.signal,
        );
        if (controller.signal.aborted) return;
        setSubmission(result);
        setError("");
        if (isFinal(result)) {
          setPaused(false);
          return;
        }
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(errorMessage(e));
      }
      if (++count >= 60) {
        setPaused(true);
        return;
      }
      timer = setTimeout(poll, Math.min(1000 + count * 250, 5000));
    };
    setSubmission(null);
    setPaused(false);
    setError("");
    poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [id, version]);
  const resume = useCallback(() => setVersion((v) => v + 1), []);
  return { submission, error, paused, resume };
}
