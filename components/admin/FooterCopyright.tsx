'use client';

import { useRef } from 'react';
import { openAdminLoginDialog } from '@/components/admin/AdminShortcut';
import { useHoverSound } from '@/hooks/useHoverSound';

export default function FooterCopyright({ year, name }: { year: string; name: string }) {
    const playHover = useHoverSound();
    const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tapResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pressed = useRef(false);
    const tapCount = useRef(0);

    const startPress = () => {
        pressed.current = true;
        pressTimer.current = setTimeout(() => {
            if (pressed.current) openAdminLoginDialog();
        }, 3000);
    };

    const endPress = () => {
        pressed.current = false;
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };

    const registerTap = () => {
        tapCount.current += 1;
        if (tapResetTimer.current) clearTimeout(tapResetTimer.current);

        if (tapCount.current === 7) {
            tapCount.current = 0;
            openAdminLoginDialog();
            return;
        }

        tapResetTimer.current = setTimeout(() => {
            tapCount.current = 0;
            tapResetTimer.current = null;
        }, 2000);
    };

    return (
        <button
            type="button"
            onClick={registerTap}
            onMouseEnter={playHover}
            onPointerDown={startPress}
            onPointerUp={endPress}
            onPointerLeave={endPress}
            onPointerCancel={endPress}
            className="select-none text-left"
            title="Tap seven times or long-press for admin access"
        >
            © {year} {name}
        </button>
    );
}
