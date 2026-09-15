import { z } from 'zod';
import type { IExperience } from '@/types/experience';

export const experienceSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    company: z.string().min(1, 'Company is required'),
    duration: z.string().min(1, 'Duration is required'),
    description: z.string().min(1, 'Description is required'),
    order: z.number().int().min(0).default(0),
});

export const experienceBulkSchema = z.object({
    create: z.array(experienceSchema.extend({ id: z.string().min(1) })).default([]),
    update: z.array(z.object({ id: z.string().min(1), data: experienceSchema.partial() })).default([]),
    delete: z.array(z.string().min(1)).default([]),
});

export type ExperienceBulkChangeset = z.infer<typeof experienceBulkSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type ExperienceWithId = IExperience & { id: string };
