import { z } from 'zod';
import type { IStackItem } from '@/types/stack';

export const stackCategorySchema = z.enum(['frontend', 'backend', 'database', 'tools']);

export const stackItemSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    icon: z.string().min(1, 'Icon path is required'),
    category: stackCategorySchema.or(z.string().min(1)),
    order: z.number().int().min(0).default(0),
});

export const stackBulkSchema = z.object({
    create: z.array(stackItemSchema.extend({ id: z.string().min(1) })).default([]),
    update: z.array(z.object({ id: z.string().min(1), data: stackItemSchema.partial() })).default([]),
    delete: z.array(z.string().min(1)).default([]),
});

export type StackBulkChangeset = z.infer<typeof stackBulkSchema>;
export type StackItemInput = z.infer<typeof stackItemSchema>;
export type StackItemWithId = IStackItem & { id: string };
