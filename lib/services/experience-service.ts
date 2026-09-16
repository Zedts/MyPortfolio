import 'server-only';

import { adminDb, isAdminFirebaseReady } from '@/lib/firebase/admin';
import { requireAdmin } from '@/lib/auth/require-admin';
import type { IExperience } from '@/types/experience';
import {
    experienceBulkSchema,
    type ExperienceBulkChangeset,
    type ExperienceWithId,
} from '@/lib/schemas/experience';
import type { BulkOperationResult } from '@/types';

const COLLECTION = 'experiences';

export async function getExperiences(): Promise<ExperienceWithId[]> {
    if (!isAdminFirebaseReady || !adminDb) return [];

    const snap = await adminDb
        .collection(COLLECTION)
        .orderBy('order', 'asc')
        .get();

    return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as IExperience),
    }));
}

export async function saveExperiencesBulk(
    changeset: ExperienceBulkChangeset,
): Promise<BulkOperationResult> {
    await requireAdmin();
    if (!adminDb) {
        return { ok: false, created: 0, updated: 0, deleted: 0, message: 'Firebase admin not ready' };
    }

    const parsed = experienceBulkSchema.safeParse(changeset);
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
