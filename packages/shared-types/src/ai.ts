import { BaseEntity } from './common.js';

export type AIGenerationType =
  | 'summary'
  | 'quiz'
  | 'assignment_help'
  | 'resume_analysis'
  | 'study_plan'
  | 'code_review';

export type AIGenerationStatus = 'queued' | 'processing' | 'complete' | 'failed';

export interface AIGeneration extends BaseEntity {
  userId: string;
  type: AIGenerationType;
  inputRef?: string | null;
  status: AIGenerationStatus;
  tokensUsed: number;
  modelUsed?: string | null;
  cached: boolean;
  error?: string | null;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tag?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  notes?: string;
}

export interface AISummaryResult {
  id: string;
  generationId: string;
  shortSummary?: string | null;
  detailedSummary?: string | null;
  keyConcepts?: string[] | null;
  flashcards?: Flashcard[] | null;
  mindMap?: MindMapNode | null;
}

export interface ResumeKeywordAnalysis {
  keyword: string;
  found: boolean;
  frequency?: number;
  importance?: 'high' | 'medium' | 'low';
}

export interface ResumeSuggestion {
  section: string;
  issue: string;
  recommendation: string;
  example?: string;
}

export interface AIResumeAnalysisResult {
  id: string;
  generationId: string;
  atsScore: number; // 0 - 100
  missingKeywords: string[];
  matchedKeywords?: ResumeKeywordAnalysis[];
  suggestions: ResumeSuggestion[];
  formattingScore?: number;
  grammarScore?: number;
}

export interface AICodeReviewFinding {
  line?: number;
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  suggestedFix?: string;
}

export interface AICodeReviewResult {
  generationId: string;
  summary: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  cleanlinessScore: number; // 0-100
  findings: AICodeReviewFinding[];
  refactoredCode?: string;
}

export interface AIAssignmentAnalysisResult {
  generationId: string;
  overallScore: number; // 0-100
  grammarErrors: {
    original: string;
    replacement: string;
    explanation: string;
    offset?: number;
  }[];
  readabilityLevel: string;
  citationSuggestions: {
    text: string;
    style: string;
    formattedCitation: string;
  }[];
}
