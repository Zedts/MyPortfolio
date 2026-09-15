import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { requireAdmin, COOKIE_NAME } from '@/lib/auth/require-admin';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(_request: NextRequest) {
    void _request;
    try {
        const admin = await requireAdmin();
        if (adminAuth) {
            try {
                await adminAuth.revokeRefreshTokens(admin.uid);
            } catch {
                // ignore revoke errors
            }
        }

        const jar = await cookies();
        jar.delete(COOKIE_NAME);

        return NextResponse.json({ ok: true, redirect: '/' });
    } catch {
        const jar = await cookies();
        jar.delete(COOKIE_NAME);
        return NextResponse.json({ ok: true, redirect: '/' });
    }
}
