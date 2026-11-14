import { cn } from '@/lib/utils';

const map: Record<string, string> = { easy: 'text-difficulty-easy', medium: 'text-difficulty-medium', hard: 'text-difficulty-hard' };
const label: Record<string, string> = { easy: 'Easy', medium: 'Med.', hard: 'Hard' };

export const DifficultyText = ({ value, full, className }: { value: string; full?: boolean; className?: string }) => {
  const v = value?.toLowerCase();
  return <span className={cn('text-sm font-medium', map[v], className)}>{full ? v?.charAt(0).toUpperCase() + v?.slice(1) : label[v] ?? value}</span>;
};

export const DifficultyPill = ({ value }: { value: string }) => {
  const v = value?.toLowerCase();
  return <span className={cn('rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium', map[v])}>{v?.charAt(0).toUpperCase() + v?.slice(1)}</span>;
};

export const verdictClass = (v: string) => (/accept/i.test(v) ? 'text-success' : /pending/i.test(v) ? 'text-muted-foreground' : 'text-destructive');
