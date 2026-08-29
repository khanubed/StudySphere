import { z } from 'zod';

export const createFacultySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  department: z.string().trim().min(1, 'Department is required').max(100),
  designation: z.string().trim().min(1, 'Designation is required').max(100),
  branchIds: z.array(z.string().uuid('Invalid branch ID')).min(1, 'Assign at least one branch'),
});

export const createAnnouncementSchema = z
  .object({
    subjectId: z.string().uuid('Invalid subject ID').optional().or(z.literal('')),
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150),
    message: z.string().trim().min(1, 'Message is required').max(2000),
    scheduledFor: z.coerce.date().optional(),
    pinned: z.boolean().default(false),
  })
  .refine((d) => !d.scheduledFor || d.scheduledFor.getTime() > Date.now(), {
    message: 'Scheduled time must be in the future',
    path: ['scheduledFor'],
  });

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
