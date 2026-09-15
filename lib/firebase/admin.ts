import 'server-only';

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { isFirebaseAdminConfigured, serverEnv } from '@/lib/env/server';

const ADMIN_APP_NAME = 'portfolio-admin';

function findExisting() {
    return getApps().find((a) => a.name === ADMIN_APP_NAME) ?? getApps()[0];
}

let adminApp = findExisting();

if (!adminApp && isFirebaseAdminConfigured) {
    adminApp = initializeApp(
        {
            credential: cert({
                projectId: serverEnv.FIREBASE_PROJECT_ID,
                clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
                privateKey: serverEnv.FIREBASE_PRIVATE_KEY,
            }),
            projectId: serverEnv.FIREBASE_PROJECT_ID,
        },
        ADMIN_APP_NAME,
    );
}

export const isAdminFirebaseReady = Boolean(adminApp);

export const adminAuth = adminApp ? getAdminAuth(adminApp) : null;
export const adminDb = adminApp ? getFirestore(adminApp) : null;

export { adminApp };
