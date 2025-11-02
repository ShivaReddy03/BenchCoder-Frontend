import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Code2, Loader2 } from 'lucide-react';
import { AuthScene3D } from '@/components/3d/AuthScene3D';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in.',
      });
      navigate('/problems');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthScene3D />
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in relative z-10">
        <div className="w-full max-w-md portal-float">{/* Add floating animation */}
          <div className="text-center mb-10">
            {/* Gradient Icon with glow */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 shadow-lg shadow-blue-500/50 mb-5 relative overflow-hidden group transition-all duration-300 hover:shadow-blue-500/70">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-50 group-hover:opacity-70 transition-opacity" />
              <Code2 className="w-12 h-12 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Gradient Text Title */}
            <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-700">
              Enter the Gateway
            </h1>

            {/* Subtext */}
            <p className="text-muted-foreground text-sm sm:text-base">
              Access your coding dimension
            </p>
          </div>

          <Card className="glass-panel shadow-glow border-border/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground/90">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="auth-input bg-background/50 border-primary/30 focus:border-primary focus:shadow-glow transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/90">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="auth-input bg-background/50 border-primary/30 focus:border-primary focus:shadow-glow transition-all duration-300"
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary shadow-glow hover:shadow-glow-intense transition-all duration-300"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Entering Gateway...' : 'Enter Gateway'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Don't have access?"}{' '}
                <Link to="/register" className="text-primary hover:underline hover:text-primary-glow transition-colors">
                  Request Entry
                </Link>
              </p>
            </form>
          </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
