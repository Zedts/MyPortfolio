'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../_components/AdminPageHeader';
import DataTable, { DataRow, DataCell } from '../../_components/DataTable';
import BulkActionBar from '../../_components/BulkActionBar';
import ConfirmDialog from '../../_components/ConfirmDialog';
import type { ProjectWithId } from '@/lib/schemas/project';
import type { BulkOperationResult } from '@/types';
import { cn } from '@/lib/utils';
import { useHoverSound } from '@/hooks/useHoverSound';

interface Props {
    initialProjects: ProjectWithId[];
}

export default function ProjectsClient({ initialProjects }: Props) {
    const router = useRouter();
    const playHover = useHoverSound();
    const [projects, setProjects] = useState<ProjectWithId[]>(initialProjects);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [busy, setBusy] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<'bulk' | string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const sorted = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const allSelected = sorted.length > 0 && sorted.every((p) => selected.has(p.id));

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelected(new Set(checked ? sorted.map((p) => p.id) : []));
    };

    const doBulk = async (payload: {
        create: Array<ProjectWithId & { id: string }>;
        update: Array<{ id: string; data: Partial<ProjectWithId> }>;
        delete: string[];
    }) => {
        const res = await fetch('/api/admin/projects/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data: BulkOperationResult = await res.json();
        if (!data.ok) {
            throw new Error(data.message || 'Operation failed');
        }
        return data;
    };

    const doRevalidateAndRefresh = async () => {
        try {
            await fetch('/api/revalidate', { method: 'POST' });
        } catch {
            // ignore
        }
        router.refresh();
        router.push('/ops-k7m4/projects');
    };

    const moveSelected = async (direction: -1 | 1) => {
        const ids = Array.from(selected);
        if (ids.length === 0 || busy) return;
        setBusy(true);
        setError(null);
        try {
            let sortedCopy = [...sorted];
            const indices = ids
                .map((id) => sortedCopy.findIndex((p) => p.id === id))
                .filter((i) => i !== -1)
                .sort((a, b) => (direction === 1 ? b - a : a - b));
            for (const idx of indices) {
                const targetIdx = idx + direction;
                if (targetIdx < 0 || targetIdx >= sortedCopy.length) continue;
                [sortedCopy[idx], sortedCopy[targetIdx]] = [sortedCopy[targetIdx], sortedCopy[idx]];
            }
            sortedCopy = sortedCopy.map((p, i) => ({ ...p, order: i + 1 }));

            const update = sortedCopy.map((p) => ({
                id: p.id,
                data: { order: p.order },
            }));

            await doBulk({ create: [], update, delete: [] });
            setProjects(sortedCopy);
            await doRevalidateAndRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setBusy(false);
        }
    };

    const handleBulkDeleteConfirm = async () => {
        const ids = Array.from(selected);
        if (ids.length === 0) return;
        setBusy(true);
        setError(null);
        try {
            await doBulk({ create: [], update: [], delete: ids });
            setProjects((prev) => prev.filter((p) => !ids.includes(p.id)));
            setSelected(new Set());
            setDeleteTarget(null);
            setShowDeleteConfirm(false);
            await doRevalidateAndRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setBusy(false);
        }
    };

    const handleSingleDeleteConfirm = async () => {
        if (!deleteTarget || deleteTarget === 'bulk') return;
        const id = deleteTarget;
        setBusy(true);
        setError(null);
        try {
            await doBulk({ create: [], update: [], delete: [id] });
            setProjects((prev) => prev.filter((p) => p.id !== id));
            setSelected((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            setDeleteTarget(null);
            setShowDeleteConfirm(false);
            await doRevalidateAndRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setBusy(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteTarget === 'bulk') {
            return handleBulkDeleteConfirm();
        }
        return handleSingleDeleteConfirm();
    };

    const actionButtons = (
        <Link
            href="/ops-k7m4/projects/new"
            onMouseEnter={playHover}
            className={cn(
                'px-8 py-2.5 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors',
                busy && 'opacity-50 cursor-not-allowed pointer-events-none',
            )}
        >
            + New Project
        </Link>
    );

    const confirmTitle =
        deleteTarget === 'bulk'
            ? `Delete ${selected.size} project(s)?`
            : 'Delete Project?';
    const confirmMessage =
        deleteTarget === 'bulk'
            ? 'These projects will be permanently deleted. Published pages referencing them will show 404. Are you sure?'
            : 'This project will be permanently deleted. Published pages referencing it will show 404. Are you sure?';

    return (
        <div>
            <SectionTitle title="Projects" />
            <AdminPageHeader breadcrumb={[{ label: 'Admin Ops', href: '/ops-k7m4' }, { label: 'Projects' }]} actions={actionButtons} />

            {error && (
                <div className="mb-6 p-4 rounded-md bg-destructive/20 border border-destructive/30 text-destructive-foreground text-sm">
                    {error}
                </div>
            )}

            <DataTable
                headers={['Thumbnail', 'Title', 'Year', 'Slug', 'Published', 'Tech', 'Order', 'Actions']}
                allSelected={allSelected}
                onSelectAll={toggleSelectAll}
            >
                {sorted.length === 0 ? (
                    <DataRow>
                        <DataCell
                            className="!py-8 text-center text-muted-foreground italic"
                            colSpan={9}
                        >
                            No projects yet. Click &quot;+ New Project&quot; to create one.
                        </DataCell>
                    </DataRow>
                ) : (
                    sorted.map((project) => (
                        <DataRow key={project.id} selected={selected.has(project.id)}>
                            <DataCell className="w-12">
                                <input
                                    type="checkbox"
                                    checked={selected.has(project.id)}
                                    onChange={() => toggleSelect(project.id)}
                                    className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                />
                            </DataCell>
                            <DataCell className="w-24">
                                {project.thumbnail ? (
                                    <div className="relative w-16 h-10 rounded-md border border-border overflow-hidden">
                                        <Image
                                            src={project.thumbnail}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-10 rounded-md bg-background-light border border-border flex items-center justify-center text-muted-foreground text-xs">
                                        N/A
                                    </div>
                                )}
                            </DataCell>
                            <DataCell>
                                <div className="font-roboto-flex text-sm font-medium text-foreground">
                                    {project.title}
                                </div>
                            </DataCell>
                            <DataCell className="w-20">
                                <span className="text-sm text-muted-foreground">{project.year}</span>
                            </DataCell>
                            <DataCell>
                                <code className="text-xs bg-background border border-border rounded px-2 py-1 text-muted-foreground">
                                    {project.slug}
                                </code>
                            </DataCell>
                            <DataCell className="w-28">
                                {project.published ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-anton uppercase tracking-widest bg-green-500/20 text-green-400 border border-green-500/30">
                                        Published
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-anton uppercase tracking-widest bg-background-light text-muted-foreground border border-border">
                                        Draft
                                    </span>
                                )}
                            </DataCell>
                            <DataCell className="w-20 text-center">
                                <span className="text-sm text-muted-foreground font-anton tracking-widest">
                                    {project.techStack?.length ?? 0}
                                </span>
                            </DataCell>
                            <DataCell className="w-20 text-center">
                                <span className="text-sm text-muted-foreground">{project.order ?? 0}</span>
                            </DataCell>
                            <DataCell className="w-40">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <Link
                                        href={`/ops-k7m4/projects/${project.id}/edit`}
                                        onMouseEnter={playHover}
                                        className="px-3 py-1.5 rounded-md bg-background border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setDeleteTarget(project.id);
                                            setShowDeleteConfirm(true);
                                        }}
                                        onMouseEnter={playHover}
                                        disabled={busy}
                                        className={cn(
                                            'px-3 py-1.5 rounded-md bg-destructive/20 text-destructive-foreground border border-destructive/30 font-anton uppercase tracking-widest text-xs hover:bg-destructive/40 transition-colors',
                                            busy && 'opacity-50 cursor-not-allowed',
                                        )}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </DataCell>
                        </DataRow>
                    ))
                )}
            </DataTable>

            <BulkActionBar
                selectedCount={selected.size}
                onMoveUp={() => moveSelected(-1)}
                onMoveDown={() => moveSelected(1)}
                onDelete={() => {
                    setDeleteTarget('bulk');
                    setShowDeleteConfirm(true);
                }}
            />

            <ConfirmDialog
                open={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                }}
                onConfirm={handleDeleteConfirm}
                title={confirmTitle}
                message={confirmMessage}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
