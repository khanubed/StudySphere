import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { ResourceType } from '@studysphere/shared-types';
import {
  useSubmitResourceMutation,
  useValidateDriveUrlMutation,
  DriveValidationResult,
} from '../store/api/resourceApi';

export const ResourceUpload: React.FC = () => {
  const navigate = useNavigate();
  const [submitResource, { isLoading: isSubmitting }] = useSubmitResourceMutation();
  const [validateDrive, { isLoading: isValidating }] = useValidateDriveUrlMutation();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('notes');
  const [subjectId, setSubjectId] = useState('CS-301 Database Systems');
  const [semester, setSemester] = useState<number>(5);
  const [driveUrl, setDriveUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [description, setDescription] = useState('');

  // Validation State
  const [validationResult, setValidationResult] = useState<DriveValidationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleValidateUrl = async (urlToTest: string) => {
    if (!urlToTest.trim()) {
      setValidationResult(null);
      setValidationError(null);
      return;
    }

    setValidationError(null);
    try {
      const res = await validateDrive({ url: urlToTest }).unwrap();
      if (res && res.data && res.data.isValid) {
        setValidationResult(res.data);
      } else {
        setValidationResult(null);
        setValidationError(res?.data?.error || 'Invalid Google Drive link format.');
      }
    } catch {
      setValidationError('Could not verify Drive link. Please check permissions.');
    }
  };

  const handleDriveUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDriveUrl(val);
    if (val.includes('drive.google.com')) {
      handleValidateUrl(val);
    } else {
      setValidationResult(null);
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl || !title || !description) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    try {
      await submitResource({
        title,
        type,
        subjectId,
        semester,
        driveLink: driveUrl,
        tags: tags.length > 0 ? tags : ['Curriculum'],
        description,
      }).unwrap();

      setSubmittedSuccess(true);
      setTimeout(() => {
        navigate('/resources/my-resources');
      }, 2000);
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* ── BREADCRUMB ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3 font-mono text-xs text-graphite">
        <div className="flex items-center gap-2">
          <Link to="/resources" className="hover:text-quad transition-colors">
            LIBRARY CATALOG
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">SUBMIT ACADEMIC RECORD</span>
        </div>

        <span className="text-quad font-bold">GOOGLE DRIVE FIRST ARCHITECTURE</span>
      </div>

      {submittedSuccess ? (
        <div className="p-8 rounded-md border border-quad bg-paper text-center space-y-4 max-w-lg mx-auto my-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-quad/10 border border-quad/30 flex items-center justify-center text-quad mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-ink">
              Submission Queued in Ledger
            </h2>
            <p className="font-sans text-xs text-graphite leading-relaxed">
              Your resource <span className="font-semibold text-ink">"{title}"</span> has been submitted to the faculty moderation committee. Turnaround is typically 24 hours.
            </p>
          </div>

          <div className="p-3 bg-secondary/20 rounded-[4px] border border-border font-mono text-[11px] text-graphite">
            STATUS: <span className="text-marker font-bold uppercase">PENDING FACULTY REVIEW</span>
          </div>

          <p className="font-mono text-[10px] text-graphite">
            Redirecting to My Submissions...
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Form Ledger (8 cols) */}
          <div className="lg:col-span-8 bg-paper border border-border rounded-md p-6 space-y-5">
            <div className="border-b border-border/60 pb-3">
              <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
                01 — SUBMISSION PROTOCOL
              </span>
              <h2 className="font-display text-xl font-bold text-ink mt-0.5">
                Contribute Course Notes or Solved PYQs
              </h2>
              <p className="font-body text-xs text-graphite mt-1">
                StudySphere uses zero-storage cloud sync. Upload files to your Google Drive and share the public link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Field 1: Title */}
              <div>
                <label className="block font-mono text-xs font-bold text-graphite uppercase mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CS-301 DBMS Normalization (1NF to BCNF) Master Handout"
                  className="w-full bg-secondary/15 border border-border rounded-md px-3.5 py-2 font-sans text-xs text-ink placeholder:text-graphite focus:outline-none focus:border-quad transition-colors"
                />
              </div>

              {/* Field 2: Category & Semester */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-graphite uppercase mb-1">
                    Category Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ResourceType)}
                    className="w-full bg-paper border border-border rounded-md px-3 py-2 font-mono text-xs text-ink focus:outline-none focus:border-quad"
                  >
                    <option value="notes">Lecture Notes</option>
                    <option value="pyq">Solved Question Paper (PYQ)</option>
                    <option value="book">Reference Book / Guide</option>
                    <option value="lab_manual">Lab Manual / Code Packet</option>
                    <option value="research_paper">Research Paper Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-graphite uppercase mb-1">
                    Semester Level *
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full bg-paper border border-border rounded-md px-3 py-2 font-mono text-xs text-ink focus:outline-none focus:border-quad"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem} (Year {Math.ceil(sem / 2)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 3: Subject & Code */}
              <div>
                <label className="block font-mono text-xs font-bold text-graphite uppercase mb-1">
                  Subject & Course Code *
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full bg-paper border border-border rounded-md px-3 py-2 font-mono text-xs text-ink focus:outline-none focus:border-quad"
                >
                  <option value="CS-301 Database Systems">CS-301 Database Systems</option>
                  <option value="CS-302 Algorithms">CS-302 Algorithms</option>
                  <option value="CS-303 Operating Systems">CS-303 Operating Systems</option>
                  <option value="CS-304 Computer Networks">CS-304 Computer Networks</option>
                  <option value="CS-305 Software Engineering">CS-305 Software Engineering</option>
                  <option value="CS-306 Web Technologies">CS-306 Web Technologies</option>
                </select>
              </div>

              {/* Field 4: Google Drive Link & Live Validator */}
              <div className="space-y-2">
                <label className="block font-mono text-xs font-bold text-graphite uppercase mb-1">
                  Google Drive Shareable Link *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={driveUrl}
                    onChange={handleDriveUrlChange}
                    placeholder="https://drive.google.com/file/d/1A2b3C.../view?usp=sharing"
                    className={`w-full bg-secondary/15 border rounded-md px-3.5 py-2 font-mono text-xs text-ink placeholder:text-graphite focus:outline-none transition-colors ${
                      validationResult
                        ? 'border-quad bg-quad/5'
                        : validationError
                        ? 'border-destructive bg-destructive/5'
                        : 'border-border focus:border-quad'
                    }`}
                  />
                  {isValidating && (
                    <span className="absolute right-3 top-2.5 font-mono text-[10px] text-graphite animate-pulse">
                      Validating...
                    </span>
                  )}
                </div>

                {/* Validation Status Panel */}
                {validationResult && (
                  <div className="p-3 bg-quad/10 border border-quad/40 rounded-md space-y-1.5 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-quad font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Drive Link Valid & Public Access Confirmed</span>
                    </div>
                    <div className="text-[11px] text-graphite space-y-0.5 pt-1 border-t border-quad/20">
                      <div>File: <span className="text-ink font-semibold">{validationResult.fileName}</span></div>
                      <div>Size: <span className="text-ink">{validationResult.fileSizeFormatted}</span> · Format: <span className="text-ink">{validationResult.mimeType}</span></div>
                    </div>
                  </div>
                )}

                {validationError && (
                  <div className="p-3 bg-marker/15 border border-marker/50 rounded-md space-y-1 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-ink font-bold">
                      <AlertTriangle className="w-4 h-4 text-marker" />
                      <span>Drive Link Access Notice</span>
                    </div>
                    <p className="text-[11px] text-graphite leading-relaxed">
                      {validationError} Make sure your Google Drive link permission is set to <span className="font-semibold text-ink">"Anyone with the link can view"</span>.
                    </p>
                  </div>
                )}
              </div>

              {/* Field 5: Curriculum Tags */}
              <div>
                <label className="block font-mono text-xs font-bold text-graphite uppercase mb-1">
                  Curriculum Topic Tags (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Normalization, BCNF, RelationalAlgebra, MidtermPrep"
                  className="w-full bg-secondary/15 border border-border rounded-md px-3.5 py-2 font-sans text-xs text-ink placeholder:text-graphite focus:outline-none focus:border-quad transition-colors"
                />
              </div>

              {/* Field 6: Description */}
              <div>
                <label className="block font-mono text-xs font-bold text-graphite uppercase mb-1">
                  Academic Description & Syllabus Coverage *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the topics, proofs, solved questions, and chapters included in this document (min 30 characters)..."
                  className="w-full bg-secondary/15 border border-border rounded-md p-3 font-sans text-xs text-ink placeholder:text-graphite focus:outline-none focus:border-quad transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-border/60">
                <button
                  type="submit"
                  disabled={isSubmitting || !driveUrl || !title}
                  className="w-full py-3 rounded-md bg-quad text-paper font-mono text-xs font-bold hover:bg-quad/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Recording in Ledger...' : 'Submit for Faculty Verification'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Google Drive Guidelines (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Guide Card */}
            <div className="p-4 bg-paper border border-border rounded-md space-y-3">
              <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider block border-b border-border/60 pb-2">
                HOW TO SHARE FROM DRIVE
              </span>

              <ol className="space-y-2.5 font-sans text-xs text-ink list-decimal list-inside leading-relaxed">
                <li>Upload your PDF or slides to your personal or university Google Drive.</li>
                <li>Right-click the file and choose <span className="font-semibold text-quad">Share</span>.</li>
                <li>Under General Access, set to <span className="font-semibold text-quad">"Anyone with the link"</span>.</li>
                <li>Set role to <span className="font-semibold text-quad">Viewer</span>.</li>
                <li>Click <span className="font-semibold text-quad">Copy link</span> and paste it into the field on the left.</li>
              </ol>
            </div>

            {/* Academic Honor Code Card */}
            <div className="p-4 bg-paper border border-border rounded-md space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-graphite uppercase">
                <ShieldCheck className="w-4 h-4 text-quad" />
                <span>ACADEMIC INTEGRITY CODE</span>
              </div>
              <p className="font-body text-[11px] text-graphite leading-relaxed">
                By submitting, you confirm that this material does not infringe copyright or university examination confidentiality rules. Contributors earn verified points upon approval.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

