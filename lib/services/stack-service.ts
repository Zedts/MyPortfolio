import 'server-only';

import { adminDb, isAdminFirebaseReady } from '@/lib/firebase/admin';
import { requireAdmin } from '@/lib/auth/require-admin';
import type { IStackItem, StackCategories } from '@/types/stack';
import { stackBulkSchema, type StackBulkChangeset } from '@/lib/schemas/stack';
import type { BulkOperationResult } from '@/types';

const COLLECTION = 'stack';

export async function getStack(): Promise<Array<IStackItem & { id: string }>> {
    if (!isAdminFirebaseReady || !adminDb) return [];

    const snap = await adminDb
        .collection(COLLECTION)
        .orderBy('order', 'asc')
        .get();

    return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as IStackItem),
    }));
}

export async function getStackGrouped(): Promise<StackCategories> {
    const items = await getStack();
    return items.reduce<StackCategories>((acc, item) => {
        const { category } = item;
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});
}

export async function saveStackBulk(
    changeset: StackBulkChangeset,
): Promise<BulkOperationResult> {
    await requireAdmin();
    if (!adminDb) {
        return { ok: false, created: 0, updated: 0, deleted: 0, message: 'Firebase admin not ready' };
    }

    const parsed = stackBulkSchema.safeParse(changeset);
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
