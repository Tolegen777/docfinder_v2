import React from "react";

interface DiscountProps extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode;
}

export const DiscountBanner = ({ children, className, ...props }: DiscountProps) => {
    return (
        <div
            className={`w-full px-5 py-2.5 border border-slate-300 rounded-lg text-center ${className}`}
            {...props}
        >
            <p className="text-sm">{children}</p>
        </div>
    );
};
