'use client'
import React from 'react';
import {cn} from "@/shared/lib/utils";

interface TimeStatusProps {
    timeUntilClosing?: string;
    className?: string;
}

export const TimeStatus: React.FC<TimeStatusProps> = ({timeUntilClosing, className}) => {
    return <div className={cn('bg-red-50 text-red-500 rounded-lg p-2', className)}>
        <p>{timeUntilClosing}</p>
    </div>
}
