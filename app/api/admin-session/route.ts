import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSessionCookie, COOKIE_NAME, IS_SECURE_COOKIE } from '@/lib/auth/require-admin';
import { isFirebaseAdminConfigured, serverEnv } from '@/lib/env/server';

export async function POST(request: NextRequest) {
    if (!isFirebaseAdminConfigured) {
        return NextResponse.json({ error: 'Server not configured' }, { status: 503 });
    }

    try {
        const body = (await request.json()) as { idToken?: string };
        const idToken = body?.idToken;
        if (!idToken || typeof idToken !== 'string') {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        const { sessionCookie, expiresIn } = await createAdminSessionCookie(idToken);

        const jar = await cookies();
        jar.set(COOKIE_NAME, sessionCookie, {
            httpOnly: true,
            secure: IS_SECURE_COOKIE,
            sameSite: 'strict',
            path: '/',
            maxAge: expiresIn,
            priority: 'high',
        });

        return NextResponse.json({
            ok: true,
            redirect: `/${serverEnv.ADMIN_ROUTE_SLUG || 'ops-k7m4'}`,
        });
    } catch (err) {
        const message =
            err instanceof Error &&
            (err.name === 'UnauthorizedError' || err.name === 'ForbiddenError')
                ? err.message
                : 'Invalid credentials';
        return NextResponse.json({ error: message }, { status: 401 });
    }
}
