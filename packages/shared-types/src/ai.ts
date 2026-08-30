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

export type SummaryDepth = 'quick' | 'standard' | 'detailed';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tag?: string;
  mastered?: boolean;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  notes?: string;
  tag?: string;
}

export interface FormulaEntry {
  id: string;
  title: string;
  latex: string;
  explanation: string;
  variables: { symbol: string; name: string; unit?: string }[];
}

export interface KeyConceptEntry {
  term: string;
  definition: string;
  examRelevance: 'high' | 'medium' | 'low';
  pageReference?: number;
}

export interface ImportantQuestion {
  id: string;
  type: 'short' | 'long' | 'viva';
  question: string;
  marks?: number;
  modelAnswer: string;
  keyPoints: string[];
}

export interface AISummarizerSession extends BaseEntity {
  userId: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  totalPages: number;
  wordCount: number;
  depth: SummaryDepth;
  tokensUsed: number;
  shortSummary: string;
  detailedSummary: string;
  keyConcepts: KeyConceptEntry[];
  formulas: FormulaEntry[];
  flashcards: Flashcard[];
  questions: ImportantQuestion[];
  mindMap: MindMapNode;
  status: 'completed' | 'processing' | 'failed';
}

export interface PreflightEstimateResult {
  fileName: string;
  totalPages: number;
  wordCount: number;
  depth: SummaryDepth;
  estimatedTokens: number;
  currentBalance: number;
  canAfford: boolean;
}

export interface AISummaryResult {
  id: string;
  generationId: string;
  shortSummary?: string | null;
  detailedSummary?: string | null;
  keyConcepts?: KeyConceptEntry[] | string[] | null;
  formulas?: FormulaEntry[] | null;
  flashcards?: Flashcard[] | null;
  questions?: ImportantQuestion[] | null;
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

// ── AI ASSIGNMENT HELPER & ACADEMIC WRITING STUDIO TYPES ─────────────────────

export type IssueCategory = 'grammar' | 'style' | 'tone' | 'spelling';
export type CitationStyleType = 'APA' | 'MLA' | 'IEEE';

export interface GrammarIssue {
  id: string;
  line: number;
  originalText: string;
  suggestedText: string;
  category: IssueCategory;
  explanation: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CitationItem {
  id: string;
  rawText: string;
  formattedText: string;
  style: CitationStyleType;
  missingFields?: string[];
  isValid: boolean;
}

export interface WritingScore {
  overall: number; // 0-100
  readability: number;
  clarity: number;
  grammar: number;
  tone: number;
  structure: number;
}

export interface StructureOutlineNode {
  section: string;
  status: 'found' | 'missing';
  recommendation?: string;
}

export interface AssignmentAnalysisReport extends BaseEntity {
  title: string;
  rawText: string;
  wordCount: number;
  readingTimeMinutes: number;
  tokensUsed: number;
  citationStyle: CitationStyleType;
  writingScore: WritingScore;
  grammarIssues: GrammarIssue[];
  citations: CitationItem[];
  structureOutline: StructureOutlineNode[];
}

export interface AssignmentAnalyzeRequest {
  text?: string;
  fileUrl?: string;
  fileName?: string;
  citationStyle?: CitationStyleType;
  analysisTypes?: ('grammar' | 'tone' | 'citations' | 'structure')[];
}

export interface AIAssignmentAnalysisResult {
  generationId: string;
  report: AssignmentAnalysisReport;
}
