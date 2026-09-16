'use client';
import SectionTitle from '@/components/common/SectionTitle';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import React, { useMemo, useRef, useState } from 'react';
import type { ISiteSettings } from '@/types/social';
import { ChevronDown } from 'lucide-react';
import { useHoverSound } from '@/hooks/useHoverSound';
import { cn } from '@/lib/utils';

interface Props {
    settings?: ISiteSettings;
}

const TRUNCATE_CHAR_LIMIT = 300;
const READ_MORE_EASE = 'power2.out';
const READ_MORE_DURATION = 0.55;

function splitAboutMeText(text: string): [string, string] {
    const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
    if (sentences.length >= 2) {
        const mid = Math.ceil(sentences.length / 2);
        return [sentences.slice(0, mid).join(' '), sentences.slice(mid).join(' ')];
    }
    return [text, ''];
}

const AboutMe = ({ settings }: Props) => {
    const container = React.useRef<HTMLDivElement>(null);
    const sectionRef = React.useRef<HTMLElement>(null);
    const secondParaRef = useRef<HTMLParagraphElement>(null);
    const playHover = useHoverSound();

    const name = settings?.name ?? '';
    const title = settings?.aboutMeTitle ?? '';
    const rawText = settings?.aboutMeText ?? '';
    const [aboutPara1, aboutPara2] = splitAboutMeText(rawText);

    const totalLength = useMemo(() => aboutPara1.length + aboutPara2.length, [aboutPara1, aboutPara2]);
    const needsTruncation = totalLength > TRUNCATE_CHAR_LIMIT;
    const [expanded, setExpanded] = useState(false);

    const hasSecondPara = aboutPara2.length > 0;

    useGSAP(
        () => {
            if (needsTruncation && secondParaRef.current) {
                gsap.set(secondParaRef.current, {
                    height: 0, opacity: 0, y: -8, overflow: 'hidden', marginBottom: 0,
                });
            } else if (secondParaRef.current) {
                gsap.set(secondParaRef.current, {
                    height: 'auto', opacity: 1, y: 0, overflow: 'visible', clearProps: 'overflow,marginBottom',
                });
            }
        },
        {
            scope: container,
            dependencies: [needsTruncation, hasSecondPara],
        },
    );

    const toggleExpanded = () => {
        if (!needsTruncation) return;
        const next = !expanded;
        if (next && hasSecondPara && secondParaRef.current) {
            setExpanded(true);
            gsap.to(secondParaRef.current, {
                height: 'auto',
                opacity: 1,
                y: 0,
                overflow: 'visible',
                duration: READ_MORE_DURATION,
                ease: READ_MORE_EASE,
                overwrite: 'auto',
                clearProps: 'overflow,marginBottom',
                onComplete: () => ScrollTrigger.refresh(true),
            });
        } else if (!next && hasSecondPara && secondParaRef.current) {
            gsap.to(secondParaRef.current, {
                height: 0,
                opacity: 0,
                y: -8,
                overflow: 'hidden',
                marginBottom: 0,
                duration: READ_MORE_DURATION * 0.8,
                ease: 'power2.in',
                overwrite: 'auto',
                onComplete: () => {
                    setExpanded(false);
                    ScrollTrigger.refresh(true);
                },
            });
        } else {
            setExpanded(next);
        }
    };

    useGSAP(
        () => {
            const targets = container.current?.querySelectorAll('.reveal-on-scroll');
            if (!targets?.length || !sectionRef.current) return;

            gsap.to(targets,
                {
                    y: 0,
                    autoAlpha: 1,
                    stagger: 0.12,
                    duration: 1.05,
                    ease: 'power3.out',
                    scrollTrigger: {
                        id: 'about-me-fade-in',
                        trigger: sectionRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                        invalidateOnRefresh: true,
                    },
                },
            );
        },
        { scope: container },
    );

    return (
        <section className="pb-section pt-20" id="about-me" ref={sectionRef}>
            <div className="container" ref={container}>
                <h2 className="reveal-on-scroll text-4xl md:text-6xl font-light mb-20 leading-tight">
                    {title}
                </h2>

                <SectionTitle title="About Me" className="reveal-on-scroll" />

                <div className="grid md:grid-cols-12 mt-12 gap-8">
                    <div className="md:col-span-5">
                        <p className="reveal-on-scroll text-5xl font-anton">
                            Hi, I{'\''}m {name}.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="text-lg text-muted-foreground max-w-[500px] space-y-6">
                            <p className="reveal-on-scroll whitespace-pre-wrap">{aboutPara1}</p>
                            {hasSecondPara && (
                                <p
                                    ref={secondParaRef}
                                    className={cn(
                                        needsTruncation && !expanded && 'overflow-hidden',
                                    )}
                                >
                                    {aboutPara2}
                                </p>
                            )}
                            {needsTruncation && (
                                <button
                                    type="button"
                                    onMouseEnter={playHover}
                                    onClick={toggleExpanded}
                                    className="reveal-on-scroll inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mt-2 group cursor-pointer"
                                >
                                    <span>{expanded ? 'Show Less' : 'Read More'}</span>
                                    <ChevronDown
                                        size={16}
                                        className={cn(
                                            'transition-transform duration-300',
                                            expanded && 'rotate-180',
                                            'group-hover:translate-y-0.5',
                                        )}
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
