import React, { useState } from 'react';
import { useAssistAssignmentMutation } from '../store/api/aiApi';
import { BookOpen, Sparkles } from 'lucide-react';

export const AIAssignmentHelper: React.FC = () => {
  const [text, setText] = useState('');
  const [citationStyle, setCitationStyle] = useState('IEEE');
  const [assistAssignment, { data, isLoading }] = useAssistAssignmentMutation();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await assistAssignment({
      text,
      citationStyle,
    });
  };

  const result = data?.data?.result;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assignment Helper</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Writing analysis, grammar inspection, academic style recommendations, and automated IEEE/APA citations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="assignmentDraft" className="block text-sm font-medium mb-1.5">
                Assignment Draft
              </label>
              <textarea
                id="assignmentDraft"
                rows={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your assignment paragraphs, essay sections, or lab report text..."
                className="w-full p-3.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label htmlFor="citationStyle" className="block text-sm font-medium mb-1.5">
                Target Citation Style
              </label>
              <select
                id="citationStyle"
                value={citationStyle}
                onChange={(e) => setCitationStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="IEEE">IEEE Format</option>
                <option value="APA">APA 7th Edition</option>
                <option value="MLA">MLA 9th Edition</option>
                <option value="Harvard">Harvard Referencing</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Analyzing Assignment...' : 'Review & Check Citations'}
            </button>
          </form>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="font-semibold text-sm border-b border-border pb-3">AI Analysis & Suggestions</h3>

          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Evaluating academic tone and citations...</p>
            </div>
          ) : result ? (
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                <span className="font-semibold">Academic Quality Score</span>
                <span className="text-2xl font-extrabold text-primary">{result.overallScore}/100</span>
              </div>

              {result.grammarErrors && result.grammarErrors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs uppercase text-muted-foreground">Grammar & Style Fixes</h4>
                  {result.grammarErrors.map((err, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border bg-background space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="line-through text-rose-500">{err.original}</span>
                        <span>→</span>
                        <span className="text-emerald-600 font-semibold">{err.replacement}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{err.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.citationSuggestions && result.citationSuggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-semibold text-xs uppercase text-muted-foreground">Citation Suggestions</h4>
                  {result.citationSuggestions.map((cit, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/40 border border-border text-xs font-mono">
                      {cit.formattedCitation}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground text-sm">
              <BookOpen className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p>Analysis feedback will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
