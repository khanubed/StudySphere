import React, { useState } from 'react';
import { useSummarizeNotesMutation } from '../store/api/aiApi';
import { Sparkles, FileText, List, Layers, Copy, Check } from 'lucide-react';

export const AISummarizer: React.FC = () => {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState<'short' | 'detailed' | 'flashcards' | 'mindmap'>('short');
  const [copied, setCopied] = useState(false);
  const [summarizeNotes, { data, isLoading }] = useSummarizeNotesMutation();

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await summarizeNotes({
      content,
      format,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const result = data?.data?.result;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Notes Summarizer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste lecture transcripts, textbook passages, or slides to extract smart summaries, flashcards, and key concepts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Input form */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <form onSubmit={handleSummarize} className="space-y-4">
            <div>
              <label htmlFor="notesInput" className="block text-sm font-medium mb-1.5">
                Paste Study Material / Notes
              </label>
              <textarea
                id="notesInput"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste paragraphs of text, lecture notes, or syllabus content..."
                className="w-full p-3.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Output Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'short', label: 'Key Takeaways', icon: List },
                  { key: 'detailed', label: 'Full Summary', icon: FileText },
                  { key: 'flashcards', label: 'Flashcards', icon: Layers },
                  { key: 'mindmap', label: 'Concept Map', icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = format === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setFormat(item.key as any)}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Generating AI Summary...' : 'Summarize Notes'}
            </button>
          </form>
        </div>

        {/* Results output */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm min-h-[400px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="font-semibold text-sm">Generated Output</h3>
              {result && (
                <button
                  onClick={() =>
                    handleCopy(
                      result.shortSummary ||
                        result.detailedSummary ||
                        JSON.stringify(result.flashcards) ||
                        ''
                    )
                  }
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-primary animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Synthesizing concepts & generating summary...</p>
              </div>
            ) : result ? (
              <div className="space-y-4 text-sm leading-relaxed">
                {result.shortSummary && (
                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <p className="font-medium mb-1 text-primary">Summary</p>
                    <p>{result.shortSummary}</p>
                  </div>
                )}

                {result.keyConcepts && (
                  <div>
                    <h4 className="font-semibold text-xs uppercase text-muted-foreground mb-2">
                      Key Concepts
                    </h4>
                    <ul className="space-y-1.5">
                      {result.keyConcepts.map((concept, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.flashcards && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-xs uppercase text-muted-foreground mb-2">
                      Generated Flashcards
                    </h4>
                    {result.flashcards.map((fc, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-border bg-background space-y-1">
                        <p className="font-semibold text-xs text-primary">Q: {fc.front}</p>
                        <p className="text-xs text-muted-foreground">A: {fc.back}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-muted-foreground text-sm space-y-1">
                <FileText className="w-8 h-8 mx-auto opacity-40 mb-2" />
                <p>Summary output will appear here</p>
                <p className="text-xs opacity-70">Enter text on the left and click Summarize</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
