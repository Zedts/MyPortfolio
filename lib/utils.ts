import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Keeps a collection reveal lively without making longer admin-managed lists take longer to appear. */
export function getAdaptiveStagger(itemCount: number, maxDelay = 0.14, maxCascade = 0.72): number {
  if (itemCount < 2) return 0;
  return Math.min(maxDelay, maxCascade / (itemCount - 1));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function parseBracketList<T = string>(value: unknown, fallback: T[] = []): T[] {
    if (Array.isArray(value)) return value as T[];
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return fallback;
    const inner = trimmed.slice(1, -1);
    if (!inner) return fallback;
    return inner
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean) as T[];
}

export function parseObjectString<T>(value: unknown, fallback: T): T {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return value as T;
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
                return JSON.parse(trimmed) as T;
            } catch {
                try {
                    const obj: Record<string, unknown> = {};
                    const pairs = trimmed.slice(1, -1).split(/,(?=\s*[A-Za-z_])/);
                    for (const pair of pairs) {
                        const [k, v] = pair.split(/:(.+)/).map((s) => s.trim());
                        if (!k) continue;
                        const key = k.replace(/^["']|["']$/g, '');
                        let val: unknown = v;
                        if (v && v.startsWith('"') && v.endsWith('"')) val = v.slice(1, -1);
                        else if (v && v.startsWith("'") && v.endsWith("'")) val = v.slice(1, -1);
                        else if (v === 'true') val = true;
                        else if (v === 'false') val = false;
                        else if (!isNaN(Number(v)) && v.trim() !== '') val = Number(v);
                        obj[key] = val;
                    }
                    if (Object.keys(obj).length > 0) return obj as T;
                } catch {
                    // ignore
                }
            }
        }
    }
    return fallback;
}
