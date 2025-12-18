
import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required'),

  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters'),

  bio: z
    .string()
    .max(500, 'Bio must be under 500 characters'),

  avatar: z
    .instanceof(File)
    .nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
