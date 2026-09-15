'use client';

import type { ComponentProps } from 'react';
import { useHoverSound } from '@/hooks/useHoverSound';

export function SoundLink({ onMouseEnter, ...props }: ComponentProps<'a'>) {
    const playHoverSound = useHoverSound();

    return (
        <a
            {...props}
            onMouseEnter={(e) => {
                playHoverSound();
                onMouseEnter?.(e);
            }}
        />
    );
}
