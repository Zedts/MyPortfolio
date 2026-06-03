'use client';
import parse from 'html-react-parser';
import ArrowAnimation from '@/components/animations/ArrowAnimation';
import TransitionLink from '@/components/common/TransitionLink';
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
        <section className="pt-10 pb-24 min-h-screen">
            <div className="container" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="mb-16 inline-flex gap-3 items-center group text-lg font-medium hover:text-primary transition-colors"
                >
                    <ArrowLeft className="group-hover:-translate-x-2 transition-transform duration-300" />
                    Back to projects
                </TransitionLink>

                <div
                    className="top-0 min-h-[80svh] flex flex-col justify-center"
                    id="info"
                >
                    <div className="relative w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 max-w-[800px] mx-auto">
                            <h1 className="fade-in-later text-5xl md:text-[80px] leading-tight font-anton uppercase tracking-tighter">
                                {project.title}
                            </h1>

                            <div className="fade-in-later flex gap-4">
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="size-14 rounded-full bg-background-light flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Code size={24} />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="size-14 rounded-full bg-background-light flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Globe size={24} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="max-w-[800px] grid md:grid-cols-2 gap-12 pb-20 mx-auto">
                            <div className="space-y-12">
                                <div className="fade-in-later">
                                    <p className="text-primary font-anton uppercase tracking-widest text-sm mb-4">
                                        Year
                                    </p>
                                    <div className="text-2xl font-medium">{project.year}</div>
                                </div>
                                <div className="fade-in-later">
                                    <p className="text-primary font-anton uppercase tracking-widest text-sm mb-4">
                                        Stack
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {project.techStack.map(tech => (
                                            <span key={tech} className="px-4 py-2 bg-background-light rounded-full text-sm uppercase tracking-wider font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-12">
                                <div className="fade-in-later">
                                    <p className="text-primary font-anton uppercase tracking-widest text-sm mb-4">
                                        Description
                                    </p>
                                    <div className="text-lg text-muted-foreground leading-relaxed markdown-text">
                                        {parse(project.description)}
                                    </div>
                                </div>
                                {project.role && (
                                    <div className="fade-in-later">
                                        <p className="text-primary font-anton uppercase tracking-widest text-sm mb-4">
                                            My Role
                                        </p>
                                        <div className="text-lg text-muted-foreground leading-relaxed">
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
                    className="fade-in-later relative flex flex-col gap-8 max-w-[1000px] mx-auto mt-20"
                    id="images"
                >
                    {project.images.map((image, index) => (
                        <div
                            key={`${image}-${index}`}
                            className="group relative w-full aspect-video bg-background-light rounded-2xl overflow-hidden border border-border"
                        >
                            {image.includes('placeholder') ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-background-light uppercase tracking-widest text-sm p-12 text-center border-2 border-dashed border-border m-4 rounded-xl">
                                    Project Image Placeholder {index + 1}
                                    <p className="mt-4 text-xs normal-case font-roboto-flex tracking-normal opacity-60">
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
                                className="absolute top-6 right-6 bg-background/80 backdrop-blur-md text-foreground size-14 rounded-full flex items-center justify-center transition-all opacity-0 scale-50 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 group-hover:scale-100"
                            >
                                <ExternalLink size={24} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectDetails;
