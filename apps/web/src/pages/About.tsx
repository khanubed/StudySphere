import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, Users, Shield, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full">
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Empowering Every Student with AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            StudySphere is the unified academic ecosystem designed to replace fragmented tools with
            intelligent notes summarization, automated quiz preparation, adaptive study plans, and career readiness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">AI-Powered Learning</h3>
            <p className="text-sm text-muted-foreground">
              Transform lectures, PDFs, and slide decks into smart summaries, flashcards, mind maps, and practice quizzes in seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Academic Resource Hub</h3>
            <p className="text-sm text-muted-foreground">
              Access verified peer notes, previous year question papers (PYQs), lab manuals, and syllabus resources curated by high achievers.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Alumni & Career Prep</h3>
            <p className="text-sm text-muted-foreground">
              Connect with verified alumni in top tech companies, receive 1-on-1 mentorship, and benchmark your resume with ATS scoring.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Faculty & Campus Synergy</h3>
            <p className="text-sm text-muted-foreground">
              Enable faculty to run engaging Live Quizzes, distribute course resources, and gain visibility into student academic trends.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to transform your study habits?</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Join thousands of students and educators building the future of learning on StudySphere.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
