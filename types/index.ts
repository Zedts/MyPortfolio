export type Next_Page_Url = string;

export type Variant =
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'no-color';

export interface BulkOperationResult {
    ok: boolean;
    created: number;
    updated: number;
    deleted: number;
    message?: string;
}

export interface BulkChangeset<T> {
    create: T[];
    update: Array<{ id: string; data: Partial<T> }>;
    delete: string[];
}
