import { z } from 'zod';

export const jobCategoryEnum = z.enum([
  'software_development',
  'data_science',
  'design',
  'marketing',
  'other',
]);

export const createJobSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150),
    company: z.string().trim().min(2, 'Company must be at least 2 characters').max(100),
    category: jobCategoryEnum,
    description: z.string().trim().min(50, 'Description must be at least 50 characters').max(5000),
    requirements: z.string().trim().min(10, 'Requirements must be at least 10 characters').max(3000),
    isInternship: z.boolean(),
    durationMonths: z.number().int().min(1).max(12).optional(),
    stipend: z.number().min(0).optional(),
    location: z.string().trim().max(100).optional().or(z.literal('')),
    isRemote: z.boolean().default(false),
    deadline: z.coerce.date(),
  })
  .refine((d) => d.deadline.getTime() > Date.now(), {
    message: 'Deadline must be a future date',
    path: ['deadline'],
  })
  .refine((d) => !d.isInternship || Boolean(d.durationMonths), {
    message: 'Duration is required for internships',
    path: ['durationMonths'],
  });

export const applyToJobSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  resumeUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type JobCategoryEnum = z.infer<typeof jobCategoryEnum>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type ApplyToJobInput = z.infer<typeof applyToJobSchema>;
