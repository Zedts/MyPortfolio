import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined' && !(gsap as unknown as { _registered?: boolean })._registered) {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    (gsap as unknown as { _registered?: boolean })._registered = true;
}

export { gsap, ScrollTrigger, useGSAP };
