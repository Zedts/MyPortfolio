import { notFound } from 'next/navigation';
import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../../../_components/AdminPageHeader';
import ProjectForm from '../../../_components/ProjectForm';
import { getProjects } from '@/lib/services/project-service';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
    const { id } = await params;
    const projects = await getProjects();
    const project = projects.find((p) => p.id === id);

    if (!project) {
        notFound();
    }

    return (
        <div>
            <SectionTitle title="Edit Project" />
            <AdminPageHeader
                breadcrumb={[
                    { label: 'Admin Ops', href: '/ops-k7m4' },
                    { label: 'Projects', href: '/ops-k7m4/projects' },
                    { label: project.title },
                    { label: 'Edit' },
                ]}
            />
            <ProjectForm initialData={project} isEdit={true} />
        </div>
    );
}
