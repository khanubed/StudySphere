import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Calendar, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">S</div>
          <span className="font-bold text-xl tracking-tight">StudySphere</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
          <Link to="/register" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-4 py-2 rounded-button transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight md:text-6xl text-foreground">
          The Single AI Platform For Your <span className="text-primary">Academic Journey</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
          Centralize notes, auto-generate quizzes, build AI-driven study calendars, optimize your resume, and connect with verified alumni.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link to="/register" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-3 rounded-button flex items-center gap-2 transition-all">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold px-6 py-3 rounded-button transition-all">
            Demo Logins
          </Link>
        </div>
      </section>

      {/* Grid Features */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border p-6 rounded-card bg-muted/20 space-y-4">
          <div className="p-3 bg-primary/10 w-fit rounded-lg text-primary"><Brain className="w-6 h-6" /></div>
          <h3 className="text-lg font-bold">AI Summaries & Quizzes</h3>
          <p className="text-sm text-muted-foreground font-medium">Upload slides or notes, get instant summaries, mindmaps, and interactive practice tests.</p>
        </div>
        <div className="border border-border p-6 rounded-card bg-muted/20 space-y-4">
          <div className="p-3 bg-primary/10 w-fit rounded-lg text-primary"><BookOpen className="w-6 h-6" /></div>
          <h3 className="text-lg font-bold">Verified Resource Hub</h3>
          <p className="text-sm text-muted-foreground font-medium">Share resources and get contributor points. Moderated by faculty to keep content clean.</p>
        </div>
        <div className="border border-border p-6 rounded-card bg-muted/20 space-y-4">
          <div className="p-3 bg-primary/10 w-fit rounded-lg text-primary"><Calendar className="w-6 h-6" /></div>
          <h3 className="text-lg font-bold">Smart Planner</h3>
          <p className="text-sm text-muted-foreground font-medium">AI generated daily study plans that adjust dynamically to your exam schedule.</p>
        </div>
      </section>
    </div>
  );
};
