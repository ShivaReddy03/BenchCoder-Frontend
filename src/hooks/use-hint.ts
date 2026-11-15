import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { hintService, HintJob } from "@/services/hintService";
import { errorMessage } from "@/services/api";
export function useHint(id: number | null) {
  const [hint, setHint] = useState<HintJob | null>(null);
  const [error, setError] = useState("");
  const [paused, setPaused] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    setHint(null);
    setError("");
    setPaused(false);
    if (!id) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    const poll = async () => {
      try {
        const result = await hintService.get(id, controller.signal);
        if (controller.signal.aborted) return;
        setHint(result);
        setError("");
        if (result.status === "completed" || result.status === "failed") return;
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(errorMessage(e));
        if (
          axios.isAxiosError(e) &&
          [401, 403, 404, 429].includes(e.response?.status ?? 0)
        ) {
          setPaused(true);
          return;
        }
      }
      if (++attempts >= 40) {
        setPaused(true);
        return;
      }
      timer = setTimeout(poll, Math.min(1000 + attempts * 300, 5000));
    };
    poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [id, version]);
  const resume = useCallback(() => setVersion((v) => v + 1), []);
  return { hint, error, paused, resume };
}
