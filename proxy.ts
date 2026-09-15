import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth/require-admin';
import { isFirebaseAdminConfigured, serverEnv } from '@/lib/env/server';

const ADMIN_SLUG = serverEnv?.ADMIN_ROUTE_SLUG || 'ops-k7m4';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const adminPrefix = `/${ADMIN_SLUG}`;
    const protectsAdmin = pathname === adminPrefix || pathname.startsWith(`${adminPrefix}/`);
    const protectsApi = pathname.startsWith('/api/admin/');

    if (!protectsAdmin && !protectsApi) {
        return NextResponse.next();
    }

    if (!isFirebaseAdminConfigured) {
        return NextResponse.rewrite(new URL('/not-found', request.url));
    }

    const cookie = request.cookies.get(COOKIE_NAME)?.value;

    if (!cookie) {
        if (protectsApi) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.rewrite(new URL('/not-found', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // NOTE: matcher patterns are evaluated STATICALLY by Next.js at build time.
    // If you change ADMIN_ROUTE_SLUG in .env.local, update the first matcher
    // entry below to match, e.g. `/my-custom-slug/:path*`.
    matcher: ['/ops-k7m4/:path*', '/api/admin/:path*'],
};
