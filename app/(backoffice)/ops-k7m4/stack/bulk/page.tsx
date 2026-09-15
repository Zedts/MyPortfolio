import BulkStackPageInner from '../_components/BulkStackPageInner';
import { getStack } from '@/lib/services/stack-service';

export const dynamic = 'force-dynamic';

export default async function BulkStackPage() {
    const items = await getStack();
    const initialOrdersByCategory: Record<string, number> = {};
    for (const it of items) {
        const cur = initialOrdersByCategory[it.category] ?? 0;
        initialOrdersByCategory[it.category] = Math.max(cur, it.order ?? 0);
    }
    return <BulkStackPageInner initialOrdersByCategory={initialOrdersByCategory} />;
}
