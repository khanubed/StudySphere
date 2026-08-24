import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@studysphere/shared-schemas';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials, updateTokenUsage } from '../store/authSlice';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const isFaculty = data.email.startsWith('faculty');
      const isAdmin = data.email.startsWith('admin');

      dispatch(
        setCredentials({
          id: 'user-uuid-1',
          email: data.email,
          name: data.email.split('@')[0],
          role: isFaculty ? 'faculty' : isAdmin ? 'admin' : 'student',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
      dispatch(
        updateTokenUsage({
          used: 42,
          limit: 100,
        })
      );
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const fillDemo = (role: string) => {
    setValue('email', `${role}@studysphere.edu`);
    setValue('password', 'password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full border border-border p-8 rounded-card bg-muted/10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
          <p className="text-sm text-muted-foreground">Sign in to your academic space</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="w-full border border-border rounded-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="you@university.edu"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full border border-border rounded-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded-button hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted-foreground text-xs font-bold uppercase">Quick Demo Logins</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => fillDemo('student')}
            className="border border-border rounded-button text-xs py-1.5 hover:bg-muted font-medium transition-colors"
          >
            Student Account
          </button>
          <button
            onClick={() => fillDemo('faculty')}
            className="border border-border rounded-button text-xs py-1.5 hover:bg-muted font-medium transition-colors"
          >
            Faculty Account
          </button>
        </div>

        <div className="text-center text-xs font-medium text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
