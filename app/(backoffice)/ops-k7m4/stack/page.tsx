import { getStack } from '@/lib/services/stack-service';
import StackClient from './_components/StackClient';

export const dynamic = 'force-dynamic';

const CATEGORIES = ['frontend', 'backend', 'database', 'tools'] as const;

export default async function StackPage() {
    const items = await getStack();

    const grouped = CATEGORIES.reduce<Record<string, typeof items>>((acc, cat) => {
        acc[cat] = items.filter((i) => i.category === cat);
        return acc;
    }, {});

    return <StackClient initialGrouped={grouped} categories={[...CATEGORIES]} />;
}
