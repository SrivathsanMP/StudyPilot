import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, BookOpen, Users, Sparkles, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // Error is handled in context
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDR2MmgtMnYyaDJ2LTJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-display font-bold">StudyPilot</h1>
          </div>

          <h2 className="text-3xl xl:text-4xl font-display font-bold mb-6 leading-tight">
            Empowering Teachers,<br />
            Transforming Education
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-md">
            AI-powered tools designed for teachers handling multiple grades in under-resourced classrooms.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-primary-foreground/90">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-medium">Generate lesson plans instantly</span>
            </div>
            <div className="flex items-center gap-4 text-primary-foreground/90">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-medium">Manage Grades 1-12 effortlessly</span>
            </div>
            <div className="flex items-center gap-4 text-primary-foreground/90">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-medium">Multi-language content support</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gradient-primary">StudyPilot</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive animate-scale-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="teacher@studypilot.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                className="h-12 rounded-lg border-2 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                className="h-12 rounded-lg border-2 focus:border-primary"
                required
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo Credentials:</strong><br />
              Email: <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">teacher@studypilot.com</code><br />
              Password: <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
