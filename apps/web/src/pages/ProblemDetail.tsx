import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReviewCodeAIMutation } from '../store/api/aiApi';
import { ArrowLeft, Sparkles, Code2 } from 'lucide-react';

export const ProblemDetail: React.FC = () => {
  const { trackSlug, topicSlug, problemSlug } = useParams();
  const [code, setCode] = useState(
    `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`
  );
  const [reviewCode, { data, isLoading }] = useReviewCodeAIMutation();

  const handleReview = async () => {
    await reviewCode({
      code,
      language: 'javascript',
      problemId: problemSlug || 'two-sum',
    });
  };

  const result = data?.data?.result;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link
        to="/coding"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tracks
      </Link>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Problem description */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-500 uppercase">Easy</span>
            <h1 className="text-2xl font-bold tracking-tight">Two Sum Problem</h1>
            <p className="text-xs text-muted-foreground">
              Track: {trackSlug || 'dsa'} / {topicSlug || 'arrays'}
            </p>
          </div>

          <div className="text-sm space-y-3 leading-relaxed border-t border-border pt-4">
            <p>
              Given an array of integers <code className="bg-muted px-1.5 py-0.5 rounded text-xs">nums</code> and an integer <code className="bg-muted px-1.5 py-0.5 rounded text-xs">target</code>, return indices of the two numbers such that they add up to target.
            </p>
            <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
          </div>

          {result && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2 mt-4">
              <h3 className="font-semibold text-xs uppercase text-primary">AI Code Review Score</h3>
              <div className="flex items-center justify-between text-xs">
                <span>Time Complexity: {result.timeComplexity || 'O(N)'}</span>
                <span>Space Complexity: {result.spaceComplexity || 'O(N)'}</span>
              </div>
              <p className="text-xs text-foreground/90">{result.summary}</p>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> Solution Editor (JavaScript)
              </span>
            </div>

            <textarea
              rows={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 rounded-xl border border-input bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleReview}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Running AI Code Review...' : 'Submit & Review with AI'}
          </button>
        </div>
      </div>
    </div>
  );
};
