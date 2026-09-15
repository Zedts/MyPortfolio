const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);

export type CloudinaryUploadFolder =
    | 'portfolio/icons'
    | 'portfolio/experiences'
    | 'portfolio/projects/thumbnail'
    | 'portfolio/projects/long'
    | 'portfolio/projects/images';

interface UploadSignatureResponse {
    ok: true;
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: CloudinaryUploadFolder;
    uploadPreset: string;
}

function validateImage(file: File) {
    if (file.size > MAX_IMAGE_SIZE) {
        throw new Error('File too large. Max: 5MB');
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new Error('Invalid file type. Allowed: PNG, JPG, GIF, WebP');
    }
}

export async function uploadAdminImage(file: File, folder: CloudinaryUploadFolder): Promise<string> {
    validateImage(file);

    const signatureResponse = await fetch('/api/admin/upload-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
    });
    const signatureData = (await signatureResponse.json().catch(() => ({}))) as
        | UploadSignatureResponse
        | { error?: string };

    if (!signatureResponse.ok || !('ok' in signatureData) || !signatureData.ok) {
        throw new Error(('error' in signatureData && signatureData.error) || 'Could not prepare upload');
    }

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('api_key', signatureData.apiKey);
    uploadData.append('timestamp', String(signatureData.timestamp));
    uploadData.append('signature', signatureData.signature);
    uploadData.append('folder', signatureData.folder);
    uploadData.append('upload_preset', signatureData.uploadPreset);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        { method: 'POST', body: uploadData },
    );
    const data = (await response.json().catch(() => ({}))) as {
        secure_url?: string;
        error?: { message?: string };
    };
    if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

    return data.secure_url;
}
