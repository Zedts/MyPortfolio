'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useHoverSound } from '@/hooks/useHoverSound';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
}: ConfirmDialogProps) {
    const playHover = useHoverSound();

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
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={cn(
                    'relative max-h-[calc(100vh-2rem)] w-full max-w-[440px] overflow-y-auto rounded-2xl border border-border bg-background-light p-5 sm:p-8',
                    'animate-[scaleIn_0.2s_ease-out]',
                )}
            >
                <h3 className="text-xl uppercase font-anton tracking-widest mb-3">
                    {title}
                </h3>
                <p className="text-muted-foreground text-sm font-roboto-flex mb-8">
                    {message}
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                        onClick={onClose}
                        onMouseEnter={playHover}
                        className="w-full px-6 py-3 rounded-md bg-background border border-border font-anton uppercase tracking-widest text-sm hover:bg-background-light transition-colors sm:w-auto"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        onMouseEnter={playHover}
                        className={cn(
                            'w-full px-6 py-3 rounded-md font-anton uppercase tracking-widest text-sm transition-colors sm:w-auto',
                            variant === 'danger'
                                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/70'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90',
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
