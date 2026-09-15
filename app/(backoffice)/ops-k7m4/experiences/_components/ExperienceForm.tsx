'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHoverSound } from '@/hooks/useHoverSound';
import { cn, slugify } from '@/lib/utils';
import { uploadAdminImage } from '@/lib/cloudinary-upload';
import DescriptionEditModal from '../../_components/DescriptionEditModal';
import type { ExperienceInput } from '@/lib/schemas/experience';
import type { BulkOperationResult } from '@/types';

interface ExperienceFormProps {
    initialValue?: ExperienceInput;
    initialOrder?: number;
    isBulk?: boolean;
    formData?: ExperienceInput;
    onFormChange?: (data: ExperienceInput) => void;
    onSubmit?: (data: ExperienceInput) => void;
    showSubmit?: boolean;
}

const emptyExperience: ExperienceInput = {
    company: '',
    title: '',
    duration: '',
    description: '',
    order: 1,
};

export default function ExperienceForm({
    initialValue,
    initialOrder,
    isBulk = false,
    formData,
    onFormChange,
    onSubmit,
    showSubmit = true,
}: ExperienceFormProps) {
    const router = useRouter();
    const playHover = useHoverSound();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [internalForm, setInternalForm] = useState<ExperienceInput>(
        initialValue
            ? { ...initialValue, order: initialOrder ?? initialValue.order ?? 1 }
            : { ...emptyExperience, order: initialOrder ?? 1 },
    );
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = isBulk && formData ? formData : internalForm;

    const update = <K extends keyof ExperienceInput>(key: K, value: ExperienceInput[K]) => {
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
            const url = await uploadAdminImage(file, 'portfolio/experiences');
            const imgHtml = `<img src="${url}" alt="" />\n`;
            update('description', form.description + imgHtml);
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
            if (
                !form.company.trim() ||
                !form.title.trim() ||
                !form.duration.trim() ||
                !form.description.trim()
            ) {
                setError('All fields (company, title, duration, description) are required');
                return;
            }
            const id =
                slugify(form.company + '-' + form.title) +
                `-${crypto.randomUUID().slice(0, 6)}`;
            const payload = {
                create: [{ id, ...form }],
                update: [],
                delete: [],
            };
            const res = await fetch('/api/admin/experiences/bulk', {
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
            router.push('/ops-k7m4/experiences');
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

    const textareaClass = cn(
        'w-full bg-background-light border border-border rounded-lg px-4 py-3 outline-none text-sm resize-y',
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
                        Company
                    </label>
                    <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update('company', e.target.value)}
                        className={inputClass}
                        placeholder="Company name"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                        Title
                    </label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => update('title', e.target.value)}
                        className={inputClass}
                        placeholder="Job title"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                        Duration
                    </label>
                    <input
                        type="text"
                        value={form.duration}
                        onChange={(e) => update('duration', e.target.value)}
                        className={inputClass}
                        placeholder="July 2025 - Feb 2026"
                    />
                </div>
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs uppercase font-anton tracking-widest text-muted-foreground">
                            Description
                        </label>
                        <div className="flex items-center gap-2">
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
                                    'h-8 px-3 rounded-md bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors',
                                    uploading && 'opacity-50 cursor-not-allowed',
                                )}
                            >
                                {uploading ? '...' : 'Upload Image'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDescriptionPreview((v) => !v)}
                                onMouseEnter={playHover}
                                className="h-8 px-3 rounded-md bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                                {showDescriptionPreview ? 'Edit' : 'Preview'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDescriptionModal(true)}
                                onMouseEnter={playHover}
                                className="h-8 px-3 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors"
                            >
                                Open Editor
                            </button>
                        </div>
                    </div>
                    {showDescriptionPreview ? (
                        <div
                            className="markdown-text bg-background-light border border-border rounded-lg p-5 min-h-[200px] text-sm"
                            dangerouslySetInnerHTML={{
                                __html: form.description || '<em>No description yet</em>',
                            }}
                        />
                    ) : (
                        <textarea
                            value={form.description}
                            onChange={(e) => update('description', e.target.value)}
                            rows={8}
                            className={textareaClass}
                            placeholder="HTML description"
                        />
                    )}
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
                        onClick={() => router.push('/ops-k7m4/experiences')}
                        onMouseEnter={playHover}
                        className="w-full px-6 py-3 rounded-md font-anton uppercase tracking-widest text-sm text-muted-foreground hover:text-foreground transition-colors sm:ml-auto sm:w-auto"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <DescriptionEditModal
                open={showDescriptionModal}
                onClose={() => setShowDescriptionModal(false)}
                value={form.description}
                onSave={(value) => {
                    update('description', value);
                    setShowDescriptionModal(false);
                }}
                title={
                    form.title || form.company
                        ? `${form.title} @ ${form.company}`
                        : 'Edit Description'
                }
            />
        </div>
    );
}
