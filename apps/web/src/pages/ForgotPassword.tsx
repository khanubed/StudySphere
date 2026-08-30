import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full p-8 border border-border rounded-2xl bg-card shadow-lg">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground gap-2 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we will send password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
            <h2 className="font-semibold text-foreground">Reset Link Sent</h2>
            <p className="text-xs text-muted-foreground">
              If an account with <span className="font-medium text-foreground">{email}</span> exists,
              you will receive a password reset link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm shadow-sm"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
