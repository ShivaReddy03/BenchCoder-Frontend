import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export const AuthCard = ({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) => (
  <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
    <div className="absolute right-4 top-4"><ThemeToggle /></div>
    <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-sm">
      <div className="mb-8 flex justify-center"><Logo /></div>
      {children}
      <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
    </div>
  </div>
);
