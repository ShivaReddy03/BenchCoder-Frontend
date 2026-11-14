import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { errorMessage } from '@/services/api';
import { AuthCard } from '@/components/common/AuthCard';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/problems');
    } catch (err) {
      toast({ title: 'Sign in failed', description: errorMessage(err, 'Invalid username or password'), variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <AuthCard footer={<>Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign In</Button>
      </form>
    </AuthCard>
  );
}
