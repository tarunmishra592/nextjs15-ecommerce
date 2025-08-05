import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  }).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  }),
});

export const addressSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    phone: z.string(),
    country: z.string(),
    saveAsDefault: z.boolean()
  }),
});
