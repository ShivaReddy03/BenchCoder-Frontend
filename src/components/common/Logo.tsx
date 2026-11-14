import { Link } from 'react-router-dom';

export const Logo = ({ withText = true }: { withText?: boolean }) => (
  <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">{'{}'}</span>
    {withText && <span className="text-[15px] tracking-tight">BenchCoder</span>}
  </Link>
);
