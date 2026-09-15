'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHoverSound } from '@/hooks/useHoverSound';
import { cn, slugify } from '@/lib/utils';
import { uploadAdminImage } from '@/lib/cloudinary-upload';
import type { StackItemInput } from '@/lib/schemas/stack';
import type { BulkOperationResult } from '@/types';

interface StackFormProps {
    initialCategory?: string;
    initialOrder?: number;
    isBulk?: boolean;
    formData?: StackItemInput;
    onFormChange?: (data: StackItemInput) => void;
    onSubmit?: (data: StackItemInput) => void;
    showSubmit?: boolean;
}

const emptyStackItem: StackItemInput = {
    name: '',
    icon: '',
    category: 'frontend',
    order: 1,
};

export default function StackForm({
    initialCategory,
    initialOrder,
    isBulk = false,
    formData,
    onFormChange,
    onSubmit,
    showSubmit = true,
}: StackFormProps) {
    const router = useRouter();
    const playHover = useHoverSound();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [internalForm, setInternalForm] = useState<StackItemInput>({
        ...emptyStackItem,
        category: initialCategory || 'frontend',
        order: initialOrder ?? 1,
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = isBulk && formData ? formData : internalForm;

    const update = <K extends keyof StackItemInput>(key: K, value: StackItemInput[K]) => {
        const next = { ...form, [key]: value };
        if (isBulk && onFormChange) {
            onFormChange(next);
        } else {
            setInternalForm(next);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            update('icon', await uploadAdminImage(file, 'portfolio/icons'));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const doRevalidate = async () => {
        try {
            await fetch('/api/revalidate', { method: 'POST' });
        } catch {
            // ignore
        }
    };

    const handleSubmit = async () => {
        if (onSubmit) {
            onSubmit(form);
            return;
        }
        setSaving(true);
        setError(null);
        try {
            if (!form.name.trim() || !form.icon.trim()) {
                setError('Name and icon are required');
                return;
            }
            const id = slugify(form.name) + `-${crypto.randomUUID().slice(0, 6)}`;
            const payload = {
                create: [{ id, ...form }],
                update: [],
                delete: [],
            };
            const res = await fetch('/api/admin/stack/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data: BulkOperationResult = await res.json();
            if (!data.ok) {
                setError(data.message || 'Save failed');
                return;
            }
            await doRevalidate();
            router.push('/ops-k7m4/stack');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = cn(
        'h-12 px-4 rounded-lg bg-background-light border border-border outline-none text-sm w-full',
        'focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
    );

    return (
        <div className="space-y-4">
            {error && !isBulk && (
                <div className="p-4 rounded-md bg-destructive/20 border border-destructive/30 text-destructive-foreground text-sm">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                        Name
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className={inputClass}
                        placeholder="Skill name"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                        Category
                    </label>
                    <select
                        value={form.category}
                        onChange={(e) => update('category', e.target.value)}
                        className={inputClass}
                    >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="tools">Tools</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                        Icon
                    </label>
                    <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={form.icon}
                                    onChange={(e) => update('icon', e.target.value)}
                                    className={cn(inputClass, 'min-w-0 truncate')}
                                    placeholder="https://res.cloudinary.com/..."
                                    title={form.icon}
                                />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.gif,.webp"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    onMouseEnter={playHover}
                                    className={cn(
                                        'h-12 px-5 rounded-lg bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors whitespace-nowrap shrink-0',
                                        uploading && 'opacity-50 cursor-not-allowed',
                                    )}
                                >
                                    {uploading ? '...' : 'Upload'}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Upload PNG, JPG, WebP, or GIF (5MB max) to Cloudinary.
                            </p>
                        </div>
                        {form.icon && (
                            <div className="w-12 h-12 shrink-0 rounded-lg bg-background-light border border-border flex items-center justify-center p-2">
                                <img
                                    src={form.icon}
                                    alt={form.name || 'icon preview'}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                        Order
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.order}
                        onChange={(e) => update('order', Number(e.target.value))}
                        className={inputClass}
                    />
                </div>
            </div>
            {showSubmit && !isBulk && (
                <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        onMouseEnter={playHover}
                        className={cn(
                            'w-full px-8 py-3 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors sm:w-auto',
                            saving && 'opacity-50 cursor-not-allowed',
                        )}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/ops-k7m4/stack')}
                        onMouseEnter={playHover}
                        className="w-full px-6 py-3 rounded-md font-anton uppercase tracking-widest text-sm text-muted-foreground hover:text-foreground transition-colors sm:ml-auto sm:w-auto"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
