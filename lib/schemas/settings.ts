import { z } from 'zod';
import type { ISiteSettings } from '@/types/social';

export const socialLinkSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.string().min(1, 'URL is required'),
});

export const bannerStatsSchema = z.object({
    years: z.string().default('3+'),
    projects: z.string().default('7+'),
    users: z.string().default('1000+'),
});

export const siteSettingsSchema = z.object({
    email: z.string().email('Invalid email').min(1),
    emailSubject: z.string().min(1, 'Email subject is required'),
    emailBody: z.string().min(1, 'Email body is required'),
    upworkProfile: z.string().min(0).default(''),
    socialLinks: z.array(socialLinkSchema).default([]),
    bannerStats: bannerStatsSchema.optional(),
    aboutMeText: z.string().optional(),
    aboutMeTitle: z.string().optional(),
    bannerText: z.string().optional(),
    name: z.string().optional(),
    role: z.string().optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type SiteSettingsWithId = ISiteSettings & { id: string };
