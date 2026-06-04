'use client';
import SectionTitle from '@/components/common/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React, { useRef, useState, MouseEvent } from 'react';
import Project from './Project';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        PROJECTS.length > 0 ? PROJECTS[0].slug : null
    );

    useGSAP(
        (context, contextSafe) => {
            if (typeof window === 'undefined' || window.innerWidth < 768) {
                setSelectedProject(null);
                return;
            }

            const handleMouseMove = contextSafe?.((e: MouseEvent) => {
                if (!containerRef.current || !imageContainer.current) return;

                const containerRect = containerRef.current.getBoundingClientRect();
                const imageRect = imageContainer.current.getBoundingClientRect();
                
                // if cursor is outside the container, hide the image
                if (
                    e.clientY < containerRect.top ||
                    e.clientY > containerRect.bottom ||
                    e.clientX < containerRect.left ||
                    e.clientX > containerRect.right
                ) {
                    gsap.to(imageContainer.current, {
                        duration: 0.3,
                        opacity: 0,
                        ease: 'power2.out'
                    });
                    return;
                }

                const offsetTop = e.clientY - containerRect.top;

                gsap.to(imageContainer.current, {
                    y: offsetTop - imageRect.height / 2,
                    duration: 0.8,
                    opacity: 1,
                    ease: 'power3.out'
                });
            });

            window.addEventListener('mousemove', handleMouseMove as unknown as EventListener);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
            };
        },
        { scope: containerRef }
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'top 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from(containerRef.current, {
                y: 100,
                opacity: 0,
            });

            // Exit animation
            const exitTl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            exitTl.to(containerRef.current, {
                y: -150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    const handleMouseEnter = (slug: string) => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setSelectedProject(null);
            return;
        }
        setSelectedProject(slug);
    };

    return (
        <section className="py-section" id="selected-projects">
            <div className="container">
                <SectionTitle title="SELECTED PROJECTS" />

                <div className="group/projects relative" ref={containerRef}>
                    {selectedProject !== null && (
                        <div
                            className="max-md:hidden absolute right-0 top-0 z-[1] pointer-events-none w-[200px] xl:w-[400px] aspect-[3/4] overflow-hidden opacity-0 rounded-xl bg-background-light border border-border"
                            ref={imageContainer}
                        >
                            {PROJECTS.map((project) => (
                                <div
                                    key={project.slug}
                                    className={cn(
                                        'absolute inset-0 transition-opacity duration-500 w-full h-full',
                                        {
                                            'opacity-0': project.slug !== selectedProject,
                                            'opacity-100': project.slug === selectedProject,
                                        }
                                    )}
                                >
                                    {project.thumbnail.includes('placeholder') ? (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-background-light uppercase tracking-widest text-xs p-8 text-center border border-dashed border-border rounded-xl">
                                            {project.title} <br/> Thumbnail Placeholder
                                        </div>
                                    ) : (
                                        <Image
                                            src={project.thumbnail}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col max-md:gap-16">
                        {PROJECTS.map((project, index) => (
                            <Project
                                key={project.slug}
                                index={index}
                                project={project}
                                selectedProject={selectedProject}
                                onMouseEnter={handleMouseEnter}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
