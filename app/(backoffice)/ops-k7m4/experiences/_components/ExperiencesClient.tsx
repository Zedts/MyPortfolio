'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../_components/AdminPageHeader';
import DataTable, { DataRow, DataCell } from '../../_components/DataTable';
import BulkActionBar from '../../_components/BulkActionBar';
import BulkAddRows from '../../_components/BulkAddRows';
import InlineEditableCell from '../../_components/InlineEditableCell';
import ConfirmDialog from '../../_components/ConfirmDialog';
import DescriptionEditModal from '../../_components/DescriptionEditModal';
import type { ExperienceWithId } from '@/lib/schemas/experience';
import type { ExperienceBulkChangeset } from '@/lib/schemas/experience';
import type { BulkOperationResult } from '@/types';
import { cn } from '@/lib/utils';
import { useHoverSound } from '@/hooks/useHoverSound';
import { useDirtyForm } from '@/hooks/useDirtyForm';
import { deepEqual } from '@/lib/deep-equal';

interface Props {
    initialItems: ExperienceWithId[];
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default function ExperiencesClient({ initialItems }: Props) {
    const router = useRouter();
    const playHover = useHoverSound();
    const { isDirty, setIsDirty, markClean } = useDirtyForm();
    const [items, setItems] = useState<ExperienceWithId[]>(initialItems);
    const [savedItems, setSavedItems] = useState<ExperienceWithId[]>(initialItems);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        setIsDirty(!deepEqual(items, savedItems));
    }, [items, savedItems, setIsDirty]);

    useEffect(() => {
        queueMicrotask(() => {
            setItems(initialItems);
            setSavedItems(initialItems);
            setSelected(new Set());
        });
    }, [initialItems]);

    useEffect(() => {
        return () => markClean();
    }, [markClean]);

    const sortedItems = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const allSelected = sortedItems.length > 0 && sortedItems.every((i) => selected.has(i.id));

    const updateItem = (id: string, field: keyof ExperienceWithId, value: string | number) => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
        );
    };

    const removeLocal = (ids: string[]) => {
        setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
        const next = new Set(selected);
        ids.forEach((id) => next.delete(id));
        setSelected(next);
    };

    const addInlineRows = (count: number) => {
        setItems((prev) => {
            const start = prev.reduce((m, it) => Math.max(m, it.order ?? 0), 0) + 1;
            const newItems: ExperienceWithId[] = [];
            for (let i = 0; i < count; i++) {
                newItems.push({
                    id: `new-exp-${crypto.randomUUID().slice(0, 8)}`,
                    company: '',
                    title: '',
                    duration: '',
                    description: '',
                    order: start + i,
                });
            }
            return [...prev, ...newItems];
        });
    };

    const addOne = () => addInlineRows(1);
    const addFive = () => addInlineRows(5);

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelected(new Set(checked ? sortedItems.map((i) => i.id) : []));
    };

    const moveSelected = (direction: -1 | 1) => {
        const ids = Array.from(selected);
        if (ids.length === 0) return;
        setItems((prev) => {
            const sorted = [...prev].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            const indices = ids
                .map((id) => sorted.findIndex((i) => i.id === id))
                .filter((i) => i !== -1)
                .sort((a, b) => (direction === 1 ? b - a : a - b));
            for (const idx of indices) {
                const targetIdx = idx + direction;
                if (targetIdx < 0 || targetIdx >= sorted.length) continue;
                [sorted[idx], sorted[targetIdx]] = [sorted[targetIdx], sorted[idx]];
            }
            sorted.forEach((it, i) => {
                it.order = i + 1;
            });
            return sorted;
        });
    };

    const saveAll = async () => {
        setSaving(true);
        setError(null);
        try {
            const originalIds = new Set(savedItems.map((i) => i.id));
            const currentIds = new Set(items.map((i) => i.id));

            const create: ExperienceBulkChangeset['create'] = [];
            const update: ExperienceBulkChangeset['update'] = [];
            const deleteOps: string[] = [];
            const createdIds = new Map<string, string>();

            for (const id of originalIds) {
                if (!currentIds.has(id)) deleteOps.push(id);
            }

            for (const item of items) {
                const isNew = !originalIds.has(item.id);
                const isComplete =
                    item.title.trim() &&
                    item.company.trim() &&
                    item.duration.trim() &&
                    item.description.trim();
                if (isNew && !isComplete) {
                    setError('Complete every field for each new row, or remove the unfinished row.');
                    return;
                }
                if (!isComplete) continue;
                if (isNew) {
                    const id =
                        slugify(item.company + '-' + item.title) +
                        `-${crypto.randomUUID().slice(0, 6)}`;
                    createdIds.set(item.id, id);
                    create.push({
                        id,
                        title: item.title,
                        company: item.company,
                        duration: item.duration,
                        description: item.description,
                        order: item.order ?? 0,
                    });
                } else {
                    update.push({
                        id: item.id,
                        data: {
                            title: item.title,
                            company: item.company,
                            duration: item.duration,
                            description: item.description,
                            order: item.order,
                        },
                    });
                }
            }

            const res = await fetch('/api/admin/experiences/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ create, update, delete: deleteOps }),
            });
            const data: BulkOperationResult = await res.json();
            if (!data.ok) {
                setError(data.message || 'Save failed');
                return;
            }
            const persistedItems = items.map((item) => {
                const persistedId = createdIds.get(item.id);
                return persistedId ? { ...item, id: persistedId } : item;
            });
            setItems(persistedItems);
            setSavedItems(persistedItems);
            setSelected(new Set());
            await fetch('/api/revalidate', { method: 'POST' });
            router.refresh();
            markClean();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setSaving(false);
        }
    };

    const editingItem = editingId ? items.find((i) => i.id === editingId) ?? null : null;

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
            <SectionTitle title="Experiences" />
            <AdminPageHeader breadcrumb={[{ label: 'Admin Ops', href: '/ops-k7m4' }, { label: 'Experiences' }]} actions={actionButtons} />

            {error && (
                <div className="mb-6 p-4 rounded-md bg-destructive/20 border border-destructive/30 text-destructive-foreground text-sm">
                    {error}
                </div>
            )}

            <DataTable
                headers={['Company', 'Title', 'Duration', 'Description', 'Order', 'Actions']}
                allSelected={allSelected}
                onSelectAll={toggleSelectAll}
            >
                {sortedItems.length === 0 ? (
                    <DataRow>
                        <DataCell className="!py-8 text-center text-muted-foreground italic" colSpan={7}>
                            No experiences yet. Click &quot;+ Add Row&quot; to create one.
                        </DataCell>
                    </DataRow>
                ) : (
                    sortedItems.map((item) => (
                        <DataRow key={item.id} selected={selected.has(item.id)}>
                            <DataCell className="w-12">
                                <input
                                    type="checkbox"
                                    checked={selected.has(item.id)}
                                    onChange={() => toggleSelect(item.id)}
                                    className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                />
                            </DataCell>
                            <DataCell>
                                <InlineEditableCell
                                    value={item.company}
                                    onChange={(v) => updateItem(item.id, 'company', String(v))}
                                    placeholder="Company"
                                />
                            </DataCell>
                            <DataCell>
                                <InlineEditableCell
                                    value={item.title}
                                    onChange={(v) => updateItem(item.id, 'title', String(v))}
                                    placeholder="Title"
                                />
                            </DataCell>
                            <DataCell>
                                <InlineEditableCell
                                    value={item.duration}
                                    onChange={(v) => updateItem(item.id, 'duration', String(v))}
                                    placeholder="July 2025 - Feb 2026"
                                />
                            </DataCell>
                            <DataCell>
                                <button
                                    onClick={() => setEditingId(item.id)}
                                    onMouseEnter={playHover}
                                    className="px-3 py-1.5 rounded-md bg-background border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                                >
                                    {item.description.length > 60
                                        ? item.description.slice(0, 60) + '...'
                                        : item.description || 'Edit'}
                                </button>
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
                                    onClick={() => removeLocal([item.id])}
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

            <BulkActionBar
                selectedCount={selected.size}
                onMoveUp={() => moveSelected(-1)}
                onMoveDown={() => moveSelected(1)}
                onDelete={() => setShowDeleteConfirm(true)}
            />

            <ConfirmDialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => {
                    removeLocal(Array.from(selected));
                    setShowDeleteConfirm(false);
                }}
                title={`Delete ${selected.size} experience(s)?`}
                message="These items will be marked for deletion when you click Save All."
                confirmText="Remove rows"
            />

            <DescriptionEditModal
                open={editingItem !== null}
                onClose={() => setEditingId(null)}
                value={editingItem?.description ?? ''}
                onSave={(value) => {
                    if (editingId) updateItem(editingId, 'description', value);
                    setEditingId(null);
                }}
                title={editingItem?.title || editingItem?.company ? `${editingItem?.title} @ ${editingItem?.company}` : 'Edit Description'}
            />
        </div>
    );
}
