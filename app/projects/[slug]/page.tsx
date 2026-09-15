import { notFound } from 'next/navigation';
import ProjectDetails from './_components/ProjectDetails';
import { getProjects, getProjectBySlug } from '@/lib/services/project-service';
import { Metadata } from 'next';

export const revalidate = 3600;

export const generateStaticParams = async () => {
    const projects = await getProjects({ filter: { published: true } });
    return projects.map((project) => ({ slug: project.slug }));
};

type Props = {
    params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
    params,
}: Props): Promise<Metadata> => {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) return {};

    return {
        title: `${project.title} | Project Details`,
        description: project.description.replace(/<[^>]*>?/gm, ''),
    };
};

const Page = async ({ params }: Props) => {
    const { slug } = await params;

    const project = await getProjectBySlug(slug);

    if (!project) {
        return notFound();
    }

    return <ProjectDetails project={project} />;
};

export default Page;
