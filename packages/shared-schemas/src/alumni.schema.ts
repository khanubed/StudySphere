import { z } from 'zod';

export const updateAlumniProfileSchema = z.object({
  graduationYear: z.number().int().min(1990).max(new Date().getFullYear()),
  currentCompany: z.string().trim().max(100).optional().or(z.literal('')),
  designation: z.string().trim().max(100).optional().or(z.literal('')),
  skills: z.array(z.string().trim().min(2).max(30)).max(20).optional(),
});

export const mentorshipRequestSchema = z.object({
  alumniId: z.string().uuid('Invalid alumni ID'),
  message: z.string().trim().min(20, 'Message must be at least 20 characters').max(500, 'Message must be under 500 characters'),
});

export const connectionRequestSchema = z.object({
  targetUserId: z.string().uuid('Invalid target user ID'),
});

export type UpdateAlumniProfileInput = z.infer<typeof updateAlumniProfileSchema>;
export type MentorshipRequestInput = z.infer<typeof mentorshipRequestSchema>;
export type ConnectionRequestInput = z.infer<typeof connectionRequestSchema>;
