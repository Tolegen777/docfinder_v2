import React from "react";
import Link from "next/link";
import {cn} from "@/shared/lib/utils";

export const NavItem = ({
                            icon: Icon,
                            text,
                            active = false,
                            href
                        }: {
    icon: React.ElementType;
    text: string;
    active?: boolean;
    href: string;
}) => (
    <Link
        href={href}
        scroll={false}
        className={cn(
            "h-14 flex items-center gap-2 px-6 py-3 rounded-[10px] transition-colors text-gray-900 border border-gray-300 hover:border-primary hover:text-primary",
            active && "border-primary text-primary"
        )}
    >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{text}</span>
    </Link>
);
