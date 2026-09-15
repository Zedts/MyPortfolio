'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { useDirtyForm } from '@/hooks/useDirtyForm';
import ConfirmDialog from './ConfirmDialog';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface AdminPageHeaderProps {
    breadcrumb?: BreadcrumbItem[];
    actions?: ReactNode;
    className?: string;
}

export default function AdminPageHeader({ breadcrumb, actions, className }: AdminPageHeaderProps) {
    const router = useRouter();
    const { isDirty, markClean } = useDirtyForm();
    const [showDirtyConfirm, setShowDirtyConfirm] = useState(false);
    const [pendingHref, setPendingHref] = useState<string | null>(null);

    const handleBreadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (isDirty) {
            setPendingHref(href);
            setShowDirtyConfirm(true);
        } else {
            router.push(href);
        }
    };

    const handleDirtyConfirm = () => {
        markClean();
        if (pendingHref) router.push(pendingHref);
        setPendingHref(null);
        setShowDirtyConfirm(false);
    };

    const handleDirtyCancel = () => {
        setPendingHref(null);
        setShowDirtyConfirm(false);
    };

    return (
        <>
            <div className={cn('mb-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
                <div className="flex min-w-0 overflow-x-auto whitespace-nowrap pb-1 text-sm text-muted-foreground font-roboto-flex sm:pb-0">
                    {breadcrumb?.map((item, i) => {
                        const content = (
                            <span className={cn('transition-colors', i === breadcrumb.length - 1 ? 'text-foreground' : item.href ? 'hover:text-primary' : '')}>
                                {item.label}
                            </span>
                        );
                        return (
                            <span key={i} className="flex shrink-0 items-center gap-3">
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        onClick={(e) => handleBreadcrumbClick(e, item.href!)}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {content}
                                    </Link>
                                ) : (
                                    content
                                )}
                                {i < breadcrumb.length - 1 && <span className="text-border">/</span>}
                            </span>
                        );
                    })}
                </div>
                {actions && (
                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:gap-3 [&>button]:max-sm:flex-1 [&>a]:max-sm:w-full">
                        {actions}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={showDirtyConfirm}
                onClose={handleDirtyCancel}
                onConfirm={handleDirtyConfirm}
                title="Unsaved Changes"
                message="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
                confirmText="Discard & Leave"
                cancelText="Stay & Save"
                variant="danger"
            />
        </>
    );
}
