'use client';

import { useEffect } from 'react';
import SectionTitle from '@/components/common/SectionTitle';
import Button from '@/components/ui/Button';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('App error:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
            <SectionTitle
                title="Something broke"
                subtitle="Unexpected error while rendering this page"
            />
            <p className="text-muted-foreground mt-8 max-w-xl text-center">
                <code className="bg-background-light px-3 py-1 rounded border border-border text-xs">
                    {error.message || 'Unknown error'}
                </code>
            </p>
            <div className="mt-12 flex gap-5">
                <Button variant="primary" as="button" onClick={reset}>
                    Try again
                </Button>
                <Button variant="no-color" as="link" href="/" className="border border-border rounded-lg px-6">
                    Go home
                </Button>
            </div>
        </div>
    );
}
