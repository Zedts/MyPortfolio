'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../_components/AdminPageHeader';
import ExperienceForm from './ExperienceForm';
import { cn, slugify } from '@/lib/utils';
import { useHoverSound } from '@/hooks/useHoverSound';
import type { ExperienceInput } from '@/lib/schemas/experience';
import type { BulkOperationResult } from '@/types';

interface Props {
    initialMaxOrder: number;
}

export default function BulkExperiencesPageInner({ initialMaxOrder }: Props) {
    const router = useRouter();
    const playHover = useHoverSound();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState<(ExperienceInput | null)[]>(
        Array(5).fill(null).map((_, i) => ({
            company: '',
            title: '',
            duration: '',
            description: '',
            order: initialMaxOrder + 1 + i,
        })),
    );

    const updateRow = (index: number, data: ExperienceInput) => {
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
                (r) =>
                    r &&
                    r.company.trim() &&
                    r.title.trim() &&
                    r.duration.trim() &&
                    r.description.trim(),
            ) as ExperienceInput[];
            if (validRows.length === 0) {
                setError('Fill at least one item (all fields required)');
                return;
            }

            const create = validRows.map((item, idx) => ({
                id:
                    slugify(item.company + '-' + item.title) +
                    `-${crypto.randomUUID().slice(0, 6)}`,
                ...item,
                order: item.order ?? initialMaxOrder + 1 + idx,
            }));

            const payload = { create, update: [], delete: [] };

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

    return (
        <div>
            <SectionTitle title="Add Experiences" subtitle="Fill 1-5 items, empty rows will be skipped" />
            <AdminPageHeader
                breadcrumb={[
                    { label: 'Admin Ops', href: '/ops-k7m4' },
                    { label: 'Experiences', href: '/ops-k7m4/experiences' },
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
                                Experience {index + 1}
                            </h3>
                        </div>
                        {row && (
                            <ExperienceForm
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
                    onClick={() => router.push('/ops-k7m4/experiences')}
                    onMouseEnter={playHover}
                    className="w-full px-6 py-3 rounded-md font-anton uppercase tracking-widest text-sm text-muted-foreground hover:text-foreground transition-colors sm:ml-auto sm:w-auto"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
