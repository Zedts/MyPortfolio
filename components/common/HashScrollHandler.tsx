'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from '@/lib/gsap';

export default function HashScrollHandler() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== '/') return;

        const hash = window.location.hash;
        if (!hash || hash.length <= 1) return;

        const id = hash.slice(1);
        if (!id) return;

        const raf = requestAnimationFrame(() => {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (!el) return;
                el.scrollIntoView({ behavior: 'auto', block: 'start' });
                ScrollTrigger.refresh();
            }, 150);
        });

        return () => cancelAnimationFrame(raf);
    }, [pathname]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleHashChange = () => {
            const hash = window.location.hash;
            if (!hash || hash.length <= 1) return;

            const el = document.getElementById(hash.slice(1));
            if (!el) return;

            el.scrollIntoView({ behavior: 'auto', block: 'start' });
            ScrollTrigger.refresh();
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const refresh = () => ScrollTrigger.refresh();

        window.addEventListener('load', refresh);
        window.addEventListener('resize', refresh);
        window.addEventListener('orientationchange', refresh);

        return () => {
            window.removeEventListener('load', refresh);
            window.removeEventListener('resize', refresh);
            window.removeEventListener('orientationchange', refresh);
        };
    }, []);

    return null;
}
