import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataTableProps {
    children: ReactNode;
    className?: string;
    selectedCount?: number;
    onSelectAll?: (checked: boolean) => void;
    allSelected?: boolean;
    headers: string[];
    showSelectAll?: boolean;
}

export default function DataTable({
    children,
    className,
    onSelectAll,
    allSelected,
    headers,
    showSelectAll = true,
}: DataTableProps) {
    return (
        <div className={cn('w-full overflow-hidden rounded-lg border border-border bg-background-light', className)}>
            <div className="w-full overflow-x-auto overscroll-x-contain" tabIndex={0} aria-label="Scrollable data table">
                <table className="min-w-[760px] w-full text-sm">
                    <thead className="bg-background border-b border-border">
                        <tr>
                            {showSelectAll && (
                                <th className="w-12 px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allSelected ?? false}
                                        onChange={(e) => onSelectAll?.(e.target.checked)}
                                        className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                    />
                                </th>
                            )}
                            {headers.map((header, i) => (
                                <th
                                    key={i}
                                    className="whitespace-nowrap px-4 py-3 text-left uppercase font-anton tracking-widest text-xs text-muted-foreground"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">{children}</tbody>
                </table>
            </div>
        </div>
    );
}

interface DataRowProps {
    children: ReactNode;
    selected?: boolean;
    className?: string;
}

export function DataRow({ children, selected, className }: DataRowProps) {
    return (
        <tr
            className={cn(
                'transition-colors duration-200 hover:bg-primary/5',
                selected && 'bg-primary/10 border-l-2 border-l-primary',
                className,
            )}
        >
            {children}
        </tr>
    );
}

interface DataCellProps {
    children: ReactNode;
    className?: string;
    colSpan?: number;
}

export function DataCell({ children, className, colSpan }: DataCellProps) {
    return <td colSpan={colSpan} className={cn('px-4 py-3 align-middle', className)}>{children}</td>;
}
