'use client';
import ArrowAnimation from '@/components/animations/ArrowAnimation';
import Button from '@/components/ui/Button';
import { useHoverSound } from '@/hooks/useHoverSound';
import { GENERAL_INFO } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const playHoverSound = useHoverSound();

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 70%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.fromTo(
                '.slide-up-and-fade',
                { y: 0, opacity: 1 },
                { y: -150, opacity: 0, stagger: 0.02 },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            <ArrowAnimation />
            <div
                className="container h-[100svh] min-h-[530px] max-md:pb-10 flex justify-between items-center max-md:flex-col relative z-[1] 2xl:px-24 2xl:mx-auto"
                ref={containerRef}
            >
                <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[800px]">
                    <h1 className="banner-title slide-up-and-fade leading-[.95] text-7xl sm:text-8xl lg:text-[120px] font-anton">
                        <span className="text-primary">FULL-STACK</span>
                        <br /> <span className="ml-4">DEVELOPER</span>
                    </h1>
                    <p className="banner-description slide-up-and-fade mt-6 text-xl sm:text-2xl text-muted-foreground">
                        Hi! I&apos;m{' '}
                        <span className="font-medium text-foreground">
                            Royyan Hikmal Kautsar
                        </span>
                        . A passionate developer with experience in building modern web applications. 
                        Focused on clean code, performance, and user experience.
                    </p>
                    <div className="flex flex-col items-start gap-4 mt-9 slide-up-and-fade group/btn-container">
                        <div className="contents" onMouseEnter={playHoverSound}>
                            <Button
                                as="link"
                                target="_blank"
                                rel="noopener noreferrer"
                                href={GENERAL_INFO.upworkProfile}
                                variant="no-color"
                                className="banner-button relative overflow-hidden bg-primary text-primary-foreground h-16 px-12 text-lg rounded-lg group"
                            >
                                {/* Liquid Fill Animation Background */}
                                <span className="absolute bottom-0 left-0 w-full h-0 bg-white group-hover:h-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-t-[50%] group-hover:rounded-t-none"></span>

                                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                                    Let&apos;s Talk
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
                            3+
                        </h5>
                        <p className="text-muted-foreground text-base">
                            Years of Experience
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-4xl sm:text-5xl font-anton text-primary mb-1.5">
                            7+
                        </h5>
                        <p className="text-muted-foreground text-base">
                            Completed Projects
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-4xl sm:text-5xl font-anton text-primary mb-1.5">
                            1.000+
                        </h5>
                        <p className="text-muted-foreground text-base">Hours Worked</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
