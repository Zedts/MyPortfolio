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
import { parseBracketList } from '@/lib/utils';

const COLLECTION = 'projects';

function normalizeProject(raw: IProject & { id?: string }): IProject & { id?: string } {
    return {
        ...raw,
        techStack: parseBracketList<string>(raw.techStack, []),
        images: parseBracketList<string>(raw.images, []),
    };
}

export async function getProjects(opts?: { filter?: { published?: boolean } }): Promise<ProjectWithId[]> {
    if (!isAdminFirebaseReady || !adminDb) return [];

    const query = adminDb.collection(COLLECTION).orderBy('order', 'asc');
    const snap = await query.get();
    const all = snap.docs.map((doc) => normalizeProject({ id: doc.id, ...(doc.data() as IProject) }) as ProjectWithId);

    if (opts?.filter?.published === true) {
        return all.filter((p) => p.published === true);
    }
    return all;
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithId | null> {
    if (!isAdminFirebaseReady || !adminDb) return null;

    const snap = await adminDb
        .collection(COLLECTION)
        .where('slug', '==', slug)
        .limit(1)
        .get();

    if (snap.empty) return null;
    const doc = snap.docs[0];
    return normalizeProject({ id: doc.id, ...(doc.data() as IProject) }) as ProjectWithId;
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
