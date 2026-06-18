import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Sun } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      
      // Parse JWT payload for role and email
      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setAuth(token, payload.role, payload.email);
      
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg" style={{background:'linear-gradient(135deg, #f59e0b, #ef4444)'}}>
            <Sun className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">SolarOps Cloud</CardTitle>
          <CardDescription>Solar Farm Management Platform — Enter your credentials to access the operations center</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@solarops.cloud" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
