'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    BriefcaseBusiness,
    ChevronLeft,
    ChevronRight,
    FolderKanban,
    LayoutDashboard,
    Layers,
    LogOut,
    Settings,
} from 'lucide-react';
import { useHoverSound } from '@/hooks/useHoverSound';
import { useDirtyForm } from '@/hooks/useDirtyForm';
import { cn } from '@/lib/utils';
import ConfirmDialog from './ConfirmDialog';

const navItems = [
    { href: '/ops-k7m4', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/ops-k7m4/stack', label: 'Stack', icon: Layers },
    { href: '/ops-k7m4/experiences', label: 'Experiences', icon: BriefcaseBusiness },
    { href: '/ops-k7m4/projects', label: 'Projects', icon: FolderKanban },
    { href: '/ops-k7m4/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarProps {
    collapsed: boolean;
    mobileOpen: boolean;
    onToggleCollapsed: () => void;
    onCloseMobile: () => void;
}

export default function AdminSidebar({
    collapsed,
    mobileOpen,
    onToggleCollapsed,
    onCloseMobile,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const playHover = useHoverSound();
    const { isDirty, markClean } = useDirtyForm();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showDirtyConfirm, setShowDirtyConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const isActive = (href: string) => {
        if (href === '/ops-k7m4') return pathname === '/ops-k7m4';
        return pathname.startsWith(href);
    };

    const withDirtyCheck = (action: () => void) => {
        if (isDirty) {
            setPendingAction(() => action);
            setShowDirtyConfirm(true);
        } else {
            action();
        }
    };

    const handleDirtyConfirm = () => {
        markClean();
        if (pendingAction) pendingAction();
        setPendingAction(null);
        setShowDirtyConfirm(false);
    };

    const handleDirtyCancel = () => {
        setPendingAction(null);
        setShowDirtyConfirm(false);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/admin-logout', { method: 'POST' });
        } catch {
            // ignore
        }
        await router.push('/');
        router.refresh();
    };

    const handleLogoutClick = () => {
        withDirtyCheck(() => setShowLogoutConfirm(true));
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (isActive(href)) return;
        e.preventDefault();
        withDirtyCheck(() => {
            onCloseMobile();
            router.push(href);
        });
    };

    return (
        <>
        <aside
            className={cn(
                'fixed inset-y-0 left-0 z-40 flex w-[260px] -translate-x-full flex-col border-r border-border bg-background transition-[transform,width] duration-200 lg:translate-x-0',
                mobileOpen && 'translate-x-0',
                collapsed && 'lg:w-20',
            )}
        >
            <div className={cn('flex items-center border-b border-border p-6', collapsed && 'lg:justify-center lg:p-4')}>
                <Link
                    href="/ops-k7m4"
                    onClick={(e) => handleNavClick(e, '/ops-k7m4')}
                    onMouseEnter={playHover}
                    className={cn('text-2xl uppercase font-anton tracking-widest text-primary', collapsed && 'lg:hidden')}
                >
                    Admin Ops
                </Link>
                <button
                    type="button"
                    onClick={onToggleCollapsed}
                    onMouseEnter={playHover}
                    className={cn('ml-auto hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-background-light hover:text-foreground lg:inline-flex', collapsed && 'lg:ml-0')}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className={cn('flex-1 space-y-1 p-4', collapsed && 'lg:p-2')}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        onMouseEnter={playHover}
                        className={cn(
                            'flex items-center gap-3 rounded-md px-4 py-3 font-anton text-sm uppercase tracking-widest transition-all duration-200',
                            collapsed && 'lg:justify-center lg:px-2',
                            isActive(item.href)
                                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                : 'text-foreground/70 hover:bg-background-light hover:text-foreground',
                        )}
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className={cn(collapsed && 'lg:hidden')}>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className={cn('border-t border-border p-4', collapsed && 'lg:p-2')}>
                <button
                    onClick={handleLogoutClick}
                    onMouseEnter={playHover}
                    className={cn(
                        'flex w-full items-center gap-3 rounded-md bg-background-light px-4 py-3 font-anton text-sm uppercase tracking-widest text-foreground/70 transition-all duration-200 hover:bg-destructive/20 hover:text-destructive-foreground',
                        collapsed && 'lg:justify-center lg:px-2',
                    )}
                    title={collapsed ? 'Logout' : undefined}
                >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className={cn(collapsed && 'lg:hidden')}>Logout</span>
                </button>
            </div>

        </aside>
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

            <ConfirmDialog
                open={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Logout?"
                message="You will be signed out of the admin panel. Are you sure?"
                confirmText="Logout"
                cancelText="Stay"
            />
        </>
    );
}
