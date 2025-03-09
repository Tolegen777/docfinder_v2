import React, { HTMLAttributes, ReactNode } from 'react';
import {cn} from "@/lib/utils";

interface IProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const MaxWidthLayout = ({
    children,
    className = '',
    ...props
}: IProps) => {
    return (
        <div
            className={cn('mx-auto max-w-[1181px] px-4', className)}
            {...props}
        >
            {children}
        </div>
    );
};
