'use client';
import SectionTitle from '@/components/common/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Entrance animation for items
            gsap.from('.experience-item', {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });

            // Animate the vertical line height on scroll
            if (lineRef.current) {
                gsap.fromTo(
                    lineRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        transformOrigin: 'top',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.experience-list',
                            start: 'top 80%',
                            end: 'bottom 20%',
                            scrub: true,
                        },
                    }
                );
            }
        },
        { scope: containerRef }
    );

    return (
        <section className="py-section overflow-hidden" id="my-experience">
            <div className="container" ref={containerRef}>
                <SectionTitle title="My Experience" />

                <div className="experience-list relative mt-16 ml-4 sm:ml-0">
                    {/* Continuous Vertical Green Line */}
                    <div
                        ref={lineRef}
                        className="absolute left-[7px] top-[10px] bottom-[10px] w-[2px] bg-primary origin-top"
                        style={{ height: 'calc(100% - 20px)' }}
                    />

                    <div className="flex flex-col gap-24 sm:gap-32">
                        {MY_EXPERIENCE.map((item, index) => (
                            <div
                                key={`${item.title}-${index}`}
                                className="experience-item relative pl-10 sm:pl-16 group"
                            >
                                {/* Intersection Dot */}
                                <div className="absolute left-0 top-[10px] w-4 h-4 rounded-full bg-background border-2 border-primary z-10 transition-transform duration-300 group-hover:scale-125">
                                    <div className="absolute inset-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
                                        <p className="text-xl sm:text-2xl text-primary font-bold tracking-tight">
                                            {item.company}
                                        </p>
                                        <p className="text-sm sm:text-base text-muted-foreground font-medium bg-muted/30 px-3 py-1 rounded-full w-fit">
                                            {item.duration}
                                        </p>
                                    </div>

                                    <h3 className="text-4xl sm:text-6xl md:text-7xl font-anton leading-[0.9] uppercase mb-6">
                                        {item.title}
                                    </h3>

                                    {item.description && (
                                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experiences;
