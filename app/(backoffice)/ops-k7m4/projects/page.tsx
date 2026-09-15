import { getProjects } from '@/lib/services/project-service';
import ProjectsClient from './_components/ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const projects = await getProjects();
    return <ProjectsClient initialProjects={projects} />;
}
