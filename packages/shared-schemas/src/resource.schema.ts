import { z } from 'zod';

export const resourceTypeEnum = z.enum([
  'notes',
  'pyq',
  'book',
  'presentation',
  'assignment',
  'lab_manual',
  'research_paper',
]);

export const createResourceSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150, 'Title must be under 150 characters'),
    type: resourceTypeEnum,
    subjectId: z.string().uuid('Invalid subject ID'),
    fileUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    driveLink: z
      .string()
      .url('Must be a valid URL')
      .regex(/drive\.google\.com/, 'Must be a Google Drive share link')
      .optional()
      .or(z.literal('')),
    tags: z.array(z.string().trim().min(2).max(30)).max(10).optional(),
    description: z.string().trim().max(500, 'Description must be under 500 characters').optional().or(z.literal('')),
  })
  .refine((d) => Boolean(d.fileUrl) || Boolean(d.driveLink), {
    message: 'Upload a file or paste a Drive link',
    path: ['fileUrl'],
  });

export const addCommentSchema = z.object({
  resourceId: z.string().uuid('Invalid resource ID'),
  content: z.string().trim().min(1, 'Comment cannot be empty').max(500, 'Comment must be under 500 characters'),
});

export const moderateResourceSchema = z
  .object({
    resourceId: z.string().uuid('Invalid resource ID'),
    action: z.enum(['publish', 'reject']),
    rejectionReason: z.string().trim().min(10, 'Rejection reason must be at least 10 characters').optional().or(z.literal('')),
  })
  .refine((d) => d.action !== 'reject' || (Boolean(d.rejectionReason) && d.rejectionReason!.trim().length >= 10), {
    message: 'A valid reason is required to reject a resource',
    path: ['rejectionReason'],
  });

export type ResourceTypeEnum = z.infer<typeof resourceTypeEnum>;
export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
export type ModerateResourceInput = z.infer<typeof moderateResourceSchema>;
