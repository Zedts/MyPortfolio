import Link from 'next/link';
import { getStack } from '@/lib/services/stack-service';
import { getExperiences } from '@/lib/services/experience-service';
import { getProjects } from '@/lib/services/project-service';
import { getSettings } from '@/lib/services/settings-service';
import SectionTitle from '@/components/common/SectionTitle';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {

    const [stack, experiences, projects, settings] = await Promise.all([
        getStack(),
        getExperiences(),
        getProjects(),
        getSettings(),
    ]);

    const countCards = [
        { label: 'Stack Items', value: stack.length, href: '/ops-k7m4/stack' },
        { label: 'Experiences', value: experiences.length, href: '/ops-k7m4/experiences' },
        { label: 'Projects', value: projects.length, href: '/ops-k7m4/projects' },
        {
            label: 'Settings Last Modified',
            value:
                (settings as unknown as { lastModifiedAt?: Date })?.lastModifiedAt
                    ? new Date(
                          (settings as unknown as { lastModifiedAt: Date | string }).lastModifiedAt,
                      ).toLocaleDateString()
                    : 'Never',
            href: '/ops-k7m4/settings',
        },
    ];

    const quickActions = [
        { label: 'Manage Stack', sub: 'Edit, reorder, add skills', href: '/ops-k7m4/stack' },
        {
            label: 'Manage Experiences',
            sub: 'Edit career timeline',
            href: '/ops-k7m4/experiences',
        },
        {
            label: 'New Project',
            sub: 'Create a new project entry',
            href: '/ops-k7m4/projects/new',
        },
        {
            label: 'Site Settings',
            sub: 'Contact info, social links',
            href: '/ops-k7m4/settings',
        },
    ];

    return (
        <div>
            <SectionTitle title="Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
                {countCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="group bg-background-light border border-border rounded-lg p-6 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                    >
                        <div className="text-xs uppercase font-anton tracking-widest text-muted-foreground mb-3">
                            {card.label}
                        </div>
                        <div className="text-4xl uppercase font-anton tracking-widest text-primary group-hover:scale-105 transition-transform duration-200 origin-left">
                            {card.value}
                        </div>
                    </Link>
                ))}
            </div>

            <h3 className="text-lg uppercase font-anton tracking-widest text-foreground mb-6">
                Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="group bg-background-light border border-border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm uppercase font-anton tracking-widest text-foreground mb-1">
                                {action.label}
                            </div>
                            <div className="text-xs text-muted-foreground font-roboto-flex">
                                {action.sub}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
