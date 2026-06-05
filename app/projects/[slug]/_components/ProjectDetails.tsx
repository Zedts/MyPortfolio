'use client';
import parse from 'html-react-parser';
import ArrowAnimation from '@/components/animations/ArrowAnimation';
import TransitionLink from '@/components/common/TransitionLink';
import { useHoverSound } from '@/hooks/useHoverSound';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowLeft, ExternalLink, Code, Globe } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    project: IProject;
}

gsap.registerPlugin(ScrollTrigger);

const ProjectDetails = ({ project }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playHoverSound = useHoverSound();

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set('.fade-in-later', {
                autoAlpha: 0,
                y: 30,
            });
            const tl = gsap.timeline({
                delay: 0.5,
            });

            tl.to('.fade-in-later', {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out'
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            if (typeof window === 'undefined' || window.innerWidth < 992) return;

            gsap.to('#info', {
                filter: 'blur(3px)',
                autoAlpha: 0,
                scale: 0.95,
                scrollTrigger: {
                    trigger: '#info',
                    start: 'bottom bottom',
                    end: 'bottom top',
                    pin: true,
                    pinSpacing: false,
                    scrub: 0.5,
                },
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const imageDivs = gsap.utils.toArray<HTMLDivElement>('#images > div');
            imageDivs.forEach((imageDiv, i) => {
                gsap.to(imageDiv, {
                    backgroundPosition: `center 20%`,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: imageDiv,
                        start: () => (i ? 'top bottom' : 'top 50%'),
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="pt-10 pb-24 min-h-screen px-4 sm:px-6">
            <div className="container max-w-[1400px]" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="mb-12 sm:mb-16 inline-flex gap-3 items-center group text-base sm:text-lg font-medium hover:text-primary transition-colors"
                    onMouseEnter={playHoverSound}
                >
                    <ArrowLeft className="group-hover:-translate-x-2 transition-transform duration-300" />
                    Back to projects
                </TransitionLink>

                <div
                    className="top-0 py-8 sm:py-12 flex flex-col justify-center"
                    id="info"
                >
                    <div className="relative w-full">
                        <div className="flex flex-col md:flex-row md:items-start lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12 max-w-[1200px] mx-auto">
                            <h1 className="fade-in-later text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-anton uppercase tracking-tighter">
                                {project.title}
                            </h1>

                            <div className="fade-in-later flex gap-3 sm:gap-4 md:flex-shrink-0">
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="size-12 sm:size-14 rounded-full bg-background-light flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Code size={20} className="sm:size-6" />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="size-12 sm:size-14 rounded-full bg-background-light flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                                        onMouseEnter={playHoverSound}
                                    >
                                        <Globe size={20} className="sm:size-6" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="max-w-[1200px] grid lg:grid-cols-[1fr_1.5fr] gap-8 sm:gap-10 lg:gap-12 pb-12 sm:pb-16 mx-auto">
                            <div className="space-y-8 sm:space-y-10">
                                <div className="fade-in-later">
                                    <p className="text-primary font-anton uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">
                                        Year
                                    </p>
                                    <div className="text-xl sm:text-2xl font-medium">{project.year}</div>
                                </div>
                                <div className="fade-in-later">
                                    <p className="text-primary font-anton uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">
                                        Stack
                                    </p>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {project.techStack.map(tech => (
                                            <span key={tech} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-background-light rounded-full text-xs sm:text-sm uppercase tracking-wider font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-8 sm:space-y-10">
                                <div className="fade-in-later">
                                    <p className="text-primary font-anton uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">
                                        Description
                                    </p>
                                    <div className="text-sm sm:text-base text-muted-foreground leading-relaxed markdown-text [&_ul]:list-disc [&_ul]:ml-5 sm:[&_ul]:ml-6 [&_ul]:mt-2 sm:[&_ul]:mt-3 [&_ul]:space-y-1.5 sm:[&_ul]:space-y-2 [&_li]:leading-relaxed [&_li]:text-sm sm:[&_li]:text-base">
                                        {parse(project.description)}
                                    </div>
                                </div>
                                {project.role && (
                                    <div className="fade-in-later">
                                        <p className="text-primary font-anton uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">
                                            My Role
                                        </p>
                                        <div className="text-sm sm:text-base text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 sm:[&_ul]:ml-6 [&_ul]:mt-2 sm:[&_ul]:mt-3 [&_ul]:space-y-1.5 sm:[&_ul]:space-y-2 [&_li]:leading-relaxed [&_li]:text-sm sm:[&_li]:text-base">
                                            {parse(project.role)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <ArrowAnimation />
                    </div>
                </div>

                <div
                    className="fade-in-later relative flex flex-col gap-6 sm:gap-8 max-w-[1000px] mx-auto mt-12 sm:mt-16 lg:mt-20"
                    id="images"
                >
                    {project.images.map((image, index) => (
                        <div
                            key={`${image}-${index}`}
                            className="group relative w-full aspect-video bg-background-light rounded-xl sm:rounded-2xl overflow-hidden border border-border"
                        >
                            {image.includes('placeholder') ? (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-background-light uppercase tracking-widest text-xs sm:text-sm p-6 sm:p-12 text-center border-2 border-dashed border-border m-3 sm:m-4 rounded-lg sm:rounded-xl"
                                    onMouseEnter={playHoverSound}
                                >
                                    Project Image Placeholder {index + 1}
                                    <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs normal-case font-roboto-flex tracking-normal opacity-60">
                                        Replace with your own project screenshot in lib/data.ts
                                    </p>
                                </div>
                            ) : (
                                <div 
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: `url(${image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center 40%',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                />
                            )}
                            <a
                                href={image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-background/80 backdrop-blur-md text-foreground size-12 sm:size-14 rounded-full flex items-center justify-center transition-all opacity-0 scale-50 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 group-hover:scale-100"
                            >
                                <ExternalLink size={20} className="sm:size-6" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectDetails;
