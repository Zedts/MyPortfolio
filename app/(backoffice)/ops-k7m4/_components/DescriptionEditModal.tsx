'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useHoverSound } from '@/hooks/useHoverSound';

interface DescriptionEditModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    value: string;
    title?: string;
}

export default function DescriptionEditModal({
    open,
    onClose,
    onSave,
    value,
    title = 'Edit Description',
}: DescriptionEditModalProps) {
    const playHover = useHoverSound();
    const [local, setLocal] = useState(value);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (open) {
            queueMicrotask(() => setLocal(value));
        }
    }, [open, value]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div
                className={cn(
                    'relative bg-background-light rounded-2xl border border-border p-8 max-w-3xl w-full max-h-[85vh] flex flex-col',
                    'animate-[scaleIn_0.2s_ease-out]',
                )}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl uppercase font-anton tracking-widest">{title}</h3>
                    <button
                        onClick={() => setShowPreview((v) => !v)}
                        onMouseEnter={playHover}
                        className="px-4 py-2 rounded-md bg-background border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                </div>
                <div className="flex-1 min-h-[320px] overflow-y-auto mb-6">
                    {showPreview ? (
                        <div
                            className="markdown-text bg-background border border-border rounded-md p-5 h-full min-h-[320px] text-sm"
                            dangerouslySetInnerHTML={{ __html: local || '<em>No description yet</em>' }}
                        />
                    ) : (
                        <textarea
                            autoFocus
                            value={local}
                            onChange={(e) => setLocal(e.target.value)}
                            rows={14}
                            className="w-full bg-background border border-border rounded-md p-5 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none"
                            placeholder="HTML description text..."
                        />
                    )}
                </div>
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        onMouseEnter={playHover}
                        className="px-6 py-3 rounded-md bg-background border border-border font-anton uppercase tracking-widest text-sm hover:bg-background-light transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(local)}
                        onMouseEnter={playHover}
                        className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors"
                    >
                        Save Description
                    </button>
                </div>
            </div>
        </div>
    );
}
