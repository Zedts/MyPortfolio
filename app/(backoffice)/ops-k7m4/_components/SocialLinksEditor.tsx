'use client';

import { useHoverSound } from '@/hooks/useHoverSound';
import { cn } from '@/lib/utils';
import type { ISocialLink } from '@/types/social';

interface SocialLinksEditorProps {
    value: ISocialLink[];
    onChange: (links: ISocialLink[]) => void;
}

export default function SocialLinksEditor({ value, onChange }: SocialLinksEditorProps) {
    const playHover = useHoverSound();

    const addLink = () => {
        onChange([...value, { name: '', url: '' }]);
    };

    const removeLink = (index: number) => {
        const next = value.filter((_, i) => i !== index);
        onChange(next);
    };

    const updateLink = (index: number, field: 'name' | 'url', fieldValue: string) => {
        const next = [...value];
        next[index] = { ...next[index], [field]: fieldValue };
        onChange(next);
    };

    return (
        <div className="space-y-3">
            <div className="w-full overflow-hidden rounded-lg border border-border bg-background-light">
                <div className="w-full overflow-x-auto overscroll-x-contain">
                    <table className="min-w-[560px] w-full text-sm">
                        <thead className="bg-background border-b border-border">
                            <tr>
                                <th className="px-4 py-3 text-left uppercase font-anton tracking-widest text-xs text-muted-foreground">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left uppercase font-anton tracking-widest text-xs text-muted-foreground">
                                    URL
                                </th>
                                <th className="w-24 px-4 py-3 text-left uppercase font-anton tracking-widest text-xs text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {value.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-8 text-center text-muted-foreground italic"
                                    >
                                        No social links yet. Click &quot;Add Social Link&quot; to add one.
                                    </td>
                                </tr>
                            ) : (
                                value.map((link, i) => (
                                    <tr key={i} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={link.name}
                                                onChange={(e) => updateLink(i, 'name', e.target.value)}
                                                placeholder="e.g. github"
                                                className={cn(
                                                    'w-full min-w-0 bg-background border border-border rounded-md px-3 py-2 outline-none',
                                                    'focus:border-primary focus:ring-1 focus:ring-primary text-sm',
                                                )}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => updateLink(i, 'url', e.target.value)}
                                                placeholder="https://..."
                                                title={link.url}
                                                className={cn(
                                                    'w-full min-w-0 truncate bg-background border border-border rounded-md px-3 py-2 outline-none',
                                                    'focus:border-primary focus:ring-1 focus:ring-primary text-sm',
                                                )}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => removeLink(i)}
                                                onMouseEnter={playHover}
                                                className="px-3 py-1.5 rounded-md bg-destructive/20 text-destructive-foreground border border-destructive/30 font-anton uppercase tracking-widest text-xs hover:bg-destructive/40 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <button
                onClick={addLink}
                onMouseEnter={playHover}
                className="w-full px-5 py-2.5 rounded-md bg-background-light border border-border font-anton uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors sm:w-auto"
            >
                + Add Social Link
            </button>
        </div>
    );
}
