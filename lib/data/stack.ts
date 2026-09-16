import type { IStackItem } from '@/types/stack';

const stackEntries: Array<IStackItem & { category: string }> = [
    // Frontend
    { name: 'JavaScript', icon: '/logo/js.png', category: 'frontend' },
    { name: 'TypeScript', icon: '/logo/ts.png', category: 'frontend' },
    { name: 'React', icon: '/logo/react.png', category: 'frontend' },
    { name: 'Next.js', icon: '/logo/next.png', category: 'frontend' },
    { name: 'Redux', icon: '/logo/redux.png', category: 'frontend' },
    { name: 'Tailwind CSS', icon: '/logo/tailwind.png', category: 'frontend' },
    { name: 'GSAP', icon: '/logo/gsap.png', category: 'frontend' },
    { name: 'Framer Motion', icon: '/logo/framer-motion.png', category: 'frontend' },
    { name: 'Sass', icon: '/logo/sass.png', category: 'frontend' },
    { name: 'Bootstrap', icon: '/logo/bootstrap.svg', category: 'frontend' },
    // Backend
    { name: 'Node.js', icon: '/logo/node.png', category: 'backend' },
    { name: 'NestJS', icon: '/logo/nest.svg', category: 'backend' },
    { name: 'Express.js', icon: '/logo/express.png', category: 'backend' },
    // Database
    { name: 'MySQL', icon: '/logo/mysql.svg', category: 'database' },
    { name: 'PostgreSQL', icon: '/logo/postgreSQL.png', category: 'database' },
    { name: 'MongoDB', icon: '/logo/mongodb.svg', category: 'database' },
    { name: 'Prisma', icon: '/logo/prisma.png', category: 'database' },
    // Tools
    { name: 'Git', icon: '/logo/git.png', category: 'tools' },
    { name: 'Docker', icon: '/logo/docker.svg', category: 'tools' },
    { name: 'AWS', icon: '/logo/aws.png', category: 'tools' },
];

export const STACK_ITEMS_FLAT: IStackItem[] = stackEntries.map((item, idx) => ({ ...item, order: idx + 1 }));
