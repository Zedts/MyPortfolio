import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../_components/AdminPageHeader';
import ExperienceForm from '../_components/ExperienceForm';
import { getExperiences } from '@/lib/services/experience-service';

export const dynamic = 'force-dynamic';

export default async function NewExperiencePage() {
    const items = await getExperiences();
    const maxOrder = items.reduce((m, i) => Math.max(m, i.order ?? 0), 0);
    const initialOrder = maxOrder + 1;

    return (
        <div>
            <SectionTitle title="New Experience" />
            <AdminPageHeader
                breadcrumb={[
                    { label: 'Admin Ops', href: '/ops-k7m4' },
                    { label: 'Experiences', href: '/ops-k7m4/experiences' },
                    { label: 'New' },
                ]}
            />
            <ExperienceForm initialOrder={initialOrder} />
        </div>
    );
}
