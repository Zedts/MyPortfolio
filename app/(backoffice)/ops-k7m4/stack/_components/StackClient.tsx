'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../_components/AdminPageHeader';
import DataTable, { DataRow, DataCell } from '../../_components/DataTable';
import BulkActionBar from '../../_components/BulkActionBar';
import BulkAddRows from '../../_components/BulkAddRows';
import InlineEditableCell from '../../_components/InlineEditableCell';
import ConfirmDialog from '../../_components/ConfirmDialog';
import type { StackItemWithId } from '@/lib/schemas/stack';
import type { StackBulkChangeset } from '@/lib/schemas/stack';
import type { BulkOperationResult } from '@/types';
import { cn } from '@/lib/utils';
import { useHoverSound } from '@/hooks/useHoverSound';
import { useDirtyForm } from '@/hooks/useDirtyForm';
import { deepEqual } from '@/lib/deep-equal';
import { uploadAdminImage } from '@/lib/cloudinary-upload';
import { Upload, ImageIcon } from 'lucide-react';

interface Props {
    initialGrouped: Record<string, StackItemWithId[]>;
    categories: string[];
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default function StackClient({ initialGrouped, categories }: Props) {
    const router = useRouter();
    const playHover = useHoverSound();
    const { isDirty, setIsDirty, markClean } = useDirtyForm();
    const [activeTab, setActiveTab] = useState<string>(categories[0]);
    const [grouped, setGrouped] = useState<Record<string, StackItemWithId[]>>(initialGrouped);
    const [savedGrouped, setSavedGrouped] = useState<Record<string, StackItemWithId[]>>(initialGrouped);
    const [selected, setSelected] = useState<Record<string, Set<string>>>(
        Object.fromEntries(categories.map((c) => [c, new Set<string>()])),
    );
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const uploadFileRef = useRef<HTMLInputElement | null>(null);
    const uploadTargetRef = useRef<string | null>(null);

    useEffect(() => {
        setIsDirty(!deepEqual(grouped, savedGrouped));
    }, [grouped, savedGrouped, setIsDirty]);

    // A router refresh supplies canonical Firestore IDs for newly created
    // rows. Keep the local editor in sync with that server snapshot.
    useEffect(() => {
        queueMicrotask(() => {
            setGrouped(initialGrouped);
            setSavedGrouped(initialGrouped);
            setSelected(Object.fromEntries(categories.map((c) => [c, new Set<string>()])));
        });
    }, [initialGrouped, categories]);

    useEffect(() => {
        return () => markClean();
    }, [markClean]);

    const triggerUpload = (id: string) => {
        uploadTargetRef.current = id;
        uploadFileRef.current?.click();
    };

    const handleUploadIcon = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const id = uploadTargetRef.current;
        e.target.value = '';
        uploadTargetRef.current = null;
        if (!file || !id) return;
        setUploadingId(id);
        try {
            updateItem(id, 'icon', await uploadAdminImage(file, 'portfolio/icons'));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploadingId(null);
        }
    };

    const items = grouped[activeTab] ?? [];
    const selectedForTab = selected[activeTab] ?? new Set<string>();
    const allSelected = items.length > 0 && items.every((i) => selectedForTab.has(i.id));

    const updateItem = (id: string, field: keyof StackItemWithId, value: string | number) => {
        setGrouped((prev) => {
            const tabItems = [...(prev[activeTab] ?? [])];
            const idx = tabItems.findIndex((i) => i.id === id);
            if (idx !== -1) {
                tabItems[idx] = { ...tabItems[idx], [field]: value };
            }
            return { ...prev, [activeTab]: tabItems };
        });
    };

    const removeItemLocal = (ids: string[]) => {
        setGrouped((prev) => {
            const tabItems = (prev[activeTab] ?? []).filter((i) => !ids.includes(i.id));
            return { ...prev, [activeTab]: tabItems };
        });
        setSelected((prev) => {
            const set = new Set(prev[activeTab] ?? new Set<string>());
            ids.forEach((id) => set.delete(id));
            return { ...prev, [activeTab]: set };
        });
    };

    const addInlineRows = (count: number) => {
        setGrouped((prev) => {
            const tabItems = [...(prev[activeTab] ?? [])];
            const start = tabItems.reduce((m, it) => Math.max(m, it.order ?? 0), 0) + 1;
            for (let i = 0; i < count; i++) {
                tabItems.push({
                    id: `new-${activeTab}-${crypto.randomUUID().slice(0, 8)}`,
                    name: '',
                    icon: '',
                    category: activeTab,
                    order: start + i,
                });
            }
            return { ...prev, [activeTab]: tabItems };
        });
    };

    const addOne = () => addInlineRows(1);
    const addFive = () => addInlineRows(5);

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const set = new Set(prev[activeTab] ?? new Set<string>());
            if (set.has(id)) set.delete(id);
            else set.add(id);
            return { ...prev, [activeTab]: set };
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelected((prev) => ({
            ...prev,
            [activeTab]: new Set(checked ? items.map((i) => i.id) : []),
        }));
    };

    const moveSelected = (direction: -1 | 1) => {
        const ids = Array.from(selectedForTab);
        if (ids.length === 0) return;
        setGrouped((prev) => {
            const tabItems = [...(prev[activeTab] ?? [])].sort(
                (a, b) => (a.order ?? 0) - (b.order ?? 0),
            );
            const indices = ids
                .map((id) => tabItems.findIndex((i) => i.id === id))
                .filter((i) => i !== -1)
                .sort((a, b) => (direction === 1 ? b - a : a - b));
            for (const idx of indices) {
                const targetIdx = idx + direction;
                if (targetIdx < 0 || targetIdx >= tabItems.length) continue;
                [tabItems[idx], tabItems[targetIdx]] = [tabItems[targetIdx], tabItems[idx]];
            }
            tabItems.forEach((it, i) => {
                it.order = i + 1;
            });
            return { ...prev, [activeTab]: tabItems };
        });
    };

    const handleBulkDeleteConfirm = () => {
        const ids = Array.from(selectedForTab);
        removeItemLocal(ids);
        setShowDeleteConfirm(false);
    };

    const handleDeleteSingle = (id: string) => {
        removeItemLocal([id]);
    };

    const saveAll = async () => {
        setSaving(true);
        setError(null);
        try {
            const allItems = Object.values(grouped).flat();
            const originalAll = Object.values(savedGrouped).flat();
            const originalIds = new Set(originalAll.map((i) => i.id));

            const create: StackBulkChangeset['create'] = [];
            const update: StackBulkChangeset['update'] = [];
            const deleteOps: string[] = [];

            const currentIds = new Set(allItems.map((i) => i.id));
            const createdIds = new Map<string, string>();

            for (const id of originalIds) {
                if (!currentIds.has(id)) {
                    deleteOps.push(id);
                }
            }

            for (const item of allItems) {
                const isNew = !originalIds.has(item.id);
                if (isNew && (!item.name.trim() || !item.icon.trim())) {
                    setError('Complete the name and icon URL for every new row, or remove the unfinished row.');
                    return;
                }
                if (!item.name.trim() || !item.icon.trim()) continue;
                const payloadId = isNew
                    ? slugify(item.name) + `-${crypto.randomUUID().slice(0, 6)}`
                    : item.id;
                if (isNew) {
                    createdIds.set(item.id, payloadId);
                    create.push({
                        id: payloadId,
                        name: item.name,
                        icon: item.icon,
                        category: item.category,
                        order: item.order ?? 0,
                    });
                } else {
                    update.push({
                        id: item.id,
                        data: {
                            name: item.name,
                            icon: item.icon,
                            category: item.category,
                            order: item.order,
                        },
                    });
                }
            }

            const res = await fetch('/api/admin/stack/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ create, update, delete: deleteOps }),
            });
            const data: BulkOperationResult = await res.json();
            if (!data.ok) {
                setError(data.message || 'Save failed');
                return;
            }
            const persistedGrouped = Object.fromEntries(
                Object.entries(grouped).map(([category, rows]) => [
                    category,
                    rows.map((row) => {
                        const persistedId = createdIds.get(row.id);
                        return persistedId ? { ...row, id: persistedId } : row;
                    }),
                ]),
            );
            setGrouped(persistedGrouped);
            setSavedGrouped(persistedGrouped);
            setSelected(Object.fromEntries(categories.map((c) => [c, new Set<string>()])));
            await fetch('/api/revalidate', { method: 'POST' });
            router.refresh();
            markClean();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setSaving(false);
        }
    };

    const actionButtons = (
        <>
            <BulkAddRows
                manyCount={5}
                onAddOne={addOne}
                onAddMany={addFive}
            />
            <button
                onClick={saveAll}
                disabled={!isDirty || saving}
                onMouseEnter={playHover}
                className={cn(
                    'px-8 py-2.5 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors',
                    (!isDirty || saving) && 'opacity-50 cursor-not-allowed hover:bg-primary',
                )}
            >
                {saving ? 'Saving...' : 'Save All'}
            </button>
        </>
    );

    return (
        <div>
            <SectionTitle title="My Stack" />
            <AdminPageHeader
                breadcrumb={[
                    { label: 'Admin Ops', href: '/ops-k7m4' },
                    { label: 'Stack' },
                ]}
                actions={actionButtons}
            />

            {error && (
                <div className="mb-6 p-4 rounded-md bg-destructive/20 border border-destructive/30 text-destructive-foreground text-sm">
                    {error}
                </div>
            )}

            <div className="mb-6 flex w-full gap-2 overflow-x-auto rounded-lg border border-border bg-background-light p-1">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        onMouseEnter={playHover}
                        className={cn(
                            'shrink-0 px-5 py-2.5 rounded-md font-anton uppercase tracking-widest text-xs transition-all duration-200',
                            activeTab === cat
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <input
                ref={uploadFileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleUploadIcon}
                className="hidden"
            />
            <DataTable
                headers={['Name', 'Icon (Upload)', 'Order', 'Actions']}
                allSelected={allSelected}
                onSelectAll={toggleSelectAll}
            >
                {items.length === 0 ? (
                    <DataRow>
                        <DataCell className="!py-8 text-center text-muted-foreground italic" colSpan={5}>
                            No items in this category. Click &quot;+ Add Row&quot; to create one.
                        </DataCell>
                    </DataRow>
                ) : (
                    items.map((item) => (
                        <DataRow key={item.id} selected={selectedForTab.has(item.id)}>
                            <DataCell className="w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedForTab.has(item.id)}
                                    onChange={() => toggleSelect(item.id)}
                                    className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                />
                            </DataCell>
                            <DataCell>
                                <InlineEditableCell
                                    value={item.name}
                                    onChange={(v) => updateItem(item.id, 'name', String(v))}
                                    placeholder="Skill name"
                                />
                            </DataCell>
                            <DataCell className="w-[min(42vw,26rem)] max-w-[26rem]">
                                <div className="flex w-full min-w-0 items-center gap-3">
                                    <div className="w-11 h-11 shrink-0 rounded-md border border-border bg-background flex items-center justify-center overflow-hidden">
                                        {item.icon ? (
                                            <img
                                                src={item.icon}
                                                alt={item.name || 'icon'}
                                                className="w-8 h-8 object-contain"
                                                onError={(ev) => {
                                                    (ev.currentTarget as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 overflow-hidden">
                                        <InlineEditableCell
                                            value={item.icon}
                                            onChange={(v) => updateItem(item.id, 'icon', String(v))}
                                            placeholder="https://res.cloudinary.com/..."
                                            className="truncate"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => triggerUpload(item.id)}
                                        disabled={uploadingId === item.id}
                                        onMouseEnter={playHover}
                                        className="shrink-0 px-3 py-2 rounded-md bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors disabled:opacity-50"
                                        title="Upload icon (PNG / JPG / WebP / GIF, 5MB max)"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </div>
                            </DataCell>
                            <DataCell className="w-24">
                                <InlineEditableCell
                                    value={item.order ?? 0}
                                    type="number"
                                    onChange={(v) => updateItem(item.id, 'order', Number(v))}
                                />
                            </DataCell>
                            <DataCell className="w-28">
                                <button
                                    onClick={() => handleDeleteSingle(item.id)}
                                    onMouseEnter={playHover}
                                    className="px-3 py-1.5 rounded-md bg-destructive/20 text-destructive-foreground border border-destructive/30 font-anton uppercase tracking-widest text-xs hover:bg-destructive/40 transition-colors"
                                >
                                    Delete
                                </button>
                            </DataCell>
                        </DataRow>
                    ))
                )}
            </DataTable>

            <div className="mt-3 text-xs text-muted-foreground">
                💡 Tip: Click the <span className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium mx-1">↑ Upload</span> button to upload an icon to Cloudinary and auto-fill its URL. Max 5MB (PNG, JPG, WebP, GIF).
            </div>

            <BulkActionBar
                selectedCount={selectedForTab.size}
                onMoveUp={() => moveSelected(-1)}
                onMoveDown={() => moveSelected(1)}
                onDelete={() => setShowDeleteConfirm(true)}
            />

            <ConfirmDialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleBulkDeleteConfirm}
                title={`Delete ${selectedForTab.size} item(s)?`}
                message="These items will be marked for deletion when you click Save All."
                confirmText="Remove rows"
            />
        </div>
    );
}
