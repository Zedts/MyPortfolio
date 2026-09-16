import 'server-only';

import { adminDb, isAdminFirebaseReady } from '@/lib/firebase/admin';
import { requireAdmin } from '@/lib/auth/require-admin';
import type { IBannerStats, ISiteSettings, ISocialLink } from '@/types/social';
import { siteSettingsSchema, type SiteSettingsInput } from '@/lib/schemas/settings';
import type { BulkOperationResult } from '@/types';
import { parseObjectString } from '@/lib/utils';

const COLLECTION = 'settings';
const DOC_ID = 'site';

const EMPTY_STATS: IBannerStats = { years: '', projects: '', users: '' };

function normalizeSocialLinks(value: unknown): ISocialLink[] {
    if (Array.isArray(value)) return value.filter((l) => l && typeof l === 'object' && 'name' in l && 'url' in l);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return normalizeSocialLinks(parsed);
                }
            } catch {
                const inner = trimmed.slice(1, -1);
                const items = inner
                    .split(/,\s*(?=\{)/)
                    .map((s) => s.trim())
                    .filter(Boolean);
                const out: ISocialLink[] = [];
                for (const item of items) {
                    const nameMatch = item.match(/"name"\s*:\s*"([^"]+)"|'name'\s*:\s*'([^']+)'/);
                    const urlMatch = item.match(/"url"\s*:\s*"([^"]+)"|'url'\s*:\s*'([^']+)'/);
                    if (nameMatch && urlMatch) {
                        out.push({ name: nameMatch[1] ?? nameMatch[2] ?? '', url: urlMatch[1] ?? urlMatch[2] ?? '' });
                    }
                }
                if (out.length > 0) return out;
            }
        }
    }
    return [];
}

export async function getSettings(): Promise<ISiteSettings> {
    const empty: ISiteSettings = {
        email: '',
        emailSubject: '',
        emailBody: '',
        upworkProfile: '',
        socialLinks: [],
        bannerStats: { ...EMPTY_STATS },
        aboutMeText: '',
        aboutMeTitle: '',
        bannerText: '',
        name: '',
        role: '',
    };

    if (!isAdminFirebaseReady || !adminDb) return empty;

    const snap = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
    if (!snap.exists) return empty;

    const raw = snap.data() as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
        if (value && typeof value === 'object' && '_seconds' in value) {
            data[key] = new Date(
                (value as { _seconds: number; _nanoseconds?: number })._seconds * 1000,
            ).toISOString();
        } else {
            data[key] = value;
        }
    }

    return {
        ...empty,
        ...data,
        bannerStats: parseObjectString<IBannerStats>(data.bannerStats, { ...EMPTY_STATS }),
        socialLinks: normalizeSocialLinks(data.socialLinks),
        socialLinks_raw: undefined,
    } as ISiteSettings;
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
        bannerStats: parsed.data.bannerStats ?? EMPTY_STATS,
        socialLinks: parsed.data.socialLinks ?? [],
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
