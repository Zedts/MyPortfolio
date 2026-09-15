'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

interface DirtyFormContextValue {
    isDirty: boolean;
    setIsDirty: (dirty: boolean) => void;
    markClean: () => void;
}

const DirtyFormContext = createContext<DirtyFormContextValue | undefined>(undefined);

export function DirtyFormProvider({ children }: { children: ReactNode }) {
    const [isDirty, setIsDirtyState] = useState(false);

    const setIsDirty = useCallback((dirty: boolean) => {
        setIsDirtyState(dirty);
    }, []);

    const markClean = useCallback(() => {
        setIsDirtyState(false);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const value = useMemo<DirtyFormContextValue>(
        () => ({ isDirty, setIsDirty, markClean }),
        [isDirty, setIsDirty, markClean],
    );

    return <DirtyFormContext.Provider value={value}>{children}</DirtyFormContext.Provider>;
}

export function useDirtyForm(): DirtyFormContextValue {
    const ctx = useContext(DirtyFormContext);
    if (!ctx) {
        throw new Error('useDirtyForm must be used within DirtyFormProvider');
    }
    return ctx;
}
