import 'server-only';

import { z } from 'zod';
import { adminDb, isAdminFirebaseReady } from '@/lib/firebase/admin';
import { requireAdmin } from '@/lib/auth/require-admin';
import type { IProject } from '@/types/project';
import {
    projectBulkSchema,
    projectSchema,
    type ProjectBulkChangeset,
    type ProjectWithId,
} from '@/lib/schemas/project';
import type { BulkOperationResult } from '@/types';
import { PROJECTS } from '@/lib/data/projects';

const COLLECTION = 'projects';

export async function getProjects(opts?: { filter?: { published?: boolean } }): Promise<ProjectWithId[]> {
    const fallback = PROJECTS.map((p) => ({ ...p, id: p.slug }));
    if (!isAdminFirebaseReady || !adminDb) {
        if (opts?.filter?.published === true) return fallback.filter((p) => p.published);
        return fallback;
    }

    try {
        let query = adminDb.collection(COLLECTION).orderBy('order', 'asc');
        if (opts?.filter?.published === true) {
            query = query.where('published', '==', true) as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
        }

        const snap = await query.get();
        const data = snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as IProject),
        }));

        if (!data.length) {
            if (opts?.filter?.published === true) return fallback.filter((p) => p.published);
            return fallback;
        }

        return data;
    } catch {
        if (opts?.filter?.published === true) return fallback.filter((p) => p.published);
        return fallback;
    }
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithId | null> {
    if (!isAdminFirebaseReady || !adminDb) {
        const found = PROJECTS.find((p) => p.slug === slug);
        return found ? { ...found, id: found.slug } : null;
    }

    const snap = await adminDb
        .collection(COLLECTION)
        .where('slug', '==', slug)
        .limit(1)
        .get();

    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...(doc.data() as IProject) };
}

export async function saveProjectsBulk(
    changeset: ProjectBulkChangeset,
): Promise<BulkOperationResult> {
    await requireAdmin();
    if (!adminDb) {
        return { ok: false, created: 0, updated: 0, deleted: 0, message: 'Firebase admin not ready' };
    }

    const parsed = projectBulkSchema.safeParse(changeset);
    if (!parsed.success) {
        return {
            ok: false,
            created: 0,
            updated: 0,
            deleted: 0,
            message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
        };
    }

    const { create, update, delete: del } = parsed.data;

    const batch = adminDb.batch();
    let created = 0,
        updated = 0,
        deleted = 0;

    for (const item of create) {
        const { id, ...data } = item;
        batch.set(adminDb.collection(COLLECTION).doc(id), data);
        created++;
    }

    for (const { id, data } of update) {
        batch.update(adminDb.collection(COLLECTION).doc(id), data as Record<string, unknown>);
        updated++;
    }

    for (const id of del) {
        batch.delete(adminDb.collection(COLLECTION).doc(id));
        deleted++;
    }

    if (create.length || update.length || del.length) {
        await batch.commit();
    }

    return { ok: true, created, updated, deleted };
}

export async function saveProjectSingle(
    id: string,
    data: Partial<z.infer<typeof projectSchema>>,
): Promise<BulkOperationResult> {
    await requireAdmin();
    if (!adminDb) {
        return { ok: false, created: 0, updated: 0, deleted: 0, message: 'Firebase admin not ready' };
    }

    const parsed = projectSchema.partial().safeParse(data);
    if (!parsed.success) {
        return {
            ok: false,
            created: 0,
            updated: 0,
            deleted: 0,
            message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
        };
    }

    const docRef = adminDb.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    let created = 0,
        updated = 0;

    if (doc.exists) {
        await docRef.update(parsed.data as Record<string, unknown>);
        updated = 1;
    } else {
        await docRef.set(parsed.data as Record<string, unknown>);
        created = 1;
    }

    return { ok: true, created, updated, deleted: 0 };
}
