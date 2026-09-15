import 'server-only';

import { cookies } from 'next/headers';
import { isAdminFirebaseReady, adminAuth } from '@/lib/firebase/admin';
import { isFirebaseAdminConfigured, serverEnv } from '@/lib/env/server';

export class UnauthorizedError extends Error {
    name = 'UnauthorizedError';
}

export class ForbiddenError extends Error {
    name = 'ForbiddenError';
}

const IS_SECURE_COOKIE = process.env.NODE_ENV === 'production';
const COOKIE_NAME = IS_SECURE_COOKIE ? '__Host-admin_session' : 'admin_session';
const MAX_SESSION_AGE_SECONDS = 60 * 60 * 4;

export async function createAdminSessionCookie(idToken: string) {
    if (!adminAuth || !isAdminFirebaseReady) {
        throw new UnauthorizedError('Firebase admin not configured');
    }
    const decoded = await adminAuth.verifyIdToken(idToken, true);

    if (
        decoded.uid !== serverEnv.FIREBASE_ADMIN_UID ||
        decoded.email !== 'ryyn.work@gmail.com' ||
        decoded.email_verified !== true
    ) {
        throw new ForbiddenError('Sign-in account is not the allowed administrator.');
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn: MAX_SESSION_AGE_SECONDS * 1000,
    });
    return { sessionCookie, uid: decoded.uid, expiresIn: MAX_SESSION_AGE_SECONDS };
}

export async function requireAdmin() {
    if (!isFirebaseAdminConfigured || !adminAuth || !isAdminFirebaseReady) {
        throw new UnauthorizedError('Server Firebase admin not configured');
    }

    const jar = await cookies();
    const sessionCookie = jar.get(COOKIE_NAME)?.value;
    if (!sessionCookie) throw new UnauthorizedError('Missing admin session');

    let decoded: Awaited<ReturnType<NonNullable<typeof adminAuth>['verifySessionCookie']>>;
    try {
        decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (_err) {
        void _err;
        throw new UnauthorizedError('Invalid or revoked admin session');
    }

    if (
        decoded.uid !== serverEnv.FIREBASE_ADMIN_UID ||
        decoded.email !== 'ryyn.work@gmail.com' ||
        decoded.email_verified !== true
    ) {
        throw new ForbiddenError('Session identity is not the allowed administrator.');
    }

    return Object.freeze({
        uid: decoded.uid,
        email: decoded.email ?? null,
    });
}

export { COOKIE_NAME, MAX_SESSION_AGE_SECONDS, IS_SECURE_COOKIE };
