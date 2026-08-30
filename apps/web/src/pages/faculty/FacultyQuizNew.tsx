import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFacultyQuizMutation } from '../../store/api/facultyApi';
import { Sparkles } from 'lucide-react';

export const FacultyQuizNew: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [createQuiz, { isLoading }] = useCreateFacultyQuizMutation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createQuiz({
      title,
      subjectId: subjectId || 'dbms-101',
    });
    navigate('/faculty');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI-Assisted Assessment Creator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate structured multiple choice, short-answer, and conceptual quizzes for your classes.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="assessmentTitle" className="block text-sm font-medium mb-1.5">
              Assessment Title
            </label>
            <input
              id="assessmentTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm Evaluation — Database Systems Unit 1-3"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="subjectCode" className="block text-sm font-medium mb-1.5">
              Course / Subject Code
            </label>
            <input
              id="subjectCode"
              type="text"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              placeholder="e.g. CS-301"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Creating Assessment...' : 'Generate & Publish Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};
