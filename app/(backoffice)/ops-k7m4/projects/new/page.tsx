import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../_components/AdminPageHeader';
import ProjectForm from '../../_components/ProjectForm';
import { getProjects } from '@/lib/services/project-service';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
    const projects = await getProjects();
    const maxOrder = projects.reduce((m, p) => Math.max(m, p.order ?? 0), 0);
    const initialOrder = maxOrder + 1;

    return (
        <div>
            <SectionTitle title="New Project" />
            <AdminPageHeader
                breadcrumb={[
                    { label: 'Admin Ops', href: '/ops-k7m4' },
                    { label: 'Projects', href: '/ops-k7m4/projects' },
                    { label: 'New' },
                ]}
            />
            <ProjectForm isEdit={false} initialOrder={initialOrder} />
        </div>
    );
}
