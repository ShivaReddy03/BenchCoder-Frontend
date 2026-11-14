import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  problemService,
  Problem,
  TestCase,
  CreateProblemData,
} from "@/services/problemService";
import { errorMessage } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
const empty: CreateProblemData = {
  title: "",
  description: "",
  difficulty: "easy",
  points: 10,
};
const emptyCase = { input: "", expected_output: "", is_public: false };
export default function Admin() {
  const [rows, setRows] = useState<Problem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState(empty);
  const [cases, setCases] = useState<TestCase[]>([]);
  const [caseId, setCaseId] = useState<number | null>(null);
  const [test, setTest] = useState(emptyCase);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    const d = await problemService.listProblems(page, 20);
    setRows(d.results);
    setPages(d.total_pages);
  }, [page]);
  useEffect(() => {
    load().catch((e) => setError(errorMessage(e)));
  }, [load]);
  const action = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const choose = (p: Problem) =>
    action(async () => {
      setSelected(p.id);
      setForm({
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        points: p.points,
      });
      setCases(await problemService.listTestCases(p.id));
      setCaseId(null);
      setTest(emptyCase);
    });
  const save = (e: FormEvent) => {
    e.preventDefault();
    action(async () => {
      const p = selected
        ? await problemService.updateProblem(selected, form)
        : await problemService.createProblem(form);
      setSelected(p.id);
      setForm({
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        points: p.points,
      });
      setCases(await problemService.listTestCases(p.id));
      await load();
      setNotice("Problem saved.");
    });
  };
  const saveCase = (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    action(async () => {
      if (caseId) await problemService.updateTestCase(selected, caseId, test);
      else await problemService.addTestCase(selected, test);
      setCases(await problemService.listTestCases(selected));
      setCaseId(null);
      setTest(emptyCase);
      setNotice("Test case saved.");
    });
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Problem management</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage problems, public samples, and private evaluation tests.
      </p>
      {error && (
        <p role="alert" className="my-4 text-destructive">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="my-4 text-success">
          {notice}
        </p>
      )}
      <fieldset
        disabled={busy}
        className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[280px_1fr]"
      >
        <aside className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelected(null);
              setForm(empty);
              setCases([]);
              setCaseId(null);
              setTest(emptyCase);
              setNotice("");
            }}
          >
            New problem
          </Button>
          <div className="rounded border bg-card">
            {rows.map((p) => (
              <button
                key={p.id}
                className={`block w-full border-b p-3 text-left text-sm last:border-0 hover:bg-muted ${selected === p.id ? "bg-muted" : ""}`}
                onClick={() => choose(p)}
              >
                {p.id}. {p.title}
              </button>
            ))}
            {!rows.length && (
              <p className="p-4 text-sm text-muted-foreground">
                No problems yet.
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              disabled={busy || page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="text-xs">
              {page} / {Math.max(pages, 1)}
            </span>
            <Button
              variant="outline"
              disabled={busy || page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </aside>
        <div className="min-w-0 space-y-6">
          <form
            onSubmit={save}
            className="space-y-4 rounded border bg-card p-5"
          >
            <h2 className="font-semibold">
              {selected ? `Edit problem #${selected}` : "Create problem"}
            </h2>
            <label className="block space-y-2 text-sm">
              <span>Title</span>
              <Input
                required
                maxLength={255}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Description and input/output format</span>
              <Textarea
                required
                rows={7}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>
            <div className="flex gap-5">
              <label className="space-y-2 text-sm">
                <span className="block">Difficulty</span>
                <select
                  className="rounded border bg-background p-2"
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      difficulty: e.target
                        .value as CreateProblemData["difficulty"],
                    })
                  }
                >
                  {["easy", "medium", "hard"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="block">Points</span>
                <Input
                  className="w-28"
                  type="number"
                  required
                  min={1}
                  value={form.points}
                  onChange={(e) =>
                    setForm({ ...form, points: Number(e.target.value) })
                  }
                />
              </label>
            </div>
            <div className="flex justify-between">
              <Button type="submit">
                {busy ? "Saving..." : "Save problem"}
              </Button>
              {selected && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Delete this problem, all its test cases, and submissions?",
                      )
                    )
                      action(async () => {
                        await problemService.deleteProblem(selected);
                        setSelected(null);
                        setForm(empty);
                        setCases([]);
                        setPage(1);
                        const firstPage = await problemService.listProblems(1, 20);
                        setRows(firstPage.results);
                        setPages(firstPage.total_pages);
                        setNotice("Problem deleted.");
                      });
                  }}
                >
                  Delete problem
                </Button>
              )}
            </div>
          </form>
          {selected && (
            <section className="space-y-4 rounded border bg-card p-5">
              <h2 className="font-semibold">Test cases</h2>
              <p className="text-xs text-muted-foreground">
                Only the first three public cases are shown as samples. Private
                cases are used for evaluation only.
              </p>
              {cases.map((tc, i) => (
                <div
                  key={tc.id}
                  className="flex items-start justify-between gap-3 rounded border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm">
                      Test {i + 1} · {tc.is_public ? "Public" : "Private"}
                    </p>
                    <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap break-words text-xs">
                      {tc.input || "(empty input)"}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCaseId(tc.id!);
                        setTest({
                          input: tc.input,
                          expected_output: tc.expected_output,
                          is_public: tc.is_public,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (window.confirm("Delete this test case?"))
                          action(async () => {
                            await problemService.deleteTestCase(
                              selected,
                              tc.id!,
                            );
                            setCases(
                              await problemService.listTestCases(selected),
                            );
                            if (caseId === tc.id) {
                              setCaseId(null);
                              setTest(emptyCase);
                            }
                          });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              <form className="space-y-3 border-t pt-4" onSubmit={saveCase}>
                <h3 className="text-sm font-medium">
                  {caseId ? `Edit test #${caseId}` : "Add test case"}
                </h3>
                <label className="block space-y-2 text-sm">
                  <span>Input (may be empty)</span>
                  <Textarea
                    rows={3}
                    value={test.input}
                    onChange={(e) =>
                      setTest({ ...test, input: e.target.value })
                    }
                  />
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Expected output</span>
                  <Textarea
                    rows={3}
                    value={test.expected_output}
                    onChange={(e) =>
                      setTest({ ...test, expected_output: e.target.value })
                    }
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={test.is_public}
                    onChange={(e) =>
                      setTest({ ...test, is_public: e.target.checked })
                    }
                  />
                  Public sample
                </label>
                <div className="flex gap-3">
                  <Button type="submit">Save test case</Button>
                  {caseId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCaseId(null);
                        setTest(emptyCase);
                      }}
                    >
                      Cancel edit
                    </Button>
                  )}
                </div>
              </form>
            </section>
          )}
        </div>
      </fieldset>
    </div>
  );
}
