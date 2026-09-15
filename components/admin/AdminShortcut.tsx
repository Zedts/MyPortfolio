'use client';

import { useEffect } from 'react';

const OPEN_EVENT = 'open-admin-login';

export function openAdminLoginDialog() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export default function AdminShortcut() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const baseModifier = isMac ? e.metaKey && e.altKey : e.ctrlKey && e.altKey;
            const withShiftModifier = baseModifier && e.shiftKey;
            if ((baseModifier || withShiftModifier) && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                openAdminLoginDialog();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return null;
}
