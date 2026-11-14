import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Flame, LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './common/Logo';
import { ThemeToggle } from './common/ThemeToggle';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/problems', label: 'Problems' },
  { to: '/submissions', label: 'Submissions' },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isWorkspace = pathname.startsWith('/problem/');
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const links = isAdmin ? [...NAV, { to: '/admin', label: 'Admin' }] : NAV;

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn('relative flex h-full items-center px-1 text-sm transition-colors hover:text-foreground', isActive ? 'text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground' : 'text-muted-foreground');

  return (
    <div className={cn('flex flex-col bg-background', isWorkspace ? 'h-screen' : 'min-h-screen')}>
      {!isAuthPage && (
        <header className="sticky top-0 z-40 h-12 shrink-0 border-b bg-card">
          <div className={cn('mx-auto flex h-full items-center gap-6 px-4', !isWorkspace && 'max-w-7xl')}>
            <Logo />
            <nav className="hidden h-full items-center gap-5 md:flex">
              {links.map((l) => <NavLink key={l.to} to={l.to} className={linkCls}>{l.label}</NavLink>)}
            </nav>
            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <span className="hidden items-center gap-1 px-2 text-sm text-muted-foreground sm:flex"><Flame className="h-4 w-4 text-primary" />3</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold uppercase" aria-label="Account">
                        {user?.username?.[0] ?? <User className="h-4 w-4" />}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuLabel><div className="font-semibold">{user?.username}</div><div className="text-xs font-normal text-muted-foreground">{user?.email}</div></DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/submissions')}>Submissions</DropdownMenuItem>
                      {isAdmin && <DropdownMenuItem onClick={() => navigate('/admin')}>Admin</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden items-center gap-1 sm:flex">
                  <Button variant="ghost" size="sm" asChild><Link to="/register">Register</Link></Button>
                  <span className="text-muted-foreground">or</span>
                  <Button variant="ghost" size="sm" asChild><Link to="/login">Sign in</Link></Button>
                </div>
              )}
              <Sheet>
                <SheetTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" aria-label="Menu"><Menu className="h-4 w-4" /></Button></SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="mt-8 flex flex-col gap-1">
                    {links.map((l) => <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('rounded-md px-3 py-2 text-sm', isActive ? 'bg-secondary font-medium' : 'text-muted-foreground')}>{l.label}</NavLink>)}
                    {!isAuthenticated && <><Link to="/login" className="rounded-md px-3 py-2 text-sm">Sign in</Link><Link to="/register" className="rounded-md px-3 py-2 text-sm">Register</Link></>}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )}
      <main className={cn('flex-1', isWorkspace && 'min-h-0')}>{children}</main>
    </div>
  );
};
