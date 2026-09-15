'use client';

import { cn } from '@/lib/utils';
import { useHoverSound } from '@/hooks/useHoverSound';

interface BulkActionBarProps {
    selectedCount: number;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    className?: string;
}

export default function BulkActionBar({
    selectedCount,
    onDelete,
    onMoveUp,
    onMoveDown,
    className,
}: BulkActionBarProps) {
    const playHover = useHoverSound();

    if (selectedCount === 0) return null;

    return (
        <div
            className={cn(
                'fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-3 rounded-lg border border-border bg-background-light px-4 py-3 shadow-2xl sm:bottom-6 sm:left-1/2 sm:right-auto sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-4 sm:-translate-x-1/2',
                className,
            )}
        >
            <span className="text-sm font-roboto-flex text-foreground">
                <span className="font-anton uppercase tracking-widest text-primary">
                    {selectedCount}
                </span>{' '}
                selected
            </span>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
                {onMoveUp && (
                    <button
                        onClick={onMoveUp}
                        onMouseEnter={playHover}
                        className="px-4 py-2 rounded-md bg-background border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        Move Up
                    </button>
                )}
                {onMoveDown && (
                    <button
                        onClick={onMoveDown}
                        onMouseEnter={playHover}
                        className="px-4 py-2 rounded-md bg-background border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        Move Down
                    </button>
                )}
                <button
                    onClick={onDelete}
                    onMouseEnter={playHover}
                    className="px-4 py-2 rounded-md bg-destructive/20 text-destructive-foreground border border-destructive/30 font-anton uppercase tracking-widest text-xs hover:bg-destructive/40 transition-colors"
                >
                    Delete Selected
                </button>
            </div>
        </div>
    );
}
