'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useHoverSound } from '@/hooks/useHoverSound';
import { useDirtyForm } from '@/hooks/useDirtyForm';
import { deepEqual } from '@/lib/deep-equal';
import { cn, slugify } from '@/lib/utils';
import { uploadAdminImage } from '@/lib/cloudinary-upload';
import ConfirmDialog from './ConfirmDialog';
import type { ProjectWithId } from '@/lib/schemas/project';
import type { ProjectInput } from '@/lib/schemas/project';
import type { BulkOperationResult } from '@/types';
import { Upload, ImageIcon } from 'lucide-react';

interface ProjectFormProps {
    initialData?: ProjectWithId;
    initialOrder?: number;
    isEdit?: boolean;
}

const emptyProject: ProjectInput & { id?: string } = {
    id: undefined,
    title: '',
    slug: '',
    year: new Date().getFullYear(),
    description: '',
    role: '',
    techStack: [],
    thumbnail: '',
    longThumbnail: '',
    images: [],
    liveUrl: '',
    sourceCode: '',
    order: 1,
    published: false,
};

function getInitialForm(initialData?: ProjectWithId, initialOrder?: number): ProjectInput & { id?: string } {
    if (!initialData) {
        return { ...emptyProject, order: initialOrder ?? 1 };
    }

    return {
        id: initialData.id,
        title: initialData.title,
        slug: initialData.slug,
        year: initialData.year,
        description: initialData.description,
        role: initialData.role,
        techStack: initialData.techStack || [],
        thumbnail: initialData.thumbnail,
        longThumbnail: initialData.longThumbnail,
        images: initialData.images || [],
        liveUrl: initialData.liveUrl || '',
        sourceCode: initialData.sourceCode || '',
        order: initialData.order ?? 1,
        published: initialData.published ?? false,
    };
}

export default function ProjectForm({ initialData, initialOrder, isEdit = false }: ProjectFormProps) {
    const router = useRouter();
    const playHover = useHoverSound();
    const { isDirty, setIsDirty, markClean } = useDirtyForm();
    const initialForm = useMemo(
        () => getInitialForm(initialData, initialOrder),
        [initialData, initialOrder],
    );
    const [form, setForm] = useState<ProjectInput & { id?: string }>(initialForm);
    const [techInput, setTechInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);
    const [showRolePreview, setShowRolePreview] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newImage, setNewImage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const lastInitialRef = useRef<ProjectWithId | undefined>(undefined);
    const uploadRef = useRef<HTMLInputElement | null>(null);
    const uploadTargetRef = useRef<
        | { kind: 'thumbnail' }
        | { kind: 'long' }
        | { kind: 'image-add' }
        | { kind: 'image-edit'; index: number }
        | null
    >(null);
    const [uploading, setUploading] = useState(false);

    const triggerUpload = (
        target:
            | { kind: 'thumbnail' }
            | { kind: 'long' }
            | { kind: 'image-add' }
            | { kind: 'image-edit'; index: number },
    ) => {
        uploadTargetRef.current = target;
        uploadRef.current?.click();
    };

    const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const target = uploadTargetRef.current;
        e.target.value = '';
        uploadTargetRef.current = null;
        if (!file || !target) return;
        setUploading(true);
        try {
            const folder =
                target.kind === 'thumbnail'
                    ? 'portfolio/projects/thumbnail'
                    : target.kind === 'long'
                      ? 'portfolio/projects/long'
                      : 'portfolio/projects/images';
            const url = await uploadAdminImage(file, folder);
            switch (target.kind) {
                case 'thumbnail':
                    update('thumbnail', url);
                    break;
                case 'long':
                    update('longThumbnail', url);
                    break;
                case 'image-add':
                    update('images', [...form.images, url]);
                    break;
                case 'image-edit': {
                    const next = [...form.images];
                    next[target.index] = url;
                    update('images', next);
                    break;
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (initialData && initialData !== lastInitialRef.current) {
            lastInitialRef.current = initialData;
            queueMicrotask(() => setForm(initialForm));
        }
    }, [initialData, initialForm]);

    useEffect(() => {
        setIsDirty(!deepEqual(form, initialForm));
    }, [form, initialForm, setIsDirty]);

    useEffect(() => () => markClean(), [markClean]);

    const update = <K extends keyof (ProjectInput & { id?: string })>(
        key: K,
        value: (ProjectInput & { id?: string })[K],
    ) => {
        setForm((prev) => {
            const next = { ...prev, [key]: value };
            if (key === 'title' && !isEdit && !prev.slug) {
                next.slug = slugify(String(value));
            }
            return next;
        });
    };

    const addTech = () => {
        const tech = techInput.trim();
        if (!tech) return;
        if (!form.techStack.includes(tech)) {
            update('techStack', [...form.techStack, tech]);
        }
        setTechInput('');
    };

    const removeTech = (tech: string) => {
        update(
            'techStack',
            form.techStack.filter((t) => t !== tech),
        );
    };

    const addImage = () => {
        const img = newImage.trim();
        if (!img) return;
        update('images', [...form.images, img]);
        setNewImage('');
    };

    const removeImage = (idx: number) => {
        update(
            'images',
            form.images.filter((_, i) => i !== idx),
        );
    };

    const doRevalidate = async () => {
        try {
            await fetch('/api/revalidate', { method: 'POST' });
        } catch {
            // ignore
        }
    };

    const save = async () => {
        setSaving(true);
        setError(null);
        try {
            const payload: {
                create: Array<ProjectInput & { id: string }>;
                update: Array<{ id: string; data: Partial<ProjectInput> }>;
                delete: string[];
            } = {
                create: [],
                update: [],
                delete: [],
            };

            const finalForm = { ...form, published: form.published };
            if (isEdit && initialData) {
                payload.update.push({
                    id: initialData.id,
                    data: {
                        title: finalForm.title,
                        slug: finalForm.slug,
                        year: finalForm.year,
                        description: finalForm.description,
                        role: finalForm.role,
                        techStack: finalForm.techStack,
                        thumbnail: finalForm.thumbnail,
                        longThumbnail: finalForm.longThumbnail,
                        images: finalForm.images,
                        liveUrl: finalForm.liveUrl,
                        sourceCode: finalForm.sourceCode,
                        order: finalForm.order,
                        published: finalForm.published,
                    },
                });
            } else {
                const id = finalForm.id || slugify(finalForm.slug || finalForm.title) || crypto.randomUUID();
                payload.create.push({
                    id,
                    title: finalForm.title,
                    slug: finalForm.slug || slugify(finalForm.title),
                    year: finalForm.year,
                    description: finalForm.description,
                    role: finalForm.role,
                    techStack: finalForm.techStack,
                    thumbnail: finalForm.thumbnail,
                    longThumbnail: finalForm.longThumbnail,
                    images: finalForm.images,
                    liveUrl: finalForm.liveUrl,
                    sourceCode: finalForm.sourceCode,
                    order: finalForm.order,
                    published: finalForm.published,
                });
            }

            const res = await fetch('/api/admin/projects/bulk', {
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
            markClean();
            router.push('/ops-k7m4/projects');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setSaving(false);
        }
    };

    const doDelete = async () => {
        if (!initialData) return;
        setSaving(true);
        try {
            const payload = {
                create: [],
                update: [],
                delete: [initialData.id],
            };
            await fetch('/api/admin/projects/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            await doRevalidate();
            router.push('/ops-k7m4/projects');
            router.refresh();
        } finally {
            setSaving(false);
        }
    };

    const inputClass = cn(
        'w-full bg-background-light border border-border rounded-md px-4 py-3 outline-none text-sm',
        'focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
    );
    const urlInputClass = cn(inputClass, 'min-w-0 truncate');

    const sectionClass = 'mb-10';
    const headingClass = 'text-lg uppercase font-anton tracking-widest mb-4 text-primary';

    return (
        <form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
            {error && (
                <div className="mb-6 p-4 rounded-md bg-destructive/20 border border-destructive/30 text-destructive-foreground text-sm">
                    {error}
                </div>
            )}

            <div className={sectionClass}>
                <h3 className={headingClass}>Basic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                            Title
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => update('title', e.target.value)}
                            className={inputClass}
                            placeholder="Project Title"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                            Slug
                        </label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e) => update('slug', e.target.value)}
                            className={inputClass}
                            placeholder="project-slug"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                            Year
                        </label>
                        <input
                            type="number"
                            min={2000}
                            max={2100}
                            value={form.year}
                            onChange={(e) => update('year', Number(e.target.value))}
                            className={inputClass}
                        />
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
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.published}
                                onChange={(e) => update('published', e.target.checked)}
                                className="w-5 h-5 rounded border-border bg-background-light text-primary focus:ring-primary focus:ring-offset-0"
                            />
                            <span className="text-xs uppercase font-anton tracking-widest text-muted-foreground">
                                Published
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <h3 className={headingClass}>URLs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                            Live URL
                        </label>
                        <input
                            type="url"
                            value={form.liveUrl}
                            onChange={(e) => update('liveUrl', e.target.value)}
                            className={urlInputClass}
                            title={form.liveUrl}
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                            Source Code URL
                        </label>
                        <input
                            type="url"
                            value={form.sourceCode}
                            onChange={(e) => update('sourceCode', e.target.value)}
                            className={urlInputClass}
                            title={form.sourceCode}
                            placeholder="https://github.com/..."
                        />
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <h3 className={headingClass}>Media</h3>
                <input
                    ref={uploadRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChosen}
                    className="hidden"
                />
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                            Thumbnail
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="shrink-0 w-48 h-36 rounded-lg border border-border bg-background-light flex items-center justify-center overflow-hidden">
                                {form.thumbnail ? (
                                    <img
                                        src={form.thumbnail}
                                        alt="Thumbnail preview"
                                        className="w-full h-full object-cover"
                                        onError={(ev) => ((ev.currentTarget as HTMLImageElement).style.display = 'none')}
                                    />
                                ) : (
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 w-full space-y-2">
                                <input
                                    type="text"
                                    value={form.thumbnail}
                                    onChange={(e) => update('thumbnail', e.target.value)}
                                    className={urlInputClass}
                                    placeholder="https://res.cloudinary.com/..."
                                    title={form.thumbnail}
                                />
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => triggerUpload({ kind: 'thumbnail' })}
                                        disabled={uploading}
                                        onMouseEnter={playHover}
                                        className="px-4 py-2 rounded-md bg-primary/10 text-primary border border-primary/30 font-anton uppercase tracking-widest text-xs hover:bg-primary/20 transition-colors disabled:opacity-50"
                                    >
                                        <span className="inline-flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Thumbnail</span>
                                    </button>
                                    <span className="text-xs text-muted-foreground">
                                        Uploaded directly to Cloudinary · max 5MB
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                            Long Thumbnail
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="shrink-0 w-64 h-36 rounded-lg border border-border bg-background-light flex items-center justify-center overflow-hidden">
                                {form.longThumbnail ? (
                                    <img
                                        src={form.longThumbnail}
                                        alt="Long thumbnail preview"
                                        className="w-full h-full object-cover"
                                        onError={(ev) => ((ev.currentTarget as HTMLImageElement).style.display = 'none')}
                                    />
                                ) : (
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 w-full space-y-2">
                                <input
                                    type="text"
                                    value={form.longThumbnail}
                                    onChange={(e) => update('longThumbnail', e.target.value)}
                                    className={urlInputClass}
                                    placeholder="https://res.cloudinary.com/..."
                                    title={form.longThumbnail}
                                />
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => triggerUpload({ kind: 'long' })}
                                        disabled={uploading}
                                        onMouseEnter={playHover}
                                        className="px-4 py-2 rounded-md bg-primary/10 text-primary border border-primary/30 font-anton uppercase tracking-widest text-xs hover:bg-primary/20 transition-colors disabled:opacity-50"
                                    >
                                        <span className="inline-flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Long</span>
                                    </button>
                                    <span className="text-xs text-muted-foreground">
                                        Uploaded directly to Cloudinary · max 5MB
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground">
                            Gallery Images
                        </label>
                        <div className="space-y-3 mb-4">
                            {form.images.length === 0 && (
                                <p className="text-sm italic text-muted-foreground">No gallery images yet. Upload or paste paths below.</p>
                            )}
                            {form.images.map((img, i) => (
                                <div key={i} className="flex flex-col sm:flex-row items-start gap-3 p-3 rounded-lg bg-background-light border border-border">
                                    <div className="shrink-0 w-28 h-20 rounded-md border border-border bg-background flex items-center justify-center overflow-hidden">
                                        {img ? (
                                            <img
                                                src={img}
                                                alt={`Gallery ${i + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(ev) => ((ev.currentTarget as HTMLImageElement).style.display = 'none')}
                                            />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 w-full space-y-2">
                                        <input
                                            type="text"
                                            value={img}
                                            onChange={(e) => {
                                                const next = [...form.images];
                                                next[i] = e.target.value;
                                                update('images', next);
                                            }}
                                            className={urlInputClass}
                                            placeholder="https://res.cloudinary.com/..."
                                            title={img}
                                        />
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => triggerUpload({ kind: 'image-edit', index: i })}
                                                disabled={uploading}
                                                onMouseEnter={playHover}
                                                className="px-3 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/30 font-anton uppercase tracking-widest text-xs hover:bg-primary/20 transition-colors disabled:opacity-50"
                                            >
                                                <span className="inline-flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Replace</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                onMouseEnter={playHover}
                                                className="px-3 py-1.5 rounded-md bg-destructive/20 text-destructive-foreground border border-destructive/30 font-anton uppercase tracking-widest text-xs hover:bg-destructive/40 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start gap-3">
                            <input
                                type="text"
                                value={newImage}
                                onChange={(e) => setNewImage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addImage();
                                    }
                                }}
                                placeholder="https://res.cloudinary.com/... (optional)"
                                className={urlInputClass + ' flex-1'}
                                title={newImage}
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={addImage}
                                    onMouseEnter={playHover}
                                    disabled={!newImage.trim()}
                                    className="px-5 py-3 rounded-md bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors whitespace-nowrap disabled:opacity-50"
                                >
                                    + Add URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => triggerUpload({ kind: 'image-add' })}
                                    disabled={uploading}
                                    onMouseEnter={playHover}
                                    className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-50"
                                >
                                    <span className="inline-flex items-center gap-2"><Upload className="w-4 h-4" /> Upload &amp; Add</span>
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            💡 Images upload directly to Cloudinary. Max 5MB each.
                        </div>
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <h3 className={headingClass}>Tech Stack</h3>
                <div className="mb-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTech();
                                }
                            }}
                            placeholder="Type then press Enter to add"
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={addTech}
                            onMouseEnter={playHover}
                            className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors whitespace-nowrap"
                        >
                            + Add
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {form.techStack.length === 0 ? (
                        <span className="text-muted-foreground italic text-sm">No tech added yet</span>
                    ) : (
                        form.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="inline-flex items-center gap-2 bg-background-light rounded-full uppercase tracking-widest text-xs px-4 py-2 border border-border"
                            >
                                {tech}
                                <button
                                    type="button"
                                    onClick={() => removeTech(tech)}
                                    className="text-muted-foreground hover:text-destructive-foreground transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    )}
                </div>
            </div>

            <div className={sectionClass}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={headingClass}>Description</h3>
                    <button
                        type="button"
                        onClick={() => setShowDescriptionPreview((v) => !v)}
                        onMouseEnter={playHover}
                        className="px-4 py-2 rounded-md bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        {showDescriptionPreview ? 'Edit' : 'Preview'}
                    </button>
                </div>
                {showDescriptionPreview ? (
                    <div
                        className="markdown-text bg-background-light border border-border rounded-md p-5 min-h-[200px] text-sm"
                        dangerouslySetInnerHTML={{ __html: form.description || '<em>No description yet</em>' }}
                    />
                ) : (
                    <textarea
                        value={form.description}
                        onChange={(e) => update('description', e.target.value)}
                        rows={10}
                        className={inputClass}
                        placeholder="HTML description"
                    />
                )}
            </div>

            <div className={sectionClass}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={headingClass}>My Role</h3>
                    <button
                        type="button"
                        onClick={() => setShowRolePreview((v) => !v)}
                        onMouseEnter={playHover}
                        className="px-4 py-2 rounded-md bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        {showRolePreview ? 'Edit' : 'Preview'}
                    </button>
                </div>
                {showRolePreview ? (
                    <div
                        className="markdown-text bg-background-light border border-border rounded-md p-5 min-h-[160px] text-sm"
                        dangerouslySetInnerHTML={{ __html: form.role || '<em>No role description yet</em>' }}
                    />
                ) : (
                    <textarea
                        value={form.role}
                        onChange={(e) => update('role', e.target.value)}
                        rows={8}
                        className={inputClass}
                        placeholder="HTML role description"
                    />
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                    type="button"
                    onClick={save}
                    disabled={!isDirty || saving}
                    onMouseEnter={playHover}
                    className={cn(
                        'w-full px-8 py-3 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors sm:w-auto',
                        (!isDirty || saving) && 'opacity-50 cursor-not-allowed hover:bg-primary',
                    )}
                >
                    {saving ? 'Saving...' : 'SAVE ALL'}
                </button>
                {isEdit && (
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={saving}
                        onMouseEnter={playHover}
                        className={cn(
                            'w-full px-8 py-3 rounded-md font-anton uppercase tracking-widest text-sm transition-colors sm:w-auto',
                            'bg-destructive/20 text-destructive-foreground border border-destructive/30 hover:bg-destructive/40',
                            saving && 'opacity-50 cursor-not-allowed',
                        )}
                    >
                        Delete
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => router.push('/ops-k7m4/projects')}
                    onMouseEnter={playHover}
                    className="w-full px-6 py-3 rounded-md font-anton uppercase tracking-widest text-sm text-muted-foreground hover:text-foreground transition-colors sm:ml-auto sm:w-auto"
                >
                    Cancel
                </button>
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={doDelete}
                title="Delete Project?"
                message='This will permanently delete this project. Published pages that reference it will show 404. Are you sure?'
                confirmText="Delete"
                variant="danger"
            />
        </form>
    );
}
