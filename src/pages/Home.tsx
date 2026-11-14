import { Link } from "react-router-dom";
import { Code2, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="max-w-3xl py-20 md:py-28">
        <p className="mb-5 text-sm font-medium text-primary">
          Practice. Submit. Improve.
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          A place to sharpen
          <br />
          your problem-solving skills.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Solve coding challenges, test your ideas, and learn from clear
          execution results in a focused coding workspace.
        </p>
        <div className="mt-8 flex gap-3">
          <Button size="lg" asChild>
            <Link to={isAuthenticated ? "/problems" : "/register"}>
              {isAuthenticated ? "Start solving" : "Create account"}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to={isAuthenticated ? "/submissions" : "/login"}>
              {isAuthenticated ? "My submissions" : "Sign in"}
            </Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-6 border-t py-10 md:grid-cols-3">
        {[
          {
            icon: BookOpen,
            title: "Choose a challenge",
            text: "Browse problems by difficulty and find your next challenge.",
          },
          {
            icon: Code2,
            title: "Write and test",
            text: "Use Python or JavaScript and run your code against public samples.",
          },
          {
            icon: CheckCircle,
            title: "Review your results",
            text: "Submit against evaluation tests and inspect verdicts, timing, and diagnostics.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <Icon className="mb-4 h-5 w-5 text-primary" />
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {text}
            </p>
          </div>
        ))}
      </section>
      <footer className="border-t py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} BenchCoder
      </footer>
    </div>
  );
}
