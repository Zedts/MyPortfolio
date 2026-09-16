'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHoverSound } from '@/hooks/useHoverSound';
import { useDirtyForm } from '@/hooks/useDirtyForm';
import { deepEqual } from '@/lib/deep-equal';
import { cn } from '@/lib/utils';
import SocialLinksEditor from '../../_components/SocialLinksEditor';
import type { ISiteSettings, IBannerStats } from '@/types/social';
import type { BulkOperationResult } from '@/types';

interface Props {
    initialSettings: ISiteSettings;
}

export default function SettingsClient({ initialSettings }: Props) {
    const router = useRouter();
    const playHover = useHoverSound();
    const { isDirty, setIsDirty, markClean } = useDirtyForm();
    const [settings, setSettings] = useState<ISiteSettings>(initialSettings);
    const [savedSettings, setSavedSettings] = useState<ISiteSettings>(initialSettings);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        setIsDirty(!deepEqual(settings, savedSettings));
    }, [settings, savedSettings, setIsDirty]);

    useEffect(() => {
        queueMicrotask(() => {
            setSettings(initialSettings);
            setSavedSettings(initialSettings);
        });
    }, [initialSettings]);

    useEffect(() => {
        return () => markClean();
    }, [markClean]);

    const update = <K extends keyof ISiteSettings>(
        key: K,
        value: ISiteSettings[K],
    ) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const updateBannerStat = <K extends keyof IBannerStats>(
        key: K,
        value: IBannerStats[K],
    ) => {
        setSettings((prev) => ({
            ...prev,
            bannerStats: {
                ...(prev.bannerStats ?? { years: '', projects: '', users: '' }),
                [key]: value,
            },
        }));
    };

    const save = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('/api/admin/settings/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            const data: BulkOperationResult = await res.json();
            if (!data.ok) {
                setError(data.message || 'Save failed');
                return;
            }
            try {
                await fetch('/api/revalidate', { method: 'POST' });
            } catch {
                // ignore
            }
            router.refresh();
            setSuccess('Settings saved successfully!');
            setSavedSettings(settings);
            markClean();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = cn(
        'w-full h-12 bg-background-light border border-border rounded-lg px-4 outline-none text-sm',
        'focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
    );
    const urlInputClass = cn(inputClass, 'min-w-0 truncate');

    const textareaClass = cn(
        'w-full bg-background-light border border-border rounded-lg px-4 py-3 outline-none text-sm resize-y',
        'focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
    );

    const sectionClass = 'mb-10';
    const headingClass = 'text-lg uppercase font-anton tracking-widest mb-4 text-primary';
    const labelClass = 'block text-xs uppercase font-anton tracking-widest mb-2 text-muted-foreground';

    return (
        <div className="space-y-0">
            {error && (
                <div className="mb-6 p-4 rounded-md bg-destructive/20 border border-destructive/30 text-destructive-foreground text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 rounded-md bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
                    {success}
                </div>
            )}

            <div className={sectionClass}>
                <h3 className={headingClass}>Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Email</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => update('email', e.target.value)}
                            className={inputClass}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Email Subject</label>
                        <input
                            type="text"
                            value={settings.emailSubject}
                            onChange={(e) => update('emailSubject', e.target.value)}
                            className={inputClass}
                            placeholder="Let's collaborate"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Email Body</label>
                        <textarea
                            value={settings.emailBody}
                            onChange={(e) => update('emailBody', e.target.value)}
                            rows={5}
                            className={textareaClass}
                            placeholder="Hi, I am reaching out to you because..."
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Lets Talk URL</label>
                        <input
                            type="url"
                            value={settings.upworkProfile}
                            onChange={(e) => update('upworkProfile', e.target.value)}
                            className={urlInputClass}
                            placeholder="https://www.upwork.com/freelancers/..."
                            title={settings.upworkProfile}
                        />
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <h3 className={headingClass}>Banner</h3>
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Banner Text</label>
                        <textarea
                            value={settings.bannerText ?? ''}
                            onChange={(e) => update('bannerText', e.target.value)}
                            rows={4}
                            className={textareaClass}
                            placeholder="Hi, I'm..."
                        />
                    </div>
                    <div>
                        <label className={cn(labelClass, 'mb-3')}>Banner Stats</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase font-anton tracking-widest mb-2 text-muted-foreground/80">
                                    Years Exp
                                </label>
                                <input
                                    type="text"
                                    value={settings.bannerStats?.years ?? ''}
                                    onChange={(e) => updateBannerStat('years', e.target.value)}
                                    className={inputClass}
                                    placeholder="3+"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-anton tracking-widest mb-2 text-muted-foreground/80">
                                    Projects
                                </label>
                                <input
                                    type="text"
                                    value={settings.bannerStats?.projects ?? ''}
                                    onChange={(e) => updateBannerStat('projects', e.target.value)}
                                    className={inputClass}
                                    placeholder="7+"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-anton tracking-widest mb-2 text-muted-foreground/80">
                                    Hours
                                </label>
                                <input
                                    type="text"
                                    value={settings.bannerStats?.users ?? ''}
                                    onChange={(e) => updateBannerStat('users', e.target.value)}
                                    className={inputClass}
                                    placeholder="1000+"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <h3 className={headingClass}>About Me</h3>
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Display Name</label>
                        <input
                            type="text"
                            value={settings.name ?? ''}
                            onChange={(e) => update('name', e.target.value)}
                            className={inputClass}
                            placeholder="Royyan Hikmal Kautsar"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>About Me Heading</label>
                        <textarea
                            value={settings.aboutMeTitle ?? ''}
                            onChange={(e) => update('aboutMeTitle', e.target.value)}
                            rows={3}
                            className={textareaClass}
                            placeholder="I believe in a user-centered design approach..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>About Me Text</label>
                        <textarea
                            value={settings.aboutMeText ?? ''}
                            onChange={(e) => update('aboutMeText', e.target.value)}
                            rows={10}
                            className={textareaClass}
                            placeholder="Hi, I'm..."
                        />
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <h3 className={headingClass}>Social</h3>
                <SocialLinksEditor
                    value={settings.socialLinks ?? []}
                    onChange={(links) => update('socialLinks', links)}
                />
            </div>

            <div className="flex items-center justify-end pt-6 border-t border-border">
                <button
                    type="button"
                    onClick={save}
                    disabled={!isDirty || saving}
                    onMouseEnter={playHover}
                    className={cn(
                        'w-full px-10 py-3 rounded-lg bg-primary text-primary-foreground font-anton uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors sm:w-auto',
                        (!isDirty || saving) && 'opacity-50 cursor-not-allowed hover:bg-primary',
                    )}
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
}
