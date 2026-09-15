import BulkExperiencesPageInner from '../_components/BulkExperiencesPageInner';
import { getExperiences } from '@/lib/services/experience-service';

export const dynamic = 'force-dynamic';

export default async function BulkExperiencesPage() {
    const items = await getExperiences();
    const maxOrder = items.reduce((m, i) => Math.max(m, i.order ?? 0), 0);
    return <BulkExperiencesPageInner initialMaxOrder={maxOrder} />;
}
