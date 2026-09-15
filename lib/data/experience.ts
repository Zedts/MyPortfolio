import type { IExperience } from '@/types/experience';

export const MY_EXPERIENCE: (IExperience & { order: number })[] = [
    {
        title: 'Intern Software Engineer',
        company: 'PT Denso Indonesia',
        duration: 'July 2025 - February 2026',
        description:
            'Engineered and optimized internal web applications using React and Node.js. Improved system efficiency by 20% through database query optimization and implemented responsive UI components for manufacturing dashboards.',
        order: 1,
    },
    {
        title: 'Usher',
        company: 'Big Bang Festival',
        duration: 'December 2025 - January 2026',
        description:
            'Managed crowd control and guest relations for a high-traffic festival. Coordinated with security and logistics teams to ensure seamless entry for over 5,000 daily attendees while maintaining high service standards.',
        order: 2,
    },
    {
        title: 'Crew Runner',
        company: 'Manufacturing Expo',
        duration: 'December 3 - December 6 (2025)',
        description:
            'Facilitated logistical operations for international exhibitors. Managed equipment distribution and provided real-time support for technical setups, ensuring all booth requirements were met ahead of schedule.',
        order: 3,
    },
];
