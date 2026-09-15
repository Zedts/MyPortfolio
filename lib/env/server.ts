import 'server-only';

import { z } from 'zod';

const schema = z.object({
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().min(1),
    FIREBASE_PRIVATE_KEY: z.string().min(1),
    FIREBASE_ADMIN_UID: z.string().min(1),
    ADMIN_ROUTE_SLUG: z.string().min(5).default('ops-k7m4'),
});

const parsed = schema.safeParse({
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
    FIREBASE_ADMIN_UID: process.env.FIREBASE_ADMIN_UID,
    ADMIN_ROUTE_SLUG: process.env.ADMIN_ROUTE_SLUG,
});

if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join('.')).join(', ');
    console.warn(
        `[env/server] Missing or invalid SERVER env vars: ${missing}. ` +
        'Public site works without Firebase — Admin + seed + server Firestore queries disabled.',
    );
}

export const serverEnv = parsed.success
    ? parsed.data
    : (process.env as unknown as z.infer<typeof schema>);

export const isFirebaseAdminConfigured = parsed.success;
