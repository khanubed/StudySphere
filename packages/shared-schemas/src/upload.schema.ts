import { z } from 'zod';

export const presignUploadSchema = z.object({
  fileType: z.string().regex(/^(application|image|video|audio|text)\//, 'Invalid file MIME type'),
  fileSizeBytes: z.number().int().positive('File size must be positive'),
  purpose: z.enum(['resource', 'resume', 'assignment', 'avatar', 'live_quiz_evidence']),
});

export type PresignUploadInput = z.infer<typeof presignUploadSchema>;
