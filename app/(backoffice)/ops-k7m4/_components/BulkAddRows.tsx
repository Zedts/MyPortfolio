'use client';

import Link from 'next/link';
import { useHoverSound } from '@/hooks/useHoverSound';
import { cn } from '@/lib/utils';

interface BulkAddRowsProps {
    addOneHref?: string;
    addManyHref?: string;
    manyCount?: number;
    className?: string;
    onAddOne?: () => void;
    onAddMany?: () => void;
}

export default function BulkAddRows({
    addOneHref,
    addManyHref,
    manyCount = 5,
    className,
    onAddOne,
    onAddMany,
}: BulkAddRowsProps) {
    const playHover = useHoverSound();

    const addOneNode = (
        <button
            type="button"
            onClick={onAddOne}
            onMouseEnter={playHover}
            className="flex-1 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors sm:flex-none"
        >
            + Add Row
        </button>
    );

    const addOneLink = addOneHref ? (
        <Link
            href={addOneHref}
            onMouseEnter={playHover}
            className="flex-1 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-anton uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors sm:flex-none"
        >
            + Add Row
        </Link>
    ) : null;

    const addManyNode = addManyHref || onAddMany ? (
        onAddMany ? (
            <button
                type="button"
                onClick={onAddMany}
                onMouseEnter={playHover}
                className="flex-1 px-5 py-2.5 rounded-md bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors sm:flex-none"
            >
                +{manyCount} Rows
            </button>
        ) : (
            <Link
                href={addManyHref!}
                onMouseEnter={playHover}
                className="flex-1 px-5 py-2.5 rounded-md bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors sm:flex-none"
            >
                +{manyCount} Rows
            </Link>
        )
    ) : null;

    return (
            <div className={cn('flex w-full items-center gap-2 sm:w-auto', className)}>
            {onAddOne ? addOneNode : addOneLink}
            {addManyNode}
        </div>
    );
}
