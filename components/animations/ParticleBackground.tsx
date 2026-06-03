'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

const ParticleBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current) return;

        particlesRef.current.forEach((particle) => {
            if (!particle) return;
            
            gsap.set(particle, {
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                opacity: Math.random(),
                left: Math.random() * window.innerWidth,
                top: Math.random() * (window.innerHeight + 1),
            });

            gsap.to(particle, {
                y: window.innerHeight,
                duration: Math.random() * 10 + 10,
                opacity: 0,
                repeat: -1,
                ease: 'none',
            });
        });
    }, { scope: containerRef });

    return (
        <div className="fixed inset-0 z-0 pointer-events-none" ref={containerRef}>
            {[...Array(100)].map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        particlesRef.current[i] = el;
                    }}
                    className="absolute rounded-full bg-white/20"
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
