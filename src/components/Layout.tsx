import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50 transform group-hover:scale-105 transition-all duration-300">
              {/* Inner shadow for depth */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent to-white/10"></div>
              <Code2 className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500">
              BenchCoder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link to="/problems" className="text-muted-foreground hover:text-foreground transition-colors">
                  Problems
                </Link>
                <Link to="/submissions" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Submissions
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gradient-primary">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {isAuthenticated && (
                <>
                  <Link 
                    to="/problems" 
                    className="text-muted-foreground hover:text-foreground transition-colors p-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Problems
                  </Link>
                  <Link 
                    to="/submissions" 
                    className="text-muted-foreground hover:text-foreground transition-colors p-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Submissions
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-muted-foreground hover:text-foreground transition-colors p-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center gap-2 p-2 mt-2 border-t border-border">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{user?.username}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full gradient-primary">Register</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-card/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>BenchCoder © 2025 - Master Your Coding Skills</p>
        </div>
      </footer>
    </div>
  );
};
