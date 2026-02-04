import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters'), // RFC 5321 limit
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const validateContactForm = (data: unknown) => {
  return contactFormSchema.safeParse(data);
};