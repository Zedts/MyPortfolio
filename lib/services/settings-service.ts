import 'server-only';

import { adminDb, isAdminFirebaseReady } from '@/lib/firebase/admin';
import { requireAdmin } from '@/lib/auth/require-admin';
import type { ISiteSettings } from '@/types/social';
import { siteSettingsSchema, type SiteSettingsInput } from '@/lib/schemas/settings';
import type { BulkOperationResult } from '@/types';
import { GENERAL_INFO, BANNER_STATS, ABOUT_ME_TEXT, BANNER_TEXT } from '@/lib/data/settings';
import { SOCIAL_LINKS } from '@/lib/data/social';

const COLLECTION = 'settings';
const DOC_ID = 'site';

const FALLBACK_SETTINGS: ISiteSettings = {
    email: GENERAL_INFO.email,
    emailSubject: GENERAL_INFO.emailSubject,
    emailBody: GENERAL_INFO.emailBody,
    upworkProfile: GENERAL_INFO.upworkProfile,
    socialLinks: SOCIAL_LINKS,
    bannerStats: BANNER_STATS,
    aboutMeText: ABOUT_ME_TEXT,
    bannerText: BANNER_TEXT,
};

export async function getSettings(): Promise<ISiteSettings> {
    if (!isAdminFirebaseReady || !adminDb) {
        return FALLBACK_SETTINGS;
    }

    try {
        const snap = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
        if (!snap.exists) {
            return FALLBACK_SETTINGS;
        }

        const raw = snap.data() as Record<string, unknown>;
        const sanitized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(raw)) {
            if (value && typeof value === 'object' && '_seconds' in value) {
                sanitized[key] = new Date(
                    (value as { _seconds: number; _nanoseconds?: number })._seconds * 1000,
                ).toISOString();
            } else {
                sanitized[key] = value;
            }
        }

        const data = sanitized as unknown as ISiteSettings & { lastModifiedAt?: string };
        const { lastModifiedAt: _omit, ...rest } = data;
        void _omit;

        return {
            ...FALLBACK_SETTINGS,
            ...rest,
            socialLinks: data.socialLinks?.length ? data.socialLinks : FALLBACK_SETTINGS.socialLinks,
        };
    } catch {
        return FALLBACK_SETTINGS;
    }
}

export async function saveSettings(
    input: SiteSettingsInput,
): Promise<BulkOperationResult> {
    await requireAdmin();
    if (!adminDb) {
        return { ok: false, created: 0, updated: 0, deleted: 0, message: 'Firebase admin not ready' };
    }

    const parsed = siteSettingsSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            created: 0,
            updated: 0,
            deleted: 0,
            message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
        };
    }

    const docRef = adminDb.collection(COLLECTION).doc(DOC_ID);
    const doc = await docRef.get();

    let created = 0,
        updated = 0;
    const data = {
        ...parsed.data,
        lastModifiedAt: new Date(),
    } as Record<string, unknown>;

    if (doc.exists) {
        await docRef.update(data);
        updated = 1;
    } else {
        await docRef.set(data);
        created = 1;
    }

    return { ok: true, created, updated, deleted: 0 };
}
