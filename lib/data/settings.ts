import type { ISiteSettings } from '@/types/social';

export const DEFAULT_NAME = 'Royyan Hikmal Kautsar';

export const GENERAL_INFO: Pick<ISiteSettings, 'email' | 'emailSubject' | 'emailBody' | 'upworkProfile'> = {
    email: 'ryyn.work@gmail.com',
    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi, I am reaching out to you because...',
    upworkProfile: 'https://www.upwork.com/freelancers/~01d4518f13a97b4f9a?viewMode=1',
};

export const BANNER_STATS: NonNullable<ISiteSettings['bannerStats']> = {
    years: '3+',
    projects: '7+',
    users: '1000+',
};

export const ABOUT_ME_TITLE =
    'I believe in a user-centered design approach, ensuring every project is tailored to its users.';

export const ABOUT_ME_TEXT = `Hi, I'm Royyan Hikmal Kautsar, a passionate Full-Stack Developer with a keen eye for design and a love for creating seamless digital experiences. I specialize in building modern web applications that are not only functional but also visually stunning and user-friendly.

With a strong foundation in both frontend and backend technologies, I enjoy turning complex problems into simple, beautiful, and intuitive solutions. Whether it's crafting pixel-perfect interfaces or architecting robust server-side systems, I approach every project with dedication and creativity.

When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while reading about the latest trends in web development. I believe in continuous learning and staying updated with the ever-evolving tech landscape.`;

export const BANNER_TEXT = `Hi, I'm Royyan Hikmal Kautsar — a Full-Stack Developer crafting modern, fast, and beautiful web experiences. Let's build something extraordinary together.`;
