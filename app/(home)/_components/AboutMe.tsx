'use client';
import SectionTitle from '@/components/common/SectionTitle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

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
                    [Your Mission Statement: I believe in a user-centered design approach, ensuring every project is tailored to its users.]
                </h2>

                <SectionTitle title="About Me" className="slide-up-and-fade-about" />

                <div className="grid md:grid-cols-12 mt-12 gap-8">
                    <div className="md:col-span-5">
                        <p className="text-5xl font-anton slide-up-and-fade-about">
                            Hi, I&apos;m [Your Name].
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="text-lg text-muted-foreground max-w-[500px] space-y-6">
                            <p className="slide-up-and-fade-about">
                                [Your Professional Summary: I am a developer dedicated to turning ideas into reality. I specialize in creating seamless and intuitive digital experiences.]
                            </p>
                            <p className="slide-up-and-fade-about">
                                [Your Approach: My work focuses on scalability and performance, ensuring that every solution is optimized for both users and business goals.]
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
