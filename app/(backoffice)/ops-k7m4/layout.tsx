import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-admin';
import AdminClientWrapper from './_components/AdminClientWrapper';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    try {
        await requireAdmin();
    } catch {
        notFound();
    }

    return (
        <AdminClientWrapper>
            {children}
        </AdminClientWrapper>
    );
}
