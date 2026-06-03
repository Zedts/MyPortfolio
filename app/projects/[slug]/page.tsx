import { notFound } from 'next/navigation';
import ProjectDetails from './_components/ProjectDetails';
import { PROJECTS } from '@/lib/data';
import { Metadata } from 'next';

export const generateStaticParams = async () => {
    return PROJECTS.map((project) => ({ slug: project.slug }));
};

type Props = {
    params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
    params,
}: Props): Promise<Metadata> => {
    const { slug } = await params;
    const project = PROJECTS.find((project) => project.slug === slug);

    if (!project) return {};

    return {
        title: `${project.title} | Project Details`,
        description: project.description.replace(/<[^>]*>?/gm, ''),
    };
};

const Page = async ({ params }: Props) => {
    const { slug } = await params;

    const project = PROJECTS.find((project) => project.slug === slug);

    if (!project) {
        return notFound();
    }

    return <ProjectDetails project={project} />;
};

export default Page;
