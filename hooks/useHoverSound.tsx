'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { ComponentProps } from 'react';

// soundcn click-soft — subtle soft pop
const HOVER_SOUND =
    'data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjMuMTAwAAAAAAAAAAAAAAD/+1DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAIAAAJxAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr//////////////////////////////////////////////////////////////////wAAAABMYXZjNjIuMTEAAAAAAAAAAAAAAAAkBYYAAAAAAAACcU7MYgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAACghZUlTHgAGDlWufHzAAAVWgJg3EszX3mlF95pSk7enve+GBDEMNMg4R8BLACwAsA7BVjjOhDEMQxWKx5EcJwfB/KBiU8/wI7QH+BHaA/ynv6PB8/LgQEMgD78CHO/oGiAIBAQBAYFAA1hDi4z22DmJ7Et+PSEd1f8Y4PmLI5uDYKAWyCmBlSZJ3gAmD0RBEUDS/HKFzC5iZIr/5FTIvE0Yl3/8ipkXi8Yl0u/xEFQVER7/WCoiCoKiL/4VBURPOqgAQuacbblgZh//7UsQEg8aUBv9cMIAgAAA0gAAABIKqErhFDZUNQ7PRK4S8s8r1HiuGlHuSnenrcW9yvO/PcFflep5XqPKfrO9NTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

const VOLUME = 1;

export function useHoverSound() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio(HOVER_SOUND);
        audio.preload = 'auto';
        audio.volume = VOLUME;
        audioRef.current = audio;
    }, []);

    return useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        try {
            audio.currentTime = 0;
            void audio.play().catch(() => {});
        } catch {
            // Browser autoplay policy
        }
    }, []);
}

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
