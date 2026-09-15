import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../_components/AdminPageHeader';
import StackForm from '../_components/StackForm';
import { getStack } from '@/lib/services/stack-service';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function NewStackPage({ searchParams }: PageProps) {
    const { category } = await searchParams;
    const items = await getStack();
    const sameCatItems = items.filter((i) => i.category === category);
    const maxOrder = sameCatItems.reduce((m, i) => Math.max(m, i.order ?? 0), 0);
    const initialOrder = maxOrder + 1;

    return (
        <div>
            <SectionTitle title="New Stack Item" />
            <AdminPageHeader
                breadcrumb={[
                    { label: 'Admin Ops', href: '/ops-k7m4' },
                    { label: 'Stack', href: '/ops-k7m4/stack' },
                    { label: 'New' },
                ]}
            />
            <StackForm initialCategory={category} initialOrder={initialOrder} />
        </div>
    );
}
