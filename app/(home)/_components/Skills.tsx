'use client';
import SectionTitle from '@/components/common/SectionTitle';
import { gsap, useGSAP } from '@/lib/gsap';
import { getAdaptiveStagger } from '@/lib/utils';
import Image from 'next/image';
import React, { useRef } from 'react';
import type { StackCategories } from '@/types/stack';

interface Props {
    stackGrouped: StackCategories;
}

const Skills = ({ stackGrouped }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const targets = containerRef.current?.querySelectorAll('.reveal-on-scroll');
            if (!targets?.length || !sectionRef.current) return;

            gsap.to(targets,
                {
                    y: 0,
                    autoAlpha: 1,
                    ease: 'power3.out',
                    stagger: getAdaptiveStagger(targets.length),
                    duration: 1.05,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                        invalidateOnRefresh: true,
                    },
                },
            );
        },
        { scope: containerRef, dependencies: [Object.keys(stackGrouped).length, Object.values(stackGrouped).flat().length] },
    );

    return (
        <section id="my-stack" className="py-section" ref={sectionRef}>
            <div className="container" ref={containerRef}>
                <SectionTitle title="My Stack" className="reveal-on-scroll" />

                <div className="space-y-20">
                    {Object.entries(stackGrouped).map(([key, value]) => (
                        <div className="grid sm:grid-cols-12" key={key}>
                            <div className="sm:col-span-5">
                                <p className="reveal-on-scroll text-5xl font-anton leading-none text-muted-foreground uppercase">
                                    {key}
                                </p>
                            </div>

                            <div className="sm:col-span-7 flex gap-x-11 gap-y-9 flex-wrap">
                                {value.map((item) => (
                                    <div
                                        className="reveal-on-scroll flex gap-3.5 items-center leading-none"
                                        key={item.name}
                                    >
                                        <div>
                                            <Image
                                                src={item.icon}
                                                alt={item.name}
                                                width="40"
                                                height="40"
                                                className="max-h-10"
                                            />
                                        </div>
                                        <span className="text-2xl capitalize">
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
