'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

const ArrowAnimation = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const arrow1Ref = useRef<SVGPathElement>(null);
    const arrow2Ref = useRef<SVGPathElement>(null);

    useGSAP(() => {
        if (!svgRef.current || !arrow1Ref.current || !arrow2Ref.current) return;

        gsap.set(svgRef.current, { fill: 'transparent', autoAlpha: 0 });
        
        const length1 = arrow1Ref.current.getTotalLength();
        const length2 = arrow2Ref.current.getTotalLength();

        gsap.set(arrow1Ref.current, {
            strokeDasharray: length1,
            strokeDashoffset: length1,
        });
        gsap.set(arrow2Ref.current, {
            strokeDasharray: length2,
            strokeDashoffset: length2,
        });

        const tl = gsap.timeline({ repeat: -1 });

        tl.to(svgRef.current, { autoAlpha: 1, duration: 0.1 });
        tl.to([arrow1Ref.current, arrow2Ref.current], {
            duration: 2,
            delay: 1,
            strokeDashoffset: 0,
        });
        tl.to(svgRef.current, {
            duration: 0.5,
            delay: 0.5,
            fill: 'rgba(255, 255, 255, 0.03)',
        });
        tl.to(svgRef.current, {
            duration: 1,
            y: 300,
        });
        tl.to(svgRef.current, {
            duration: 0,
            autoAlpha: 0,
        });
    }, { scope: svgRef });

    return (
        <svg
            id="banner-arrow-svg"
            width="376"
            height="111"
            viewBox="0 0 376 111"
            fill="transparent"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
            ref={svgRef}
        >
            <path
                className="svg-arrow"
                d="M1 1V39.9286L188 110V70.6822L1 1Z"
                stroke="currentColor"
                strokeOpacity="0.2"
                ref={arrow1Ref}
            />
            <path
                className="svg-arrow"
                d="M375 1V39.9286L188 110V70.6822L375 1Z"
                stroke="currentColor"
                strokeOpacity="0.2"
                ref={arrow2Ref}
            />
        </svg>
    );
};

export default ArrowAnimation;
