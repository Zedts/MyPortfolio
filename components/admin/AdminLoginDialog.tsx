'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { firebaseAuth, hasFirebaseClientConfig } from '@/lib/firebase/client';
import SectionTitle from '@/components/common/SectionTitle';
import { useHoverSound } from '@/hooks/useHoverSound';
import { cn } from '@/lib/utils';

const OPEN_EVENT = 'open-admin-login';

export default function AdminLoginDialog() {
    const router = useRouter();
    const playHover = useHoverSound();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => {
        setOpen(false);
        setError(null);
        setEmail('');
        setPassword('');
        setLoading(false);
    }, []);

    useEffect(() => {
        const openHandler = () => {
            if (!hasFirebaseClientConfig) {
                setError('Firebase client is not configured. Check NEXT_PUBLIC_* env vars.');
            }
            setOpen(true);
        };
        window.addEventListener(OPEN_EVENT, openHandler);
        return () => window.removeEventListener(OPEN_EVENT, openHandler);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, close]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firebaseAuth) {
            setError('Firebase auth is not available.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const cred = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
            const idToken = await cred.user.getIdToken(true);
            const res = await fetch('/api/admin-session', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            const data = (await res.json().catch(() => ({}))) as { ok?: boolean; redirect?: string; error?: string };
            if (!res.ok || !data.ok) {
                setError(data.error || 'Sign-in failed');
                setLoading(false);
                return;
            }
            close();
            await router.push(data.redirect || '/ops-k7m4');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? 'Invalid credentials' : 'Sign-in failed');
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => {
                if (e.target === e.currentTarget) close();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
        >
            <div
                ref={dialogRef}
                className="relative w-full max-w-[440px] bg-background-light border border-border rounded-2xl p-8 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)] animate-[scaleIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]"
            >
                <button
                    type="button"
                    onClick={close}
                    onMouseEnter={playHover}
                    className="absolute top-4 right-4 h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <SectionTitle
                    title="ADMIN LOGIN"
                    subtitle="Authentication required to access portfolio operations"
                    className="mb-8"
                    classNames={{ icon: '!w-8 !h-8' }}
                />

                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="admin-email"
                            className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-anton"
                        >
                            Email
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className={cn(
                                'h-12 px-4 rounded-lg bg-background border border-border outline-none transition-colors',
                                'focus:border-primary focus:ring-1 focus:ring-primary',
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="admin-password"
                            className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-anton"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPw ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={cn(
                                    'h-12 w-full px-4 pr-12 rounded-lg bg-background border border-border outline-none transition-colors',
                                    'focus:border-primary focus:ring-1 focus:ring-primary',
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((s) => !s)}
                                onMouseEnter={playHover}
                                tabIndex={-1}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md hover:bg-background-light transition-colors"
                                aria-label={showPw ? 'Hide password' : 'Show password'}
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-full px-4 py-2 text-sm bg-destructive/20 border border-destructive text-destructive-foreground text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        onMouseEnter={playHover}
                        className={cn(
                            'group relative overflow-hidden h-14 rounded-lg font-anton uppercase tracking-widest text-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed',
                        )}
                    >
                        <span className="absolute top-[200%] left-0 right-0 h-full bg-white/10 rounded-[50%] group-hover:top-0 transition-all duration-500 scale-150 pointer-events-none"></span>
                        <span className="z-[1] relative">
                            {loading ? 'Signing in...' : 'Sign in'}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
