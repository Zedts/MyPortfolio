import AboutMe from './_components/AboutMe';
import Banner from './_components/Banner';
import Experiences from './_components/Experiences';
import Skills from './_components/Skills';
import ProjectList from './_components/ProjectList';
import { getSettings } from '@/lib/services/settings-service';
import { getStackGrouped } from '@/lib/services/stack-service';
import { getExperiences } from '@/lib/services/experience-service';
import { getProjects } from '@/lib/services/project-service';

export const revalidate = 3600;

export default async function Home() {
    const [settings, stackGrouped, experiences, projects] = await Promise.all([
        getSettings(),
        getStackGrouped(),
        getExperiences(),
        getProjects({ filter: { published: true } }),
    ]);

    return (
        <div className="flex flex-col">
            <Banner settings={settings} />
            <AboutMe settings={settings} />
            <Skills stackGrouped={stackGrouped} />
            <Experiences experiences={experiences} />
            <ProjectList projects={projects} />
        </div>
    );
}
