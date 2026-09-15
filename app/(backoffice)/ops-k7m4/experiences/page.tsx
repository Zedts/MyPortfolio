import { getExperiences } from '@/lib/services/experience-service';
import ExperiencesClient from './_components/ExperiencesClient';

export const dynamic = 'force-dynamic';

export default async function ExperiencesPage() {
    const items = await getExperiences();
    return <ExperiencesClient initialItems={items} />;
}
