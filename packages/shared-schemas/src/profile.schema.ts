import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must be under 60 characters'),
  bio: z.string().trim().max(300, 'Bio must be under 300 characters').optional().or(z.literal('')),
  institutionId: z.string().uuid('Invalid institution ID').optional().or(z.literal('')),
  branchId: z.string().uuid('Invalid branch ID').optional().or(z.literal('')),
  semesterId: z.string().uuid('Invalid semester ID').optional().or(z.literal('')),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'institution_only', 'private']),
  showContactInfo: z.boolean(),
  showAcademicStats: z.boolean(),
});

export const notificationPreferencesSchema = z
  .object({
    category: z.enum(['academic', 'social', 'career', 'billing', 'moderation', 'system']),
    channels: z.object({
      inApp: z.literal(true), // in-app cannot be disabled
      email: z.boolean(),
      push: z.boolean(),
    }),
  })
  .refine((d) => d.category !== 'billing' || d.channels.email, {
    message: 'Billing email notifications cannot be disabled',
    path: ['channels', 'email'],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
