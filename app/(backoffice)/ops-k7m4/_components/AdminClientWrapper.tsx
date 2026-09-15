'use client';

import { ReactNode, useState } from 'react';
import { DirtyFormProvider } from '@/hooks/useDirtyForm';
import { cn } from '@/lib/utils';
import AdminSidebar from './AdminSidebar';

export default function AdminClientWrapper({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <DirtyFormProvider>
            <div className="min-h-screen bg-background">
                <AdminSidebar
                    collapsed={collapsed}
                    mobileOpen={mobileOpen}
                    onToggleCollapsed={() => setCollapsed((value) => !value)}
                    onCloseMobile={() => setMobileOpen(false)}
                />
                {mobileOpen && (
                    <button
                        type="button"
                        aria-label="Close navigation menu"
                        className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
                <button
                    type="button"
                    aria-label="Open navigation menu"
                    className="fixed left-4 top-4 z-30 h-11 w-11 rounded-md border border-border bg-background-light text-foreground shadow-lg lg:hidden"
                    onClick={() => setMobileOpen(true)}
                >
                    ☰
                </button>
                <main
                    className={cn(
                        'min-h-screen transition-[margin] duration-200 lg:ml-[260px]',
                        collapsed && 'lg:ml-20',
                    )}
                >
                    <div className="max-w-[1148px] mx-auto px-4 py-10 pt-20 lg:pt-10">
                        {children}
                    </div>
                </main>
            </div>
        </DirtyFormProvider>
    );
}
