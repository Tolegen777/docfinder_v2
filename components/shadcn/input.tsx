'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, required, ...props }, ref) => {

        return (
            <div className="relative">
                {label && (
                    <label
                        className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 transition-all duration-150 pointer-events-none",
                            (props.value || props.defaultValue || props.placeholder) &&
                            "text-xs top-2 translate-y-0 text-green-600"
                        )}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
                        "focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        label && "pt-5 pb-1", // Добавляем дополнительный padding-top при наличии лейбла
                        className
                    )}
                    ref={ref}
                    onFocus={(e) => {
                        const label = e.currentTarget.previousElementSibling;
                        if (label && label.tagName === 'LABEL') {
                            label.classList.add('text-xs', 'top-2', 'translate-y-0', 'text-green-600');
                            label.classList.remove('top-1/2', '-translate-y-1/2');
                        }
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        const label = e.currentTarget.previousElementSibling;
                        if (label && label.tagName === 'LABEL' && !e.currentTarget.value) {
                            label.classList.remove('text-xs', 'top-2', 'translate-y-0', 'text-green-600');
                            label.classList.add('top-1/2', '-translate-y-1/2');
                        }
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
