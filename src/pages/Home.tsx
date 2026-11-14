import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, Database, GitBranch, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const SNIPPET = `class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, n in enumerate(nums):
            if target - n in seen:
                return [seen[target - n], i]
            seen[n] = i`;

const CARDS = [
  { icon: BookOpen, title: 'Explore', text: 'A well-organized path to master data structures and algorithms, one topic at a time.' },
  { icon: Code2, title: 'Practice', text: 'Hundreds of hand-picked problems with an in-browser editor and instant feedback.' },
  { icon: Trophy, title: 'Compete', text: 'Earn points for every accepted solution and track your progress over time.' },
];

const TOPICS = [
  { icon: GitBranch, name: 'Algorithms', count: 120 },
  { icon: Database, name: 'Data Structures', count: 86 },
  { icon: Code2, name: 'Dynamic Programming', count: 54 },
  { icon: BookOpen, name: 'Strings', count: 61 },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-medium text-primary">Practice. Submit. Improve.</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">A new way to<br />sharpen your code</h1>
            <p className="mt-5 max-w-md text-muted-foreground">BenchCoder is the place to practice coding problems, get judged instantly, and prepare for your next technical interview.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to={isAuthenticated ? '/problems' : '/register'}>{isAuthenticated ? 'Start solving' : 'Create account'}<ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/problems">Browse problems</Link></Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-4 py-2 text-xs text-muted-foreground">
              <span>1. Two Sum · <span className="text-difficulty-easy">Easy</span></span><span className="font-mono">Python3</span>
            </div>
            <pre className="overflow-x-auto p-4 text-[13px] leading-6"><code>{SNIPPET.split('\n').map((l, i) => (<div key={i}><span className="mr-4 inline-block w-4 select-none text-right text-muted-foreground">{i + 1}</span>{l}</div>))}</code></pre>
            <div className="flex items-center justify-between border-t px-4 py-2 text-sm">
              <span className="font-medium text-success">Accepted</span><span className="text-muted-foreground">Runtime 52 ms · Beats 91%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border bg-card p-6">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 mt-16 text-lg font-semibold">Popular topics</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {TOPICS.map(({ icon: Icon, name, count }) => (
            <Link key={name} to="/problems" className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div><div className="text-sm font-medium">{name}</div><div className="text-xs text-muted-foreground">{count} problems</div></div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} BenchCoder</footer>
    </div>
  );
}
