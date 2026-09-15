'use client';
import SectionTitle from '@/components/common/SectionTitle';
import { gsap, useGSAP } from '@/lib/gsap';
import React from 'react';
import type { ISiteSettings } from '@/types/social';

interface Props {
    settings?: ISiteSettings;
}

const DEFAULT_NAME = 'Royyan Hikmal Kautsar';
const DEFAULT_ABOUT_PARAGRAPH_1 = `I am a developer dedicated to turning ideas into reality. I specialize in creating seamless and intuitive digital experiences.`;
const DEFAULT_ABOUT_PARAGRAPH_2 = `My work focuses on scalability and performance, ensuring that every solution is optimized for both users and business goals.`;

function splitAboutMeText(text?: string): [string, string] {
    if (!text) return [DEFAULT_ABOUT_PARAGRAPH_1, DEFAULT_ABOUT_PARAGRAPH_2];
    const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
    if (sentences.length >= 2) {
        const mid = Math.ceil(sentences.length / 2);
        return [sentences.slice(0, mid).join(' '), sentences.slice(mid).join(' ')];
    }
    return [text, DEFAULT_ABOUT_PARAGRAPH_2];
}

const AboutMe = ({ settings }: Props) => {
    const container = React.useRef<HTMLDivElement>(null);

    const name = settings?.name || DEFAULT_NAME;
    const [aboutPara1, aboutPara2] = splitAboutMeText(settings?.aboutMeText);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 70%',
                    end: 'bottom bottom',
                    scrub: 0.5,
                },
            });

            tl.from('.slide-up-and-fade-about', {
                y: 150,
                opacity: 0,
                stagger: 0.05,
            });
        },
        { scope: container },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-out',
                    trigger: container.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 0.5,
                },
            });

            tl.to('.slide-up-and-fade-about', {
                y: -150,
                opacity: 0,
                stagger: 0.02,
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-section pt-20" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-4xl md:text-6xl font-light mb-20 slide-up-and-fade-about leading-tight">
                    I believe in a user-centered design approach, ensuring every project is tailored to its users.
                </h2>

                <SectionTitle title="About Me" className="slide-up-and-fade-about" />

                <div className="grid md:grid-cols-12 mt-12 gap-8">
                    <div className="md:col-span-5">
                        <p className="text-5xl font-anton slide-up-and-fade-about">
                            Hi, I{'\''}m {name}.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="text-lg text-muted-foreground max-w-[500px] space-y-6">
                            <p className="slide-up-and-fade-about">
                                {aboutPara1}
                            </p>
                            <p className="slide-up-and-fade-about">
                                {aboutPara2}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
