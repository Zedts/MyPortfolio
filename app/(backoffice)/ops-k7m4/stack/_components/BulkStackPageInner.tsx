'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../_components/AdminPageHeader';
import StackForm from './StackForm';
import { cn, slugify } from '@/lib/utils';
import { useHoverSound } from '@/hooks/useHoverSound';
import type { StackItemInput } from '@/lib/schemas/stack';
import type { BulkOperationResult } from '@/types';

interface Props {
    initialOrdersByCategory: Record<string, number>;
}

export default function BulkStackPageInner({ initialOrdersByCategory }: Props) {
    const router = useRouter();
    const playHover = useHoverSound();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState<(StackItemInput | null)[]>(
        Array(5).fill(null).map((_, i) => ({
            name: '',
            icon: '',
            category: 'frontend',
            order: (initialOrdersByCategory['frontend'] ?? 0) + 1 + i,
        })),
    );

    const updateRow = (index: number, data: StackItemInput) => {
        setRows((prev) => {
            const next = [...prev];
            next[index] = data;
            return next;
        });
    };

    const doRevalidate = async () => {
        try {
            await fetch('/api/revalidate', { method: 'POST' });
        } catch {
            // ignore
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError(null);
        try {
            const validRows = rows.filter(
                (r) => r && r.name.trim() && r.icon.trim(),
            ) as StackItemInput[];
            if (validRows.length === 0) {
                setError('Fill at least one item (name + icon required)');
                return;
            }

            const categoryCounter: Record<string, number> = {};
            const create = validRows.map((item) => {
                const base = initialOrdersByCategory[item.category] ?? 0;
                const offset = categoryCounter[item.category] ?? 0;
                categoryCounter[item.category] = offset + 1;
                return {
                    id: slugify(item.name) + `-${crypto.randomUUID().slice(0, 6)}`,
                    ...item,
                    order: item.order ?? base + 1 + offset,
                };
            });

            const payload = { create, update: [], delete: [] };

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

    return (
        <div>
            <SectionTitle title="Add Stack Items" subtitle="Fill 1-5 items, empty rows will be skipped" />
            <AdminPageHeader
                breadcrumb={[
                    { label: 'Admin Ops', href: '/ops-k7m4' },
                    { label: 'Stack', href: '/ops-k7m4/stack' },
                    { label: 'Bulk Add' },
                ]}
            />

            {error && (
                <div className="mb-6 p-4 rounded-md bg-destructive/20 border border-destructive/30 text-destructive-foreground text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                {rows.map((row, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-border/60 bg-background-light/30 p-4 sm:p-6"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm uppercase font-anton tracking-widest text-primary">
                                Item {index + 1}
                            </h3>
                        </div>
                        {row && (
                            <StackForm
                                isBulk
                                formData={row}
                                onFormChange={(d) => updateRow(index, d)}
                                showSubmit={false}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:flex-wrap sm:items-center">
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
                    {saving ? 'Saving...' : 'Save All'}
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
        </div>
    );
}
