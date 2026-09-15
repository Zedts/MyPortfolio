import { ReactNode } from 'react';
import SvgSectionFlower from '@/components/icons/SectionFlower';
import { cn } from '@/lib/utils';

interface Props {
    icon?: ReactNode;
    className?: string;
    classNames?: {
        container?: string;
        title?: string;
        icon?: string;
        subtitle?: string;
    };
    title: string;
    subtitle?: string;
}

const SectionTitle = ({ icon, title, subtitle, className, classNames }: Props) => {
    return (
        <div
            className={cn(
                'flex items-center gap-4 mb-10',
                className,
                classNames?.container,
            )}
        >
            {icon ? (
                icon
            ) : (
                <SvgSectionFlower
                    width={30}
                    height={30}
                    className={cn(
                        'animate-spin duration-7000 shrink-0',
                        classNames?.icon,
                    )}
                />
            )}
            <div>
                <h2
                    className={cn(
                        'text-xl uppercase font-anton tracking-widest leading-none',
                        classNames?.title,
                    )}
                >
                    {title}
                </h2>
                {subtitle && (
                    <p
                        className={cn(
                            'mt-2 text-sm text-muted-foreground font-roboto-flex normal-case tracking-normal',
                            classNames?.subtitle,
                        )}
                    >
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SectionTitle;
