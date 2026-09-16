'use client';
import ArrowAnimation from '@/components/animations/ArrowAnimation';
import Button from '@/components/ui/Button';
import { useHoverSound } from '@/hooks/useHoverSound';
import { gsap, useGSAP } from '@/lib/gsap';
import React from 'react';
import type { ISiteSettings } from '@/types/social';

interface Props {
    settings?: ISiteSettings;
}

const Banner = ({ settings }: Props) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const sectionRef = React.useRef<HTMLElement>(null);
    const playHoverSound = useHoverSound();

    const name = settings?.name ?? '';
    const upworkProfile = settings?.upworkProfile ?? '#';
    const bannerDescription = settings?.bannerText ?? '';
    const statsYears = settings?.bannerStats?.years ?? '';
    const statsProjects = settings?.bannerStats?.projects ?? '';
    const statsUsers = settings?.bannerStats?.users ?? '';

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add('(prefers-reduced-motion: no-preference)', () => {
                gsap.to(containerRef.current, {
                    yPercent: 10,
                    autoAlpha: 0.85,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                });
            });

            mm.add('(prefers-reduced-motion: reduce)', () => {
                gsap.set(containerRef.current, { yPercent: 0, autoAlpha: 1 });
            });

            return () => mm.revert();
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner" ref={sectionRef}>
            <ArrowAnimation />
            <div
                className="container h-[100svh] min-h-[530px] max-md:pb-10 flex justify-between items-center max-md:flex-col relative z-[1]"
                ref={containerRef}
            >
                <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[800px]">
                    <h1 className="banner-title slide-up-and-fade leading-[.95] text-7xl sm:text-8xl lg:text-[120px] font-anton">
                        <span className="text-primary">FULL-STACK</span>
                        <br /> <span className="ml-4">DEVELOPER</span>
                    </h1>
                    <p className="banner-description slide-up-and-fade mt-6 text-xl sm:text-2xl text-muted-foreground">
                        {bannerDescription.includes(name) ? (
                            <>{bannerDescription}</>
                        ) : (
                            <>
                                Hi! I{'\''}m{' '}
                                <span className="font-medium text-foreground">
                                    {name}
                                </span>
                                . {bannerDescription.startsWith('Hi') ? bannerDescription.replace(/^Hi! I'm[^.]*\.?\s*/, '') : bannerDescription}
                            </>
                        )}
                    </p>
                    <div className="flex flex-col items-start gap-4 mt-9 slide-up-and-fade group/btn-container">
                        <div className="contents" onMouseEnter={playHoverSound}>
                            <Button
                                as="link"
                                target="_blank"
                                rel="noopener noreferrer"
                                href={upworkProfile}
                                variant="no-color"
                                className="banner-button relative overflow-hidden bg-primary text-primary-foreground h-16 px-12 text-lg rounded-lg group"
                            >
                                {/* Liquid Fill Animation Background */}
                                <span className="absolute bottom-0 left-0 w-full h-0 bg-white group-hover:h-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-t-[50%] group-hover:rounded-t-none"></span>

                                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                                    Let{'\''}s Talk
                                </span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium ml-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Available for full-time opportunities
                        </div>
                    </div>
                </div>

                <div className="md:absolute bottom-[10%] right-[4%] flex md:flex-col gap-4 md:gap-8 text-center md:text-right">
                    <div className="slide-up-and-fade">
                        <h5 className="text-4xl sm:text-5xl font-anton text-primary mb-1.5">
                            {statsYears}
                        </h5>
                        <p className="text-muted-foreground text-base">
                            Years of Experience
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-4xl sm:text-5xl font-anton text-primary mb-1.5">
                            {statsProjects}
                        </h5>
                        <p className="text-muted-foreground text-base">
                            Completed Projects
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-4xl sm:text-5xl font-anton text-primary mb-1.5">
                            {statsUsers}
                        </h5>
                        <p className="text-muted-foreground text-base">Hours Worked</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
