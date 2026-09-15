export interface IStackItem {
    name: string;
    icon: string;
    category: 'frontend' | 'backend' | 'database' | 'tools' | string;
    order?: number;
}

export type StackCategories = Record<string, IStackItem[]>;
