import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-admin';
import { isFirebaseAdminConfigured } from '@/lib/env/server';

export async function POST(request: NextRequest) {
    if (!isFirebaseAdminConfigured) {
        return NextResponse.json({ error: 'Server not configured' }, { status: 503 });
    }

    try {
        await requireAdmin();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
        tags?: string[];
        paths?: string[];
    };

    const tags = body.tags?.length ? body.tags : ['stack', 'experiences', 'projects', 'settings', 'home'];
    const paths = body.paths?.length ? body.paths : ['/', '/projects/[slug]'];

    for (const tag of tags) {
        try {
            revalidateTag(tag, {});
        } catch {
            // ignore
        }
    }

    for (const p of paths) {
        try {
            revalidatePath(p, p.includes('[') ? 'page' : 'layout');
        } catch {
            try {
                revalidatePath(p);
            } catch {
                // ignore
            }
        }
    }

    try {
        revalidatePath('/', 'layout');
    } catch {
        // ignore
    }

    return NextResponse.json({ ok: true, revalidated: { tags, paths } });
}
