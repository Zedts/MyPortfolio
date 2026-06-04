'use client';

import { useHoverSound } from '@/hooks/useHoverSound';
import { GENERAL_INFO } from '@/lib/data';

const StickyEmail = () => {
    const playHoverSound = useHoverSound();

    return (
        <div className="max-xl:hidden fixed bottom-32 left-0 block z-50">
            <a
                href={`mailto:${GENERAL_INFO.email}`}
                className="px-3 text-muted-foreground tracking-[1px] transition-all hover:text-primary"
                style={{
                    textOrientation: 'mixed',
                    writingMode: 'vertical-rl',
                }}
                onMouseEnter={playHoverSound}
            >
                {GENERAL_INFO.email}
            </a>
        </div>
    );
};

export default StickyEmail;
