import { NextResponse, type NextRequest } from 'next/server';
import { saveProjectsBulk } from '@/lib/services/project-service';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await saveProjectsBulk(body);

        if (result.ok) {
            revalidateTag('projects', {});
            revalidateTag('home', {});
        }

        return NextResponse.json(result, { status: result.ok ? 200 : 400 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return NextResponse.json(
            { ok: false, created: 0, updated: 0, deleted: 0, message },
            { status: 500 },
        );
    }
}
