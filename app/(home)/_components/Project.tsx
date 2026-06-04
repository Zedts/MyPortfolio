'use client';
import { useHoverSound } from '@/hooks/useHoverSound';
import TransitionLink from '@/components/common/TransitionLink';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useRef } from 'react';

interface Props {
    index: number;
    project: IProject;
    selectedProject: string | null;
    onMouseEnter: (_slug: string) => void;
}

const Project = ({ index, project, selectedProject, onMouseEnter }: Props) => {
    const playHoverSound = useHoverSound();
    const externalLinkSVGRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { context, contextSafe } = useGSAP(() => {}, {
        scope: containerRef,
    });

    const handleMouseEnter = () => {
        playHoverSound();

        if (!contextSafe) return;
        
        contextSafe(() => {
            onMouseEnter(project.slug);

            const arrowLine = externalLinkSVGRef.current?.querySelector(
                '#arrow-line',
            ) as SVGPathElement;
            const arrowCurb = externalLinkSVGRef.current?.querySelector(
                '#arrow-curb',
            ) as SVGPathElement;
            const box = externalLinkSVGRef.current?.querySelector(
                '#box',
            ) as SVGPathElement;

            if (!arrowLine || !arrowCurb || !box) return;

            gsap.set(box, {
                opacity: 0,
                strokeDasharray: box.getTotalLength(),
                strokeDashoffset: box.getTotalLength(),
            });
            gsap.set(arrowLine, {
                opacity: 0,
                strokeDasharray: arrowLine.getTotalLength(),
                strokeDashoffset: arrowLine.getTotalLength(),
            });
            gsap.set(arrowCurb, {
                opacity: 0,
                strokeDasharray: arrowCurb.getTotalLength(),
                strokeDashoffset: arrowCurb.getTotalLength(),
            });

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
            tl.to(externalLinkSVGRef.current, {
                autoAlpha: 1,
            })
                .to(box, {
                    opacity: 1,
                    strokeDashoffset: 0,
                })
                .to(
                    arrowLine,
                    {
                        opacity: 1,
                        strokeDashoffset: 0,
                    },
                    '<0.2',
                )
                .to(arrowCurb, {
                    opacity: 1,
                    strokeDashoffset: 0,
                })
                .to(
                    externalLinkSVGRef.current,
                    {
                        autoAlpha: 0,
                    },
                    '+=1',
                );
        })();
    };

    const handleMouseLeave = () => {
        if (!contextSafe) return;

        contextSafe(() => {
            context.kill();
            gsap.set(externalLinkSVGRef.current, { autoAlpha: 0 });
        })();
    };

    return (
        <div ref={containerRef} className="border-t border-border/50 first:border-none last:border-b">
            <TransitionLink
                href={`/projects/${project.slug}`}
                className="project-item group leading-none py-10 md:py-16 md:group-hover/projects:opacity-30 md:hover:!opacity-100 transition-all block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {selectedProject === null && (
                    <div className="relative w-full aspect-[3/2] mb-6 overflow-hidden rounded-lg bg-background-light">
                        {project.thumbnail.includes('placeholder') ? (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground border border-dashed border-border uppercase tracking-widest text-sm">
                                Project Thumbnail Placeholder
                            </div>
                        ) : (
                            <Image
                                src={project.thumbnail}
                                alt={project.title}
                                fill
                                className="object-cover object-top"
                                loading="lazy"
                            />
                        )}
                    </div>
                )}
                <div className="flex gap-4 md:gap-8">
                    <div className="font-anton text-muted-foreground text-xl">
                        _{(index + 1).toString().padStart(2, '0')}.
                    </div>
                    <div className="flex-1">
                        <h4 className="text-4xl xs:text-6xl flex items-center gap-4 font-anton transition-all duration-700 bg-gradient-to-r from-primary to-foreground from-[50%] to-[50%] bg-[length:200%] bg-right bg-clip-text text-transparent group-hover:bg-left uppercase tracking-tighter">
                            {project.title}
                            <span className="text-foreground opacity-0 group-hover:opacity-100 transition-all flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="36"
                                    height="36"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    ref={externalLinkSVGRef}
                                    className="invisible"
                                >
                                    <path
                                        id="box"
                                        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                    ></path>
                                    <path id="arrow-line" d="M10 14 21 3"></path>
                                    <path id="arrow-curb" d="M15 3h6v6"></path>
                                </svg>
                            </span>
                        </h4>
                        <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground text-sm font-medium">
                            {project.techStack.map((tech, idx, stackArr) => (
                                <div className="flex items-center gap-4" key={tech}>
                                    <span className="uppercase tracking-widest">{tech}</span>
                                    {idx !== stackArr.length - 1 && (
                                        <span className="inline-block size-1.5 rounded-full bg-primary/30"></span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </TransitionLink>
        </div>
    );
};

export default Project;
