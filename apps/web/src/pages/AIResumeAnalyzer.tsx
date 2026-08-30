import React, { useState } from 'react';
import { useAnalyzeResumeMutation } from '../store/api/aiApi';
import { Sparkles, FileText, AlertTriangle } from 'lucide-react';

export const AIResumeAnalyzer: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [analyzeResume, { data, isLoading }] = useAnalyzeResumeMutation();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    await analyzeResume({
      rawText,
      targetRole,
    });
  };

  const result = data?.data?.result;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Resume Analyzer & ATS Scorer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Scan your resume against real tech industry job descriptions, uncover missing keywords, and optimize ATS ranking.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="targetRole" className="block text-sm font-medium mb-1.5">
                Target Role / Job Title
              </label>
              <input
                id="targetRole"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer Intern, Data Analyst"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="resumeText" className="block text-sm font-medium mb-1.5">
                Paste Resume Text
              </label>
              <textarea
                id="resumeText"
                rows={10}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste experience bullets, project descriptions, and technical skills..."
                className="w-full p-3.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !rawText.trim()}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Computing ATS Score...' : 'Analyze Resume'}
            </button>
          </form>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="font-semibold text-sm border-b border-border pb-3">ATS Score & Keyword Feedback</h3>

          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Evaluating keyword density and impact verbs...</p>
            </div>
          ) : result ? (
            <div className="space-y-4 text-sm">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase text-muted-foreground">Estimated ATS Match</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Target: {targetRole}</p>
                </div>
                <span className="text-4xl font-extrabold text-primary">{result.atsScore}%</span>
              </div>

              {result.missingKeywords && result.missingKeywords.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs uppercase text-amber-500 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Missing High-Impact Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestions && result.suggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-semibold text-xs uppercase text-muted-foreground">Actionable Recommendations</h4>
                  {result.suggestions.map((sug, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border bg-background space-y-1">
                      <p className="font-semibold text-xs text-foreground">{sug.section}: {sug.issue}</p>
                      <p className="text-xs text-muted-foreground">{sug.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground text-sm">
              <FileText className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p>Resume evaluation will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
