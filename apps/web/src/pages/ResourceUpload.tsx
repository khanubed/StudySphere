import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUploadResourceMutation } from '../store/api/resourceApi';
import { ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';
import { ResourceType } from '@studysphere/shared-types';

export const ResourceUpload: React.FC = () => {
  const navigate = useNavigate();
  const [uploadResource, { isLoading }] = useUploadResourceMutation();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('notes');
  const [subjectId, setSubjectId] = useState('dbms-101');
  const [description, setDescription] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await uploadResource({
        title,
        type,
        subjectId,
        description,
        driveLink: driveLink || undefined,
      }).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
    } catch {
      // Handle error
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Resources
      </Link>

      <div className="p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Resource</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Share study notes, previous year question papers, or books with your campus community.
          </p>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-semibold text-foreground">Upload Successful!</h3>
            <p className="text-xs text-muted-foreground">
              Your resource has been submitted and is pending moderation review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                Resource Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unit 3 Database Normalization Handwritten Notes"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="resourceType" className="block text-sm font-medium mb-1.5">
                  Category Type
                </label>
                <select
                  id="resourceType"
                  value={type}
                  onChange={(e) => setType(e.target.value as ResourceType)}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="notes">Lecture Notes</option>
                  <option value="pyq">PYQ / Exam Paper</option>
                  <option value="book">Reference Book</option>
                  <option value="lab_manual">Lab Manual</option>
                  <option value="assignment">Assignment Solution</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  placeholder="Subject code or name"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="driveLink" className="block text-sm font-medium mb-1.5">
                Google Drive or Cloud Document Link
              </label>
              <input
                id="driveLink"
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1.5">
                Description & Key Topics Covered
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly explain what is included in this document..."
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Uploading...'
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" /> Submit Resource
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
