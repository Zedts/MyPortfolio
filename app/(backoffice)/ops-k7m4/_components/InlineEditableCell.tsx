'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditableCellProps {
    value: string | number;
    onChange: (value: string | number) => void;
    type?: 'text' | 'number' | 'textarea';
    className?: string;
    placeholder?: string;
    textareaRows?: number;
}

export default function InlineEditableCell({
    value,
    onChange,
    type = 'text',
    className,
    placeholder,
    textareaRows = 3,
}: InlineEditableCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState<string | number>(value);
    const lastValueRef = useRef<string | number>(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (value !== lastValueRef.current) {
            lastValueRef.current = value;
            queueMicrotask(() => setLocalValue(value));
        }
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if (type !== 'textarea' && inputRef.current instanceof HTMLInputElement) {
                inputRef.current.select();
            }
        }
    }, [isEditing, type]);

    const commit = () => {
        setIsEditing(false);
        if (type === 'number') {
            const num = Number(localValue);
            if (!isNaN(num)) onChange(num);
        } else {
            onChange(String(localValue));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && type !== 'textarea') {
            e.preventDefault();
            commit();
        }
        if (e.key === 'Escape') {
            setLocalValue(value);
            setIsEditing(false);
        }
    };

    if (!isEditing) {
        const displayValue = type === 'textarea' && String(value).length > 80
            ? String(value).slice(0, 80) + '...'
            : value;
        return (
            <span
                onClick={() => setIsEditing(true)}
                className={cn(
                    'block w-full min-w-[40px] max-w-full cursor-pointer truncate rounded px-2 py-1 text-left hover:bg-primary/5 transition-colors',
                    !value && 'text-muted-foreground italic',
                    className,
                )}
                title={String(value)}
            >
                {displayValue || placeholder || 'Click to edit'}
            </span>
        );
    }

    const commonProps = {
        ref: inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>,
        value: localValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setLocalValue(e.target.value),
        onBlur: commit,
        onKeyDown: handleKeyDown,
        placeholder,
        className: cn(
            'w-full min-w-0 truncate rounded border border-primary bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary',
            className,
        ),
    };

    if (type === 'textarea') {
        return (
            <textarea
                {...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                rows={textareaRows}
            />
        );
    }

    return <input {...commonProps} type={type} />;
}
