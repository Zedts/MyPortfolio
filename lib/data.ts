import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'YOUR_EMAIL@example.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi, I am reaching out to you because...',

    upworkProfile: 'https://www.upwork.com/freelancers/your-id',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/your-username' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/your-profile/' },
    { name: 'instagram', url: 'https://www.instagram.com/your-profile' },
];

export const MY_STACK = {
    frontend: [
        {
            name: 'JavaScript',
            icon: '/logo/js.png',
        },
        {
            name: 'TypeScript',
            icon: '/logo/ts.png',
        },
        {
            name: 'React',
            icon: '/logo/react.png',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.png',
        },
        {
            name: 'Redux',
            icon: '/logo/redux.png',
        },
        {
            name: 'Tailwind CSS',
            icon: '/logo/tailwind.png',
        },
        {
            name: 'GSAP',
            icon: '/logo/gsap.png',
        },
        {
            name: 'Framer Motion',
            icon: '/logo/framer-motion.png',
        },
        {
            name: 'Sass',
            icon: '/logo/sass.png',
        },
        {
            name: 'Bootstrap',
            icon: '/logo/bootstrap.svg',
        },
    ],
    backend: [
        {
            name: 'Node.js',
            icon: '/logo/node.png',
        },
        {
            name: 'NestJS',
            icon: '/logo/nest.svg',
        },
        {
            name: 'Express.js',
            icon: '/logo/express.png',
        },
    ],
    database: [
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'Prisma',
            icon: '/logo/prisma.png',
        },
    ],
    tools: [
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'Project Title',
        slug: 'project-slug',
        liveUrl: 'https://project-live-url.com',
        year: 2024,
        description: `
      Project description placeholder. <br/> <br/>
      
      Key Features:<br/>
      <ul>
        <li>Feature 1</li>
        <li>Feature 2</li>
      </ul>
      `,
        role: `
      Your Role <br/>
      Responsibilities:
      <ul>
        <li>Task 1</li>
        <li>Task 2</li>
      </ul>
      `,
        techStack: [
            'Tech 1',
            'Tech 2',
        ],
        thumbnail: '/projects/thumbnail/placeholder.webp',
        longThumbnail: '/projects/long/placeholder.webp',
        images: [
            '/projects/images/placeholder-1.webp',
            '/projects/images/placeholder-2.webp',
        ],
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'Job Title',
        company: 'Company Name',
        duration: 'Duration (e.g., Jan 2024 - Present)',
    },
];
