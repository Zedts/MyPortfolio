import { createHash } from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import type { CloudinaryUploadFolder } from '@/lib/cloudinary-upload';

export const dynamic = 'force-dynamic';

const ALLOWED_FOLDERS = new Set<CloudinaryUploadFolder>([
    'portfolio/icons',
    'portfolio/experiences',
    'portfolio/projects/thumbnail',
    'portfolio/projects/long',
    'portfolio/projects/images',
]);

function getCloudinaryConfig() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !apiKey || !apiSecret || !uploadPreset) return null;
    return { cloudName, apiKey, apiSecret, uploadPreset };
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const config = getCloudinaryConfig();
        if (!config) {
            return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 503 });
        }

        const body = (await request.json().catch(() => ({}))) as { folder?: string };
        if (!body.folder || !ALLOWED_FOLDERS.has(body.folder as CloudinaryUploadFolder)) {
            return NextResponse.json({ error: 'Invalid upload folder' }, { status: 400 });
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const folder = body.folder as CloudinaryUploadFolder;
        const signaturePayload = `folder=${folder}&timestamp=${timestamp}&upload_preset=${config.uploadPreset}${config.apiSecret}`;
        const signature = createHash('sha1').update(signaturePayload).digest('hex');

        return NextResponse.json({
            ok: true,
            cloudName: config.cloudName,
            apiKey: config.apiKey,
            timestamp,
            signature,
            folder,
            uploadPreset: config.uploadPreset,
        });
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
