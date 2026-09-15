import { z } from 'zod';
import type { IProject } from '@/types/project';

export const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    year: z.number().int().min(2000).max(2100),
    description: z.string().min(1, 'Description is required'),
    role: z.string().min(1, 'Role is required'),
    techStack: z.array(z.string().min(1)).default([]),
    thumbnail: z.string().min(1, 'Thumbnail path is required'),
    longThumbnail: z.string().min(1, 'Long thumbnail path is required'),
    images: z.array(z.string().min(1)).default([]),
    liveUrl: z.string().url().optional().or(z.literal('')),
    sourceCode: z.string().url().optional().or(z.literal('')),
    order: z.number().int().min(0).default(0),
    published: z.boolean().default(false),
});

export const projectBulkSchema = z.object({
    create: z.array(projectSchema.extend({ id: z.string().min(1) })).default([]),
    update: z.array(z.object({ id: z.string().min(1), data: projectSchema.partial() })).default([]),
    delete: z.array(z.string().min(1)).default([]),
});

export type ProjectBulkChangeset = z.infer<typeof projectBulkSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectWithId = IProject & { id: string };
