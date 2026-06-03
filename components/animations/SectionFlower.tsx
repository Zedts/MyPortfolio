'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    width?: number;
    height?: number;
}

const SectionFlower = ({ className, width = 25, height = 25 }: Props) => {
    return (
        <div 
            className={cn("relative flex items-center justify-center", className)}
            style={{ width, height }}
        >
            {/* A simple geometric "flower" placeholder using CSS */}
            <div className="absolute inset-0 border-2 border-primary rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-2 border-secondary rounded-full rotate-45 animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-foreground rounded-full"></div>
        </div>
    );
};

export default SectionFlower;
